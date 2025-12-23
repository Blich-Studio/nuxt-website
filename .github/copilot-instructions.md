# Copilot instructions — blich-studio-website-nuxt

## ⚠️ CRITICAL: Next.js site is READ-ONLY

**`blich-studio-website` (Next.js) is strictly READ-ONLY.**

- ✅ You MAY read/reference it for inspiration and visual standards
- ❌ You MUST NOT edit any files in `blich-studio-website`
- ❌ You MUST NOT run any commands in `blich-studio-website`
- ❌ You MUST NOT make any modifications whatsoever

All development work happens in **`blich-studio-website-nuxt`** only.

---

## Project identity (do not confuse repos)

- **`blich-studio-website`** is the **old public marketing website** built with **Next.js (App Router) + React + TypeScript**. **READ-ONLY - reference only.**
- **`blich-studio-website-nuxt`** is the **public marketing website** built with **Nuxt.js (App Router) + Vue 3 + TypeScript**. **ACTIVE DEVELOPMENT.**
- **`blich-cms`** is the **CMS/admin app** built with **Nuxt + Vue 3**.

When the user says “Nuxt/CMS”, double-check whether they mean **porting the website to Nuxt** vs working in `blich-cms`.

## Current website architecture (as of 2025-12)

- Nuxt.js App Router under `app/`

## Migration note: Next → Nuxt/Vue 3

The user is considering rewriting this project from **Next/React** to **Nuxt/Vue 3** to unify the stack with the CMS.

When discussing/implementing a rewrite, be explicit about:
- desired fidelity (pixel-perfect vs “close enough”)
- replacement plan for Radix/shadcn React components (Vue equivalents vs custom components)
- content source of truth (repo content vs API)

## Migration constraints (user preference)

- **Pixel-perfect parity required**: design, look, and behavior should stay the same.
- Build a **custom design system** (primitives → atoms → molecules → organisms).
- Prefer **Sass** and **ditch Tailwind** in the Nuxt/Vue rewrite.
- Use the current Next.js site as the **visual/behavior standard**; copy styling from the existing CSS/Tailwind/React implementation as reference.

## Data source (Nuxt rewrite)

- The Nuxt/Vue rewrite should connect UI to the **real backend** (`api-gateway`) rather than using mocked/local data.
- Prefer a single API client/composable (e.g. `useApi()` wrapping `$fetch`) with base URL from `runtimeConfig.public.apiUrl`.
- Keep SSR vs client behavior explicit: data fetching should work in SSR where possible; client-only interactions should not affect layout parity.

## API access + auth decisions (Nuxt rewrite)

- Use a **Nuxt server proxy** (browser calls the Nuxt app; Nuxt forwards to `api-gateway`).
- Use **cookie-based authentication** (API sets `Set-Cookie`; browser stores cookie; Nuxt forwards cookies server-side).

## Proxy implementation sketch (Nuxt rewrite)

Goal: the browser calls **same-origin** Nuxt endpoints under `/api/*`. Nuxt proxies to `api-gateway` and handles cookies correctly for SSR.

### 1) Catch-all proxy route

Create `server/api/_proxy/[...path].ts`:

```ts
export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const gatewayBaseUrl = config.public.apiUrl
	if (!gatewayBaseUrl) {
		throw createError({ statusCode: 500, statusMessage: 'Missing runtimeConfig.public.apiUrl' })
	}

	const path = getRouterParam(event, 'path') || ''
	const targetUrl = `${gatewayBaseUrl.replace(/\/$/, '')}/${path}`

	const method = getMethod(event)
	const query = getQuery(event)
	const headers = getHeaders(event)

	// Forward incoming cookies to the gateway (SSR requests)
	const cookie = headers.cookie

	// Forward body for non-GET/HEAD
	const body = method === 'GET' || method === 'HEAD' ? undefined : await readBody(event)

	const res = await $fetch.raw(targetUrl, {
		method,
		query,
		body,
		headers: {
			// Do not forward host/connection headers
			...(cookie ? { cookie } : {}),
			// Optional: forward user-agent for logging/debug
			...(headers['user-agent'] ? { 'user-agent': headers['user-agent'] } : {}),
			// Preserve content-type if present
			...(headers['content-type'] ? { 'content-type': headers['content-type'] } : {}),
		},
	})

	// IMPORTANT: forward Set-Cookie back to the browser on login/refresh/logout
	const setCookie = res.headers.getSetCookie?.() ?? (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')!] : [])
	for (const cookieValue of setCookie) {
		appendHeader(event, 'set-cookie', cookieValue)
	}

	// Mirror gateway status + response body
	setResponseStatus(event, res.status)
	return res._data
})
```

### 2) Use a single API composable (client + SSR)

Create `composables/useApi.ts`:

```ts
export function useApi() {
	return $fetch.create({
		baseURL: '/api/_proxy',
		credentials: 'include',
	})
}
```

Usage example:

```ts
const api = useApi()
const { data } = await useAsyncData('articles', () => api('/articles'))
```

### 3) Cookie auth expectations

- `api-gateway` should set auth cookies with `HttpOnly; Secure; SameSite=Lax` (or `None` if needed) and a proper `Path=/`.
- Nuxt proxy must pass through `Set-Cookie` and forward incoming `Cookie` on SSR.
- UI should not store tokens in localStorage; rely on cookies + `/auth/me` (or equivalent) for session state.
