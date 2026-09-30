<script setup lang="ts">
import { studioEmail, studioDiscord, studioItchio, studioSocialLinks } from '~/data/studio-contact'

useEditorialSeo(
  'Contact',
  'Get in touch with Blich Studio, find our games, and follow the work across the web.',
)
const directLinks = [
  ...(studioEmail ? [{ name: 'Email', href: `mailto:${studioEmail}`, description: studioEmail, action: 'Write to the studio' }] : []),
  ...(studioDiscord ? [{ name: 'Discord', href: studioDiscord, description: 'Talk games, share feedback, and compare notes.', action: 'Join the conversation' }] : []),
  ...(studioItchio ? [{ name: 'itch.io', href: studioItchio, description: 'Find the studio’s games and experiments.', action: 'Visit itch.io' }] : []),
]
</script>
<template>
  <div class="layout-shell contact-page">
    <header class="editorial-intro">
      <p class="eyebrow">CONTACT / AROUND THE WEB</p>
      <h1>Say hello.<br /><span class="text-accent">Compare notes.</span></h1>
      <p>A question about a game, an idea to share, or something you’re making? Here’s where to find Blich Studio.</p>
    </header>
    <section v-if="directLinks.length" class="contact-section" aria-labelledby="get-in-touch">
      <div class="section-heading">
        <p class="eyebrow">01 / GET IN TOUCH & PLAY</p>
        <h2 id="get-in-touch">Start here.</h2>
      </div>
      <div class="contact-grid">
        <a v-for="link in directLinks" :key="link.name" class="contact-card contact-card--primary" :href="link.href" :target="link.name === 'Email' ? undefined : '_blank'" :rel="link.name === 'Email' ? undefined : 'noopener noreferrer'">
          <h3>{{ link.name }} <span aria-hidden="true">↗</span></h3>
          <p>{{ link.description }}</p>
          <span class="contact-action">{{ link.action }} <span v-if="link.name !== 'Email'" class="sr-only">(opens in a new tab)</span></span>
        </a>
      </div>
    </section>
    <section class="contact-section" aria-labelledby="follow-the-work">
      <div class="section-heading">
        <p class="eyebrow">02 / FOLLOW THE WORK</p>
        <h2 id="follow-the-work">Elsewhere in the studio.</h2>
      </div>
      <div class="contact-grid">
        <a v-for="link in studioSocialLinks" :key="link.name" class="contact-card" :href="link.href" target="_blank" rel="noopener noreferrer">
          <h3>{{ link.name }} <span aria-hidden="true">↗</span></h3>
          <p>{{ link.description }}</p>
          <span class="contact-action">Visit {{ link.name }}<span class="sr-only"> (opens in a new tab)</span></span>
        </a>
        <a class="contact-card" href="/feed.xml">
          <h3>RSS <span aria-hidden="true">↗</span></h3>
          <p>Development notes delivered to your feed reader.</p>
          <span class="contact-action">Follow the workshop</span>
        </a>
      </div>
    </section>
  </div>
</template>
<style scoped>
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
.contact-section { border-top: 1px solid var(--border); padding: 2.5rem 0; }
.section-heading { margin-bottom: 2rem; }
h2 { font-size: clamp(1.8rem, 4vw, 3rem); }
.contact-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; }
.contact-card { display: flex; flex-direction: column; gap: 1rem; padding: 1.75rem; background: var(--card); border: 1px solid var(--border); }
.contact-card--primary { border-top: 3px solid var(--primary); }
.contact-card:hover { border-color: var(--primary); }
.contact-card h3 { display: flex; justify-content: space-between; gap: 1rem; font-size: 1.55rem; }
.contact-card h3 span { color: var(--primary); }
.contact-card p { margin: 0; color: var(--muted-foreground); overflow-wrap: anywhere; }
.contact-action { margin-top: auto; padding-top: 1rem; color: var(--primary); font-size: 0.9rem; }
@media (max-width: 900px) { .contact-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 600px) { .contact-grid { grid-template-columns: minmax(0, 1fr); } .contact-card { padding: 1.5rem; } }
</style>
