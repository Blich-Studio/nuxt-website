<script setup lang="ts">
import { computed } from 'vue'
import type { ArticleListItem, ProjectListItem } from '~/types/api'

const { getFeaturedProjects } = useProjects()
const { getArticles } = useArticles()
const itemAccent = useRandomItemAccent()

const streamUrl = ''

const { data: featuredProjects } = await useAsyncData('home-featured-projects', () => getFeaturedProjects(4), {
  default: () => [] as ProjectListItem[],
})

const { data: articlesData } = await useAsyncData('home-featured-articles', () => getArticles(undefined, { limit: 3 }), {
  default: () => ({ articles: [] as ArticleListItem[], meta: {} }),
})

const featuredArticles = computed(() => articlesData.value.articles)
const isLive = computed(() => streamUrl.length > 0)

const signalTags = ['analog synths', 'drum machines', 'tribe', 'analog techno', 'handmade motion', 'artsy games']

const channels = [
  {
    title: 'Sound',
    href: '/sound',
    icon: 'lucide:radio',
    kicker: 'machines / pressure / repetition',
    description: 'Analog synth sketches, drum machine patterns, tribe and analog techno experiments, sound design fragments, and live set notes.',
  },
  {
    title: 'Motion',
    href: '/motion',
    icon: 'lucide:scan-line',
    kicker: 'drawn / filmed / assembled',
    description: 'Hand-drawn animation, stop motion tests, loops, character studies, scanned marks, and frame-by-frame process.',
  },
  {
    title: 'Play',
    href: '/play',
    icon: 'lucide:gamepad-2',
    kicker: 'weird systems / playable art',
    description: 'Small games, prototypes, mechanics, worlds, and interactive pieces that keep one foot in the sketchbook.',
  },
]

const typeLabels: Record<string, string> = {
  game: 'PLAY',
  engine: 'SYSTEM',
  tool: 'TOOL',
  animation: 'MOTION',
  artwork: 'VISUAL',
  other: 'WORK',
}

function getProjectTag(project: ProjectListItem): string {
  return typeLabels[project.type] || 'WORK'
}

function getArticleTag(article: ArticleListItem): string {
  return article.tags?.[0]?.name?.toUpperCase() || 'NOTE'
}
</script>

<template>
  <div class="page">
    <section class="hero">
      <div class="hero-noise" />
      <div class="marquee marquee-top" aria-hidden="true">
        <span>NO MENU FOR NORMALITY / LIVE SIGNAL / ANALOG TECHNO / FRAME DAMAGE / PLAYABLE ART / </span>
        <span>NO MENU FOR NORMALITY / LIVE SIGNAL / ANALOG TECHNO / FRAME DAMAGE / PLAYABLE ART / </span>
      </div>
      <div class="side-rail" aria-hidden="true">BLICH COLLECTIVE 2026 / PRAGUE / LOW FREQUENCY OBJECTS</div>
      <div class="hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">BLICH COLLECTIVE / CURRENT SIGNAL</p>
          <h1 class="hero-title" aria-label="Analog noise, handmade motion, weird games.">
            <span aria-hidden="true">Analog</span>
            <span aria-hidden="true">noise,</span>
            <span aria-hidden="true">handmade</span>
            <span aria-hidden="true">motion,</span>
            <span aria-hidden="true">weird games.</span>
          </h1>
          <p class="hero-text">
            A living archive for sound system experiments, drawn and filmed animation, artsy indie games, and the notes that leak out between them.
          </p>
          <div class="hero-actions">
            <NuxtLink to="/projects" class="button button-primary">
              Archive
              <Icon name="lucide:arrow-up-right" class="button-icon" />
            </NuxtLink>
            <NuxtLink to="/sound" class="button button-ghost">
              Tune In
              <Icon name="lucide:radio" class="button-icon" />
            </NuxtLink>
          </div>
        </div>

        <aside class="signal-board" aria-label="Blich signal status">
          <p class="board-stamp">UNLICENSED MOOD</p>
          <div class="signal-row">
            <span>MODE</span>
            <strong>COLLECTIVE</strong>
          </div>
          <div class="signal-row">
            <span>COLOR</span>
            <strong>RANDOMIZED</strong>
          </div>
          <div class="signal-row">
            <span>PARTY</span>
            <strong>HIDDEN</strong>
          </div>
          <div class="meter" aria-hidden="true">
            <span v-for="bar in 18" :key="bar" :style="{ '--delay': `${bar * 38}ms` }" />
          </div>
          <code>patch://blich/signal/random-color/live-slot-null</code>
        </aside>
      </div>

      <div class="tag-strip" aria-label="Creative disciplines">
        <span v-for="tag in signalTags" :key="tag" :style="itemAccent('signal:' + tag)">{{ tag }}</span>
      </div>
      <div class="marquee marquee-bottom" aria-hidden="true">
        <span>FIELD NOTES / PARTY HIDDEN / SYNTH TABLE / STOP MOTION / BROKEN UI AS A FEATURE / </span>
        <span>FIELD NOTES / PARTY HIDDEN / SYNTH TABLE / STOP MOTION / BROKEN UI AS A FEATURE / </span>
      </div>
    </section>

    <section class="section live-section">
      <div class="section-head">
        <p class="eyebrow">LIVE SIGNAL</p>
        <h2>Broadcast-ready, even when the room is quiet.</h2>
      </div>
      <div class="live-grid">
        <div class="live-player" :class="{ 'is-live': isLive }">
          <div class="scanline" aria-hidden="true" />
          <div class="live-status">
            <span class="status-dot" />
            {{ isLive ? 'ON AIR' : 'OFFLINE / PATCHING' }}
          </div>
          <audio v-if="isLive" :src="streamUrl" controls />
          <div v-else class="offline-panel">
            <Icon name="lucide:radio-receiver" class="offline-icon" />
            <p>Future slot for live analog sets, production sessions, animation desk streams, or party transmissions.</p>
          </div>
        </div>
        <div class="live-copy">
          <p>
            The site can host a real stream later: Owncast, YouTube Live, Twitch, Icecast, or AzuraCast. For now the section is designed into the page so the live layer has a home when you are ready to plug it in.
          </p>
          <NuxtLink to="/sound" class="text-link">
            Sound archive <Icon name="lucide:arrow-right" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="section channel-section">
      <div class="section-head">
        <p class="eyebrow">CHANNELS</p>
        <h2>One collective, several forms of noise.</h2>
      </div>
      <div class="channel-grid">
        <NuxtLink v-for="channel in channels" :key="channel.title" :to="channel.href" class="channel-card">
          <Icon :name="channel.icon" class="channel-icon" />
          <p class="channel-kicker">{{ channel.kicker }}</p>
          <h3>{{ channel.title }}</h3>
          <p>{{ channel.description }}</p>
          <span class="corner-code">0{{ channels.indexOf(channel) + 1 }}</span>
        </NuxtLink>
      </div>
    </section>

    <section class="section archive-section">
      <div class="section-head section-head-row">
        <div>
          <p class="eyebrow">ARCHIVE</p>
          <h2>Recent work from the desk, screen, and floor.</h2>
        </div>
        <NuxtLink to="/projects" class="text-link">
          Full archive <Icon name="lucide:arrow-right" />
        </NuxtLink>
      </div>

      <div v-if="featuredProjects.length === 0" class="empty-state">
        <Icon name="lucide:folder-open" />
        <p>No archive entries published yet.</p>
      </div>

      <div v-else class="work-grid">
        <NuxtLink v-for="project in featuredProjects" :key="project.id" :to="`/projects/${project.slug}`" class="work-card">
          <img :src="project.coverImageUrl || '/placeholder.svg'" :alt="project.title" />
          <div class="work-card-content">
            <span :style="itemAccent('project:' + project.id)">{{ getProjectTag(project) }}</span>
            <h3>{{ project.title }}</h3>
            <p v-if="project.shortDescription">{{ project.shortDescription }}</p>
          </div>
        </NuxtLink>
      </div>
    </section>

    <section class="section notes-section">
      <div class="section-head section-head-row">
        <div>
          <p class="eyebrow">NOTES</p>
          <h2>Devlogs, sound logs, process scraps.</h2>
        </div>
        <NuxtLink to="/blog" class="text-link">
          All notes <Icon name="lucide:arrow-right" />
        </NuxtLink>
      </div>

      <div v-if="featuredArticles.length === 0" class="empty-state">
        <Icon name="lucide:notebook-text" />
        <p>No notes published yet.</p>
      </div>

      <div v-else class="notes-grid">
        <NuxtLink v-for="article in featuredArticles" :key="article.id" :to="`/blog/${article.slug}`" class="note-card">
          <span :style="itemAccent('article:' + article.id)">{{ getArticleTag(article) }}</span>
          <h3>{{ article.title }}</h3>
          <p>{{ article.perex }}</p>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  overflow: hidden;
  background:
    repeating-linear-gradient(135deg, color-mix(in oklch, var(--foreground) 4%, transparent) 0 1px, transparent 1px 18px),
    var(--background);
}

.hero {
  position: relative;
  min-height: 100vh;
  padding: 9rem 1rem 6.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background:
    linear-gradient(90deg, color-mix(in oklch, var(--accent-primary) 20%, transparent) 0 12%, transparent 12% 100%),
    repeating-linear-gradient(0deg, transparent 0 22px, color-mix(in oklch, var(--foreground) 6%, transparent) 22px 23px),
    linear-gradient(300deg, color-mix(in oklch, var(--accent-secondary) 22%, transparent), transparent 46%),
    var(--background);
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in oklch, var(--foreground) 8%, transparent) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom, black, transparent 72%);
  pointer-events: none;
}

.hero-noise {
  position: absolute;
  inset: 0;
  opacity: 0.32;
  background-image:
    radial-gradient(circle at 20% 30%, var(--accent-primary) 0 1px, transparent 1px),
    radial-gradient(circle at 70% 60%, var(--accent-secondary) 0 1px, transparent 1px);
  background-size: 7px 7px, 11px 11px;
  mix-blend-mode: difference;
  pointer-events: none;
}

.marquee {
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  overflow: hidden;
  border-block: 2px solid var(--accent-primary);
  background: var(--accent-primary);
  color: var(--accent-primary-on);
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: 0.8rem;
  text-transform: uppercase;
  z-index: 2;
}

.marquee span {
  min-width: max-content;
  padding: 0.4rem 0;
  animation: crawl 18s linear infinite;
}

.marquee-top {
  top: 5rem;
  transform: rotate(-1deg) scaleX(1.02);
}

.marquee-bottom {
  bottom: 1.25rem;
  transform: rotate(1deg) scaleX(1.02);
  background: var(--accent-secondary);
  color: var(--accent-secondary-on);
  border-color: var(--accent-secondary);
}

.side-rail {
  position: absolute;
  left: 0.35rem;
  top: 9rem;
  writing-mode: vertical-rl;
  color: var(--accent-secondary);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0;
  z-index: 2;
}

.hero-grid {
  width: min(100%, 80rem);
  margin: 0 auto;
  display: grid;
  gap: 2rem;
  align-items: end;
  position: relative;
  z-index: 1;

  @media (min-width: 900px) {
    grid-template-columns: minmax(0, 1fr) 22rem;
  }
}

.hero-copy h1 {
  max-width: 13ch;
  font-size: clamp(3.6rem, 10vw, 9.5rem);
  line-height: 0.78;
  letter-spacing: 0;
  text-transform: uppercase;
  filter: drop-shadow(0.08em 0.08em 0 color-mix(in oklch, var(--accent-secondary) 72%, transparent));
}

.hero-title span {
  display: block;
  width: fit-content;
}

.hero-title span:nth-child(2) {
  color: var(--accent-primary);
  transform: translateX(0.35em) rotate(-2deg);
}

.hero-title span:nth-child(3) {
  -webkit-text-stroke: 2px var(--foreground);
  color: transparent;
}

.hero-title span:nth-child(4) {
  transform: translateX(0.75em);
}

.hero-title span:nth-child(5) {
  background: var(--accent-secondary);
  color: var(--accent-secondary-on);
  padding: 0 0.1em 0.06em;
  transform: rotate(1.5deg);
}

.eyebrow {
  margin: 0 0 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--accent-primary);
  text-transform: uppercase;
}

.hero-text {
  max-width: 44rem;
  margin: 2rem 0 0;
  color: color-mix(in oklch, var(--foreground) 86%, var(--muted-foreground));
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  border-left: 0.75rem solid var(--accent-primary);
  padding-left: 1rem;
  background: color-mix(in oklch, var(--background) 74%, transparent);
}

.hero-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 2rem;
}

.button,
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
}

.button {
  min-height: 2.875rem;
  padding: 0.75rem 1rem;
  border: 2px solid var(--accent-primary);
  text-transform: uppercase;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  transform: skew(-8deg);
  box-shadow: 0.35rem 0.35rem 0 color-mix(in oklch, var(--accent-secondary) 80%, transparent);
}

.button > * {
  transform: skew(8deg);
}

.button-primary {
  color: var(--accent-primary-on);
  background: var(--accent-primary);
}

.button-ghost {
  color: var(--foreground);
  background: color-mix(in oklch, var(--background) 72%, transparent);
}

.button-icon,
.text-link svg {
  width: 1rem;
  height: 1rem;
}

.signal-board {
  border: 2px solid color-mix(in oklch, var(--foreground) 22%, transparent);
  background:
    linear-gradient(135deg, color-mix(in oklch, var(--accent-secondary) 18%, transparent) 0 18%, transparent 18%),
    color-mix(in oklch, var(--background) 80%, transparent);
  backdrop-filter: blur(12px);
  padding: 1rem;
  transform: rotate(2deg);
  box-shadow: -0.5rem 0.5rem 0 var(--accent-primary);
  position: relative;
}

.board-stamp {
  display: inline-block;
  margin: 0 0 1rem;
  padding: 0.25rem 0.4rem;
  border: 2px solid var(--accent-secondary);
  color: var(--accent-secondary);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  transform: rotate(-6deg);
}

.signal-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid color-mix(in oklch, var(--foreground) 16%, transparent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
}

.signal-board code {
  display: block;
  margin-top: 1rem;
  color: var(--muted-foreground);
  font-size: 0.7rem;
  word-break: break-all;
}

.signal-row span {
  color: var(--muted-foreground);
}

.meter {
  display: grid;
  grid-template-columns: repeat(18, 1fr);
  gap: 0.25rem;
  height: 6rem;
  align-items: end;
  margin-top: 1rem;
}

.meter span {
  height: 20%;
  background: var(--accent-primary);
  animation: pulse 920ms infinite alternate;
  animation-delay: var(--delay);
}

.tag-strip {
  width: min(100%, 80rem);
  margin: 5rem auto 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  position: relative;
  z-index: 3;
}

.tag-strip span,
.work-card-content span,
.note-card span {
  border: 1px solid currentColor;
  padding: 0.35rem 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  transform: rotate(var(--tag-tilt, -1deg));
}

.section {
  padding: 6rem 1rem;
  position: relative;
}

.section::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 0.5rem;
  background: var(--accent-primary);
  opacity: 0.8;
}

.section-head {
  width: min(100%, 80rem);
  margin: 0 auto 2rem;
}

.section-head h2 {
  max-width: 14ch;
  font-size: clamp(2.5rem, 6vw, 5rem);
  line-height: 0.95;
}

.section-head-row {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.live-grid,
.channel-grid,
.work-grid,
.notes-grid {
  width: min(100%, 80rem);
  margin: 0 auto;
}

.live-grid {
  display: grid;
  gap: 1rem;

  @media (min-width: 850px) {
    grid-template-columns: 1.35fr 0.65fr;
  }
}

.live-player,
.live-copy,
.channel-card,
.note-card {
  border: 2px solid color-mix(in oklch, var(--foreground) 22%, transparent);
  background:
    repeating-linear-gradient(90deg, color-mix(in oklch, var(--foreground) 5%, transparent) 0 1px, transparent 1px 16px),
    var(--card);
}

.live-player {
  min-height: 20rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  transform: rotate(-0.8deg);
}

.scanline {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent 0 8px, color-mix(in oklch, var(--accent-primary) 12%, transparent) 8px 10px);
  pointer-events: none;
  mix-blend-mode: screen;
}

.live-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-mono);
  color: var(--accent-primary);
  font-size: 0.8rem;
}

.status-dot {
  width: 0.75rem;
  height: 0.75rem;
  background: var(--accent-primary);
  border-radius: 50%;
  box-shadow: 0 0 1rem var(--accent-primary);
}

.offline-panel {
  flex: 1;
  display: grid;
  place-items: center;
  text-align: center;
  color: var(--muted-foreground);
}

.offline-icon {
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  color: var(--accent-secondary);
}

.live-copy {
  padding: 1.25rem;
  color: var(--muted-foreground);
}

.text-link {
  color: var(--accent-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
  font-size: 0.8rem;
}

.channel-grid,
.notes-grid {
  display: grid;
  gap: 1rem;

  @media (min-width: 760px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.channel-card,
.note-card {
  min-height: 18rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.channel-card:hover,
.note-card:hover {
  transform: translateY(-4px) rotate(-1.5deg);
  border-color: var(--accent-primary);
}

.channel-card:nth-child(odd) {
  transform: rotate(-1deg);
}

.channel-card:nth-child(even) {
  transform: rotate(1deg);
}

.corner-code {
  position: absolute;
  right: 0.75rem;
  top: 0.75rem;
  color: color-mix(in oklch, var(--accent-primary) 62%, transparent);
  font-family: var(--font-display);
  font-size: 3rem;
  line-height: 1;
}

.channel-icon {
  width: 2rem;
  height: 2rem;
  color: var(--accent-secondary);
}

.channel-kicker,
.note-card p,
.work-card-content p {
  color: var(--muted-foreground);
}

.channel-card h3,
.note-card h3 {
  font-size: 2rem;
}

.work-grid {
  display: grid;
  gap: 1rem;

  @media (min-width: 760px) {
    grid-template-columns: repeat(4, 1fr);
  }
}

.work-card {
  min-height: 24rem;
  position: relative;
  overflow: hidden;
  background: var(--card);
  border: 2px solid color-mix(in oklch, var(--foreground) 16%, transparent);
  clip-path: polygon(0 0, 100% 0.75rem, calc(100% - 0.75rem) 100%, 0.5rem calc(100% - 0.25rem));
}

.work-card:first-child {
  @media (min-width: 760px) {
    grid-column: span 2;
  }
}

.work-card img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: contrast(1.15) saturate(0.85);
  transition: transform 0.4s ease;
}

.work-card:hover img {
  transform: scale(1.04);
}

.work-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, color-mix(in oklch, var(--foreground) 7%, transparent) 0 1px, transparent 1px 10px),
    linear-gradient(to top, color-mix(in oklch, var(--background) 94%, transparent), transparent);
}

.work-card-content {
  position: absolute;
  inset: auto 0 0;
  z-index: 1;
  padding: 1rem;
}

.work-card-content h3 {
  margin-top: 1rem;
  font-size: 1.65rem;
}

.empty-state {
  width: min(100%, 80rem);
  margin: 0 auto;
  padding: 3rem;
  display: grid;
  place-items: center;
  gap: 1rem;
  text-align: center;
  color: var(--muted-foreground);
  border: 2px dashed color-mix(in oklch, var(--foreground) 18%, transparent);
}

.empty-state svg {
  width: 2rem;
  height: 2rem;
}

@keyframes pulse {
  from {
    height: 18%;
    background: var(--accent-primary);
  }
  to {
    height: 100%;
    background: var(--accent-secondary);
  }
}

@keyframes crawl {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}

@media (max-width: 720px) {
  .side-rail {
    display: none;
  }

  .hero-title span:nth-child(2),
  .hero-title span:nth-child(4),
  .hero-title span:nth-child(5) {
    transform: none;
  }

  .signal-board,
  .live-player,
  .channel-card:nth-child(odd),
  .channel-card:nth-child(even) {
    transform: none;
  }
}
</style>
