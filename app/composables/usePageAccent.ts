import { applyRandomPageAccent } from './useRandomAccent'

/**
 * usePageAccent — sets body[data-page] based on the current route, then
 * applies a random accent pair on every route change (client-only).
 *
 * Server-rendered HTML uses the deterministic body[data-page] rotation map
 * defined in main.scss. Post-hydration on the client, we overwrite with a
 * random family pair so the user "never knows what color they get" —
 * chameleon-graffiti unpredictability within the curated family.
 *
 * Call once in the root layout/app entry.
 */
export function usePageAccent() {
  const route = useRoute()

  const pageKey = computed<string>(() => {
    const path = route.path
    if (path === '/') return 'home'
    if (path === '/about') return 'about'
    if (path === '/projects') return 'projects'
    if (path.startsWith('/projects/')) return 'project-detail'
    if (path === '/blog') return 'blog'
    if (path.startsWith('/blog/')) return 'blog-article'
    if (path.startsWith('/auth/')) return 'auth'
    return 'home'
  })

  useHead({
    bodyAttrs: {
      'data-page': pageKey,
    },
  })

  // Client-only: randomize on initial mount and each route change.
  if (import.meta.client) {
    onMounted(() => {
      applyRandomPageAccent()
    })
    watch(
      () => route.fullPath,
      () => applyRandomPageAccent(),
    )
  }
}
