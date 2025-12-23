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
</script>
