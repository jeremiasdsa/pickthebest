import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Clock3,
  Send,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { subscribeToCriterios } from '../../services/criteriosService'
import { subscribeToEquipes } from '../../services/equipesService'
import {
  getVotoRegistradoRodadaKey,
  registrarVoto,
} from '../../services/votosService'
import { subscribeToVotacao } from '../../services/votacoesService'
import type { Criterio, Equipe, RespostasVoto, Votacao } from '../../types/domain'

export function VotarPage() {
  const { votacaoId } = useParams()
  const [votacao, setVotacao] = useState<Votacao | null>(null)
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [criterios, setCriterios] = useState<Criterio[]>([])
  const [respostas, setRespostas] = useState<RespostasVoto>({})
  const [currentStep, setCurrentStep] = useState(0)
  const [isReviewing, setIsReviewing] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [isVoteSubmitted, setIsVoteSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const currentCriterio = criterios[currentStep]
  const selectedEquipeId = currentCriterio ? respostas[currentCriterio.id] : undefined
  const progressLabel = `Criterio ${Math.min(currentStep + 1, criterios.length)} de ${
    criterios.length
  }`
  const allCriteriaAnswered = useMemo(
    () => criterios.every((criterio) => Boolean(respostas[criterio.id])),
    [criterios, respostas],
  )

  useEffect(() => {
    if (!votacaoId) {
      return
    }

    setIsLoading(true)
    setErrorMessage('')

    const unsubscribeVotacao = subscribeToVotacao(
      votacaoId,
      (item) => {
        setVotacao(item)
        setIsLoading(false)
      },
      (error) => {
        setErrorMessage(getFriendlyErrorMessage(error))
        setIsLoading(false)
      },
    )

    const unsubscribeEquipes = subscribeToEquipes(
      votacaoId,
      setEquipes,
      (error) => setErrorMessage(getFriendlyErrorMessage(error)),
    )

    const unsubscribeCriterios = subscribeToCriterios(
      votacaoId,
      setCriterios,
      (error) => setErrorMessage(getFriendlyErrorMessage(error)),
    )

    return () => {
      unsubscribeVotacao()
      unsubscribeEquipes()
      unsubscribeCriterios()
    }
  }, [votacaoId])

  useEffect(() => {
    if (!votacaoId || !votacao) {
      return
    }

    setHasVoted(
      localStorage.getItem(
        getVotoRegistradoRodadaKey(votacaoId, votacao.rodadaAtual),
      ) === 'true',
    )
  }, [votacao, votacaoId])

  function selectEquipe(equipeId: string) {
    if (!currentCriterio) {
      return
    }

    setRespostas((current) => ({
      ...current,
      [currentCriterio.id]: equipeId,
    }))
  }

  function goNext() {
    if (!selectedEquipeId) {
      setErrorMessage('Selecione uma equipe para continuar.')
      return
    }

    setErrorMessage('')

    if (currentStep < criterios.length - 1) {
      setCurrentStep((step) => step + 1)
      return
    }

    setIsReviewing(true)
  }

  function goBack() {
    setErrorMessage('')

    if (isReviewing) {
      setIsReviewing(false)
      return
    }

    setCurrentStep((step) => Math.max(0, step - 1))
  }

  async function handleSubmitVote() {
    if (!votacaoId || !votacao || !allCriteriaAnswered) {
      setErrorMessage('Revise suas escolhas antes de enviar.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      await registrarVoto(votacaoId, respostas, votacao.rodadaAtual)
      localStorage.setItem(
        getVotoRegistradoRodadaKey(votacaoId, votacao.rodadaAtual),
        'true',
      )
      setIsVoteSubmitted(true)
      setHasVoted(true)
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="voting-preview is-loading">
        <p className="eyebrow light">PickTheBest</p>
        <h1>Carregando votacao</h1>
        <p>Buscando equipes, criterios e status em tempo real.</p>
        <div className="public-skeleton" />
        <div className="public-skeleton short" />
      </div>
    )
  }

  if (errorMessage && !votacao) {
    return (
      <VotingBlock
        title="Nao foi possivel carregar"
        message={errorMessage}
        icon={AlertTriangle}
        tone="error"
      />
    )
  }

  if (!votacao) {
    return (
      <VotingBlock
        title="Votacao nao encontrada"
        message="Confira se o link ou QR Code utilizado esta correto."
        icon={AlertTriangle}
        tone="error"
      />
    )
  }

  if (hasVoted) {
    return (
      <VotingBlock
        title={isVoteSubmitted ? 'Voto enviado' : 'Voto ja registrado'}
        message={
          isVoteSubmitted
            ? 'Seu voto foi registrado com sucesso. Nenhuma acao adicional e necessaria.'
            : 'Este navegador ja enviou um voto para esta votacao.'
        }
        icon={CheckCircle2}
        tone="success"
      />
    )
  }

  if (votacao.status === 'AGUARDANDO') {
    return (
      <VotingBlock
        title="Votacao aguardando"
        message="Aguarde o organizador abrir a votacao para iniciar."
        icon={Clock3}
        tone="waiting"
      />
    )
  }

  if (votacao.status === 'ENCERRADA') {
    return (
      <VotingBlock
        title="Votacao encerrada"
        message="O periodo de envio de votos foi finalizado pelo organizador."
        icon={AlertTriangle}
        tone="warning"
      />
    )
  }

  if (equipes.length === 0 || criterios.length === 0) {
    return (
      <VotingBlock
        title="Votacao incompleta"
        message="O organizador ainda precisa cadastrar equipes e criterios."
        icon={Clock3}
        tone="waiting"
      />
    )
  }

  if (isReviewing) {
    return (
      <div className="voting-preview">
        <p className="eyebrow light">Revisao</p>
        <h1>Confira seu voto</h1>
        <p className="review-helper">Revise cada criterio antes de confirmar.</p>
        <div className="review-list">
          {criterios.map((criterio) => {
            const equipe = equipes.find((item) => item.id === respostas[criterio.id])

            return (
              <article className="review-item" key={criterio.id}>
                <span>{criterio.titulo}</span>
                <strong>{equipe?.nome ?? 'Nao selecionado'}</strong>
              </article>
            )
          })}
        </div>
        {errorMessage ? <p className="public-error">{errorMessage}</p> : null}
        <div className="public-actions">
          <button className="ghost-action" type="button" onClick={goBack}>
            <ChevronLeft size={18} aria-hidden="true" />
            Voltar
          </button>
          <button
            className="primary-action"
            disabled={isSubmitting}
            type="button"
            onClick={() => void handleSubmitVote()}
          >
            <Send size={18} aria-hidden="true" />
            {isSubmitting ? 'Enviando...' : 'Confirmar voto'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="voting-preview">
      <p className="eyebrow light">PickTheBest</p>
      <h1>{currentCriterio?.titulo}</h1>
      {currentCriterio?.descricao ? <p>{currentCriterio.descricao}</p> : null}
      <div className="progress-block">
        <div className="progress-label">{progressLabel}</div>
        <div className="progress-track">
          <span
            style={{
              width: `${((currentStep + 1) / Math.max(criterios.length, 1)) * 100}%`,
            }}
          />
        </div>
      </div>
      <div className="team-list">
        {equipes.map((equipe) => {
          const isSelected = selectedEquipeId === equipe.id

          return (
            <button
              className={`team-card ${isSelected ? 'selected' : ''}`}
              aria-pressed={isSelected}
              key={equipe.id}
              type="button"
              onClick={() => selectEquipe(equipe.id)}
            >
              <span className="team-card-copy">
                <strong>{equipe.nome}</strong>
                {equipe.descricao ? <small>{equipe.descricao}</small> : null}
              </span>
              <span className="team-selected-indicator" aria-hidden="true">
                {isSelected ? <CheckCircle2 size={22} /> : null}
              </span>
            </button>
          )
        })}
      </div>
      {errorMessage ? <p className="public-error">{errorMessage}</p> : null}
      <div className="public-actions">
        <button
          className="ghost-action"
          disabled={currentStep === 0}
          type="button"
          onClick={goBack}
        >
          <ChevronLeft size={18} aria-hidden="true" />
          Voltar
        </button>
        <button
          className="primary-action"
          disabled={!selectedEquipeId}
          type="button"
          onClick={goNext}
        >
          {currentStep === criterios.length - 1 ? 'Revisar' : 'Continuar'}
        </button>
      </div>
    </div>
  )
}

function VotingBlock({
  icon: Icon = CheckCircle2,
  message,
  tone = 'default',
  title,
}: {
  icon?: LucideIcon
  message: string
  tone?: 'default' | 'error' | 'success' | 'waiting' | 'warning'
  title: string
}) {
  return (
    <div className={`voting-preview voting-state state-${tone}`}>
      <p className="eyebrow light">PickTheBest</p>
      <div className="public-status-icon">
        <Icon aria-hidden="true" />
      </div>
      <h1>{title}</h1>
      <p>{message}</p>
    </div>
  )
}
