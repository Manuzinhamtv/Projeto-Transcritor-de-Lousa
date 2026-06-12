# Schemas Pydantic para a transcrição
# Definem o formato dos dados que entram e saem da API

from pydantic import BaseModel
from datetime import datetime

# Dados que o professor envia para criar uma transcrição
# O arquivo de imagem vem separado como upload (não entra aqui)
class TranscricaoEntrada(BaseModel):
    titulo:str

# Dados que a API devolve após criar uma transcrição
class TranscricaoResposta(BaseModel):
    id:int
    titulo:str
    imagem_caminho:str
    texto_resultado:str
    criado:datetime
    usuario_id:int
    # Permite que o Pydantic leia dados vindos do SQLModel
    class Config:
        from_attributes=True