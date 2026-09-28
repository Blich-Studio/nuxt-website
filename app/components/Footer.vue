<script setup lang="ts">
const { user, signOut, showAuthModal } = useAuth()
</script>
<template>
  <footer class="site-footer">
    <div class="layout-shell">
      <div class="footer-top">
        <div>
          <p class="eyebrow">KEEP IN TOUCH</p>
          <h2>
            More from the<br /><span class="text-accent">workbench.</span>
          </h2>
          <p>
            New builds, development notes, and things learned along the way.
          </p>
        </div>
        <div class="footer-follow">
          <a class="studio-button" href="/feed.xml"
            >Follow via RSS <span aria-hidden="true">↗</span></a
          ><a
            class="text-link"
            href="https://www.youtube.com/@blichstudio.prague"
            target="_blank"
            rel="noopener noreferrer"
            >Watch on YouTube ↗</a
          ><a
            class="text-link"
            href="https://github.com/Blich-Studio"
            target="_blank"
            rel="noopener noreferrer"
            >Explore the code ↗</a
          >
        </div>
      </div>
      <div class="footer-bottom">
        <NuxtLink to="/">© {{ new Date().getFullYear() }} Blich Studio</NuxtLink
        ><a href="mailto:filip@blichstudio.com">filip@blichstudio.com</a
        ><button
          type="button"
          class="quiet-button"
          @click="user?.userId ? signOut() : showAuthModal()"
        >
          {{ user?.userId ? 'Sign out' : 'Sign in to comment' }}
        </button>
      </div>
    </div>
  </footer>
</template>
<style scoped>
.site-footer {
  border-top: 1px solid var(--border);
  margin-top: 4rem;
}
.footer-top {
  display: flex;
  justify-content: space-between;
  gap: 3rem;
  padding: 4rem 0;
}
h2 {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  letter-spacing: -0.055em;
}
p:not(.eyebrow) {
  max-width: 30rem;
  color: var(--muted-foreground);
}
.footer-follow {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1rem;
  justify-content: center;
}
.footer-bottom {
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.8rem 0;
  font-size: 0.8rem;
  color: var(--muted-foreground);
  flex-wrap: wrap;
}
@media (max-width: 640px) {
  .footer-top {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
