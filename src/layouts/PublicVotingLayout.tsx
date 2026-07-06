import { Outlet } from 'react-router-dom'

export function PublicVotingLayout() {
  return (
    <main className="public-shell">
      <div className="public-background" />
      <section className="public-card">
        <Outlet />
      </section>
    </main>
  )
}
