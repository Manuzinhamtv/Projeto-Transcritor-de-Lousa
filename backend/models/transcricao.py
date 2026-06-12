# Modelo do banco de dados para transcrição
# Cada transcrição pertence a um professor

from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime

class Transcricao(SQLModel, table=True):

    # Chave primária, gerada automaticamente pelo banco
    id:Optional[int]=Field(default=None, primary_key=True)

    # Título dado pelo professor
    titulo:str

    # Caminho da imagem salva no servido
    imagem_caminho:str

    # Texto acessível gerado pela IA
    texto_resultado:str

    # Data e hora de criação, preenchido automaticamente
    criado:datetime=Field(default_factory=datetime.utcnow)

    # Chave estrangeira, liga a transcrição ao professor que a criou
    # Field(foreig_key=) diz que esse campo aponta para tabela usuário
    usuario_id:int=Field(foreign_key="usuario.id")
