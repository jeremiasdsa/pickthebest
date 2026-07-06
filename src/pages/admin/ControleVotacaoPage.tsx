import { useEffect, useMemo, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Link, useParams } from 'react-router-dom'
import { getFriendlyErrorMessage } from '../../lib/errors'
import { subscribeToCriterios } from '../../services/criteriosService'
import { subscribeToEquipes } from '../../services/equipesService'
import { subscribeToVotos } from '../../services/resultadosService'
import {
  atualizarStatusVotacao,
  subscribeToVotacao,
} from '../../services/votacoesService'
import type {
  Criterio,
  Equipe,
  StatusVotacao,
  Votacao,
  Voto,
} from '../../types/domain'

export function ControleVotacaoPage() {
  const { votacaoId } = useParams()
  const [votacao, setVotacao] = useState<Votacao | null>(null)
  const [equipes, setEquipes] = useState<Equipe[]>([])
  const [criterios, setCriterios] = useState<Criterio[]>([])
  const [votos, setVotos] = useState<Voto[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isChangingStatus, setIsChangingStatus] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const publicUrl = useMemo(() => {
    if (!votacaoId) {
      return ''
    }

    return `${window.location.origin}/votar/${votacaoId}`
  }, [votacaoId])

  const resultados = useMemo(
    () => calcularResultados(votos, criterios, equipes),
    [criterios, equipes, votos],
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

    const unsubscribeVotos = subscribeToVotos(
      votacaoId,
      setVotos,
      (error) => setErrorMessage(getFriendlyErrorMessage(error)),
    )

    return () => {
      unsubscribeVotacao()
      unsubscribeEquipes()
      unsubscribeCriterios()
      unsubscribeVotos()
    }
  }, [votacaoId])

  async function handleStatusChange(status: StatusVotacao) {
    if (!votacaoId) {
      return
    }

    if (status === 'ABERTA' && (equipes.length === 0 || criterios.length === 0)) {
      setErrorMessage(
        'Cadastre ao menos uma equipe e um criterio antes de abrir a votacao.',
      )
      return
    }

    setIsChangingStatus(true)
    setErrorMessage('')

    try {
      await atualizarStatusVotacao(votacaoId, status)
    } catch (error) {
      setErrorMessage(getFriendlyErrorMessage(error))
    } finally {
      setIsChangingStatus(false)
    }
  }

  async function copyPublicUrl() {
    try {
      await navigator.clipboard.writeText(publicUrl)
    } catch {
      setErrorMessage('Nao foi possivel copiar o link automaticamente.')
    }
  }

  return (
    <section className="admin-panel">
      <div>
        <p className="eyebrow">Controle ao vivo</p>
        <h1>{isLoading ? 'Carregando votacao' : votacao?.titulo ?? 'Votacao'}</h1>
        {votacao?.descricao ? <p className="muted">{votacao.descricao}</p> : null}
      </div>
      <div className="quick-actions">
        <Link className="secondary-link" to={`/admin/votacoes/${votacaoId}/editar`}>
          Editar dados
        </Link>
        <Link className="secondary-link" to={`/admin/votacoes/${votacaoId}/equipes`}>
          Gerenciar equipes
        </Link>
        <Link className="secondary-link" to={`/admin/votacoes/${votacaoId}/criterios`}>
          Gerenciar criterios
        </Link>
      </div>

      {errorMessage ? <p className="form-error">{errorMessage}</p> : null}

      <div className="control-grid">
        <article className="control-card">
          <p className="eyebrow">Status</p>
          <div className="status-row">
            <span className={`status-pill status-${votacao?.status.toLowerCase()}`}>
              {votacao?.status ?? 'CARREGANDO'}
            </span>
            <strong>{votos.length} voto(s)</strong>
          </div>
          <div className="status-grid">
            <button
              disabled={isChangingStatus || votacao?.status === 'AGUARDANDO'}
              onClick={() => void handleStatusChange('AGUARDANDO')}
              type="button"
            >
              Aguardando
            </button>
            <button
              disabled={isChangingStatus || votacao?.status === 'ABERTA'}
              onClick={() => void handleStatusChange('ABERTA')}
              type="button"
            >
              Abrir
            </button>
            <button
              disabled={isChangingStatus || votacao?.status === 'ENCERRADA'}
              onClick={() => void handleStatusChange('ENCERRADA')}
              type="button"
            >
              Encerrar
            </button>
          </div>
        </article>

        <article className="control-card">
          <p className="eyebrow">Link publico</p>
          <div className="public-url-box">{publicUrl}</div>
          <div className="form-actions">
            <button type="button" onClick={() => void copyPublicUrl()}>
              Copiar link
            </button>
            <Link className="secondary-link" to={`/votar/${votacaoId}`}>
              Abrir votacao
            </Link>
          </div>
        </article>

        <article className="control-card qr-card">
          <p className="eyebrow">QR Code</p>
          {publicUrl ? (
            <div className="qr-frame">
              <QRCodeSVG value={publicUrl} size={220} level="M" includeMargin />
            </div>
          ) : null}
        </article>

        <article className="control-card">
          <p className="eyebrow">Checklist</p>
          <ul className="checklist">
            <li className={equipes.length > 0 ? 'ok' : 'missing'}>
              {equipes.length} equipe(s) cadastrada(s)
            </li>
            <li className={criterios.length > 0 ? 'ok' : 'missing'}>
              {criterios.length} criterio(s) cadastrado(s)
            </li>
            <li className={votacao?.status === 'ABERTA' ? 'ok' : 'missing'}>
              Votacao aberta para receber votos
            </li>
          </ul>
        </article>

        <article className="control-card results-card">
          <div className="results-header">
            <div>
              <p className="eyebrow">Resultados</p>
              <h2>Apuracao da votacao</h2>
            </div>
            <button
              className={showResults ? 'neutral-button' : ''}
              type="button"
              onClick={() => setShowResults((current) => !current)}
            >
              {showResults ? 'Ocultar resultado' : 'Ver resultado'}
            </button>
          </div>

          {!showResults ? (
            <div className="result-hidden">
              <strong>Resultados ocultos.</strong>
              <span>
                Use o botao apenas quando quiser exibir a apuracao em tela.
              </span>
            </div>
          ) : (
            <ResultsView resultados={resultados} totalVotos={votos.length} />
          )}
        </article>
      </div>
    </section>
  )
}

interface ResultadoEquipe {
  equipe: Equipe
  total: number
}

interface ResultadoCriterio {
  criterio: Criterio
  ranking: ResultadoEquipe[]
}

interface ResultadosVotacao {
  porCriterio: ResultadoCriterio[]
  consolidado: ResultadoEquipe[]
}

function calcularResultados(
  votos: Voto[],
  criterios: Criterio[],
  equipes: Equipe[],
): ResultadosVotacao {
  const makeInitialCounts = () =>
    new Map<string, number>(equipes.map((equipe) => [equipe.id, 0]))

  const consolidadoCounts = makeInitialCounts()

  const porCriterio = criterios.map((criterio) => {
    const counts = makeInitialCounts()

    votos.forEach((voto) => {
      const equipeId = voto.respostas[criterio.id]

      if (!equipeId || !counts.has(equipeId)) {
        return
      }

      counts.set(equipeId, (counts.get(equipeId) ?? 0) + 1)
      consolidadoCounts.set(equipeId, (consolidadoCounts.get(equipeId) ?? 0) + 1)
    })

    return {
      criterio,
      ranking: sortRanking(equipes, counts),
    }
  })

  return {
    porCriterio,
    consolidado: sortRanking(equipes, consolidadoCounts),
  }
}

function sortRanking(equipes: Equipe[], counts: Map<string, number>) {
  return equipes
    .map((equipe) => ({
      equipe,
      total: counts.get(equipe.id) ?? 0,
    }))
    .sort((a, b) => b.total - a.total || a.equipe.nome.localeCompare(b.equipe.nome))
}

function ResultsView({
  resultados,
  totalVotos,
}: {
  resultados: ResultadosVotacao
  totalVotos: number
}) {
  if (totalVotos === 0) {
    return (
      <div className="empty-state">
        <strong>Nenhum voto recebido ainda.</strong>
        <span>Os resultados aparecerao assim que houver votos registrados.</span>
      </div>
    )
  }

  return (
    <div className="results-view">
      <section>
        <h3>Resultado consolidado</h3>
        <RankingList ranking={resultados.consolidado} totalReferencia={totalVotos} />
      </section>

      <section className="criteria-results">
        <h3>Resultado por criterio</h3>
        {resultados.porCriterio.map((resultado) => (
          <article className="criteria-result-card" key={resultado.criterio.id}>
            <h4>{resultado.criterio.titulo}</h4>
            <RankingList ranking={resultado.ranking} totalReferencia={totalVotos} />
          </article>
        ))}
      </section>
    </div>
  )
}

function RankingList({
  ranking,
  totalReferencia,
}: {
  ranking: ResultadoEquipe[]
  totalReferencia: number
}) {
  return (
    <ol className="ranking-list">
      {ranking.map((item) => {
        const percent =
          totalReferencia > 0 ? Math.round((item.total / totalReferencia) * 100) : 0

        return (
          <li key={item.equipe.id}>
            <div>
              <strong>{item.equipe.nome}</strong>
              <span>
                {item.total} voto(s) - {percent}%
              </span>
            </div>
            <div className="result-bar">
              <span style={{ width: `${percent}%` }} />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
