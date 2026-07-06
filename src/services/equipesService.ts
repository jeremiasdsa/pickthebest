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
import type { Equipe } from '../types/domain'

export function subscribeToEquipes(
  votacaoId: string,
  callback: (equipes: Equipe[]) => void,
  onError?: (error: Error) => void,
) {
  return onSnapshot(
    collection(db, 'votacoes', votacaoId, 'equipes'),
    (snapshot) => {
      callback(
        snapshot.docs
          .map(mapEquipeDocument)
          .sort((a, b) => a.ordem - b.ordem || a.nome.localeCompare(b.nome)),
      )
    },
    onError,
  )
}

export function criarEquipe(
  votacaoId: string,
  input: { nome: string; descricao?: string; ordem: number },
) {
  return addDoc(collection(db, 'votacoes', votacaoId, 'equipes'), {
    ...input,
    createdAt: serverTimestamp(),
  })
}

export function atualizarEquipe(
  votacaoId: string,
  equipeId: string,
  input: { nome: string; descricao?: string; ordem: number },
) {
  return updateDoc(doc(db, 'votacoes', votacaoId, 'equipes', equipeId), input)
}

export function excluirEquipe(votacaoId: string, equipeId: string) {
  return deleteDoc(doc(db, 'votacoes', votacaoId, 'equipes', equipeId))
}

function mapEquipeDocument(snapshot: DocumentSnapshot<DocumentData>): Equipe {
  const data = snapshot.data()

  return {
    id: snapshot.id,
    votacaoId: snapshot.ref.parent.parent?.id ?? '',
    nome: data?.nome ?? '',
    descricao: data?.descricao ?? '',
    ordem: Number(data?.ordem ?? 0),
    createdAt: data?.createdAt?.toDate?.(),
  }
}
