<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Button from './ui/Button.vue'

const isScrolled = ref(false)
const showLogo = ref(false)
const isMobileMenuOpen = ref(false)
const route = useRoute()

const theme = ref<'light' | 'dark'>('dark')

// Composables are auto-imported in Nuxt
const { user, signOut, showAuthModal } = useAuth()

onMounted(() => {
  // Check saved theme
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
  if (savedTheme) {
    theme.value = savedTheme
    document.documentElement.classList.toggle('dark', savedTheme === 'dark')
  }

  const handleScroll = () => {
    isScrolled.value = window.scrollY > 50
    showLogo.value = window.scrollY > 400
  }
  window.addEventListener('scroll', handleScroll)
  handleScroll() // Initial check

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})

function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
  document.documentElement.classList.toggle('dark', theme.value === 'dark')
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' }
]
</script>

<template>
  <nav :class="[$style.nav, isScrolled && $style.navScrolled, isMobileMenuOpen && $style.navMobileOpen]">
    <div :class="$style.container">
      <div :class="$style.inner">
        <!-- Logo -->
        <NuxtLink to="/" :class="[$style.logo, showLogo && $style.logoVisible]">
          <span :class="$style.logoText">BLICH</span>
          <span :class="$style.logoAccent">STUDIO</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <div :class="$style.desktopNav">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.href"
            :to="link.href"
            :class="[$style.navLink, route.path === link.href && $style.navLinkActive]"
          >
            {{ link.label }}
          </NuxtLink>

          <!-- Theme Toggle -->
          <button type="button" @click="toggleTheme" :class="$style.themeToggle" aria-label="Toggle theme">
            <Icon v-if="theme === 'dark'" name="lucide:sun" :class="$style.icon" />
            <Icon v-else name="lucide:moon" :class="$style.icon" />
          </button>

          <!-- Auth -->
          <template v-if="user && user.userId">
            <div :class="$style.authSection">
              <span :class="$style.greeting">Hello, {{ user.name }}</span>
              <Button size="sm" variant="outline" @click="signOut" :class="$style.authButton">
                <Icon name="lucide:log-out" :class="$style.buttonIcon" />
                Sign Out
              </Button>
            </div>
          </template>
          <template v-else>
            <Button size="sm" variant="outline" @click="showAuthModal" :class="$style.authButton">
              <Icon name="lucide:user" :class="$style.buttonIcon" />
              Sign In
            </Button>
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
          :class="[$style.mobileNavLink, route.path === link.href && $style.navLinkActive]"
          @click="isMobileMenuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <button type="button" @click="toggleTheme" :class="$style.mobileThemeToggle">
          <Icon v-if="theme === 'dark'" name="lucide:sun" :class="$style.icon" />
          <Icon v-else name="lucide:moon" :class="$style.icon" />
          {{ theme === 'dark' ? 'Light Mode' : 'Dark Mode' }}
        </button>
        <template v-if="user && user.userId">
          <div :class="$style.mobileGreeting">Hello, {{ user.name }}</div>
          <Button size="sm" variant="outline" :class="$style.mobileAuthButton" @click="signOut">
            <Icon name="lucide:log-out" :class="$style.buttonIcon" />
            Sign Out
          </Button>
        </template>
        <template v-else>
          <Button size="sm" variant="outline" :class="$style.mobileAuthButton" @click="showAuthModal">
            <Icon name="lucide:user" :class="$style.buttonIcon" />
            Sign In
          </Button>
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
  background-color: transparent;
}

.navScrolled {
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  // Light mode (default)
  background-color: oklch(0.97 0.02 50 / 0.95);
}

:global(.dark) .navScrolled {
  background-color: oklch(0.12 0.015 280 / 0.95);
}

.navMobileOpen {
  background-color: var(--background);
}

:global(.dark) .navMobileOpen {
  background-color: var(--background);
}

:global(body.article-detail) .nav {
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
}

.desktopNav {
  display: none;
  align-items: center;
  gap: 2rem;

  @media (min-width: $breakpoint-md) {
    display: flex;
  }
}

.navLink {
  font-size: $text-sm;
  font-weight: 500;
  color: $color-muted-foreground;
  transition: color 0.2s ease;

  &:hover {
    color: $color-clay-orange;
  }
}

.navLinkActive {
  color: $color-clay-orange;
}

.themeToggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  border: 0px;
  background: transparent;
  color: $color-muted-foreground;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: $color-foreground;
    border-color: $color-foreground;
  }
}

.icon {
  width: 1rem;
  height: 1rem;
}

.authSection {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.greeting {
  font-size: $text-sm;
  color: $color-muted-foreground;
}

.authButton {
  border-radius: 9999px;
}

.buttonIcon {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
}

.mobileMenuButton {
  display: block;
  padding: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: $color-foreground;

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
  border-top: 1px solid $color-border;

  @media (min-width: $breakpoint-md) {
    display: none;
  }
}

.mobileNavLink {
  display: block;
  padding: 0.75rem 0;
  font-size: $text-sm;
  font-weight: 500;
  color: $color-muted-foreground;
  transition: color 0.2s ease;
}

.mobileThemeToggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0;
  font-size: $text-sm;
  font-weight: 500;
  color: $color-muted-foreground;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: $color-foreground;
  }
}

.mobileGreeting {
  padding: 0.75rem 0;
  font-size: $text-sm;
  color: $color-muted-foreground;
}

.mobileAuthButton {
  width: 100%;
  margin-top: 0.5rem;
  background: transparent;
}
</style>
