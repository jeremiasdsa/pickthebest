import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { getFriendlyErrorMessage } from '../../lib/errors'
import {
  excluirVotacao,
  subscribeToVotacoes,
} from '../../services/votacoesService'
import type { Votacao } from '../../types/domain'

export function VotacoesPage() {
  const { user } = useAuth()
  const [votacoes, setVotacoes] = useState<Votacao[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    return subscribeToVotacoes(
      user.uid,
      (items) => {
        setVotacoes(items)
        setIsLoading(false)
      },
      (error) => {
        setErrorMessage(getFriendlyErrorMessage(error))
        setIsLoading(false)
      },
    )
  }, [user])

  async function handleDelete(votacao: Votacao) {
    const confirmed = window.confirm(
      `Excluir a votacao "${votacao.titulo}"? Esta acao nao pode ser desfeita.`,
    )

    if (!confirmed) {
      return
    }

    setDeletingId(votacao.id)
    setErrorMessage('')

    try {
      await excluirVotacao(votacao.id)
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section className="admin-panel">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h1>Votacoes</h1>
          <p className="muted">
            Crie sessoes, cadastre equipes, defina criterios e controle a votacao.
          </p>
        </div>
        <Link className="button-link" to="/admin/votacoes/nova">
          Nova votacao
        </Link>
      </div>
      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
      {isLoading ? (
        <div className="empty-state">
          <strong>Carregando votacoes.</strong>
          <span>Aguarde enquanto buscamos seus eventos no Firestore.</span>
        </div>
      ) : null}
      {!isLoading && votacoes.length === 0 ? (
        <div className="empty-state">
          <strong>Nenhuma votacao criada ainda.</strong>
          <span>Crie a primeira sessao para cadastrar equipes e criterios.</span>
        </div>
      ) : null}
      {votacoes.length > 0 ? (
        <div className="votacoes-list">
          {votacoes.map((votacao) => (
            <article className="votacao-card" key={votacao.id}>
              <div>
                <span className={`status-pill status-${votacao.status.toLowerCase()}`}>
                  {votacao.status}
                </span>
                <h2>{votacao.titulo}</h2>
                {votacao.descricao ? <p>{votacao.descricao}</p> : null}
              </div>
              <div className="card-actions">
                <Link to={`/admin/votacoes/${votacao.id}/controle`}>
                  Controle
                </Link>
                <Link to={`/admin/votacoes/${votacao.id}/equipes`}>Equipes</Link>
                <Link to={`/admin/votacoes/${votacao.id}/criterios`}>Criterios</Link>
                <Link to={`/admin/votacoes/${votacao.id}/editar`}>Editar</Link>
                <button
                  disabled={deletingId === votacao.id}
                  onClick={() => void handleDelete(votacao)}
                  type="button"
                >
                  {deletingId === votacao.id ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
