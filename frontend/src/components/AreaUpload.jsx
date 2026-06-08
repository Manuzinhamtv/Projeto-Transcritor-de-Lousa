// Componente da área de upload de imagem
// Recebe como props:
// - onTranscrever: função chamada quando clica em "Transcrever com IA"
// - loading: se está processando (para desabilitar o botão)
// - isLoggedIn: se o usuário está logado
// - onAbrirLogin: função para abrir o modal de login

import { useState, useRef } from 'react'

export default function AreaUpload({ onTranscrever, loading, isLoggedIn, onAbrirLogin }) {

  // Guarda o arquivo de imagem selecionado
  const [arquivo, setArquivo] = useState(null)

  // Guarda a URL da preview da imagem (para mostrar na tela)
  const [preview, setPreview] = useState(null)

  // Guarda o título digitado pelo professor
  const [titulo, setTitulo] = useState('')

  // Referência ao input de arquivo — usada para abrir o seletor ao clicar na área
  const inputRef = useRef()

  // Função chamada quando o usuário escolhe um arquivo
  function handleArquivo(file) {

    // Verifica se é uma imagem
    if (!file || !file.type.startsWith('image/')) return

    // Verifica se é menor que 10 MB
    if (file.size > 10 * 1024 * 1024) {
      alert('Imagem muito grande. Máximo 10 MB.')
      return
    }

    // Salva o arquivo no estado
    setArquivo(file)

    // Cria uma URL temporária para mostrar a preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  // Função chamada quando o usuário solta uma imagem na área (drag and drop)
  function handleDrop(e) {
    e.preventDefault()
    handleArquivo(e.dataTransfer.files[0])
  }

  // Função chamada quando clica em "Transcrever com IA"
  async function handleSubmit() {

    // Se não está logado, abre o modal de login
    if (!isLoggedIn) {
      onAbrirLogin()
      return
    }

    // Se não tem arquivo, não faz nada
    if (!arquivo) return

    // Chama a função passada pela página principal
    await onTranscrever(arquivo, titulo)
  }

  // Função para remover a imagem selecionada
  function removerImagem() {
    setArquivo(null)
    setPreview(null)
    // Limpa o input para permitir selecionar o mesmo arquivo de novo
    inputRef.current.value = ''
  }

  return (
    <div className="upload-container">

      <p className="secao-titulo">Enviar imagem</p>

      {/* Área de drag and drop — clicável e acessível por teclado */}
      <div
        className="drop-area"
        onClick={() => !preview && inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label="Área de upload. Clique ou arraste uma imagem"
        onKeyDown={(e) => e.key === 'Enter' && !preview && inputRef.current.click()}
      >
        {/* Se tem preview, mostra a imagem. Se não, mostra as instruções */}
        {preview ? (
          <img src={preview} alt="Pré-visualização da imagem enviada" className="preview-img" />
        ) : (
          <>
            <span className="upload-icone">📷</span>
            <p>Clique para escolher ou arraste uma foto da lousa ou slide</p>
            <p className="upload-dica">JPG, PNG, WebP — até 10 MB</p>
          </>
        )}
      </div>

      {/* Input de arquivo oculto — ativado pelo clique na área acima */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="input-oculto"
        aria-label="Selecionar arquivo de imagem"
        onChange={(e) => handleArquivo(e.target.files[0])}
      />

      {/* Botão para remover a imagem — só aparece se tem uma imagem selecionada */}
      {preview && (
        <button onClick={removerImagem} className="btn-remover">
          Remover imagem
        </button>
      )}

      {/* Campo de título */}
      <label htmlFor="titulo">Título da aula</label>
      <input
        id="titulo"
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Ex: Fotossíntese — fases e equação"
        maxLength={80}
      />

      {/* Botão principal */}
      <button
        onClick={handleSubmit}
        disabled={loading || (isLoggedIn && !arquivo)}
        className="btn-transcrever"
        aria-label="Transcrever imagem com inteligência artificial"
      >
        {/* Muda o texto dependendo do estado */}
        {loading ? 'Analisando com IA...' : !isLoggedIn ? 'Entre para transcrever' : '✨ Transcrever com IA'}
      </button>

    </div>
  )
}
