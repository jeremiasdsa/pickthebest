import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  updateDoc,
  where,
  type DocumentData,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { StatusVotacao, Votacao } from '../types/domain'

export function subscribeToVotacoes(
  userId: string,
  callback: (votacoes: Votacao[]) => void,
  onError?: (error: Error) => void,
) {
  const votacoesQuery = query(
    collection(db, 'votacoes'),
    where('createdBy', '==', userId),
  )

  return onSnapshot(
    votacoesQuery,
    (snapshot) => {
      callback(
        snapshot.docs
          .map(mapVotacaoDocument)
          .sort((a, b) => getTime(b.createdAt) - getTime(a.createdAt)),
      )
    },
    onError,
  )
}

export function subscribeToVotacaoStatus(
  votacaoId: string,
  callback: (status?: StatusVotacao) => void,
) {
  return onSnapshot(doc(db, 'votacoes', votacaoId), (snapshot) => {
    callback(snapshot.data()?.status as StatusVotacao | undefined)
  })
}

export function subscribeToVotacao(
  votacaoId: string,
  callback: (votacao: Votacao | null) => void,
  onError?: (error: Error) => void,
) {
  return onSnapshot(
    doc(db, 'votacoes', votacaoId),
    (snapshot) => {
      callback(snapshot.exists() ? mapVotacaoDocument(snapshot) : null)
    },
    onError,
  )
}

export async function buscarVotacao(votacaoId: string) {
  const snapshot = await getDoc(doc(db, 'votacoes', votacaoId))

  if (!snapshot.exists()) {
    return null
  }

  return mapVotacaoDocument(snapshot)
}

export function criarVotacao(input: {
  titulo: string
  descricao?: string
  createdBy: string
}) {
  return addDoc(collection(db, 'votacoes'), {
    ...input,
    status: 'AGUARDANDO' satisfies StatusVotacao,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export function atualizarVotacao(
  votacaoId: string,
  input: { titulo: string; descricao?: string },
) {
  return updateDoc(doc(db, 'votacoes', votacaoId), {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export function atualizarStatusVotacao(votacaoId: string, status: StatusVotacao) {
  return updateDoc(doc(db, 'votacoes', votacaoId), {
    status,
    updatedAt: serverTimestamp(),
  })
}

export function excluirVotacao(votacaoId: string) {
  return deleteDoc(doc(db, 'votacoes', votacaoId))
}

function mapVotacaoDocument(snapshot: DocumentSnapshot<DocumentData>): Votacao {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    titulo: data?.titulo ?? '',
    descricao: data?.descricao ?? '',
    status: data?.status ?? 'AGUARDANDO',
    createdBy: data?.createdBy ?? '',
    createdAt: data?.createdAt?.toDate?.(),
    updatedAt: data?.updatedAt?.toDate?.(),
  }
}

function getTime(date?: Date) {
  return date?.getTime() ?? 0
}
