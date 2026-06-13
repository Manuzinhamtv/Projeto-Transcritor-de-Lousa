"""
routers/transcricoes.py
Endpoints de upload de imagem, transcrição com IA (Gemini) e listagem do histórico.
"""

import os
import uuid
from pathlib import Path
from datetime import datetime

import google.generativeai as genai
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlmodel import Session, select

from database import get_session
from models.transcricao import Transcricao
from models.usuario import Usuario
from schemas.transcricao import TranscricaoResposta
from auth.jwt import get_usuario_atual

# ── Configuração ───────────────────────────────────────────────────────────────

router = APIRouter(prefix="/transcricoes", tags=["Transcrições"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Configura a API do Gemini com a chave do .env
genai.configure(api_key=os.getenv("GEMINI_API_KEY", ""))
modelo_gemini = genai.GenerativeModel("gemini-2.0-flash")

PROMPT_TRANSCRICAO = (
    "Você é um assistente de apoio à educação. "
    "Analise a imagem de uma lousa ou slide escolar e transcreva todo o conteúdo "
    "de forma clara, organizada e acessível. "
    "Preserve a estrutura original (títulos, listas, equações) usando texto simples. "
    "Não adicione explicações extras — apenas transcreva fielmente o que está escrito."
)


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post(
    "/",
    response_model=TranscricaoResposta,
    status_code=status.HTTP_201_CREATED,
    summary="Envia imagem e retorna a transcrição gerada pela IA",
)
async def criar_transcricao(
    titulo: str = Form(...),
    arquivo: UploadFile = File(...),
    session: Session = Depends(get_session),
    usuario_atual: Usuario = Depends(get_usuario_atual),
):
    """
    Recebe a imagem da lousa e um título.
    Salva a imagem, chama o Gemini para transcrever e persiste no banco.
    Requer autenticação JWT.
    """
    # Valida o tipo do arquivo
    tipos_permitidos = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    if arquivo.content_type not in tipos_permitidos:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Tipo de arquivo inválido. Envie uma imagem (JPEG, PNG, WEBP ou GIF).",
        )

    # Salva a imagem em disco com nome único
    extensao = Path(arquivo.filename).suffix or ".jpg"
    nome_arquivo = f"{uuid.uuid4().hex}{extensao}"
    caminho = UPLOAD_DIR / nome_arquivo

    conteudo = await arquivo.read()
    caminho.write_bytes(conteudo)

    # Chama o Gemini Vision para transcrever
    try:
        imagem_gemini = {
            "mime_type": arquivo.content_type,
            "data": conteudo,
        }
        resposta = modelo_gemini.generate_content([PROMPT_TRANSCRICAO, imagem_gemini])
        texto_resultado = resposta.text.strip()
    except Exception as e:
        # Remove o arquivo se a IA falhar para não deixar lixo em disco
        caminho.unlink(missing_ok=True)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Erro ao processar imagem com a IA: {str(e)}",
        )

    # Persiste no banco
    nova = Transcricao(
        titulo=titulo,
        imagem_caminho=str(caminho),
        texto_resultado=texto_resultado,
        criado=datetime.utcnow(),
        usuario_id=usuario_atual.id,
    )
    session.add(nova)
    session.commit()
    session.refresh(nova)

    return nova


@router.get(
    "/",
    response_model=list[TranscricaoResposta],
    summary="Lista todas as transcrições do usuário logado",
)
def listar_transcricoes(
    session: Session = Depends(get_session),
    usuario_atual: Usuario = Depends(get_usuario_atual),
):
    if usuario_atual.role == "estudante":
        # Estudante vê todas as transcrições de todos os professores
        transcricoes = session.exec(
            select(Transcricao).order_by(Transcricao.criado.desc())
        ).all()
    else:
        # Professor vê só as transcrições que ele criou
        transcricoes = session.exec(
            select(Transcricao)
            .where(Transcricao.usuario_id == usuario_atual.id)
            .order_by(Transcricao.criado.desc())
        ).all()
    return transcricoes


@router.get(
    "/{transcricao_id}",
    response_model=TranscricaoResposta,
    summary="Retorna uma transcrição específica pelo ID",
)
def obter_transcricao(
    transcricao_id: int,
    session: Session = Depends(get_session),
    usuario_atual: Usuario = Depends(get_usuario_atual),
):
    """
    Retorna os dados de uma transcrição.
    Garante que ela pertence ao usuário logado.
    """
    transcricao = session.get(Transcricao, transcricao_id)

    if not transcricao:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transcrição não encontrada.",
        )

    if transcricao.usuario_id != usuario_atual.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Você não tem permissão para acessar esta transcrição.",
        )

    return transcricao
