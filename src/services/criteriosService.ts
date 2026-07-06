import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  type DocumentData,
  type DocumentSnapshot,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { Criterio } from '../types/domain'

export function subscribeToCriterios(
  votacaoId: string,
  callback: (criterios: Criterio[]) => void,
  onError?: (error: Error) => void,
) {
  return onSnapshot(
    collection(db, 'votacoes', votacaoId, 'criterios'),
    (snapshot) => {
      callback(
        snapshot.docs
          .map(mapCriterioDocument)
          .sort((a, b) => a.ordem - b.ordem || a.titulo.localeCompare(b.titulo)),
      )
    },
    onError,
  )
}

export function criarCriterio(
  votacaoId: string,
  input: { titulo: string; descricao?: string; ordem: number },
) {
  return addDoc(collection(db, 'votacoes', votacaoId, 'criterios'), {
    ...input,
    createdAt: serverTimestamp(),
  })
}

export function atualizarCriterio(
  votacaoId: string,
  criterioId: string,
  input: { titulo: string; descricao?: string; ordem: number },
) {
  return updateDoc(doc(db, 'votacoes', votacaoId, 'criterios', criterioId), input)
}

export function excluirCriterio(votacaoId: string, criterioId: string) {
  return deleteDoc(doc(db, 'votacoes', votacaoId, 'criterios', criterioId))
}

function mapCriterioDocument(snapshot: DocumentSnapshot<DocumentData>): Criterio {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    votacaoId: snapshot.ref.parent.parent?.id ?? '',
    titulo: data?.titulo ?? '',
    descricao: data?.descricao ?? '',
    ordem: Number(data?.ordem ?? 0),
    createdAt: data?.createdAt?.toDate?.(),
  }
}
