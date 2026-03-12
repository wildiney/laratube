# LaraTube

A child-safe YouTube video curator. Displays a curated list of videos, lets users mark favorites, hide unwanted videos, and filter by title — all preferences persisted in `localStorage` with no backend required.

**Live:** [wildiney.github.io/laratube](https://wildiney.github.io/laratube/)

## Features

- Responsive video grid with YouTube thumbnails (1 → 2 → 3 → 4 columns)
- Real-time title search
- Favorites-only filter
- Hide videos with inline confirmation
- Animated skeleton loader while fetching
- Error state with retry button
- Preferences persisted in `localStorage` (favorites and hidden)
- Settings modal with stats and option to restore hidden videos without losing favorites
- YouTube URL validation before rendering iframes

## Stack

- React 19 + TypeScript + Vite
- Custom CSS with design tokens (no UI library)
- Fonts: [Lexend](https://fonts.google.com/specimen/Lexend) + [DM Sans](https://fonts.google.com/specimen/DM+Sans)
- Hosting: GitHub Pages (static, no backend)

## Requirements

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)

## Setup

```sh
git clone https://github.com/wildiney/laratube.git
cd laratube
pnpm install
```

## Commands

```bash
pnpm run dev            # Dev server at http://localhost:5173
pnpm run build          # TypeScript compile + Vite production build
pnpm run deploy         # Build and deploy to GitHub Pages
pnpm run test           # Run tests with Vitest
pnpm run test:watch     # Run tests in watch mode
pnpm run test:coverage  # Run tests with coverage report
pnpm run lint           # Run ESLint
```

## Project structure

```text
src/
├── App.tsx                   # Root component, data fetching, skeleton, error state
├── components/
│   ├── videoList.tsx         # Video grid, search, filters, empty states
│   ├── VideoModal.tsx        # YouTube embed modal
│   └── SettingsModal.tsx     # Settings, stats, and preference management
├── lib/
│   ├── videoPreferences.ts   # localStorage read/write logic
│   └── youtube.ts            # YouTube URL validation and ID extraction
├── model/video.ts            # Video type definition
└── data/videos.json          # Curated video list (~200 entries)
```

## Adding videos

Videos are fetched remotely from `src/data/videos.json` via the GitHub Raw URL. To add a video, append an entry and deploy.

Each entry follows this format:

```json
{ "id": "string", "title": "string", "url": "https://www.youtube.com/embed/VIDEO_ID" }
```

## License

MIT — see [LICENSE](LICENSE) for details.
