<script setup lang="ts">
import type { ProjectChannel, ProjectListItem, ProjectPlatform } from '~/types/api'

const props = defineProps<{
  channel: ProjectChannel
  eyebrow: string
  title: string
  description: string
  tags: string[]
  streamCopy?: string
}>()

const itemAccent = useRandomItemAccent()
const { getProjects } = useProjects()

const platformLabels: Record<ProjectPlatform, string> = {
  soundcloud: 'SoundCloud',
  youtube: 'YouTube',
  dailymotion: 'Dailymotion',
  vimeo: 'Vimeo',
  peertube: 'PeerTube',
  itchio: 'itch.io',
  steam: 'Steam',
  internet_archive: 'Internet Archive',
  github: 'GitHub',
  codeberg: 'Codeberg',
  other: 'External',
}

const { data, pending, error } = await useAsyncData(`channel:${props.channel}`, async () => {
  try {
    return await getProjects({ channel: props.channel }, { limit: 48, sort: 'publishedAt' })
  } catch {
    return await getProjects({}, { limit: 100, sort: 'publishedAt' })
  }
})

const projects = computed(() => {
  const items = data.value?.projects ?? []
  return items.filter(project => project.channel === props.channel)
})

const primaryHref = (project: ProjectListItem) =>
  project.externalUrl ||
  project.itchioUrl ||
  project.steamUrl ||
  project.youtubeUrl ||
  project.githubUrl ||
  `/projects/${project.slug}`

const platformLabel = (project: ProjectListItem) =>
  project.platform ? platformLabels[project.platform] : 'Project'
</script>

<template>
  <div :class="['channel-page', `channel-page--${channel}`]">
    <section class="channel-hero">
      <p class="eyebrow">{{ eyebrow }}</p>
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      <div class="tag-row">
        <span v-for="tag in tags" :key="tag" :style="itemAccent(channel + ':' + tag)">
          {{ tag }}
        </span>
      </div>
    </section>

    <section v-if="streamCopy" class="stream-strip">
      <div>
        <p class="eyebrow">LIVE SIGNAL</p>
        <h2>Stream slot armed.</h2>
      </div>
      <p>{{ streamCopy }}</p>
    </section>

    <section class="project-wall">
      <div class="wall-header">
        <p class="eyebrow">CHANNEL INDEX</p>
        <span>{{ projects.length.toString().padStart(2, '0') }} objects</span>
      </div>

      <div v-if="pending" class="empty-state">tuning signal...</div>
      <div v-else-if="error" class="empty-state">signal failed, archive remains.</div>
      <div v-else-if="projects.length === 0" class="empty-state">
        No public {{ channel }} releases yet. Add channel metadata in the CMS to light this page up.
      </div>
      <div v-else class="project-grid">
        <article v-for="project in projects" :key="project.id" class="project-tile">
          <NuxtLink :to="`/projects/${project.slug}`" class="tile-cover">
            <img v-if="project.coverImageUrl" :src="project.coverImageUrl" :alt="project.title">
            <span v-else>{{ project.type }}</span>
          </NuxtLink>
          <div class="tile-body">
            <div class="tile-meta">
              <span>{{ platformLabel(project) }}</span>
              <span v-if="project.license">{{ project.license }}</span>
            </div>
            <h2>
              <NuxtLink :to="`/projects/${project.slug}`">{{ project.title }}</NuxtLink>
            </h2>
            <p v-if="project.shortDescription">{{ project.shortDescription }}</p>
            <div class="tile-actions">
              <a :href="primaryHref(project)" target="_blank" rel="noopener noreferrer">
                Open
                <Icon name="lucide:external-link" />
              </a>
              <a
                v-if="project.archiveUrl"
                :href="project.archiveUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mirror
                <Icon name="lucide:archive" />
              </a>
            </div>
          </div>
          <iframe
            v-if="project.embedUrl"
            class="tile-embed"
            :src="project.embedUrl"
            :title="project.title"
            loading="lazy"
            allow="autoplay; fullscreen; picture-in-picture"
          />
        </article>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.channel-page {
  min-height: 100vh;
  padding: 8rem 1rem 5rem;
  background:
    repeating-linear-gradient(135deg, color-mix(in oklch, var(--foreground) 4%, transparent) 0 1px, transparent 1px 18px),
    linear-gradient(110deg, color-mix(in oklch, var(--accent-primary) 14%, transparent), transparent 34%),
    var(--background);
}

.channel-page--sound {
  background:
    repeating-linear-gradient(90deg, color-mix(in oklch, var(--accent-primary) 14%, transparent) 0 2px, transparent 2px 18px),
    repeating-linear-gradient(0deg, transparent 0 21px, color-mix(in oklch, var(--foreground) 5%, transparent) 21px 22px),
    linear-gradient(118deg, color-mix(in oklch, var(--accent-secondary) 18%, transparent), transparent 42%),
    var(--background);
}

.channel-page--motion {
  background:
    repeating-linear-gradient(0deg, color-mix(in oklch, var(--foreground) 5%, transparent) 0 1px, transparent 1px 42px),
    repeating-linear-gradient(90deg, color-mix(in oklch, var(--accent-primary) 10%, transparent) 0 1px, transparent 1px 64px),
    linear-gradient(132deg, color-mix(in oklch, var(--accent-secondary) 16%, transparent), transparent 38%),
    var(--background);
}

.channel-page--play {
  background:
    linear-gradient(90deg, color-mix(in oklch, var(--accent-primary) 16%, transparent) 0 10%, transparent 10% 100%),
    repeating-linear-gradient(90deg, transparent 0 15px, color-mix(in oklch, var(--foreground) 5%, transparent) 15px 16px),
    repeating-linear-gradient(0deg, transparent 0 15px, color-mix(in oklch, var(--accent-secondary) 8%, transparent) 15px 16px),
    linear-gradient(315deg, color-mix(in oklch, var(--accent-secondary) 14%, transparent), transparent 45%),
    var(--background);
}

.channel-hero,
.stream-strip,
.project-wall {
  width: min(100%, 80rem);
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--accent-primary);
  text-transform: uppercase;
}

h1 {
  max-width: 12ch;
  font-size: clamp(4rem, 10vw, 8rem);
  line-height: 0.9;
  letter-spacing: 0;
  text-transform: uppercase;
  color: var(--foreground);
  filter: drop-shadow(0.05em 0.05em 0 color-mix(in oklch, var(--accent-secondary) 72%, transparent));
}

.channel-hero p {
  max-width: 44rem;
  color: var(--muted-foreground);
  font-size: 1.2rem;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 2rem;
}

.tag-row span {
  border: 1px solid currentColor;
  padding: 0.35rem 0.55rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
}

.stream-strip {
  display: grid;
  gap: 1rem;
  margin-top: 4rem;
  padding: 1rem;
  border-block: 2px solid var(--accent-primary);
  background:
    repeating-linear-gradient(90deg, color-mix(in oklch, var(--accent-primary) 24%, transparent) 0 1px, transparent 1px 14px),
    var(--card);

  @media (min-width: 760px) {
    grid-template-columns: 18rem 1fr;
    align-items: end;
  }
}

.stream-strip h2 {
  margin: 0;
  font-size: clamp(2rem, 6vw, 4rem);
  text-transform: uppercase;
}

.stream-strip p:last-child {
  margin: 0;
  color: var(--muted-foreground);
}

.project-wall {
  margin-top: 5rem;
}

.wall-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid color-mix(in oklch, var(--foreground) 24%, transparent);
  margin-bottom: 1rem;
  font-family: var(--font-mono);
  text-transform: uppercase;
}

.project-grid {
  display: grid;
  gap: 1rem;

  @media (min-width: 760px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.project-tile {
  display: grid;
  border: 2px solid color-mix(in oklch, var(--foreground) 18%, transparent);
  background: var(--card);
}

.tile-cover {
  display: grid;
  min-height: 12rem;
  overflow: hidden;
  place-items: center;
  background: color-mix(in oklch, var(--accent-secondary) 12%, transparent);
  color: var(--accent-primary);
  font-family: var(--font-mono);
  text-transform: uppercase;
}

.tile-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.tile-body {
  padding: 1rem;
}

.tile-meta,
.tile-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
}

.tile-meta span {
  border: 1px solid color-mix(in oklch, var(--foreground) 28%, transparent);
  padding: 0.25rem 0.4rem;
}

.project-tile h2 {
  margin: 1rem 0 0;
  font-size: clamp(1.7rem, 4vw, 3.2rem);
  line-height: 0.95;
  text-transform: uppercase;
}

.project-tile h2 a {
  color: var(--foreground);
}

.project-tile p {
  color: var(--muted-foreground);
}

.tile-actions a {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  color: var(--accent-primary);
}

.tile-embed {
  width: 100%;
  min-height: 10rem;
  border: 0;
  border-top: 1px solid color-mix(in oklch, var(--foreground) 18%, transparent);
}

.empty-state {
  min-height: 14rem;
  display: grid;
  place-items: center;
  border: 2px dashed color-mix(in oklch, var(--foreground) 22%, transparent);
  color: var(--muted-foreground);
  font-family: var(--font-mono);
  text-align: center;
  text-transform: uppercase;
}
</style>
