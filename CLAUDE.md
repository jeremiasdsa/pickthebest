# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Type-check + production build
npm run lint       # Type-check only (tsc -b)
npm run deploy     # Build + deploy to Firebase Hosting
```

There are no automated tests in this project.

## Environment

Copy `.env.example` to `.env.local` and fill in the Firebase project credentials. All vars are prefixed `VITE_FIREBASE_*`. The app throws on startup if any are missing.

## Architecture

Single-page React 19 app with Vite, TypeScript, Tailwind CSS, and Firebase (Auth + Firestore).

**Two distinct surfaces share one router (`src/routes/AppRoutes.tsx`):**

- `/admin/*` — protected by Firebase Email/Password auth (`src/auth/`). Admins create and manage votações (polls). Guarded by `RequireAuth`; login page wrapped in `RedirectIfAuthenticated`.
- `/votar/:votacaoId` — public, unauthenticated. Voters access this via QR code/link to submit a vote for a specific votação.

**Firestore data model** (all under `votacoes/{votacaoId}`):
- `votacoes` — top-level collection; `createdBy` ties each to an admin UID
- `votacoes/{id}/equipes` — teams being evaluated
- `votacoes/{id}/criterios` — evaluation criteria
- `votacoes/{id}/votos` — submitted votes; `respostas` is a `Record<criterioId, equipeId>` map

**Votação lifecycle:** `AGUARDANDO → ABERTA → ENCERRADA`. Votes can only be submitted when status is `ABERTA`. Status transitions are controlled from `ControleVotacaoPage`.

**Services (`src/services/`)** are plain functions wrapping Firestore SDK calls. Real-time data uses `onSnapshot` subscriptions (returned unsubscribe function should be called in `useEffect` cleanup). One-off reads use `getDoc`/`getDocs`.

**Firestore security rules** (`firestore.rules`) enforce: admins can only write to their own votações and subcollections; votes are append-only and only allowed while the voting is open; all reads on votações/equipes/criterios are public.

**Domain types** are centralized in `src/types/domain.ts`. All service functions map Firestore `DocumentSnapshot` objects to these typed interfaces (timestamps converted via `.toDate()`).

**UI** uses Radix UI primitives, `class-variance-authority`, and `lucide-react` icons. All pages are lazy-loaded via `React.lazy`.
