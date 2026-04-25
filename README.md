# Weather UI

A React + TypeScript weather application built with Vite.

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Query
- Zustand
- Sass Modules
- Vitest + Testing Library

## App Features

- Location search
- Current weather snapshot (temperature, feels like, humidity, wind, pressure)
- 24-hour preview and weather condition indicators
- 10-day forecast with details
- Hourly details grouped by day
- Watchlist for tracked locations
- Recent searches history (max 5)
- Unit preferences (temperature, wind speed, precipitation, pressure, distance)

## API Endpoints

- `https://geocoding-api.open-meteo.com/v1/search`
  - Used for location search.
- `https://nominatim.openstreetmap.org/reverse`
  - Used for reverse geocoding latitude/longitude into location details.
- `https://api.open-meteo.com/v1/forecast`
  - Used for current weather, hourly preview, and 10-day forecast/overview data.

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

### 3. Build for production

```bash
npm run build
```

### 4. Preview production build

```bash
npm run preview
```

## Scripts

- `npm run dev`: start local dev server
- `npm run build`: type-check and build production bundle
- `npm run preview`: preview built app locally
- `npm run typecheck`: run TypeScript checks only
- `npm run lint`: run ESLint
- `npm run lint:fix`: run ESLint with auto-fixes
- `npm run format`: format files with Prettier
- `npm run format:check`: check formatting with Prettier
- `npm run test`: run Vitest in watch mode
- `npm run test:run`: run Vitest once (CI mode)

## Testing

Unit tests are implemented with Vitest and Testing Library.

Run all tests once:

```bash
npm run test:run
```

Run tests in watch mode:

```bash
npm run test
```

## Project Structure

```text
weather-ui/
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
├── src/
│   ├── api/            # API clients and transport helpers
│   ├── app/            # Router and app-level providers
│   ├── components/     # Reusable UI and layout components
│   ├── config/         # Constants and app configuration
│   ├── features/       # Feature modules (search, overview, watchlist, units)
│   ├── hooks/          # Shared custom hooks
│   ├── lib/            # Utilities
│   ├── styles/         # Global styles, variables, mixins
│   ├── test/           # Test setup
│   ├── theme/          # Theme provider and hook
│   ├── types/          # Shared TypeScript types
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## CI/CD

GitHub Actions workflow: `.github/workflows/ci.yml`

The CI `validate` job runs:

1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run format:check`
5. `npm run test:run`
6. `npm run build`

Optional Vercel deployment requires repository secrets:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
