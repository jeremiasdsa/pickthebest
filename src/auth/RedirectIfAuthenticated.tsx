import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from './AuthContext'

export function RedirectIfAuthenticated() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <main className="auth-loading">
        <div>
          <p className="eyebrow">PickTheBest</p>
          <h1>Verificando acesso</h1>
        </div>
      </main>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/admin/votacoes" replace />
  }

  return <Outlet />
}
