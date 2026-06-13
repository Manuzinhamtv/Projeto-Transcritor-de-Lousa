// Serviço de comunicação com a API real
// Substitui os dados mockados da Sprint 2

const BASE_URL = "http://127.0.0.1:8000"

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

  return resposta.json()
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

  return resposta.json()
}