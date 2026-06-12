// Raiz da aplicação, define as rotas do sistema
// Cada rota corresponde a uma URL e renderiza uma página diferente

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PaginaLogin from './pages/PaginaLogin'
import PaginaProfessor from './pages/PaginaProfessor'
import PaginaEstudante from './pages/PaginaEstudante'

export default function App() {
  return (
    // AuthProvider envolve tudo, qualquer página pode acessar o contexto
    <AuthProvider>

      {/* BrowserRouter habilita o roteamento por URL */}
      <BrowserRouter>
        <Routes>

          {/* / → página de login */}
          <Route path="/" element={<PaginaLogin />} />

          {/* /professor, painel do professor */}
          <Route path="/professor" element={<PaginaProfessor />} />

          {/* /estudante, painel do estudante */}
          <Route path="/estudante" element={<PaginaEstudante />} />

          {/* qualquer URL desconhecida redireciona para o login */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>

    </AuthProvider>
  )
}