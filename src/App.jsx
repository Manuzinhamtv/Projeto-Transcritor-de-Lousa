// Raiz da aplicação
// É o primeiro componente que o React monta na página

import './App.css'

// AuthProvider envolve toda a aplicação para que qualquer componente
// possa acessar os dados de autenticação via useAuthContext()
import { AuthProvider } from './context/AuthContext'

import PaginaPrincipal from './pages/PaginaPrincipal'

export default function App() {
  return (
    // Sem o AuthProvider aqui, qualquer componente que chamar
    // useAuthContext() quebraria com um erro de contexto nulo
    <AuthProvider>
      <PaginaPrincipal />
    </AuthProvider>
  )
}
