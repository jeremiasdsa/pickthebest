import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import { getFriendlyErrorMessage } from '../../lib/errors'
import {
  atualizarVotacao,
  buscarVotacao,
  criarVotacao,
} from '../../services/votacoesService'

export function VotacaoFormPage() {
  const { votacaoId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const isEditing = Boolean(votacaoId)
  const [titulo, setTitulo] = useState('')
  const [descricao, setDescricao] = useState('')
  const [isLoading, setIsLoading] = useState(isEditing)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!votacaoId) {
      return
    }

    let isMounted = true

    async function loadVotacao() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const votacao = await buscarVotacao(votacaoId)

        if (!isMounted) {
          return
        }

        if (!votacao) {
          setErrorMessage('Votacao nao encontrada.')
          return
        }

        setTitulo(votacao.titulo)
        setDescricao(votacao.descricao ?? '')
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getFriendlyErrorMessage(error))
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadVotacao()

    return () => {
      isMounted = false
    }
  }, [votacaoId])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!user) {
      setErrorMessage('Sessao expirada. Entre novamente.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      if (votacaoId) {
        await atualizarVotacao(votacaoId, {
          titulo: titulo.trim(),
          descricao: descricao.trim(),
        })
        navigate('/admin/votacoes')
        return
      }

      const docRef = await criarVotacao({
        titulo: titulo.trim(),
        descricao: descricao.trim(),
        createdBy: user.uid,
      })

      navigate(`/admin/votacoes/${docRef.id}/controle`)
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <section className="admin-panel narrow">
        <p className="eyebrow">Votacao</p>
        <h1>Carregando</h1>
      </section>
    )
  }

  return (
    <section className="admin-panel narrow">
      <div>
        <p className="eyebrow">{isEditing ? 'Editar votacao' : 'Nova votacao'}</p>
        <h1>{isEditing ? 'Editar sessao' : 'Criar sessao'}</h1>
        <p className="muted">
          Informe os dados basicos. Equipes e criterios serao cadastrados depois.
        </p>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Titulo
          <input
            disabled={isSubmitting}
            minLength={3}
            onChange={(event) => setTitulo(event.target.value)}
            placeholder="Pitch Day 2026"
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
            placeholder="Contexto da votacao"
            rows={4}
            value={descricao}
          />
        </label>
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <div className="form-actions">
          <Link className="secondary-link" to="/admin/votacoes">
            Cancelar
          </Link>
          <button disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </section>
  )
}
