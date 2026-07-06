import { Link, Outlet } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { logoutAdmin } from '../services/authService'

export function AdminLayout() {
  const { user } = useAuth()

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="brand" to="/admin/votacoes">
          PickTheBest
        </Link>
        <nav>
          <Link to="/admin/votacoes">Votacoes</Link>
        </nav>
        <div className="admin-account">
          <span>{user?.email}</span>
          <button type="button" onClick={() => void logoutAdmin()}>
            Sair
          </button>
        </div>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  )
}
