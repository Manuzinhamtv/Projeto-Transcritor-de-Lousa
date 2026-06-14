// Página de login, primeira tela que o usuário vê
// Redireciona para /professor ou /estudante após o login

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

import '../App.css'

export default function PaginaLogin() {

    // useNavigate permite redirecionar para outra página programaticamente
    const navigate = useNavigate()

    const [modo, setModo] = useState('login')
    const [role, setRole] = useState('professor')
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')

    const { handleLogin, handleCadastro, loading, erro, setErro } = useAuth()

    async function handleSubmit(e) {
        e.preventDefault()

        let sucesso = false

        if (modo === 'login') {
            sucesso = await handleLogin(email, senha, role)
        } else {
            sucesso = await handleCadastro(nome, email, senha, role)
        }

        if (sucesso) {
            // Redireciona para a página correta dependendo do perfil
            if (role === 'professor') {
                navigate('/professor')
            } else {
                navigate('/estudante')
            }
        }
    }

    function alternarModo(novoModo) {
        setModo(novoModo)
        setErro('')
    }

    return (
        <div className="login-pagina">

            <div className="login-caixa">

                <div className="login-header">
                    <span className="login-icone">📷</span>
                    <h1 className="login-titulo">LousaAI</h1>
                    <p className="login-subtitulo">Transcreva lousas e slides com IA</p>
                </div>

                {/* Seletor entre login e cadastro */}
                <div className="role-seletor">
                    <button
                        type="button"
                        className={modo === 'login' ? 'role-ativo' : ''}
                        onClick={() => alternarModo('login')}
                    >
                        Entrar
                    </button>
                    <button
                        type="button"
                        className={modo === 'cadastro' ? 'role-ativo' : ''}
                        onClick={() => alternarModo('cadastro')}
                    >
                        Cadastrar
                    </button>
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

                    {modo === 'cadastro' && (
                        <>
                            <label htmlFor="nome">Nome</label>
                            <input
                                id="nome"
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                placeholder="Seu nome"
                                required
                            />
                        </>
                    )}

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
                        {loading
                            ? 'Aguarde...'
                            : modo === 'login'
                                ? 'Entrar'
                                : 'Cadastrar'}
                    </button>

                </form>

                {/* Dados de teste */}
                {modo === 'login' && (
                    <div className="modal-dica">
                        <p>Dados de teste:</p>
                        <p>moghis@utfpr.edu.br / 554433 (Professor)</p>
                        <p>manu@utfpr.edu.br / 123456 (Estudante)</p>
                    </div>
                )}

                {modo === 'cadastro' && (
                    <div className="modal-dica">
                        <p>Após cadastrar, o sistema já fará login automaticamente.</p>
                    </div>
                )}

            </div>
        </div>
    )
}