import {
  collection,
  onSnapshot,
  type DocumentData,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Voto } from '../types/domain'

export function subscribeToTotalVotos(
  votacaoId: string,
  callback: (total: number) => void,
  onError?: (error: Error) => void,
) {
  return onSnapshot(
    collection(db, 'votacoes', votacaoId, 'votos'),
    (snapshot) => {
      callback(snapshot.size)
    },
    onError,
  )
}

export function subscribeToVotos(
  votacaoId: string,
  callback: (votos: Voto[]) => void,
  onError?: (error: Error) => void,
) {
  return onSnapshot(
    collection(db, 'votacoes', votacaoId, 'votos'),
    (snapshot) => {
      callback(snapshot.docs.map(mapVotoDocument))
    },
    onError,
  )
}

function mapVotoDocument(snapshot: DocumentSnapshot<DocumentData>): Voto {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    votacaoId: snapshot.ref.parent.parent?.id ?? '',
    respostas: data?.respostas ?? {},
    createdAt: data?.createdAt?.toDate?.(),
    clientInfo: data?.clientInfo,
  }
}
