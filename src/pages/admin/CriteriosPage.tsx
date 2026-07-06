import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getFriendlyErrorMessage } from '../../lib/errors'
import {
  atualizarCriterio,
  criarCriterio,
  excluirCriterio,
  subscribeToCriterios,
} from '../../services/criteriosService'
import type { Criterio } from '../../types/domain'

export function CriteriosPage() {
  const { votacaoId } = useParams()
  const [criterios, setCriterios] = useState<Criterio[]>([])
  const [editing, setEditing] = useState<Criterio | null>(null)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [ordem, setOrdem] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const nextOrder = useMemo(
    () => Math.max(0, ...criterios.map((criterio) => criterio.ordem)) + 1,
    [criterios],
  )

  useEffect(() => {
    if (!votacaoId) {
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    return subscribeToCriterios(
      votacaoId,
      (items) => {
        setCriterios(items)
        setIsLoading(false)
        if (!editing) {
          setOrdem(Math.max(0, ...items.map((item) => item.ordem)) + 1)
        }
      },
      (error) => {
        setErrorMessage(getFriendlyErrorMessage(error))
        setIsLoading(false)
      },
    )
  }, [editing, votacaoId])

  function startEditing(criterio: Criterio) {
    setEditing(criterio)
    setTitulo(criterio.titulo)
    setDescricao(criterio.descricao ?? '')
    setOrdem(criterio.ordem)
    setErrorMessage('')
  }

  function resetForm() {
    setEditing(null)
    setTitulo('')
    setDescricao('')
    setOrdem(nextOrder)
    setErrorMessage('')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!votacaoId) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const input = {
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        ordem,
      }

      if (editing) {
        await atualizarCriterio(votacaoId, editing.id, input)
      } else {
        await criarCriterio(votacaoId, input)
      }

      resetForm()
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(criterio: Criterio) {
    if (!votacaoId) {
      return
    }

    const confirmed = window.confirm(`Excluir o criterio "${criterio.titulo}"?`)

    if (!confirmed) {
      return
    }

    try {
      await excluirCriterio(votacaoId, criterio.id)
      if (editing?.id === criterio.id) {
        resetForm()
      }
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error))
    }
  }

  return (
    <section className="admin-panel">
      <div className="page-header">
        <div>
          <p className="eyebrow">Criterios</p>
          <h1>Questoes de avaliacao</h1>
          <p className="muted">
            Defina a sequencia de criterios exibidos no wizard da plateia.
          </p>
        </div>
        <Link className="secondary-link" to={`/admin/votacoes/${votacaoId}/controle`}>
          Voltar ao controle
        </Link>
      </div>

      <div className="management-grid">
        <form className="form-grid" onSubmit={handleSubmit}>
          <h2>{editing ? 'Editar criterio' : 'Novo criterio'}</h2>
          <label>
            Titulo
            <input
              disabled={isSubmitting}
              minLength={2}
              onChange={(event) => setTitulo(event.target.value)}
              placeholder="Melhor demonstracao de prototipo"
              required
              type="text"
              value={titulo}
            />
          </label>
          <label>
            Descricao
            <textarea
              disabled={isSubmitting}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Orientacao opcional para a plateia"
              rows={3}
              value={descricao}
            />
          </label>
          <label>
            Ordem
            <input
              disabled={isSubmitting}
              min={1}
              onChange={(event) => setOrdem(Number(event.target.value))}
              required
              type="number"
              value={ordem}
            />
          </label>
          {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
          <div className="form-actions">
            {editing ? (
              <button className="neutral-button" onClick={resetForm} type="button">
                Cancelar edicao
              </button>
            ) : null}
            <button disabled={isSubmitting} type="submit">
              {isSubmitting ? 'Salvando...' : editing ? 'Salvar edicao' : 'Adicionar'}
            </button>
          </div>
        </form>

        <div className="admin-list-panel">
          {isLoading ? (
            <div className="empty-state">
              <strong>Carregando criterios.</strong>
              <span>Aguarde enquanto buscamos as questoes cadastradas.</span>
            </div>
          ) : null}
          {!isLoading && criterios.length === 0 ? (
            <div className="empty-state">
              <strong>Nenhum criterio cadastrado.</strong>
              <span>Adicione pelo menos um criterio para iniciar a votacao.</span>
            </div>
          ) : null}
          {criterios.map((criterio) => (
            <article className="compact-card" key={criterio.id}>
              <div>
                <span className="order-badge">#{criterio.ordem}</span>
                <h2>{criterio.titulo}</h2>
                {criterio.descricao ? <p>{criterio.descricao}</p> : null}
              </div>
              <div className="card-actions">
                <button type="button" onClick={() => startEditing(criterio)}>
                  Editar
                </button>
                <button type="button" onClick={() => void handleDelete(criterio)}>
                  Excluir
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
