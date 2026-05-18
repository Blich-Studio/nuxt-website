<template>
  <div class="party-page">
    <section>
      <p>HIDDEN PARTY SECTION</p>
      <h1>Not on the poster yet.</h1>
      <span>Future space for events, flyers, live sets, recordings, photos, and invitations.</span>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.party-page {
  min-height: 100vh;
  padding: 8rem 1rem;
  display: grid;
  place-items: center;
  background:
    repeating-linear-gradient(90deg, color-mix(in oklch, var(--accent-primary) 18%, transparent) 0 1px, transparent 1px 18px),
    var(--background);
}

section {
  width: min(100%, 56rem);
  border: 2px solid var(--accent-primary);
  background: color-mix(in oklch, var(--background) 86%, transparent);
  padding: 1.5rem;
}

p,
span {
  font-family: var(--font-mono);
  color: var(--accent-primary);
}

h1 {
  max-width: 10ch;
  font-size: clamp(4rem, 10vw, 8rem);
  line-height: 0.88;
  letter-spacing: 0;
  text-transform: uppercase;
}
</style>
