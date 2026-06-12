// Página do estudante, visualização das transcrições salvas pelo professor
// Focada em leitura e acessibilidade para leitores de tela

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useTranscricao } from '../hooks/useTranscricao'
import CardHistorico from '../components/CardHistorico'

export default function PaginaEstudante() {

    const navigate = useNavigate()
    const { user, logout, isLoggedIn } = useAuthContext()

    const {
        transcricoes,
        transcricaoAtual,
        loadingHistorico,
        carregarHistorico,
        selecionarDoHistorico,
        limparHistorico
    } = useTranscricao()

    // Se não está logado ou não é estudante, redireciona para o login
    useEffect(() => {
        if (!isLoggedIn || user?.role !== 'estudante') {
            navigate('/')
        }
    }, [isLoggedIn])

    // Carrega o histórico quando a página abre
    useEffect(() => {
        if (isLoggedIn) {
            carregarHistorico()
        }
    }, [isLoggedIn])

    function handleLogout() {
        limparHistorico()
        logout()
        navigate('/')
    }

    return (
        <div className="pagina">

            <header className="header">
                <div className="header-inner">
                    <div className="header-brand">
                        <span className="header-icone">📷</span>
                        <div>
                            <h1 className="header-titulo">LousaAI</h1>
                            <p className="header-subtitulo">Minhas aulas</p>
                        </div>
                    </div>
                    <div className="header-auth">
                        <div className="header-usuario">
                            <span className="avatar" style={{ background: '#2563eb' }}>
                                {user?.email?.slice(0, 2).toUpperCase()}
                            </span>
                            <span>{user?.email}</span>
                            <span className="header-role" style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                                Estudante
                            </span>
                            <button onClick={handleLogout} className="btn-sair">Sair</button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="estudante-layout">

                {/* Coluna esquerda — lista de transcrições */}
                <aside className="coluna-historico" aria-label="Lista de aulas disponíveis">
                    <div className="historico-header">
                        <h2 className="secao-titulo">Aulas disponíveis</h2>
                        <span className="historico-badge">{transcricoes.length}</span>
                    </div>

                    {loadingHistorico && (
                        <p className="historico-carregando">Carregando aulas...</p>
                    )}

                    {!loadingHistorico && transcricoes.length === 0 && (
                        <p className="historico-vazio">
                            Nenhuma aula disponível ainda.
                        </p>
                    )}

                    <div className="historico-lista">
                        {transcricoes.map((item) => (
                            <CardHistorico
                                key={item.id}
                                item={item}
                                selecionado={transcricaoAtual?.id === item.id}
                                onSelecionar={selecionarDoHistorico}
                                // Estudante não pode excluir transcrições
                                onExcluir={null}
                            />
                        ))}
                    </div>
                </aside>

                {/* Coluna direita — conteúdo da aula selecionada */}
                <div className="coluna-principal">
                    {transcricaoAtual ? (
                        <section
                            className="resultado-container"
                            aria-label="Conteúdo da aula selecionada"
                            aria-live="polite"
                        >
                            <h2 className="resultado-titulo">{transcricaoAtual.titulo}</h2>
                            <p className="resultado-meta-data">{transcricaoAtual.data}</p>

                            {/* Texto acessível para leitores de tela */}
                            <div className="resultado-texto">
                                {transcricaoAtual.texto}
                            </div>

                            {/* Botão de copiar para facilitar o uso com leitor de tela */}
                            <button
                                className="btn-acao"
                                onClick={() => navigator.clipboard.writeText(transcricaoAtual.texto)}
                                aria-label="Copiar texto da aula para área de transferência"
                            >
                                📋 Copiar texto
                            </button>

                        </section>
                    ) : (
                        <div className="resultado-container resultado-vazio">
                            <span className="resultado-vazio-icone">📚</span>
                            <p>Selecione uma aula ao lado para ler o conteúdo</p>
                        </div>
                    )}
                </div>

            </main>
        </div>
    )
}