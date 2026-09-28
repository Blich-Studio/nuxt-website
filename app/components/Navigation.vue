<script setup lang="ts">
const route = useRoute()
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
        >BLICH<span class="brand-star" aria-hidden="true">✱</span
        ><small>STUDIO</small></NuxtLink
      >
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
        <a class="nav-contact" href="mailto:filip@blichstudio.com"
          >Say hello <span aria-hidden="true">↗</span></a
        >
      </nav>
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
  gap: 2rem;
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
  gap: 2.5rem;
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
.menu-toggle {
  display: none;
}
@media (max-width: 640px) {
  .nav-bar {
    min-height: 72px;
    flex-wrap: wrap;
    gap: 0;
  }
  .menu-toggle {
    display: block;
    padding: 0.8rem 0 0.8rem 1rem;
    border: 0;
    background: none;
    color: var(--foreground);
    font: inherit;
  }
  .site-nav {
    display: none;
    flex-basis: 100%;
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
</style>
