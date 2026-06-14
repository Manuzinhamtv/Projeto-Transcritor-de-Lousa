"""
routers/transcricoes.py
Endpoints de upload de imagem, transcrição com IA (Gemini) e listagem do histórico.
"""

import os
import uuid
from pathlib import Path
from datetime import datetime

from google import genai
from google.genai import types
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
cliente_gemini = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

PROMPT_TRANSCRICAO = (
    "Transcreva fielmente todo o texto visível na imagem. "
    "A imagem pode conter uma lousa, slide, folha, anotação ou conteúdo escolar. "
    "Leia títulos, tópicos, listas, fórmulas, números e qualquer palavra visível. "
    "Mantenha a organização do conteúdo em texto simples. "
    "Se alguma parte estiver ilegível, escreva [ilegível]. "
    "Não explique, não resuma e não invente conteúdo. Apenas transcreva."
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

    if not conteudo:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Arquivo vazio. Envie uma imagem válida.",
        )

    caminho.write_bytes(conteudo)

    # Chama o Gemini Vision para transcrever
    try:
        # Envia o prompt e a imagem para o modelo Gemini
        resposta = cliente_gemini.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=[
                PROMPT_TRANSCRICAO,
                types.Part.from_bytes(
                    data=conteudo,
                    mime_type=arquivo.content_type
                ),
            ],
        )

        texto_resultado = (resposta.text or "").strip()

        if not texto_resultado:
            raise Exception(
                "A IA não retornou nenhum texto. "
                "Tente enviar uma imagem mais nítida, com boa iluminação e texto legível."
            )

    except Exception as e:
        # Remove o arquivo se a IA falhar para não deixar lixo em disco
        caminho.unlink(missing_ok=True)

        erro = str(e)

        if "429" in erro or "RESOURCE_EXHAUSTED" in erro:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=(
                    "A cota da API do Gemini foi excedida. "
                    "Aguarde alguns segundos e tente novamente. "
                    "Se o erro continuar, verifique a chave da API ou a cota no Google AI Studio."
                ),
            )

        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Erro ao processar imagem com a IA: {erro}",
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