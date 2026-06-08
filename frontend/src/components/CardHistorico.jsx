/**
 * CardHistorico — card reutilizável para um item do histórico de transcrições.
 * Props:
 *   item: {
 *     id: string,
 *     titulo: string,
 *     dataHora: string (ISO),
 *     nomeArquivo: string,
 *     caracteres: number,
 *     linhas: number,
 *     trecho: string
 *   }
 *   onSelecionar(item) — exibe a transcrição completa ao clicar
 *   onExcluir(id)      — remove o item do histórico
 *   selecionado: boolean — destaca o card ativo
 */
export default function CardHistorico({ item, onSelecionar, onExcluir, selecionado }) {
  const dataFormatada = new Date(item.dataHora).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  function handleExcluir(e) {
    e.stopPropagation()
    onExcluir(item.id)
  }

  return (
    <div
      className={`card-historico ${selecionado ? 'card-historico--ativo' : ''}`}
      onClick={() => onSelecionar(item)}
      role="button"
      tabIndex={0}
      aria-pressed={selecionado}
      aria-label={`Transcrição: ${item.titulo}`}
      onKeyDown={(e) => e.key === 'Enter' && onSelecionar(item)}
    >
      {/* Cabeçalho do card */}
      <div className="card-header">
        <span className="card-icone">🖼️</span>
        <span className="card-titulo">{item.titulo}</span>
        <button
          onClick={handleExcluir}
          className="card-btn-excluir"
          aria-label={`Excluir transcrição ${item.titulo}`}
          title="Excluir"
        >
          ×
        </button>
      </div>

      {/* Trecho do texto */}
      <p className="card-trecho">{item.trecho}</p>

      {/* Rodapé com metadados */}
      <div className="card-meta">
        <span>📄 {item.nomeArquivo}</span>
        <span>{item.caracteres} chars</span>
        <span className="card-data">{dataFormatada}</span>
      </div>

      {selecionado && <span className="card-badge-ativo">● aberta</span>}
    </div>
  )
}
