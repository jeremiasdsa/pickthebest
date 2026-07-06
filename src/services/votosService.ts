import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { RespostasVoto } from '../types/domain'

export function getVotoRegistradoKey(votacaoId: string) {
  return `voto_registrado_${votacaoId}`
}

export function registrarVoto(votacaoId: string, respostas: RespostasVoto) {
  return addDoc(collection(db, 'votacoes', votacaoId, 'votos'), {
    respostas,
    createdAt: serverTimestamp(),
    clientInfo: {
      userAgent: navigator.userAgent,
      language: navigator.language,
    },
  })
}
