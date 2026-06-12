# Configuração do banco de dados SQLite
# SQLModel usa SQLAlchemy por baixo para se comunicar com o banco

from sqlmodel import SQLModel, create_engine, Session

# Caminho do arquivo do banco de dados
# O arquivo transcritor.db será criado automaticamente na primeira execução
DATABASE_URL = "sqlite:///./transcritor.db"

# Engine é a conexão com o banco de dados
# echo=True faz o SQLAlchemy imprimir os comandos SQL no terminal (debug)
engine=create_engine(DATABASE_URL, echo=True)

# Cria todas as tabelas no banco se ainda não existirem
# Chamada uma vez quando o servidor inicia
def criar_tabelas():
    SQLModel.metadata.create_all(engine)

# Função geradora que abre uma sessão do banco e fecha automaticamente ao terminar
# Usada como dependência nos endpoint com Depends(get_session)
def get_session():
    with Session(engine) as session:
        # yield "pausa" aqui e entrega a sessão para o endpoint usar
        # quando o endpoint terminar, o código continua aqui e fecha a sessão
        yield session
        # sessão fechada automaticamente pelo "with" quando o endpoint termina