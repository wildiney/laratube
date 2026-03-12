# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LaraTube is a **pure frontend React/TypeScript SPA** (no PHP/Laravel despite the name) — a child-safe YouTube video curator that displays curated videos, lets users mark favorites, and hide unwanted videos, with all preferences persisted in localStorage.

**Deployment constraint:** The app is hosted on GitHub Pages (static hosting only). All features must work without a backend — no server-side code, no databases, no SSR. Data must come from static files or external public APIs.

## Commands

```bash
# Development
pnpm run dev          # Start dev server at http://localhost:5173

# Build & Deploy
pnpm run build        # TypeScript compile + Vite production build
pnpm run deploy       # Build and deploy to GitHub Pages

# Testing
pnpm run test         # Run tests once
pnpm run test:watch   # Run tests in watch mode
pnpm run test:coverage  # Run tests with coverage

# Linting
pnpm run lint         # Run ESLint
```

## Architecture

**Stack:** React 19 + TypeScript + Vite, no backend, no UI library, custom CSS only.

**Data flow:**

- `App.tsx` fetches `src/data/videos.json` remotely from GitHub on mount (via `useEffect`)
- Renders `VideoList` (main grid) and `SettingsModal` (preference management)
- `VideoList` renders each video card and `VideoModal` (embedded YouTube player)

**Key source files:**

- `src/App.tsx` — root component, data fetching, modal state
- `src/components/videoList.tsx` — video grid with favorite/hide controls
- `src/components/VideoModal.tsx` — YouTube embed modal
- `src/components/SettingsModal.tsx` — clear all preferences
- `src/lib/videoPreferences.ts` — all localStorage read/write logic
- `src/model/video.ts` — `Video` type (`id`, `title`, `url`)
- `src/data/videos.json` — curated video list (~200 videos)

**State management:** React `useState` hooks + localStorage (no external store). Preferences (`favorites: Set<string>`, `hidden: Set<string>`) are loaded on mount via `loadPreferences()` and saved on each change.

**Deployment:** GitHub Pages at `https://wildiney.github.io/laratube/`. Vite base path is `/laratube/`.

## Testing

Uses Vitest + React Testing Library + jsdom. Test files live alongside source files (`*.test.tsx` / `*.test.ts`).

Tests mock `window.confirm`, `window.location.reload`, and `localStorage`. Run a single test file:

```bash
pnpm run test src/lib/videoPreferences.test.ts
```

## Development Process

The `.AI/` directory contains a formal PRD (`.AI/PRD.md`) and operating rules (`.AI/RULES.md`). The rules specify a structured task workflow: generate tasks from PRD → execute one subtask at a time → wait for explicit user approval before proceeding to the next.

`.cursor/rules/` contains MDC rule files for PRD creation, task generation, and task execution (mirrors `.AI/RULES.md`).
