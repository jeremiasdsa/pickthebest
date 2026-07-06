import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getFriendlyErrorMessage } from '../../lib/errors'
import {
  atualizarEquipe,
  criarEquipe,
  excluirEquipe,
  subscribeToEquipes,
} from '../../services/equipesService'
import type { Equipe } from '../../types/domain'

export function EquipesPage() {
  const { votacaoId } = useParams()
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [editing, setEditing] = useState<Equipe | null>(null)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [ordem, setOrdem] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const nextOrder = useMemo(
    () => Math.max(0, ...equipes.map((equipe) => equipe.ordem)) + 1,
    [equipes],
  )

  useEffect(() => {
    if (!votacaoId) {
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    return subscribeToEquipes(
      votacaoId,
      (items) => {
        setEquipes(items)
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

  function startEditing(equipe: Equipe) {
    setEditing(equipe)
    setNome(equipe.nome)
    setDescricao(equipe.descricao ?? '')
    setOrdem(equipe.ordem)
    setErrorMessage('')
  }

  function resetForm() {
    setEditing(null)
    setNome('')
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
        nome: nome.trim(),
        descricao: descricao.trim(),
        ordem,
      }

      if (editing) {
        await atualizarEquipe(votacaoId, editing.id, input)
      } else {
        await criarEquipe(votacaoId, input)
      }

      resetForm()
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(equipe: Equipe) {
    if (!votacaoId) {
      return
    }

    const confirmed = window.confirm(`Excluir a equipe "${equipe.nome}"?`)

    if (!confirmed) {
      return
    }

    try {
      await excluirEquipe(votacaoId, equipe.id)
      if (editing?.id === equipe.id) {
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
          <p className="eyebrow">Equipes</p>
          <h1>Grupos participantes</h1>
          <p className="muted">Cadastre as equipes que aparecerao na votacao.</p>
        </div>
        <Link className="secondary-link" to={`/admin/votacoes/${votacaoId}/controle`}>
          Voltar ao controle
        </Link>
      </div>

      <div className="management-grid">
        <form className="form-grid" onSubmit={handleSubmit}>
          <h2>{editing ? 'Editar equipe' : 'Nova equipe'}</h2>
          <label>
            Nome
            <input
              disabled={isSubmitting}
              minLength={2}
              onChange={(event) => setNome(event.target.value)}
              placeholder="Equipe Alpha"
              required
              type="text"
              value={nome}
            />
          </label>
          <label>
            Descricao
            <textarea
              disabled={isSubmitting}
              onChange={(event) => setDescricao(event.target.value)}
              placeholder="Resumo opcional da equipe"
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
              <strong>Carregando equipes.</strong>
              <span>Aguarde enquanto buscamos os grupos cadastrados.</span>
            </div>
          ) : null}
          {!isLoading && equipes.length === 0 ? (
            <div className="empty-state">
              <strong>Nenhuma equipe cadastrada.</strong>
              <span>Adicione pelo menos duas equipes para uma votacao util.</span>
            </div>
          ) : null}
          {equipes.map((equipe) => (
            <article className="compact-card" key={equipe.id}>
              <div>
                <span className="order-badge">#{equipe.ordem}</span>
                <h2>{equipe.nome}</h2>
                {equipe.descricao ? <p>{equipe.descricao}</p> : null}
              </div>
              <div className="card-actions">
                <button type="button" onClick={() => startEditing(equipe)}>
                  Editar
                </button>
                <button type="button" onClick={() => void handleDelete(equipe)}>
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
