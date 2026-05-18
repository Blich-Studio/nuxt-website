<script setup lang="ts">
const fields = ['analog sound', 'animation', 'visual art', 'indie games', 'live signal', 'party archive']
const itemAccent = useRandomItemAccent()
</script>

<template>
  <div :class="$style.page">
    <section :class="$style.hero">
      <p :class="$style.eyebrow">ABOUT / BLICH COLLECTIVE</p>
      <h1 :class="$style.title">A small signal table for sound, motion, and play.</h1>
      <p :class="$style.lead">
        Blich Collective is an evolving creative archive for analog techno, machine rhythms, hand-drawn and stop motion animation, visual art, and artsy indie game development.
      </p>
      <div :class="$style.tags">
        <span v-for="field in fields" :key="field" :style="itemAccent('about:' + field)">{{ field }}</span>
      </div>
    </section>

    <section :class="$style.grid">
      <article :class="$style.panel">
        <span :class="$style.panelCode">01</span>
        <h2>What It Is</h2>
        <p>
          A public-facing collective identity for releases, process notes, playable objects, animation fragments, sound sessions, and future event material.
        </p>
      </article>

      <article :class="$style.panel">
        <span :class="$style.panelCode">02</span>
        <h2>What It Makes</h2>
        <p>
          Tracks, patches, loops, drawings, stop motion tests, game prototypes, interactive systems, and notes from the messy parts of making.
        </p>
      </article>

      <article :class="$style.panel">
        <span :class="$style.panelCode">03</span>
        <h2>Where It Goes</h2>
        <p>
          The hidden party section can later become a place for flyers, live recordings, photos, invitations, and transmission logs.
        </p>
      </article>
    </section>

    <section :class="$style.contact">
      <p :class="$style.eyebrow">CONTACT / COLLABORATION</p>
      <h2>Send a signal.</h2>
      <div :class="$style.links">
        <a href="mailto:hello@blichstudio.com">
          <Icon name="lucide:mail" />
          hello@blichstudio.com
        </a>
        <NuxtLink to="/projects">
          <Icon name="lucide:archive" />
          Open Archive
        </NuxtLink>
        <NuxtLink to="/sound">
          <Icon name="lucide:radio" />
          Sound
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss" module>
@use '../assets/styles/variables' as *;

.page {
  min-height: 100vh;
  padding: 9rem 1rem 5rem;
  background:
    repeating-linear-gradient(135deg, color-mix(in oklch, var(--foreground) 4%, transparent) 0 1px, transparent 1px 18px),
    linear-gradient(110deg, color-mix(in oklch, var(--accent-primary) 16%, transparent), transparent 34%),
    var(--background);
}

.hero,
.grid,
.contact {
  width: min(100%, 80rem);
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 1rem;
  color: var(--accent-primary);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.title {
  max-width: 12ch;
  font-size: clamp(3.5rem, 9vw, 8rem);
  line-height: 0.86;
  letter-spacing: 0;
  text-transform: uppercase;
  filter: drop-shadow(0.05em 0.05em 0 color-mix(in oklch, var(--accent-secondary) 72%, transparent));
}

.lead {
  max-width: 48rem;
  margin: 2rem 0 0;
  padding-left: 1rem;
  border-left: 0.75rem solid var(--accent-primary);
  color: color-mix(in oklch, var(--foreground) 86%, var(--muted-foreground));
  font-size: 1.2rem;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2rem;
}

.tags span {
  border: 1px solid currentColor;
  padding: 0.35rem 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
}

.grid {
  display: grid;
  gap: 1rem;
  margin-top: 5rem;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.panel,
.contact {
  border: 2px solid color-mix(in oklch, var(--foreground) 18%, transparent);
  background:
    repeating-linear-gradient(90deg, color-mix(in oklch, var(--foreground) 5%, transparent) 0 1px, transparent 1px 16px),
    color-mix(in oklch, var(--card) 88%, transparent);
}

.panel {
  min-height: 18rem;
  padding: 1.25rem;
  position: relative;
}

.panel:nth-child(odd) {
  transform: rotate(-1deg);
}

.panel:nth-child(even) {
  transform: rotate(1deg);
}

.panelCode {
  color: color-mix(in oklch, var(--accent-primary) 64%, transparent);
  font-family: var(--font-display);
  font-size: 3rem;
  line-height: 1;
}

.panel h2,
.contact h2 {
  margin-top: 2rem;
  font-size: 2rem;
  text-transform: uppercase;
}

.panel p,
.contact p {
  color: var(--muted-foreground);
}

.contact {
  margin-top: 5rem;
  padding: 1.5rem;
  border-left: 0.75rem solid var(--accent-primary);
  box-shadow: 0.5rem 0.5rem 0 color-mix(in oklch, var(--accent-secondary) 70%, transparent);
}

.links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.links a {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.65rem;
  border: 1px solid var(--accent-secondary);
  color: var(--accent-secondary);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 800;
  text-transform: uppercase;
}

.links svg {
  width: 1rem;
  height: 1rem;
}
</style>
