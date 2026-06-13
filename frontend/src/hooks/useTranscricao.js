// hooks/useTranscricao.js
// Lógica de upload, transcrição e histórico — agora conectada à API real.

import { useState } from 'react'
import { mockListarTranscricoes, mockTranscrever } from '../services/api'
import { useAuthContext } from '../context/AuthContext'

export function useTranscricao() {
    const { token } = useAuthContext()

    const [transcricoes, setTranscricoes] = useState([])
    const [transcricaoAtual, setTranscricaoAtual] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingHistorico, setLoadingHistorico] = useState(false)
    const [erro, setErro] = useState('')

    // Carrega o histórico de transcrições do usuário logado
    async function carregarHistorico() {
        setLoadingHistorico(true)
        try {
            const dados = await mockListarTranscricoes(token)
            setTranscricoes(dados)
        } catch (err) {
            console.error('Erro ao carregar histórico:', err)
        } finally {
            setLoadingHistorico(false)
        }
    }

    // Envia imagem para o backend e recebe o texto transcrito
    async function transcrever(arquivo, titulo) {
        setLoading(true)
        setErro('')
        setTranscricaoAtual(null)

        try {
            const resultado = await mockTranscrever(arquivo, titulo, token)

            // Adiciona a nova transcrição no topo do histórico
            setTranscricoes((anterior) => [resultado, ...anterior])
            setTranscricaoAtual(resultado)
            return resultado
        } catch (err) {
            setErro(err.message || 'Erro ao transcrever. Tente novamente!')
            return null
        } finally {
            setLoading(false)
        }
    }

    function selecionarDoHistorico(item) {
        setTranscricaoAtual(item)
    }

    function limpar() {
        setTranscricaoAtual(null)
        setErro('')
    }

    function limparHistorico() {
        setTranscricoes([])
        setTranscricaoAtual(null)
        setErro('')
    }

    return {
        transcricoes,
        transcricaoAtual,
        loading,
        loadingHistorico,
        erro,
        carregarHistorico,
        transcrever,
        selecionarDoHistorico,
        limpar,
        limparHistorico,
    }
}
