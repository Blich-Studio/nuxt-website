<template>
  <div>
    <NuxtRouteAnnouncer />
    <a class="skip-link" href="#main-content">Skip to content</a>
    <Navigation />
    <main id="main-content" tabindex="-1">
      <NuxtPage />
    </main>
    <Footer />
    <SignInModal />
  </div>
</template>

<script setup lang="ts">
import Navigation from '@/components/Navigation.vue'
import Footer from '@/components/Footer.vue'
import SignInModal from '@/components/modal/SignInModal.vue'
</script>
