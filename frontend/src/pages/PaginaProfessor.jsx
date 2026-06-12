// Página do professor, upload de imagens e visualização do resultado
// Só acessível após login com perfil "professor"

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../context/AuthContext'
import { useTranscricao } from '../hooks/useTranscricao'
import AreaUpload from '../components/AreaUpload'
import ResultadoTranscricao from '../components/ResultadoTranscricao'
import CardHistorico from '../components/CardHistorico'

export default function PaginaProfessor() {

    const navigate = useNavigate()
    const { user, logout, isLoggedIn } = useAuthContext()

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

    // Se não está logado ou não é professor, redireciona para o login
    useEffect(() => {
        if (!isLoggedIn || user?.role !== 'professor') {
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
                            <p className="header-subtitulo">Painel do Professor</p>
                        </div>
                    </div>
                    <div className="header-auth">
                        <div className="header-usuario">
                            <span className="avatar">
                                {user?.email?.slice(0, 2).toUpperCase()}
                            </span>
                            <span>{user?.email}</span>
                            <span className="header-role">Professor</span>
                            <button onClick={handleLogout} className="btn-sair">Sair</button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="main-layout">

                <div className="coluna-principal">

                    <section className="secao">
                        <AreaUpload
                            onTranscrever={transcrever}
                            loading={loading}
                            isLoggedIn={isLoggedIn}
                            onAbrirLogin={() => navigate('/')}
                        />
                    </section>

                    <section className="secao">
                        <ResultadoTranscricao
                            transcricao={transcricaoAtual}
                            loading={loading}
                        />
                        {erro && (
                            <p className="erro-global" role="alert">{erro}</p>
                        )}
                    </section>

                </div>

                <aside className="coluna-historico">
                    <div className="historico-header">
                        <h2 className="secao-titulo">Histórico</h2>
                        <span className="historico-badge">{transcricoes.length}</span>
                    </div>

                    {loadingHistorico && <p className="historico-carregando">Carregando...</p>}

                    {!loadingHistorico && transcricoes.length === 0 && (
                        <p className="historico-vazio">Nenhuma transcrição ainda. Envie uma imagem!</p>
                    )}

                    <div className="historico-lista">
                        {transcricoes.map((item) => (
                            <CardHistorico
                                key={item.id}
                                item={item}
                                selecionado={transcricaoAtual?.id === item.id}
                                onSelecionar={selecionarDoHistorico}
                                onExcluir={(id) => {
                                    if (transcricaoAtual?.id === id) limpar()
                                }}
                            />
                        ))}
                    </div>
                </aside>

            </main>
        </div>
    )
}