# 📷 LousaAI — Transcritor de Lousa com IA

Plataforma web que utiliza Inteligência Artificial (Google Gemini) para transcrever automaticamente o conteúdo de fotos de lousas e slides. Desenvolvida como projeto acadêmico com foco em acessibilidade e inclusão educacional.

---

## ✨ Funcionalidades

- 📸 Upload de imagens via clique ou drag and drop
- 🤖 Transcrição automática com o modelo Gemini (Google GenAI)
- 🗂️ Histórico de transcrições salvo por usuário
- 👤 Perfis distintos para **Professor** e **Estudante**
- 📋 Copiar e baixar o texto transcrito

---

## 🛠️ Tecnologias

### Backend
| Tecnologia | Uso |
|---|---|
| Python 3.11+ | Linguagem principal |
| FastAPI | Framework da API REST |
| SQLModel | ORM + definição dos modelos |
| SQLite | Banco de dados |
| Google GenAI (Gemini) | Transcrição de imagens |
| python-jose + passlib | Autenticação JWT e hash de senhas |
| python-dotenv | Variáveis de ambiente |
| Uvicorn | Servidor ASGI |

### Frontend
| Tecnologia | Uso |
|---|---|
| React 18 | Interface do usuário |
| React Router DOM | Roteamento de páginas |
| Vite | Bundler e servidor de desenvolvimento |
| Tailwind CSS | Estilização |

---

## 📁 Estrutura do Projeto

```
Projeto Transcritor de Lousa/
├── backend/
│   ├── auth/
│   │   └── jwt.py              # Geração e validação de tokens JWT
│   ├── models/
│   │   ├── usuario.py          # Modelo de usuário (SQLModel)
│   │   └── transcricao.py      # Modelo de transcrição (SQLModel)
│   ├── routers/
│   │   ├── auth.py             # Endpoints de cadastro e login
│   │   └── transcricoes.py     # Endpoints de upload e histórico
│   ├── schemas/
│   │   ├── usuario.py          # Schemas de entrada/saída do usuário
│   │   └── transcricao.py      # Schemas de entrada/saída da transcrição
│   ├── uploads/                # Imagens enviadas pelos professores
│   ├── database.py             # Configuração do banco e sessão
│   ├── main.py                 # Ponto de entrada da API
│   ├── requirements.txt        # Dependências Python
│   └── .env                    # Variáveis de ambiente (não versionar)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── AreaUpload.jsx          # Drag and drop + preview de imagem
    │   │   ├── ResultadoTranscricao.jsx # Exibição do texto transcrito
    │   │   ├── CardHistorico.jsx       # Card do histórico
    │   │   ├── ModalLogin.jsx          # Modal de autenticação
    │   │   └── Navbar.jsx              # Barra de navegação
    │   ├── context/
    │   │   └── AuthContext.jsx         # Contexto global de autenticação
    │   ├── hooks/
    │   │   ├── useAuth.js              # Lógica de login e cadastro
    │   │   └── useTranscricao.js       # Lógica de transcrição e histórico
    │   ├── pages/
    │   │   ├── PaginaLogin.jsx         # Tela de login e cadastro
    │   │   ├── PaginaPrincipal.jsx     # Página inicial (sem login)
    │   │   ├── PaginaProfessor.jsx     # Painel do professor
    │   │   └── PaginaEstudante.jsx     # Painel do estudante
    │   ├── services/
    │   │   └── api.js                  # Configuração do cliente HTTP
    │   └── App.jsx                     # Rotas da aplicação
    └── package.json
```

---

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Python 3.11 ou superior
- Node.js 18 ou superior
- Uma chave de API do [Google Gemini](https://aistudio.google.com/app/apikey)

---

### Backend

**1. Entre na pasta do backend e crie um ambiente virtual:**

```bash
cd backend
python -m venv venv
```

**2. Ative o ambiente virtual:**

```bash
# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate
```

**3. Instale as dependências:**

```bash
pip install -r requirements.txt
```

**4. Configure as variáveis de ambiente:**

Crie um arquivo `.env` na pasta `backend/` com o seguinte conteúdo:

```env
GEMINI_API_KEY=sua_chave_aqui
JWT_SECRET=uma_string_secreta_qualquer
```

> ⚠️ Nunca suba o arquivo `.env` para o repositório. Adicione-o ao `.gitignore`.

**5. Inicie o servidor:**

```bash
uvicorn main:app --reload
```

A API estará disponível em `http://localhost:8000`.  
Documentação interativa: `http://localhost:8000/docs`

---

### Frontend

**1. Entre na pasta do frontend e instale as dependências:**

```bash
cd frontend
npm install
```

**2. Inicie o servidor de desenvolvimento:**

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173`.

---

## 🔌 Endpoints da API

### Autenticação

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/cadastro` | Cria um novo usuário |
| `POST` | `/auth/login` | Autentica e retorna o token JWT |

### Transcrições

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| `POST` | `/transcricoes/` | Envia imagem e transcreve com IA | ✅ Professor |
| `GET` | `/transcricoes/` | Lista o histórico do usuário | ✅ |


---

## 👥 Perfis de Usuário

| Ação | Professor | Estudante |
|---|---|---|
| Enviar imagem para transcrição | ✅ | ❌ |
| Ver histórico próprio | ✅ | ✅ |

| Copiar texto transcrito | ✅ | ✅ |

---

## 🔐 Segurança

- Senhas armazenadas com hash bcrypt
- Autenticação via JWT com expiração configurável
- Rotas protegidas por middleware de autenticação
- CORS configurado para aceitar apenas origens locais em desenvolvimento

---

## 👩‍💻 Equipe

| Nome | Responsabilidade |
|---|---|
| **Manuela** | Backend, autenticação e integração com IA (FastAPI, JWT, Gemini), Frontend, UX e acessibilidade (React, componentes, responsividade) |
| **Giovanna** | Backend, autenticação e integração com IA (FastAPI, JWT, Gemini), Frontend, UX e acessibilidade (React, componentes, responsividade)|

---

## 📄 Licença

Projeto acadêmico desenvolvido para fins educacionais. Uso livre para estudo e referência.
