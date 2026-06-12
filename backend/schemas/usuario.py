# Schemas Pydantic para usuario
# Schameas definem o formato dos dados que entram e saem da API
# São diferentes dos modelos (modleos = banco, schemas = comunicação)

from pydantic import BaseModel

# Dados que o usuário envia para se cadastrar
class UsuarioCadastro(BaseModel):
    nome:str
    email:str
    senha:str
    role:str    # professor ou estudante


# Dados que o usuário envia para fazer login
class UsuarioLogin(BaseModel):
    email:str
    senha:str
    role:str

# Dados do usuário que a API devolve
# Nunca devolvemos a senha
class UsuarioResposta(BaseModel):
    id:int
    nome:str
    email:str
    role:str

# Token JWT devolvida após login bem sucedido
class TokenResposta(BaseModel):
    access_token:str
    token_type:str
    usuario:UsuarioResposta