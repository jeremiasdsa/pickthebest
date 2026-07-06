# Repository Guidelines

## Project Structure & Module Organization

This is a Vite React + TypeScript app backed by Firebase. Application code lives in `src/`: `pages/` has route screens split into `admin/` and `public/`, `layouts/` has page shells, `auth/` has route guards, `services/` has Firebase data access, `lib/` has shared utilities and Firebase setup, and `types/` holds domain types. Static files are in `public/`; imported assets are in `src/assets/`. Firebase files are at the root: `firebase.json`, `firestore.rules`, and `firestore.indexes.json`. Build output in `dist/` is generated and should not be hand-edited.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server with HMR.
- `npm run build`: run TypeScript project checks and create a production build in `dist/`.
- `npm run lint`: run strict TypeScript checks without emitting files.
- `npm run preview`: serve the production build locally for verification.
- `npm run deploy`: build and deploy Firebase Hosting with `firebase deploy --only hosting`.

## Coding Style & Naming Conventions

Use TypeScript and React function components. Follow the existing style: two-space indentation, single quotes, no semicolons, and named exports for shared services/utilities. Name components and page files in `PascalCase`, such as `VotacoesPage.tsx`; name services in `camelCase` with a `Service.ts` suffix, such as `votosService.ts`. Keep Firebase reads/writes inside `src/services/`. Prefer Tailwind utilities and existing `pick.*` theme colors from `tailwind.config.js`.

## Testing Guidelines

No automated test runner is currently configured. For now, use `npm run lint` and `npm run build` before submitting changes, and manually verify affected admin/public voting flows in `npm run dev` or `npm run preview`. If tests are added, place them near the code under test with a suffix such as `*.test.ts` or `*.test.tsx`, and add the matching script to `package.json`.

## Commit & Pull Request Guidelines

Git history is not available in this working tree, so use concise imperative commit messages, for example `Add voting results service` or `Fix admin login redirect`. Pull requests should include a short summary, verification steps, linked issues when applicable, and screenshots for UI changes. Mention any Firebase rule, index, or environment variable changes explicitly.

## Security & Configuration Tips

Firebase client configuration is read from `VITE_FIREBASE_*` environment variables in `src/lib/firebase.ts`. Do not commit local `.env` files or secrets. When changing Firestore access patterns, update `firestore.rules` and `firestore.indexes.json` together and verify the impacted user role flows.
