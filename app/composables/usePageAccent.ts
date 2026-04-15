/**
 * usePageAccent — sets body[data-page] based on the current route.
 *
 * Drives the chameleon-rotation accent system: CSS selectors in main.scss
 * match on `body[data-page='...']` and reassign --accent-primary/secondary
 * to different family colors per page type.
 *
 * Call once in the root layout/app entry — it updates reactively on
 * route change via useHead.
 *
 * See: _bmad-output/planning-artifacts/ux-design-specification.md
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
}
