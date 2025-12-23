# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

---

## Auth integration

This app now requires a real API gateway. Set the `API_URL` environment variable (e.g. `export API_URL="https://api.blichstudio.com"`) and the app will proxy requests under `/api/_proxy/*` to the gateway. The `useAuth` composable expects `runtimeConfig.public.apiUrl` to be set and will throw an error in development if it is missing.

Required endpoints on the API gateway:
- `POST /auth/login` — should return `{ user }` and/or tokens; the Nuxt proxy will set secure HttpOnly cookies when tokens are returned.
- `GET /auth/me` — returns `{ user }` for the current session
- `POST /auth/logout` — clears session cookie

The Nuxt proxy forwards `Set-Cookie` headers back to the browser so cookie-based auth works for SSR and client requests.
