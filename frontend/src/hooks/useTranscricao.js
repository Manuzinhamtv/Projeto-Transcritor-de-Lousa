// Arquivo responsável pela lógica de upload e do histórico

// Importa useState para controlar os dados, loading e erro
import{useState} from 'react'

// Importa as funções mockadas do api.js
import { mockListarTranscricoes, mockTranscrever } from '../services/api'

export function useTranscricao(){
    // Lista de transições do histórico
    const [transcricoes, setTranscricoes] = useState([])

    // Transcrição atualmente selecionada para exibir o resultado
    const [transcricaoAtual, setTranscricaoAtual] = useState(null)

    // Controla o loading do botão transcrever com IA
    const[loading, setLoading] = useState(false)

    // Controla o loading do histórico quando está carregando a lista
    const[loadingHistorico, setLoadingHistorico] = useState(false)

    // Guarda mensagem de erro
    const[erro, setErro] = useState('')

    // Função que carrega o histórico de transcrições
    // é chamada quando o usuário faz login
    async function carregarHistorico() {
        setLoadingHistorico(true)
    
        try{
            const dados = await mockListarTranscricoes()
            // Salva a lista retornada pela api.js
            setTranscricoes(dados)
        }
        catch(err){
            console.error('\nErro ao carregar histórico:', err)
        }
        finally{
            setLoadingHistorico(false)
        }
    }
    // Função chamada quando o professor professor clica em Transcrever com IA
    async function transcrever(arquivo, titulo){
        setLoading(true)
        setErro('')
        setTranscricaoAtual(null)        
    
    try{
        // Chama a função da api.js passando o arqwuivo e o título
        const resultado = await mockTranscrever(arquivo, titulo)

        // Adiciona a nova transcricao no topo do historico
        setTranscricoes(anterior=>[resultado, ...anterior])

        // Define como transcricao atual para exibir o resultado
        setTranscricaoAtual(resultado)
        return resultado
    }
    catch(err){
        setErro('\nErro ao transcrever. Tente novamente!\n')
        return null
    }
    finally{
        // Desativa o loading independente de ter dado certo ou errado
        setLoading(false)
    }
    }

    // Função chamada quando o usuário clica em uma transcrição do histórico
    function selecionarDoHistorico(item) {
        setTranscricaoAtual(item)
    }

    // Função para limpar o resultado atual da tela
    function limpar(){
        setTranscricaoAtual(null)
        setErro('')
    }

    // Limpa o histórico quando o usuário faz logout
    function limparHistorico() {
        setTranscricoes([])
        setTranscricaoAtual(null)
        setErro('')
    }

    // Exporta tudo que os componentes precisam usar
    return{
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
    }
}