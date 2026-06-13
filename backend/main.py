"""
main.py
Ponto de entrada da API FastAPI.
Registra os routers e cria as tabelas ao iniciar.
"""

from dotenv import load_dotenv
load_dotenv()  # carrega .env antes de qualquer import que use os.getenv

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import criar_tabelas
from routers import auth, transcricoes

# ── Aplicação ──────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Transcritor de Lousa",
    description="API para transcrição de imagens de lousa com IA (Gemini).",
    version="1.0.0",
)

# ── CORS ───────────────────────────────────────────────────────────────────────
# Permite que o frontend React (localhost:5173) acesse a API em desenvolvimento

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ────────────────────────────────────────────────────────────────────

app.include_router(auth.router)
app.include_router(transcricoes.router)


# ── Eventos ────────────────────────────────────────────────────────────────────

@app.on_event("startup")
def on_startup():
    """Cria as tabelas no banco ao iniciar o servidor."""
    criar_tabelas()


# ── Health check ───────────────────────────────────────────────────────────────

@app.get("/", tags=["Saúde"])
def raiz():
    return {"status": "ok", "mensagem": "API do Transcritor de Lousa está no ar."}
