<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer :class="$style.footer">
    <div :class="$style.container">
      <div :class="$style.grid">
        <!-- Brand -->
        <div :class="$style.brand">
          <NuxtLink to="/" :class="$style.brandTitle">
            <span :class="$style.logoText">BLICH</span>
            <span :class="$style.logoAccent">STUDIO</span>
          </NuxtLink>
          <p :class="$style.brandDescription">
            Crafting stop motion animations and handmade games frame by frame. Where analog artistry meets digital
            storytelling.
          </p>
          <div :class="$style.socialLinks">
            <a href="https://x.com/BlichStudio" target="_blank" rel="noopener noreferrer" :class="$style.socialLink" aria-label="X (Twitter)">
              <svg :class="$style.socialIcon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a href="https://github.com/Blich-Studio" target="_blank" rel="noopener noreferrer" :class="$style.socialLink" aria-label="GitHub">
              <svg :class="$style.socialIcon" fill="currentColor" viewBox="0 0 24 24">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
            </a>
            <a href="https://www.youtube.com/@blichstudio.prague" target="_blank" rel="noopener noreferrer" :class="$style.socialLink" aria-label="YouTube">
              <svg :class="$style.socialIcon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a href="https://instagram.com/blichstudio.prague" target="_blank" rel="noopener noreferrer" :class="$style.socialLink" aria-label="Instagram">
              <svg :class="$style.socialIcon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
              </svg>
            </a>
            <a href="https://tiktok.com/@blichstudio.prague" target="_blank" rel="noopener noreferrer" :class="$style.socialLink" aria-label="TikTok">
              <svg :class="$style.socialIcon" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Quick Links -->
        <div :class="$style.linksSection">
          <h4 :class="$style.linksTitle">Explore</h4>
          <ul :class="$style.linksList">
            <li>
              <NuxtLink to="/projects" :class="$style.link">Projects</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/blog" :class="$style.link">Blog</NuxtLink>
            </li>
            <li>
              <NuxtLink to="/about" :class="$style.link">About Us</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div :class="$style.linksSection">
          <h4 :class="$style.linksTitle">Contact</h4>
          <ul :class="$style.linksList">
            <li :class="$style.contactItem">filip@blichstudio.com</li>
            <li :class="$style.contactItem">Press inquiries</li>
            <li :class="$style.contactItem">Collaborations</li>
            <li :class="$style.contactItem">Discord</li>
          </ul>
        </div>
      </div>

      <div :class="$style.copyright">
        <p>&copy; {{ currentYear }} Blich Studio. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" module>
@use '../assets/styles/variables' as *;

.footer {
  border-top: 1px solid $color-border;
  // Light mode: warm cream card color with 50% opacity
  background-color: oklch(0.99 0.01 60 / 0.5);
}

:global(.dark) .footer {
  // Dark mode: dark card color with 50% opacity
  background-color: oklch(0.16 0.02 285 / 0.5);
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 3rem 1rem;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: 2fr 1fr 1fr;
  }
}

.brand {
  @media (min-width: $breakpoint-md) {
    grid-column: span 1;
  }
}

.brandTitle {
  display: block;
  font-family: $font-display;
  font-size: $text-xl;
  font-weight: 700;
  margin-bottom: 0.75rem;
  text-decoration: none;
}

.logoText {
  color: var(--foreground);
}

.logoAccent {
  color: var(--clay-orange);
}

.brandDescription {
  color: $color-muted-foreground;
  font-size: $text-sm;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.socialLinks {
  display: flex;
  gap: 1rem;
}

.socialLink {
  color: $color-muted-foreground;
  transition: color 0.2s ease;

  &:hover {
    color: $color-clay-orange;
  }
}

.socialIcon {
  width: 1.25rem;
  height: 1.25rem;
}

.linksTitle {
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.linksList {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.link {
  font-size: $text-sm;
  color: $color-muted-foreground;
  transition: color 0.2s ease;

  &:hover {
    color: $color-clay-orange;
  }
}

.contactItem {
  font-size: $text-sm;
  color: $color-muted-foreground;
}

.copyright {
  padding-top: 2rem;
  border-top: 1px solid $color-border;
  text-align: center;
  font-size: $text-sm;
  color: $color-muted-foreground;
}
</style>
