// Camada de serviço — simula as chamadas ao backend
// Em produção, essas funções fariam fetch() para uma API real.
// Por enquanto retornam dados mockados após um delay para imitar a rede.

// ── Dados mockados ────────────────────────────────────────────────────────────
// Representam transcrições que já existiriam no banco do professor
const TRANSCRICOES_MOCK = [
  {
    id: 'tr1',
    titulo: 'Fotossíntese — fases e equação',
    nomeArquivo: 'lousa_bio_03jun.jpg',
    dataHora: '2025-06-03T09:15:00',
    caracteres: 412,
    linhas: 14,
    texto:
      'FOTOSSÍNTESE\n\nDefinição: processo pelo qual plantas, algas e cianobactérias convertem energia luminosa em energia química armazenada na glicose.\n\nEquação geral:\n6 CO₂ + 6 H₂O + luz → C₆H₁₂O₆ + 6 O₂\n\nFases:\n1. Fase clara (fotoquímica)\n   - Ocorre nos tilacoides\n   - Fotólise da água → libera O₂\n   - Produz ATP e NADPH\n\n2. Fase escura (ciclo de Calvin)\n   - Ocorre no estroma\n   - Fixação do CO₂\n   - Usa ATP e NADPH para sintetizar glicose',
    trecho:
      'FOTOSSÍNTESE — processo pelo qual plantas convertem energia luminosa em química. Equação: 6 CO₂ + 6 H₂O + luz →',
  },
  {
    id: 'tr2',
    titulo: 'Revolução Industrial — causas e consequências',
    nomeArquivo: 'slide_historia_2a.png',
    dataHora: '2025-06-02T14:40:00',
    caracteres: 530,
    linhas: 18,
    texto:
      'REVOLUÇÃO INDUSTRIAL (séc. XVIII–XIX)\n\nCausas:\n• Acúmulo de capital comercial na Inglaterra\n• Disponibilidade de carvão e ferro\n• Mão de obra barata (êxodo rural)\n\nPrimeira fase (1760–1850):\n- Máquina a vapor (James Watt, 1769)\n- Indústria têxtil\n\nConsequências:\n+ Aumento da produção e urbanização\n− Condições de trabalho precárias\n− Trabalho infantil',
    trecho:
      'REVOLUÇÃO INDUSTRIAL — Causas: acúmulo de capital, carvão e ferro. Primeira fase: máquina a vapor (James Watt, 1769).',
  },
  {
    id: 'tr3',
    titulo: 'Funções do 1º grau — revisão',
    nomeArquivo: 'lousa_mat_func.jpg',
    dataHora: '2025-05-30T10:05:00',
    caracteres: 298,
    linhas: 11,
    texto:
      'FUNÇÃO DO 1º GRAU\n\nForma geral: f(x) = ax + b\n  a = coeficiente angular (inclinação)\n  b = coeficiente linear (ponto em y)\n\nCondição: a ≠ 0\n\nGráfico: reta\n  a > 0 → crescente\n  a < 0 → decrescente\n\nZero da função: f(x) = 0 → x = −b/a',
    trecho: 'FUNÇÃO DO 1º GRAU — f(x) = ax + b. Coeficiente angular (a) e linear (b). Gráfico é uma reta.',
  },
]

// Usuários mockados — simulam o banco de dados de autenticação
const USUARIOS_MOCK = [
  { email: 'prof.maria@escola.edu.br', senha: '1234', role: 'professor', nome: 'Prof. Maria' },
  { email: 'lucas@escola.edu.br',      senha: '1234', role: 'estudante', nome: 'Lucas'       },
]

// ── Helpers ───────────────────────────────────────────────────────────────────

// Simula o delay de uma chamada de rede (padrão: 1 segundo)
function esperar(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ── Funções de autenticação ───────────────────────────────────────────────────

/**
 * Simula o login do usuário.
 * Retorna { usuario, token } em caso de sucesso, ou lança um erro.
 */
export async function mockLogin(email, senha, role) {
  await esperar(800)

  const encontrado = USUARIOS_MOCK.find(
    (u) => u.email === email && u.senha === senha && u.role === role
  )

  if (!encontrado) {
    // Lança erro para o ModalLogin exibir a mensagem
    throw new Error('E-mail, senha ou perfil incorretos.')
  }

  return {
    // Dados do usuário que ficam salvos no AuthContext
    usuario: { email: encontrado.email, nome: encontrado.nome, role: encontrado.role },
    // Token fictício — em produção viria do backend (JWT)
    token: `mock-token-${Date.now()}`,
  }
}

// ── Funções de transcrição ────────────────────────────────────────────────────

/**
 * Retorna a lista de transcrições salvas do professor.
 * Em produção faria GET /api/transcricoes com o token de autenticação.
 */
export async function mockListarTranscricoes() {
  await esperar(900)
  return TRANSCRICOES_MOCK
}

/**
 * Envia a imagem para transcrição e retorna o resultado.
 * Em produção faria POST /api/transcrever com o arquivo em multipart/form-data.
 *
 * @param {File}   arquivo - Imagem enviada pelo professor
 * @param {string} titulo  - Título digitado no campo da AreaUpload
 */
export async function mockTranscrever(arquivo, titulo) {
  // Delay maior para simular o processamento da IA
  await esperar(2500)

  const id = `tr${Date.now()}`

  return {
    id,
    titulo: titulo || arquivo.name.replace(/\.[^.]+$/, ''),
    nomeArquivo: arquivo.name,
    dataHora: new Date().toISOString(),
    caracteres: 280,
    linhas: 9,
    texto:
      `[Transcrição simulada de "${arquivo.name}"]\n\n` +
      'Em produção, este texto seria extraído da imagem por um modelo de visão (ex: Claude ou GPT-4o).\n\n' +
      `Tamanho do arquivo: ${(arquivo.size / 1024).toFixed(0)} KB\n` +
      `Tipo: ${arquivo.type}`,
    trecho: `Transcrição simulada de "${arquivo.name}". Em produção o texto da lousa apareceria aqui.`,
  }
}
