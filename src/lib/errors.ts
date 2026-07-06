import { FirebaseError } from 'firebase/app'

export function getFriendlyErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (
      error.code === 'permission-denied' ||
      error.code === 'firestore/permission-denied'
    ) {
      return 'Sem permissao para acessar estes dados. Verifique as regras do Firestore ou faca login novamente.'
    }

    if (
      error.code === 'unavailable' ||
      error.code === 'firestore/unavailable' ||
      error.code === 'auth/network-request-failed'
    ) {
      return 'Falha de conexao. Verifique sua internet e tente novamente.'
    }

    if (error.code === 'not-found' || error.code === 'firestore/not-found') {
      return 'Registro nao encontrado.'
    }
  }

  return 'Algo deu errado. Tente novamente em alguns instantes.'
}
