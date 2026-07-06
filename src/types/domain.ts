export type StatusVotacao = 'AGUARDANDO' | 'ABERTA' | 'ENCERRADA'

export interface Votacao {
  id: string
  titulo: string
  descricao?: string
  status: StatusVotacao
  rodadaAtual: number
  createdBy: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Equipe {
  id: string
  votacaoId: string
  nome: string
  descricao?: string
  ordem: number
  createdAt?: Date
}

export interface Criterio {
  id: string
  votacaoId: string
  titulo: string
  descricao?: string
  ordem: number
  createdAt?: Date
}

export type RespostasVoto = Record<string, string>

export interface Voto {
  id: string
  votacaoId: string
  respostas: RespostasVoto
  rodada: number
  createdAt?: Date
  clientInfo?: {
    userAgent?: string
    language?: string
  }
}
