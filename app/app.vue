<template>
  <div>
    <NuxtRouteAnnouncer />
    <Navigation />
    <main>
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

// Drives the chameleon-rotation accent system: sets body[data-page] per route
usePageAccent()
</script>
