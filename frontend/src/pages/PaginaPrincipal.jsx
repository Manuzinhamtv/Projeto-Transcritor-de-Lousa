// Página principal da aplicação
// É aqui que tudo se conecta: upload, resultado e histórico

import { useState, useEffect } from 'react'

// Contexto de autenticação criado pela dupla — dá acesso ao usuário logado
import { useAuthContext } from '../context/AuthContext'

// Hook criado pela dupla — toda a lógica de transcrição fica aqui
import { useTranscricao } from '../hooks/useTranscricao'

// Componentes visuais
import AreaUpload from '../components/AreaUpload'
import ResultadoTranscricao from '../components/ResultadoTranscricao'
import CardHistorico from '../components/CardHistorico'
import ModalLogin from '../components/ModalLogin'


export default function PaginaPrincipal() {

  // Puxa do contexto se o usuário está logado e os dados dele
  // useAuthContext() lê o que o AuthProvider disponibilizou para toda a árvore
  const { isLoggedIn, user, logout } = useAuthContext()

  // Puxa do hook toda a lógica de transcrição:
  // transcrever() envia a imagem, transcricoes é a lista do histórico, etc.
  const {
    transcricoes,
    transcricaoAtual,
    loading,
    loadingHistorico,
    erro,
    carregarHistorico,
    transcrever,
    selecionarDoHistorico,
    limpar,
    limparHistorico
  } = useTranscricao()
  
  // Carrega o histórico sempre que o usuário logar
  useEffect(() => {
    if (isLoggedIn) {
      carregarHistorico()
    }
  }, [isLoggedIn])


  // Controla se o modal de login está aberto ou fechado
  const [modalAberto, setModalAberto] = useState(false)

  // Função repassada para o AreaUpload — chamada quando o professor clica em transcrever
  async function handleTranscrever(arquivo, titulo) {
    await transcrever(arquivo, titulo)
  }

  // Função repassada para o CardHistorico — clicou no card, mostra aquela transcrição
  function handleSelecionarHistorico(item) {
    selecionarDoHistorico(item)
  }

  return (
    <div className="pagina">

      {/* ── Cabeçalho ─────────────────────────────────────────── */}
      <header className="header">
        <div className="header-inner">

          <div className="header-brand">
            <span className="header-icone">📷</span>
            <div>
              <h1 className="header-titulo">LousaAI</h1>
              <p className="header-subtitulo">Transcreva lousas e slides com IA</p>
            </div>
          </div>

          {/* Mostra o nome do usuário se estiver logado, ou o botão de entrar */}
          <div className="header-auth">
            {isLoggedIn ? (
              <div className="header-usuario">
                {/* Iniciais do e-mail como avatar */}
                <span className="avatar">
                  {user?.email?.slice(0, 2).toUpperCase()}
                </span>
                <span>{user?.email}</span>
                <button onClick={() => { logout(); limparHistorico() }} className="btn-sair">Sair</button>
              </div>
            ) : (
              <button onClick={() => setModalAberto(true)} className="btn-entrar">
                Entrar
              </button>
            )}
          </div>

        </div>
      </header>

      {/* ── Layout de duas colunas ────────────────────────────── */}
      <main className="main-layout">

        {/* Coluna esquerda: área de upload e resultado */}
        <div className="coluna-principal">

          <section className="secao">
            {/* AreaUpload cuida do drag-and-drop, preview e campo de título */}
            <AreaUpload
              onTranscrever={handleTranscrever}
              loading={loading}
              isLoggedIn={isLoggedIn}
              onAbrirLogin={() => setModalAberto(true)}
            />
          </section>

          <section className="secao">
            {/* Exibe o texto transcrito, botões de copiar e baixar */}
            <ResultadoTranscricao
              transcricao={transcricaoAtual}
              loading={loading}
            />

            {/* Mensagem de erro vinda do hook useTranscricao */}
            {erro && (
              <p className="erro-global" role="alert">
                {erro}
              </p>
            )}
          </section>

        </div>

        {/* Coluna direita: histórico de transcrições */}
        <aside className="coluna-historico">

          <div className="historico-header">
            <h2 className="secao-titulo">Histórico</h2>
            <span className="historico-badge">{transcricoes.length}</span>
          </div>

          {/* Enquanto carrega a lista do servidor */}
          {loadingHistorico && (
            <p className="historico-carregando">Carregando histórico...</p>
          )}

          {/* Lista vazia */}
          {!loadingHistorico && transcricoes.length === 0 && (
            <p className="historico-vazio">
              {isLoggedIn
                ? 'Nenhuma transcrição ainda. Envie uma imagem!'
                : 'Faça login para ver seu histórico.'}
            </p>
          )}

          {/* Lista de cards — cada um representa uma transcrição salva */}
          <div className="historico-lista">
            {transcricoes.map((item) => (
              <CardHistorico
                key={item.id}
                item={item}
                // Destaca o card da transcrição que está sendo exibida
                selecionado={transcricaoAtual?.id === item.id}
                onSelecionar={handleSelecionarHistorico}
                // Ao excluir: se era a atual, limpa o resultado também
                onExcluir={(id) => {
                  if (transcricaoAtual?.id === id) limpar()
                }}
              />
            ))}
          </div>

        </aside>

      </main>

      {/* ── Modal de login — só renderiza quando necessário ──── */}
      {modalAberto && (
        <ModalLogin onFechar={() => setModalAberto(false)} />
      )}

    </div>
  )
}
