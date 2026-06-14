// Hook de autenticação
// Separa a lógica do formulário de login do componente ModalLogin

import { useState } from 'react'

// Puxa login() e carregarHistorico() de onde vivem
import { useAuthContext } from '../context/AuthContext'
import { useTranscricao } from './useTranscricao'
import { mockLogin, mockCadastrar } from '../services/api'

export function useAuth() {
  // Estado de loading e erro são locais ao formulário de login
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  // login() salva o usuário no contexto global
  const { login } = useAuthContext()

  // carregarHistorico() busca as transcrições assim que o usuário loga
  const { carregarHistorico } = useTranscricao()

  /**
   * Tenta autenticar o usuário com e-mail, senha e perfil.
   * Retorna true se deu certo, false se deu erro.
   */
  async function handleLogin(email, senha, role) {
    setLoading(true)
    setErro('')

    try {
      // Chama a api.js — em produção isso faria uma requisição real
      const { usuario, token } = await mockLogin(email, senha, role)

      // Salva os dados no AuthContext para toda a aplicação saber que está logado
      login(usuario, token)

      // Carrega o histórico de transcrições do professor recém-logado
      await carregarHistorico()

      return true
    } catch (err) {
      // Exibe a mensagem de erro dentro do formulário
      setErro(err.message || 'Erro ao fazer login. Tente novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }

  /**
   * Cadastra um novo usuário e, se der certo, já faz login automaticamente.
   */
  async function handleCadastro(nome, email, senha, role) {
    setLoading(true)
    setErro('')

    try {
      await mockCadastrar(nome, email, senha, role)

      const { usuario, token } = await mockLogin(email, senha, role)

      login(usuario, token)

      await carregarHistorico()

      return true
    } catch (err) {
      setErro(err.message || 'Erro ao cadastrar. Tente novamente.')
      return false
    } finally {
      setLoading(false)
    }
  }

  return { handleLogin, handleCadastro, loading, erro, setErro }
}