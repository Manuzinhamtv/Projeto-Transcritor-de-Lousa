// Serviço de comunicação com a API real
// Substitui os dados mockados da Sprint 2

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

// Converte o formato vindo do backend para o formato usado no frontend
function adaptarTranscricao(item) {
  const texto = item.texto_resultado || ""
  const linhas = texto ? texto.split(/\r\n|\r|\n/).length : 0

  return {
    // Dados principais
    id: item.id,
    titulo: item.titulo || "Sem título",
    texto: texto,

    // Campos que o CardHistorico.jsx espera
    dataHora: item.criado,
    nomeArquivo: item.imagem_caminho
      ? item.imagem_caminho.split("\\").pop().split("/").pop()
      : "imagem enviada",
    caracteres: texto.length,
    linhas: linhas,
    trecho: texto.length > 120 ? texto.slice(0, 120) + "..." : texto,

    // Campos alternativos para compatibilidade
    title: item.titulo || "Sem título",
    text: texto,
    date: item.criado,
    data: item.criado,
    chars: texto.length,

    // Campos originais do backend
    texto_resultado: item.texto_resultado,
    imagem_caminho: item.imagem_caminho,
    criado: item.criado,
    usuario_id: item.usuario_id,
  }
}

// Função auxiliar para fazer requisições com o token JWT
async function fetchComToken(url, opcoes = {}) {
  const token = localStorage.getItem("token")

  return fetch(`${BASE_URL}${url}`, {
    ...opcoes,
    headers: {
      "Authorization": `Bearer ${token}`,
      ...opcoes.headers,
    }
  })
}

// Cadastra um novo usuário
export async function mockCadastrar(nome, email, senha, role) {
  const resposta = await fetch(`${BASE_URL}/auth/cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha, role })
  })

  if (!resposta.ok) {
    const erro = await resposta.json()
    throw new Error(erro.detail || "Erro ao cadastrar usuário")
  }

  return resposta.json()
}

// Faz login e retorna os dados do usuário e o token
export async function mockLogin(email, senha, role) {
  const resposta = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha, role })
  })

  if (!resposta.ok) {
    const erro = await resposta.json()
    throw new Error(erro.detail || "Erro ao fazer login")
  }

  const dados = await resposta.json()

  // Salva o token no localStorage para usar nas próximas requisições
  localStorage.setItem("token", dados.access_token)

  return {
    usuario: dados.usuario,
    token: dados.access_token
  }
}

// Lista todas as transcrições do usuário logado
export async function mockListarTranscricoes() {
  const resposta = await fetchComToken("/transcricoes/")

  if (!resposta.ok) {
    throw new Error("Erro ao carregar transcrições")
  }

  const dados = await resposta.json()

  return dados.map(adaptarTranscricao)
}

// Envia imagem e título para transcrição pela IA
export async function mockTranscrever(arquivo, titulo) {
  const formData = new FormData()
  formData.append("titulo", titulo || "Sem título")
  formData.append("arquivo", arquivo)

  const resposta = await fetchComToken("/transcricoes/", {
    method: "POST",
    body: formData
  })

  if (!resposta.ok) {
    const erro = await resposta.json()
    throw new Error(erro.detail || "Erro ao transcrever")
  }

  const dados = await resposta.json()

  console.log("RESPOSTA DA API:", dados)

  return adaptarTranscricao(dados)
}