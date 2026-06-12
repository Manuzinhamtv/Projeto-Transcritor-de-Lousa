# Modelo do Banco de dados para o usuario
# SQLModel combina SQLAlchemy com Pydantic (banco + validação)

from sqlmodel import SQLModel, Field
from typing import Optional

class Usuario(SQLModel, table = True):
    # classe = tabela do banco de dados

    # Chave primária gerada automaticamente pelo banco
    id: Optional[int] = Field(default=None, primary_key=True)

    # Nome completo do usuário
    nome:str

    # Email único usado para login
    email:str=Field(unique=True, index=True)

    # Senha criptografada
    senha_hash:str

    # Perfil do usuário professor ou estudante
    role:str

    