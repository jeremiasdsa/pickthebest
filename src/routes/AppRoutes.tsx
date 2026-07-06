import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { RedirectIfAuthenticated } from '../auth/RedirectIfAuthenticated'
import { RequireAuth } from '../auth/RequireAuth'

const AdminLayout = lazy(() =>
  import('../layouts/AdminLayout').then((module) => ({
    default: module.AdminLayout,
  })),
)
const PublicVotingLayout = lazy(() =>
  import('../layouts/PublicVotingLayout').then((module) => ({
    default: module.PublicVotingLayout,
  })),
)
const AdminLoginPage = lazy(() =>
  import('../pages/admin/AdminLoginPage').then((module) => ({
    default: module.AdminLoginPage,
  })),
)
const ControleVotacaoPage = lazy(() =>
  import('../pages/admin/ControleVotacaoPage').then((module) => ({
    default: module.ControleVotacaoPage,
  })),
)
const CriteriosPage = lazy(() =>
  import('../pages/admin/CriteriosPage').then((module) => ({
    default: module.CriteriosPage,
  })),
)
const EquipesPage = lazy(() =>
  import('../pages/admin/EquipesPage').then((module) => ({
    default: module.EquipesPage,
  })),
)
const VotacaoFormPage = lazy(() =>
  import('../pages/admin/VotacaoFormPage').then((module) => ({
    default: module.VotacaoFormPage,
  })),
)
const VotacoesPage = lazy(() =>
  import('../pages/admin/VotacoesPage').then((module) => ({
    default: module.VotacoesPage,
  })),
)
const NotFoundPage = lazy(() =>
  import('../pages/NotFoundPage').then((module) => ({
    default: module.NotFoundPage,
  })),
)
const VotarPage = lazy(() =>
  import('../pages/public/VotarPage').then((module) => ({
    default: module.VotarPage,
  })),
)

export function AppRoutes() {
  return (
    <Suspense fallback={<RouteLoading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/votacoes" replace />} />
        <Route element={<RedirectIfAuthenticated />}>
          <Route path="/admin/login" element={<AdminLoginPage />} />
        </Route>
        <Route element={<RequireAuth />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/votacoes" replace />} />
            <Route path="votacoes" element={<VotacoesPage />} />
            <Route path="votacoes/nova" element={<VotacaoFormPage />} />
            <Route path="votacoes/:votacaoId/editar" element={<VotacaoFormPage />} />
            <Route path="votacoes/:votacaoId/equipes" element={<EquipesPage />} />
            <Route
              path="votacoes/:votacaoId/criterios"
              element={<CriteriosPage />}
            />
            <Route
              path="votacoes/:votacaoId/controle"
              element={<ControleVotacaoPage />}
            />
          </Route>
        </Route>
        <Route path="/votar" element={<PublicVotingLayout />}>
          <Route path=":votacaoId" element={<VotarPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

function RouteLoading() {
  return (
    <main className="auth-loading">
      <div>
        <p className="eyebrow">PickTheBest</p>
        <h1>Carregando</h1>
      </div>
    </main>
  )
}
