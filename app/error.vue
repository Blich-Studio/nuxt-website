<script setup lang="ts">
defineProps<{ error: { statusCode: number } }>()
useHead({
  title: 'Page unavailable | Blich Studio',
  meta: [{ name: 'robots', content: 'noindex' }],
})
</script>
<template>
  <main class="layout-shell error-page">
    <p class="eyebrow">BLICH STUDIO / {{ error.statusCode }}</p>
    <h1>
      {{
        error.statusCode === 404
          ? 'Nothing on this workbench.'
          : 'A small interruption.'
      }}
    </h1>
    <p>
      {{
        error.statusCode === 404
          ? 'This page may have moved, or the link may be wrong.'
          : 'We could not load this page. Please try again shortly.'
      }}
    </p>
    <button class="studio-button" @click="clearError({ redirect: '/' })">
      Back to the studio →
    </button>
  </main>
</template>
<style scoped>
.error-page {
  padding-top: 15vh;
  max-width: 50rem;
}
h1 {
  font-size: clamp(2.5rem, 6vw, 5rem);
}
p {
  margin-block: 2rem;
}
</style>
