"""
routers/auth.py
Endpoints de autenticação: cadastro e login.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from database import get_session
from models.usuario import Usuario
from schemas.usuario import UsuarioCadastro, UsuarioLogin, UsuarioResposta, TokenResposta
from auth.jwt import hash_senha, verificar_senha, criar_token

router = APIRouter(prefix="/auth", tags=["Autenticação"])


@router.post(
    "/cadastro",
    response_model=UsuarioResposta,
    status_code=status.HTTP_201_CREATED,
    summary="Cria um novo usuário",
)
def cadastrar(dados: UsuarioCadastro, session: Session = Depends(get_session)):
    """
    Recebe nome, e-mail, senha e perfil (professor | estudante).
    Retorna os dados do usuário criado (sem a senha).
    """
    # Verifica se o e-mail já está em uso
    existente = session.exec(
        select(Usuario).where(Usuario.email == dados.email)
    ).first()

    if existente:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="E-mail já cadastrado.",
        )

    if dados.role not in ("professor", "estudante"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Perfil inválido. Use 'professor' ou 'estudante'.",
        )

    novo_usuario = Usuario(
        nome=dados.nome,
        email=dados.email,
        senha_hash=hash_senha(dados.senha),
        role=dados.role,
    )

    session.add(novo_usuario)
    session.commit()
    session.refresh(novo_usuario)

    return novo_usuario


@router.post(
    "/login",
    response_model=TokenResposta,
    summary="Faz login e retorna um token JWT",
)
def login(dados: UsuarioLogin, session: Session = Depends(get_session)):
    """
    Recebe e-mail, senha e perfil.
    Retorna um token JWT e os dados básicos do usuário.
    """
    usuario = session.exec(
        select(Usuario).where(Usuario.email == dados.email)
    ).first()

    # Mensagem genérica para não revelar se o e-mail existe
    credenciais_invalidas = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="E-mail, senha ou perfil incorretos.",
    )

    if not usuario:
        raise credenciais_invalidas

    if not verificar_senha(dados.senha, usuario.senha_hash):
        raise credenciais_invalidas

    if usuario.role != dados.role:
        raise credenciais_invalidas

    token = criar_token({"sub": str(usuario.id), "role": usuario.role})

    return TokenResposta(
        access_token=token,
        token_type="bearer",
        usuario=UsuarioResposta(
            id=usuario.id,
            nome=usuario.nome,
            email=usuario.email,
            role=usuario.role,
        ),
    )
