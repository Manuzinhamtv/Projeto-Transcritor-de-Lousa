// Página de login, primeira tela que o usuário vê
// Redireciona para /professor ou /estudante após o login

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

import '../App.css'

export default function PaginaLogin() {

    // useNavigate permite redirecionar para outra página programaticamente
    const navigate = useNavigate()

    const [role, setRole] = useState('professor')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const { handleLogin, loading, erro } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()

        const sucesso = await handleLogin(email, senha, role)

        if (sucesso) {
            // Redireciona para a página correta dependendo do perfil
            if (role === 'professor') {
                navigate('/professor')
            } else {
                navigate('/estudante')
            }
        }
    }

    return (
        <div className="login-pagina">

            <div className="login-caixa">

                <div className="login-header">
                    <span className="login-icone">📷</span>
                    <h1 className="login-titulo">LousaAI</h1>
                    <p className="login-subtitulo">Transcreva lousas e slides com IA</p>
                </div>

                {/* Seletor de perfil */}
                <div className="role-seletor">
                    <button
                        type="button"
                        className={role === 'professor' ? 'role-ativo' : ''}
                        onClick={() => setRole('professor')}
                    >
                        Professor
                    </button>
                    <button
                        type="button"
                        className={role === 'estudante' ? 'role-ativo' : ''}
                        onClick={() => setRole('estudante')}
                    >
                        Estudante
                    </button>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit}>

                    <label htmlFor="email">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="seu@email.com"
                        required
                    />

                    <label htmlFor="senha">Senha</label>
                    <input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    {/* Mensagem de erro acessível */}
                    {erro && (
                        <p className="erro-msg" role="alert" aria-live="assertive">
                            {erro}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'Aguarde...' : 'Entrar'}
                    </button>

                </form>

                {/* Dados de teste */}
                <div className="modal-dica">
                    <p>Dados de teste:</p>
                    <p>moghis@utfpr.edu.br / 554433 (Professor)</p>
                    <p>manu@utfpr.edu.br / 123456 (Estudante)</p>
                </div>

            </div>
        </div>
    )
}