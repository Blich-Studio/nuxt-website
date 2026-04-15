<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import Button from './ui/Button.vue'

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
  background-color: color-mix(in oklch, var(--background) 95%, transparent);
}

.navMobileOpen {
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
