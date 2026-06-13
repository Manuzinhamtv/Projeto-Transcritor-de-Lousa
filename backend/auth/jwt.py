"""
auth/jwt.py
Funções de segurança: hash de senha, verificação e geração de tokens JWT.
"""

import os
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlmodel import Session, select

from database import get_session
from models.usuario import Usuario

# ── Configuração ───────────────────────────────────────────────────────────────

SECRET_KEY = os.getenv("JWT_SECRET", "chave_projeto_transcritor")
ALGORITHM = "HS256"
EXPIRE_MINUTES = 60 * 8   # token válido por 8 horas

# Contexto do passlib para hashing bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Informa ao FastAPI onde o token chega (header Authorization: Bearer <token>)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


# ── Senha ──────────────────────────────────────────────────────────────────────

def hash_senha(senha: str) -> str:
    """Retorna o hash bcrypt da senha."""
    return pwd_context.hash(senha)


def verificar_senha(senha: str, hash_: str) -> bool:
    """Compara a senha em texto puro com o hash armazenado."""
    return pwd_context.verify(senha, hash_)


# ── JWT ────────────────────────────────────────────────────────────────────────

def criar_token(data: dict) -> str:
    """Cria um JWT com os dados fornecidos e tempo de expiração."""
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRE_MINUTES)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def decodificar_token(token: str) -> dict:
    """Decodifica e valida o JWT. Lança HTTPException 401 se inválido."""
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido ou expirado.",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ── Dependência de autenticação ────────────────────────────────────────────────

def get_usuario_atual(
    token: str = Depends(oauth2_scheme),
    session: Session = Depends(get_session),
) -> Usuario:
    """
    Dependência usada nos endpoints protegidos.
    Extrai o usuário do token JWT e o retorna.
    """
    payload = decodificar_token(token)
    usuario_id: int = payload.get("sub")

    if usuario_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token sem identificação de usuário.",
        )

    usuario = session.get(Usuario, int(usuario_id))
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não encontrado.",
        )

    return usuario
