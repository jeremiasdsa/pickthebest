import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import type { RespostasVoto } from '../types/domain'

export function getVotoRegistradoRodadaKey(votacaoId: string, rodada: number) {
  return `voto_registrado_${votacaoId}_rodada_${rodada}`
}

export function registrarVoto(
  votacaoId: string,
  respostas: RespostasVoto,
  rodada: number,
) {
  return addDoc(collection(db, 'votacoes', votacaoId, 'votos'), {
    respostas,
    rodada,
    createdAt: serverTimestamp(),
    clientInfo: {
      userAgent: navigator.userAgent,
      language: navigator.language,
    },
  })
}
