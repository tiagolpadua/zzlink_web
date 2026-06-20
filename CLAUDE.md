# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

ZZLink is a WhatsApp link generator — a web port of the ZapLink Flutter app. The user types a Brazilian phone number and the app produces a `https://wa.me/<number>` link with copy, share, QR code, and direct-open actions.

**Stack:** Vite + TypeScript (no framework), Alpine.js (via CDN) for reactivity, QRCode.js (via CDN) for QR generation. Zero runtime npm dependencies.

## Commands

```bash
npm run dev          # Vite dev server at http://localhost:5173
npm run build        # tsc --build (type-check) then vite build → dist/
npm run preview      # Serve the dist/ build locally

npm run lint         # ESLint on src/
npm run lint:fix     # ESLint with --fix
npm run format       # Prettier on src/ and index.html
npm run format:check # Prettier check (no writes)

npm test             # Vitest single run
npm run test:watch   # Vitest in watch mode
npm run test:coverage # Vitest with V8 coverage

# Run a single test file
npx vitest run src/phone.test.ts
```

Pre-commit hook (Husky + lint-staged) runs `eslint --fix` and `prettier --write` automatically on staged `.ts` and `.html` files.

## Architecture

### Alpine.js integration pattern

Alpine.js is loaded from CDN. The TypeScript entry point ([src/main.ts](src/main.ts)) registers a single component by assigning `window.zzlink`, which `index.html` references via `x-data="zzlink()"`.

All component state and methods live in the object returned by `window.zzlink()`. Methods use `this: AlpineThis` explicit typing to get type safety inside the object literal — this is intentional and why `unicorn/no-this-outside-of-class` is disabled.

Alpine magic properties (`$watch`, `$nextTick`) are declared in the `AlpineThis` interface in `main.ts`.

### Module responsibilities

| File | Purpose |
|---|---|
| `src/phone.ts` | Pure functions: `sanitize`, `isValid`, `toWaUrl`. Only file with business logic. Testable without DOM. |
| `src/toast.ts` | Pure factory `createToastController` — timer management for show/hide. Testable without DOM. |
| `src/qr.ts` | Thin wrapper around the global `QRCode` CDN constructor. Uses `declare const QRCode` since there's no npm package. |
| `src/main.ts` | Alpine component wiring — bridges the pure modules to Alpine reactive state. |
| `src/style.css` | Single CSS file imported by `main.ts` (Vite processes it). WhatsApp green theme (`--green: #075E54`). |

### CDN globals

QRCode.js is declared as a global in `src/qr.ts` via `declare const QRCode` (not imported). Alpine.js exposes its API through `x-*` attributes in HTML only — it is not imported in TypeScript.

### TypeScript project structure

Uses Vite's recommended composite tsconfig split:
- `tsconfig.json` — root references file only, no `compilerOptions`
- `tsconfig.app.json` — `src/` with `noEmit: true` (Vite handles emit)
- `tsconfig.node.json` — `vite.config.ts` and `eslint.config.ts`, includes `@types/node`

### ESLint configuration

Flat config in `eslint.config.ts`. Uses `typescript-eslint` strict + stylistic, `unicorn` recommended, and `eslint-plugin-prettier`. Key disabled unicorn rules and their reasons are documented inline in the config file.

### Testing scope

Only pure modules (`phone.ts`, `toast.ts`) have unit tests. `main.ts` and `qr.ts` are excluded from coverage because they depend on DOM/CDN globals and the Alpine proxy, which require a browser environment.
