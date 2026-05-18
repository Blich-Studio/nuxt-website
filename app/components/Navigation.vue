<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRandomLetterColor } from '~/composables/useRandomAccent'

const letterColor = useRandomLetterColor()

const scrollY = ref(0)
const isMobileMenuOpen = ref(false)
const route = useRoute()

const isScrolled = computed(() => scrollY.value > 50)
// Hide logo only on homepage until past hero; always show on other pages.
const showLogo = computed(() => route.path !== '/' || scrollY.value > 400)

// Composables are auto-imported in Nuxt
const { user, signOut, showAuthModal } = useAuth()

onMounted(() => {
  const handleScroll = () => {
    scrollY.value = window.scrollY
  }
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initial check

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})

const navLinks = [
  { href: '/', label: 'Signal' },
  { href: '/projects', label: 'Archive' },
  { href: '/sound', label: 'Sound' },
  { href: '/motion', label: 'Motion' },
  { href: '/play', label: 'Play' },
  { href: '/blog', label: 'Notes' },
  { href: '/about', label: 'About' }
]

function isActiveLink(href: string): boolean {
  if (href === '/') return route.path === '/'
  return route.path === href || route.path.startsWith(`${href}/`)
}
</script>

<template>
  <nav :class="[$style.nav, isScrolled && $style.navScrolled, isMobileMenuOpen && $style.navMobileOpen]">
    <div :class="$style.container">
      <div :class="$style.inner">
        <!-- Logo — each letter picks its own random family color per visit -->
        <NuxtLink to="/" :class="[$style.logo, showLogo && $style.logoVisible]">
          <span :class="$style.logoText">
            <span
              v-for="(ch, i) in 'BLICH'"
              :key="'b' + i"
              :style="{ color: letterColor(route.path + ':b:' + i) }"
            >{{ ch }}</span>
          </span>
          <span :class="$style.logoAccent">
            <span
              v-for="(ch, i) in 'COLLECTIVE'"
              :key="'s' + i"
              :style="{ color: letterColor(route.path + ':s:' + i) }"
            >{{ ch }}</span>
          </span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div :class="$style.desktopNav">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            :to="link.href"
            :class="[$style.navLink, isActiveLink(link.href) && $style.navLinkActive]"
          >
            {{ link.label }}
          </NuxtLink>

          <!-- Auth -->
          <template v-if="user && user.userId">
            <div :class="$style.authSection">
              <span :class="$style.greeting">Hello, {{ user.name }}</span>
              <button type="button" @click="signOut" :class="$style.authButton">
                <Icon name="lucide:log-out" :class="$style.buttonIcon" />
                Sign Out
              </button>
            </div>
          </template>
          <template v-else>
            <button type="button" @click="showAuthModal" :class="$style.authButton">
              <Icon name="lucide:user" :class="$style.buttonIcon" />
              Sign In
            </button>
          </template>
        </div>

        <!-- Mobile Menu Button -->
        <button :class="$style.mobileMenuButton" @click="isMobileMenuOpen = !isMobileMenuOpen">
          <Icon v-if="isMobileMenuOpen" name="lucide:x" :class="$style.menuIcon" />
          <Icon v-else name="lucide:menu" :class="$style.menuIcon" />
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMobileMenuOpen" :class="$style.mobileMenu">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          :class="[$style.mobileNavLink, isActiveLink(link.href) && $style.navLinkActive]"
          @click="isMobileMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <template v-if="user && user.userId">
          <div :class="$style.mobileGreeting">Hello, {{ user.name }}</div>
          <button type="button" :class="$style.mobileAuthButton" @click="signOut">
            <Icon name="lucide:log-out" :class="$style.buttonIcon" />
            Sign Out
          </button>
        </template>
        <template v-else>
          <button type="button" :class="$style.mobileAuthButton" @click="showAuthModal">
            <Icon name="lucide:user" :class="$style.buttonIcon" />
            Sign In
          </button>
        </template>
      </div>
    </div>
  </nav>
</template>

<style lang="scss" module>
@use '../assets/styles/variables' as *;

.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: all 0.3s ease;
  background:
    linear-gradient(90deg, color-mix(in oklch, var(--accent-primary) 12%, transparent), transparent 35%),
    color-mix(in oklch, var(--background) 82%, transparent);
  backdrop-filter: blur(12px);
  border-bottom: 2px solid color-mix(in oklch, var(--foreground) 12%, transparent);
}

.navScrolled {
  backdrop-filter: blur(12px);
  border-bottom-color: var(--accent-primary);
  box-shadow: 0 0.25rem 0 color-mix(in oklch, var(--accent-primary) 45%, transparent);
  background:
    repeating-linear-gradient(90deg, color-mix(in oklch, var(--foreground) 5%, transparent) 0 1px, transparent 1px 18px),
    color-mix(in oklch, var(--background) 92%, transparent);
}

.navMobileOpen {
  background-color: var(--background);
}

:global(body.article-detail) .nav,
:global(body.project-detail) .nav {
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  background-color: var(--background);
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 0 1rem;
}

.inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;

  @media (min-width: $breakpoint-md) {
    height: 5rem;
  }
}

.logo {
  font-family: $font-display;
  font-size: 1.25rem;
  font-weight: 700;
  transition: all 0.7s ease;
  opacity: 0;
  filter: blur(16px);
  pointer-events: none;

  @media (min-width: $breakpoint-md) {
    font-size: 1.5rem;
  }
}

.logoVisible {
  opacity: 1;
  filter: blur(0);
  pointer-events: auto;
}

.logoText {
  color: $color-foreground;
}

.logoAccent {
  color: $color-clay-orange;
  margin-left: 0.25rem;
}

.desktopNav {
  display: none;
  align-items: center;
  gap: 0.4rem;

  @media (min-width: $breakpoint-md) {
    display: flex;
  }
}

.navLink {
  position: relative;
  display: inline-flex;
  min-height: 2.125rem;
  align-items: center;
  padding: 0.35rem 0.55rem;
  border: 1px solid transparent;
  font-size: 0.75rem;
  font-weight: 800;
  color: color-mix(in oklch, var(--foreground) 78%, var(--muted-foreground));
  font-family: $font-mono;
  text-transform: uppercase;
  transition: color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    color: var(--accent-primary);
    border-color: color-mix(in oklch, var(--accent-primary) 55%, transparent);
    background: color-mix(in oklch, var(--accent-primary) 10%, transparent);
    transform: rotate(-1deg);
  }
}

.navLinkActive {
  color: var(--accent-primary-on);
  border-color: var(--accent-primary);
  background: var(--accent-primary);
  box-shadow: 0.2rem 0.2rem 0 var(--accent-secondary);
}

.icon {
  width: 1rem;
  height: 1rem;
}

.authSection {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.greeting {
  font-size: $text-sm;
  color: $color-muted-foreground;
}

.authButton {
  display: inline-flex;
  min-height: 2.125rem;
  align-items: center;
  gap: 0.4rem;
  padding: 0.35rem 0.65rem;
  border: 1px solid color-mix(in oklch, var(--accent-secondary) 70%, transparent);
  background: color-mix(in oklch, var(--background) 72%, transparent);
  color: var(--accent-secondary);
  font-family: $font-mono;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0.2rem 0.2rem 0 color-mix(in oklch, var(--accent-secondary) 55%, transparent);
  transition: transform 0.2s ease, background-color 0.2s ease, color 0.2s ease;

  &:hover {
    transform: rotate(1deg) translateY(-1px);
    background: var(--accent-secondary);
    color: var(--accent-secondary-on);
  }
}

.buttonIcon {
  width: 1rem;
  height: 1rem;
  margin-right: 0;
}

.mobileMenuButton {
  display: block;
  padding: 0.5rem;
  background: color-mix(in oklch, var(--accent-primary) 12%, transparent);
  border: 1px solid color-mix(in oklch, var(--accent-primary) 50%, transparent);
  cursor: pointer;
  color: var(--accent-primary);

  @media (min-width: $breakpoint-md) {
    display: none;
  }
}

.menuIcon {
  width: 1.5rem;
  height: 1.5rem;
}

.mobileMenu {
  display: block;
  padding: 1rem 0;
  border-top: 2px solid color-mix(in oklch, var(--accent-primary) 55%, transparent);

  @media (min-width: $breakpoint-md) {
    display: none;
  }
}

.mobileNavLink {
  display: flex;
  min-height: 2.5rem;
  align-items: center;
  width: fit-content;
  margin-bottom: 0.35rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid transparent;
  font-family: $font-mono;
  font-size: $text-sm;
  font-weight: 800;
  color: $color-muted-foreground;
  text-transform: uppercase;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.mobileGreeting {
  padding: 0.75rem 0;
  font-size: $text-sm;
  color: $color-muted-foreground;
}

.mobileAuthButton {
  width: fit-content;
  margin-top: 0.5rem;
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  gap: 0.4rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid color-mix(in oklch, var(--accent-secondary) 70%, transparent);
  background: color-mix(in oklch, var(--background) 72%, transparent);
  color: var(--accent-secondary);
  font-family: $font-mono;
  font-size: $text-sm;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0.2rem 0.2rem 0 color-mix(in oklch, var(--accent-secondary) 55%, transparent);
}
</style>
