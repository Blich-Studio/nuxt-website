<script setup lang="ts">
import { ref, computed } from 'vue'
import Button from '../../components/ui/Button.vue'
import Badge from '../../components/ui/Badge.vue'
import EmptyState from '../../components/ui/EmptyState.vue'
import { useRouter } from 'vue-router'
import type { ProjectListItem } from '~/types/api'

// Display format for projects
interface DisplayProject {
  id: string
  slug: string
  title: string
  type: string
  description: string
  thumbnail?: string
  tags: string[]
  likes: number
  publishedAt: string
  featured: boolean
}

const typeLabels: Record<string, string> = {
  game: 'Game',
  engine: 'Engine',
  tool: 'Tool',
  animation: 'Animation',
  artwork: 'Artwork',
  other: 'Project',
}

function transformProject(project: ProjectListItem): DisplayProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    type: project.type,
    description: project.shortDescription || '',
    thumbnail: project.coverImageUrl ?? undefined,
    tags: project.tags.map(t => t.name),
    likes: project.likesCount || 0,
    publishedAt: project.publishedAt || project.createdAt,
    featured: project.featured,
  }
}

const { getProjects } = useProjects()

const selectedTag = ref<string>('all')
const router = useRouter()

const { data: projectsData, error } = await useAsyncData('projects-list', async () => {
  const result = await getProjects()
  const tagSet = new Set<string>()
  result.projects.forEach(p => p.tags.forEach(t => tagSet.add(t.name)))
  return {
    projects: result.projects.map(transformProject),
    tags: Array.from(tagSet).sort(),
  }
}, {
  default: () => ({ projects: [] as DisplayProject[], tags: [] as string[] }),
})

const projects = computed(() => projectsData.value.projects)
const allTags = computed(() => projectsData.value.tags)

function setFilter(value: string) { selectedTag.value = value }
function openProject(slug: string) { router.push(`/projects/${slug}`) }
const filteredProjects = computed(() => {
  if (selectedTag.value === 'all') return projects.value
  return projects.value.filter((p) => p.tags.includes(selectedTag.value))
})
</script>

<template>
  <div :class="$style.page">
    <section :class="$style.hero">
      <div :class="$style.heroContainer">
        <h1 :class="$style.heroTitle">Our Projects</h1>
        <p :class="$style.heroSubtitle">Explore our collection of games, animations, and interactive experiences</p>
      </div>
    </section>

    <section :class="$style.filterSection">
      <div :class="$style.filterContainer">
        <div :class="$style.filterList">
          <Button 
            :variant="selectedTag === 'all' ? 'default' : 'outline'" 
            :class="[$style.filterBtn, selectedTag === 'all' && $style.filterActive]"
            @click="setFilter('all')"
          >
            <Icon name="lucide:sparkles" :class="$style.filterIcon" />
            All Projects
          </Button>
          <Button 
            v-for="tag in allTags" 
            :key="tag" 
            :variant="selectedTag === tag ? 'default' : 'outline'" 
            :class="[$style.filterBtn, selectedTag === tag && $style.filterActive]"
            @click="setFilter(tag)"
          >
            {{ tag }}
          </Button>
        </div>
      </div>
    </section>

    <section :class="$style.contentSection">
      <div :class="$style.contentContainer">
        <!-- Error State -->
        <EmptyState
          v-if="error"
          icon="lucide:alert-circle"
          title="Failed to Load Projects"
          :description="error?.message || 'Failed to load projects'"
          action-label="Try Again"
          @action="() => $router.go(0)"
        />

        <template v-else>
          <div v-if="filteredProjects.length > 0" :class="$style.projectsGrid">
            <div v-for="project in filteredProjects" :key="project.id" :class="$style.projectCard" @click="openProject(project.slug)">
              <div :class="$style.projectImageWrapper">
                <img :src="project.thumbnail || '/placeholder.svg'" :alt="project.title" :class="$style.projectImage" @error="(e) => ((e.target as HTMLImageElement).src = '/placeholder.svg')" />
                <div :class="$style.projectBadge">
                  <Badge :class="$style.typeBadge">{{ typeLabels[project.type] || 'Project' }}</Badge>
                </div>
              </div>
              <div :class="$style.projectContent">
                <h3 :class="$style.projectTitle">{{ project.title }}</h3>
                <p :class="$style.projectDescription">{{ project.description }}</p>
                <div :class="$style.projectTags">
                  <Badge v-for="tag in project.tags.slice(0,3)" :key="tag" variant="secondary" :class="$style.tagSmall">{{ tag }}</Badge>
                </div>
                <div :class="$style.projectMeta">
                  <span>{{ project.likes }} likes</span>
                  <span>{{ new Date(project.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) }}</span>
                </div>
              </div>
            </div>
          </div>

          <EmptyState
            v-else
            icon="lucide:folder-search"
            title="No projects found"
            description="No projects match the selected category. Try a different filter."
            action-label="Show All Projects"
            @action="setFilter('all')"
          />
        </template>
      </div>
    </section>
  </div>
</template>

<style lang="scss" module>
@use '../../assets/styles/variables' as *;

.page {
  min-height: 100vh;
}

.hero {
  padding: 5rem 1rem;
  background: linear-gradient(to bottom, rgba(var(--sunset-sky-rgb, 100, 150, 200), 0.2), $color-background);
}

.heroContainer {
  max-width: 80rem;
  margin: 0 auto;
  text-align: center;
}

.heroTitle {
  font-family: $font-display;
  font-size: clamp(3rem, 8vw, $text-7xl);
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-wrap: balance;
}

.heroSubtitle {
  font-size: $text-xl;
  color: $color-muted-foreground;
  max-width: 48rem;
  margin: 0 auto;
  text-wrap: balance;
}

.filterSection {
  padding: 2rem 1rem;
  border-bottom: 1px solid $color-border;
  position: sticky;
  top: 4rem;
  // Light mode: canvas tone at 95% opacity
  background-color: color-mix(in oklch, var(--canvas) 95%, transparent);
  backdrop-filter: blur(12px);
  z-index: 40;

  @media (min-width: $breakpoint-md) {
    top: 5rem;
  }
}

:global(.dark) .filterSection {
  // Dark mode: dark background
  background-color: oklch(0.12 0.015 280 / 0.95);
}

.filterContainer {
  max-width: 80rem;
  margin: 0 auto;
}

.filterList {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.filterBtn {
  white-space: nowrap;
}

.filterActive {
  background-color: var(--sunset-orange) !important;
  border-color: var(--sunset-orange) !important;
  color: white !important;

  &:hover {
    background-color: var(--sunset-deep) !important;
    border-color: var(--sunset-deep) !important;
  }
}

.filterIcon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
}

.contentSection {
  padding: 4rem 1rem;
}

.contentContainer {
  max-width: 80rem;
  margin: 0 auto;
}

.projectsGrid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: $breakpoint-lg) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.projectCard {
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: $color-card;
  border: 1px solid $color-border;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(var(--sunset-orange-rgb, 200, 100, 50), 0.5);
    box-shadow: 0 20px 25px -5px rgba(var(--sunset-orange-rgb, 200, 100, 50), 0.1);
  }

  &:hover .projectImage {
    transform: scale(1.1);
  }

  &:hover .projectTitle {
    color: var(--sunset-orange);
  }
}

.projectImageWrapper {
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  background-color: var(--muted);
}

.projectImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.projectBadge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
}

.typeBadge {
  background-color: rgba(var(--sunset-orange-rgb, 200, 100, 50), 0.9);
  color: white;
  border: none;
  text-transform: capitalize;
}

.projectContent {
  padding: 1.5rem;
}

.projectTitle {
  font-family: $font-display;
  font-size: $text-xl;
  font-weight: 700;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.projectDescription {
  color: $color-muted-foreground;
  font-size: $text-sm;
  margin-bottom: 1rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.projectTags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tagSmall {
  font-size: $text-xs;
}

.projectMeta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: $text-sm;
  color: $color-muted-foreground;
}
</style>
