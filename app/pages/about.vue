<script setup lang="ts">
useEditorialSeo(
  'About the studio',
  'Blich Studio is Filip Černý’s independent game-making workshop: code, design, handmade art, and lessons from the process.',
)
</script>
<template>
  <div class="layout-shell">
    <header class="editorial-intro">
      <p class="eyebrow">ABOUT / BLICH STUDIO</p>
      <h1>
        Games first.<br /><span class="text-accent">Curiosity always.</span>
      </h1>
      <p>
        An independent space for games, experiments, and the work behind them.
      </p>
    </header>
    <section class="about-story">
      <div>
        <p class="eyebrow">THE PERSON AT THE DESK</p>
        <h2>Hi, I’m Filip.</h2>
      </div>
      <div class="reading-copy">
        <p>
          I’m a programmer and the founder of Blich Studio. This is where I make
          room for game development, design, drawing, and working with my hands.
        </p>
        <p>
          Games are the center of the studio. Art, animation, and sound are ways
          to give them character—and sometimes useful experiments in their own
          right.
        </p>
        <p>
          I’m taking on the
          <NuxtLink to="/projects/20-games-challenge"
            >20 Games Challenge</NuxtLink
          >
          to practise the fundamentals: solve a problem, finish a small game,
          understand what worked, and carry that lesson into the next one.
        </p>
        <p>
          This workshop is for fellow developers and designers who like seeing
          how things are made, and players curious about what comes next.
        </p>
      </div>
    </section>
    <section class="about-story">
      <div>
        <p class="eyebrow">WHAT YOU’LL FIND HERE</p>
        <h2>Work, with context.</h2>
      </div>
      <div class="reading-copy">
        <p>
          <NuxtLink to="/projects">Games & experiments</NuxtLink> collects the
          projects. Each page points to the work and any available places to try
          it or see more.
        </p>
        <p>
          <NuxtLink to="/blog">The workshop</NuxtLink> holds development notes,
          making-of stories, and lessons from the process. You can follow new
          notes with <a href="/feed.xml">RSS</a>.
        </p>
      </div>
    </section>
    <section class="contact-panel">
      <p class="eyebrow">COMPARE NOTES / ASK A QUESTION / SAY HELLO</p>
      <h2>Let’s talk about making things.</h2>
      <NuxtLink class="studio-button" to="/contact"
        >Contact the studio <span aria-hidden="true">↗</span></NuxtLink
      >
    </section>
  </div>
</template>
<style scoped>
.about-story {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  border-top: 1px solid var(--border);
  padding: 3rem 0;
}
h2 {
  font-size: clamp(2rem, 4vw, 3rem);
}
.reading-copy {
  max-width: 42rem;
  font-size: 1.1rem;
}
.reading-copy p:first-child {
  margin-top: 0;
}
.contact-panel {
  padding: 3rem;
  background: var(--card);
  border: 1px solid var(--border);
  margin-top: 2rem;
}
.contact-panel h2 {
  margin-bottom: 2rem;
}
@media (max-width: 700px) {
  .about-story {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  .contact-panel {
    padding: 1.5rem;
  }
}
</style>
