import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return (
    <main className="not-found">
      <h1>Pagina nao encontrada</h1>
      <Link to="/admin/votacoes">Voltar para o admin</Link>
    </main>
  )
}
