// Modal de login e cadastro
// Recebe onFechar como prop: função chamada quando o modal é fechado

import{useState} from 'react'
import{useAuth} from '../hooks/useAuth'

export default function ModalLogin({onFechar}){
    
    // Controla se está na tela de login ou de cadastro
    const[modo, setModo] = useState('login')

    // Controla qual perfil foi selecionado: professor ou estudante
    const[role, setRole] = useState('professor')

    // Guarda o que o usuário digita nos campos
    const[email, setEmail] = useState('')
    const[senha, setSenha] = useState('')

    // Pega a função de login e os estados de loading e erro do hook
    const{handleLogin, loading, erro, setErro} = useAuth()

    // Função chamada quando o usuário clica em entrar
    async function handleSubmit(e){
        // Impede o comportamento padrão do formulário (recarregar a página), executando normalmente sem recarregar a página
        e.preventDefault() // Cancela esse comportamento padrão

        const sucesso = await handleLogin(email, senha, role)

        // Se o login deu certo, fecha o modal
        if(sucesso) onFechar()
    }

    return (
        // Fundo escuro atrás do modal
        // Clicando fora do modal ele fecha
        <div
            className="modal-overlay"
            onClick={(e) => e.target === e.currentTarget && onFechar()}
        >
            {/* Caixa branca do modal */}
            <div className="modal-caixa">

                <div className="modal-cabecalho">
                    <h2>{modo === 'login' ? 'Entrar na conta' : 'Criar conta'}</h2>
                    {/* Botão de fechar acessível para leitores de tela */}
                    <button onClick={onFechar} aria-label="Fechar modal">×</button>
                </div>

                {/* Seletor de perfil: Professor ou Estudante */}
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

                {/* Formulário de login */}
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

                    {/* Exibe o erro se houver — aria-live faz o leitor de tela anunciar */}
                    {erro && (
                        <p className="erro-msg" role="alert" aria-live="assertive">
                            {erro}
                        </p>
                    )}

                    <button type="submit" disabled={loading} className="btn-submit">
                        {loading ? 'Aguarde...' : 'Entrar'}
                    </button>

                </form>

                {/* Dados de teste para facilitar durante o desenvolvimento */}
                <div className="modal-dica">
                    <p>Dados de teste:</p>
                    <p>moghis@utfpr.edu.br / 554433 (Professor)</p>
                    <p>manu@utfpr.edu.br / 123456 (Estudante)</p>
                </div>

            </div>
        </div>
    )
}