<script setup lang="ts">
const route = useRoute()
const letterColor = useRandomLetterColor()
const { user, loading, signOut, showAuthModal } = useAuth()
const open = ref(false)
const toggle = ref<HTMLButtonElement>()
const links = [
  { to: '/projects', label: 'Games' },
  { to: '/blog', label: 'Workshop' },
  { to: '/about', label: 'About' },
]
watch(
  () => route.fullPath,
  () => {
    open.value = false
  },
)
function closeMenu() {
  open.value = false
  toggle.value?.focus()
}
</script>
<template>
  <header class="site-header" @keydown.esc="closeMenu">
    <div class="layout-shell nav-bar">
      <NuxtLink to="/" class="wordmark" aria-label="Blich Studio home"
        ><span class="wordmark-letters"><span v-for="(letter, index) in 'BLICH'" :key="index" :style="{ color: letterColor(route.path + ':' + index) }">{{ letter }}</span></span><span class="brand-star" aria-hidden="true">✱</span
        ><small>STUDIO</small></NuxtLink
      >
      <nav
        id="site-navigation"
        aria-label="Main navigation"
        :class="['site-nav', { 'is-open': open }]"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :aria-current="route.path.startsWith(link.to) ? 'page' : undefined"
          >{{ link.label }}</NuxtLink
        >
        <NuxtLink class="nav-contact" to="/contact" :aria-current="route.path === '/contact' ? 'page' : undefined"
          >Say hello <span aria-hidden="true">↗</span></NuxtLink
        >
      </nav>
      <div class="nav-actions">
        <button
          type="button"
          class="nav-sign-in"
          :disabled="loading"
          :aria-haspopup="user?.userId ? undefined : 'dialog'"
          @click="user?.userId ? signOut() : showAuthModal()"
        >
          {{ user?.userId ? 'Sign out' : 'Sign in' }}
        </button>
        <button
          ref="toggle"
          class="menu-toggle"
          type="button"
          :aria-expanded="open"
          aria-controls="site-navigation"
          @click="open = !open"
        >
          {{ open ? 'Close' : 'Menu' }}
          <span aria-hidden="true">{{ open ? '−' : '+' }}</span>
        </button>
      </div>
    </div>
  </header>
</template>
<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--background);
  border-bottom: 1px solid var(--border);
}
.nav-bar {
  min-height: 88px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
}
.wordmark {
  display: flex;
  gap: 0.35rem;
  align-items: center;
  font: 800 1.8rem var(--font-display);
  letter-spacing: -0.07em;
}
.wordmark small {
  font: 500 0.65rem var(--font-mono);
  letter-spacing: 0.12em;
  align-self: end;
  margin: 0 0 0.4rem 0.25rem;
}
.brand-star {
  color: var(--primary);
  font-size: 2.1rem;
}
.site-nav {
  display: flex;
  gap: 2rem;
  margin-left: auto;
  align-items: center;
  font-size: 0.9rem;
}
.site-nav a {
  padding: 0.7rem 0;
}
.site-nav a:hover,
.site-nav a[aria-current] {
  color: var(--primary);
}
.nav-contact {
  border-left: 1px solid var(--border);
  padding-left: 2rem !important;
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}
.nav-sign-in {
  padding: 0.65rem 1rem;
  border: 1px solid var(--primary);
  border-radius: 0.35rem;
  background: transparent;
  color: var(--primary);
  font: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
}
.nav-sign-in:hover {
  background: var(--accent-secondary);
  color: var(--accent-secondary-on);
  border-color: var(--accent-secondary);
}
.nav-sign-in:disabled { opacity: 0.6; cursor: wait; }
.menu-toggle {
  display: none;
}
@media (max-width: 800px) {
  .nav-bar {
    min-height: 72px;
    flex-wrap: wrap;
    gap: 0;
  }
  .menu-toggle {
    display: block;
    padding: 0.8rem 0;
    border: 0;
    background: none;
    color: var(--foreground);
    font: inherit;
  }
  .site-nav {
    display: none;
    flex-basis: 100%;
    order: 3;
    padding: 1rem 0 1.5rem;
    flex-direction: column;
    align-items: stretch;
    gap: 0.3rem;
  }
  .site-nav.is-open {
    display: flex;
  }
  .nav-contact {
    border-left: 0;
    padding-left: 0 !important;
  }
}
@media (max-width: 380px) {
  .wordmark { font-size: 1.5rem; }
  .wordmark small { display: none; }
  .nav-actions { gap: 0.75rem; }
  .nav-sign-in { padding: 0.6rem 0.75rem; }
}
</style>
