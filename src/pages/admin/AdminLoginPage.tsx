import { useState, type FormEvent } from 'react'
import { FirebaseError } from 'firebase/app'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginAdmin } from '../../services/authService'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const from = (location.state as { from?: { pathname?: string } } | null)?.from
    ?.pathname

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await loginAdmin(email, password)
      navigate(from ?? '/admin/votacoes', { replace: true })
    } catch (error) {
      setErrorMessage(getAuthErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-shell">
      <section className="admin-panel narrow">
      <p className="eyebrow">Area administrativa</p>
      <h1>Entrar no PickTheBest</h1>
      <p className="muted">
        Acesse com o e-mail e senha cadastrados no Firebase Authentication.
      </p>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          E-mail
          <input
            autoComplete="email"
            disabled={isSubmitting}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="organizador@email.com"
            required
            type="email"
            value={email}
          />
        </label>
        <label>
          Senha
          <input
            autoComplete="current-password"
            disabled={isSubmitting}
            minLength={6}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="********"
            required
            type="password"
            value={password}
          />
        </label>
        {errorMessage ? <p className="form-error">{errorMessage}</p> : null}
        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </section>
    </main>
  )
}

function getAuthErrorMessage(error: unknown) {
  if (error instanceof FirebaseError) {
    if (
      error.code === 'auth/invalid-credential' ||
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password'
    ) {
      return 'E-mail ou senha invalidos.'
    }

    if (error.code === 'auth/too-many-requests') {
      return 'Muitas tentativas. Aguarde alguns minutos e tente novamente.'
    }

    if (error.code === 'auth/network-request-failed') {
      return 'Falha de rede ao conectar com o Firebase.'
    }
  }

  return 'Nao foi possivel entrar. Verifique os dados e tente novamente.'
}
