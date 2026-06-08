// Importando ferramentas do react que usaremos
import {createContext, useContext, useState} from 'react'

// Cria o contexto, caixa que qualquer componente pode acessar, começa vazia
const AuthContext = createContext(null)

// AuthProvider aplicação e disponibilização dos dados de autenticação
// children = tudo que está dentro dele
export function AuthProvider({children}){

    // user guarda os dados do usuário logado, começa null pq ninguém está logado
    // setUser = variável usada para mudar o valor de user
    const [user, setUser] = useState(null)

    // token guarda o token JWT que será usado para autenticar as requisições ao backend
    // basicamente a chave de acesso que o backend vai exigir
    const [token, setToken] = useState(null)

    // Chamada quando o usuário faz login, salva os dados recebidos
    function login(userData, authToken){
        // Salva os dados do usuário na variável user
        setUser(userData)
        // Salva token JWT na variável token
        setToken(authToken)
    }

    // Função chamada quando usuário clica em sair
    function logout(){
        // Apaga o usuário da memória (volta pra null, ninguém logado)
        setUser(null)
        // Apaga o token (backend nega requisições)
        setToken(null)
    }

    return(
        // "value" é o que fica disponível para todos os componentes filhos acessarem
        // !!user transforma user em booleano, isLoggedIn se user for null = false, se tiver dados = true
        <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn: !!user }}>
            {children}
        </AuthContext.Provider>
    )
}

// Hook personalizado, em vez de escrever useContext(AuthContext) toda hora,
// qualquer componente pode importar e chamar só useAuthContext()
export function useAuthContext(){
    return useContext(AuthContext)
}