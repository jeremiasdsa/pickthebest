import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth'
import { auth } from '../lib/firebase'

export function loginAdmin(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password)
}

export function logoutAdmin() {
  return signOut(auth)
}

export function subscribeToAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback)
}
