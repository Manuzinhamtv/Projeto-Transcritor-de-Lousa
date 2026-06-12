// Barra de navegação
// Recebe "onAbrirLogin" como prop: função chamada quando clica em entrar

// Importa o contexto para poder salvar o usuário após o login
import{useAuthContext} from '../context/AuthContext'

export default function Navbar({onAbrirLogin}){

    // Pega os dados do usuário logado e a função de logout do contexto global
    const{user, isLoggedIn, logout} = useAuthContext()

    return (
        // aria-label descreve a navbar para leitores de tela
        <nav aria-label="Barra de navegação principal">

            <div className="navbar-container">

                {/* Logo do sistema */}
                <div className="navbar-logo">
                    <span className="logo-icone">👁</span>
                    <span className="logo-texto">Transcritor<strong>IA</strong></span>
                </div>

                {/* Lado direito, muda se está logado ou não */}
                <div className="navbar-acoes">

                    {isLoggedIn ? (
                        // Se está logado: mostra nome, perfil e botão de sair
                        <>
                            <span className="navbar-usuario">{user.nome}</span>
                            <span className="navbar-role">{user.role === 'professor' ? 'Professor' : 'Estudante'}</span>
                            <button onClick={logout} className="btn-sair">
                                Sair
                            </button>
                        </>
                    ) : (
                        // Se não está logado: mostra botão de entrar
                        <button onClick={onAbrirLogin} className="btn-entrar">
                            Entrar
                        </button>
                    )}

                </div>
            </div>
        </nav>
    )

}