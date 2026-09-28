# Blich Studio website

The games-first public site for Blich Studio, built with Nuxt 4, Vue 3, TypeScript and SCSS. Production: https://blichstudio.com.

## Visitor journeys

- **Home** features a game or the 20 Games Challenge, recent workshop notes, and supporting craft.
- **Games** (`/projects`) lists published projects with search, type filters and 12-item pagination.
- **Workshop** (`/blog`) lists published articles with search, topic filters and 12-item pagination.
- **About** (`/about`) introduces Filip and the studio's games-first direction.
- Existing project/article URLs stay valid. Detail pages have individual social metadata, canonical URLs and real 404 responses.
- `/feed.xml` provides the latest 30 published workshop notes. `/sitemap.xml` includes all published projects/articles (up to 100 API pages per collection, failing rather than silently truncating). Both request anonymous published content and have a five-minute cache lifetime.

The site uses real published CMS content; it does not invent playable releases or a team. Game actions appear only when the CMS provides the corresponding links. Publishing content in the CMS updates the public site without rebuilding it.

## Local development

Use Node.js 22 and Bun 1.3.5, matching release checks:

```sh
bun install --frozen-lockfile
NUXT_API_URL=http://localhost:3002 bun run dev --port 3001
```

`NUXT_API_URL` is the server-side gateway URL. `NUXT_PUBLIC_API_URL` remains a compatibility fallback. Browser requests go through the same-origin server proxy. Use an isolated local API for mutation tests; production is suitable only for read-only content checks.

```sh
bun run test
bun run typecheck
bun run build
NUXT_API_URL=http://localhost:3002 PORT=3001 node .output/server/index.mjs
```

No standalone lint script is configured in this repository. Vitest covers session isolation, refresh/logout behavior, Markdown sanitization, editorial selection, pagination inputs and public XML discovery.

## Sessions and content rendering

The server proxy owns HttpOnly access/refresh cookies, strips tokens from responses, and coordinates only requests with the same refresh credential. Logout clears cookies even if upstream revocation fails. Temporary refresh-service failures return 503 without discarding cookies. The gateway supplies `/auth/me` and `/auth/logout`.

Markdown is parsed and sanitized with an explicit allowlist in `app/utils/render-markdown.ts`. Keep CMS previews and public renderers on the same policy. Scripts, custom inline styles and Markdown iframes are removed.

## Deployment

Main-branch changes trigger Google Cloud Build (`cloudbuild.yaml`), which builds the container, pushes it to Artifact Registry, and applies this service's Terraform deployment in `deploy/`. Production runs as `blich-website` in GCP project `blichstudio-infras`, region `europe-west1`.

Before merging, verify tests, types, the production build, desktop/mobile browsing, filters, pagination, missing-content responses and the feed/sitemap. After deployment, check the new Cloud Run revision, public pages and runtime logs. Shared infrastructure is managed separately.

## Remaining relaunch work

- Add finished game builds and honest play/download actions as they become available.
- Publish useful development notes consistently; RSS follows those notes.
- Image transformations, locally hosted fonts, consent-aware analytics, full accessibility/performance audits and broader media/session infrastructure hardening remain separate work.
