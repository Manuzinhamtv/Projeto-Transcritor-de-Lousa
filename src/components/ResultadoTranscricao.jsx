import { useState } from 'react'

/**
 * ResultadoTranscricao — exibe o texto transcrito de uma imagem de lousa/slide.
 * Props:
 *   transcricao: {
 *     texto: string,
 *     titulo: string,
 *     caracteres: number,
 *     linhas: number
 *   } | null
 *   loading: boolean — exibe skeleton enquanto a IA processa
 */
export default function ResultadoTranscricao({ transcricao, loading }) {
  const [copiado, setCopiado] = useState(false)

  async function copiarTexto() {
    if (!transcricao?.texto) return
    await navigator.clipboard.writeText(transcricao.texto)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  function baixarTexto() {
    if (!transcricao?.texto) return
    const blob = new Blob([transcricao.texto], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${transcricao.titulo || 'transcricao'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="resultado-container resultado-loading">
        <div className="resultado-loading-header">
          <span className="spinner" aria-hidden="true" />
          <span>Analisando imagem com IA...</span>
        </div>
        <div className="skeleton-lines">
          <div className="skeleton-line" style={{ width: '100%' }} />
          <div className="skeleton-line" style={{ width: '88%' }} />
          <div className="skeleton-line" style={{ width: '72%' }} />
          <div className="skeleton-line" style={{ width: '95%' }} />
          <div className="skeleton-line" style={{ width: '60%' }} />
        </div>
      </div>
    )
  }

  if (!transcricao) {
    return (
      <div className="resultado-container resultado-vazio">
        <span className="resultado-vazio-icone">📝</span>
        <p>O texto transcrito aparecerá aqui após o envio da imagem</p>
      </div>
    )
  }

  return (
    <div className="resultado-container">
      <div className="resultado-header">
        <h2 className="resultado-titulo">{transcricao.titulo || 'Transcrição'}</h2>
        <div className="resultado-meta">
          <span>{transcricao.caracteres} caracteres</span>
          <span>{transcricao.linhas} linhas</span>
        </div>
      </div>

      <div
        className="resultado-texto"
        role="region"
        aria-label="Texto transcrito"
      >
        {transcricao.texto}
      </div>

      <div className="resultado-acoes">
        <button
          onClick={copiarTexto}
          className={`btn-acao ${copiado ? 'btn-acao--sucesso' : ''}`}
          aria-label="Copiar texto transcrito"
        >
          {copiado ? '✅ Copiado!' : '📋 Copiar texto'}
        </button>
        <button
          onClick={baixarTexto}
          className="btn-acao"
          aria-label="Baixar transcrição como arquivo de texto"
        >
          ⬇️ Baixar .txt
        </button>
      </div>
    </div>
  )
}
