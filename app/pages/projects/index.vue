<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Button from '../../components/ui/Button.vue'
import Badge from '../../components/ui/Badge.vue'
import { useRouter } from 'vue-router'

interface Project {
  id: string
  title: string
  description: string
  type: string
  thumbnail?: string
  tags: string[]
  likes: number
  releaseDate: string
}

const mockProjects: Project[] = [
  { id: '1', title: 'Desert Wanderer', description: 'An open-world adventure game set in a vast desert landscape', type: 'game', thumbnail: '/desert-game-landscape.jpg', tags: ['Action', 'Adventure', 'Open World'], likes: 245, releaseDate: '2024-12' },
  { id: '2', title: 'Sunset Chronicles', description: 'A heartwarming animated short about finding home', type: 'film', thumbnail: '/animated-sunset-scene.jpg', tags: ['Drama', 'Family', 'Short Film'], likes: 189, releaseDate: '2024-11' },
  { id: '3', title: 'Pixel Oasis', description: 'Retro-style puzzle platformer with modern mechanics', type: 'game', thumbnail: '/pixel-game-desert.jpg', tags: ['Puzzle', 'Platformer', 'Retro'], likes: 312, releaseDate: '2024-10' },
  { id: '4', title: 'Dancing Dunes', description: 'Abstract motion graphics exploring desert aesthetics', type: 'animation', thumbnail: '/abstract-desert-animation.jpg', tags: ['Motion Graphics', 'Abstract', 'Experimental'], likes: 156, releaseDate: '2024-09' },
  { id: '5', title: 'Sandstorm Legends', description: 'Multiplayer battle arena set in ancient desert ruins', type: 'game', thumbnail: '/multiplayer-desert-game.jpg', tags: ['Multiplayer', 'Action', 'Strategy'], likes: 428, releaseDate: '2024-08' },
  { id: '6', title: 'The Last Caravan', description: 'Epic animated feature about a journey across the dunes', type: 'film', thumbnail: '/caravan-film.jpg', tags: ['Adventure', 'Epic', 'Feature Film'], likes: 567, releaseDate: '2024-06' },
]

const filters = [
  { value: 'all', label: 'All Projects', icon: 'lucide:sparkles' },
  { value: 'game', label: 'Games', icon: 'lucide:gamepad-2' },
  { value: 'film', label: 'Films', icon: 'lucide:clapperboard' },
  { value: 'animation', label: 'Animations', icon: 'lucide:play' },
]

const projects = ref<Project[]>(mockProjects)
const activeFilter = ref<string>('all')
const isLoading = ref(true)
const router = useRouter()

onMounted(async () => {
  isLoading.value = true
  await new Promise((r) => setTimeout(r, 400))
  projects.value = mockProjects
  isLoading.value = false
})

function setFilter(value: string) { activeFilter.value = value }
function openProject(id: string) { router.push(`/projects/${id}`) }
const filteredProjects = () => (activeFilter.value === 'all' ? projects.value : projects.value.filter((p) => p.type === activeFilter.value))
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
            v-for="filter in filters" 
            :key="filter.value" 
            :variant="activeFilter === filter.value ? 'default' : 'outline'" 
            :class="[$style.filterBtn, activeFilter === filter.value && $style.filterActive]"
            @click="setFilter(filter.value)"
          >
            <Icon :name="filter.icon" :class="$style.filterIcon" />
            {{ filter.label }}
          </Button>
        </div>
      </div>
    </section>

    <section :class="$style.contentSection">
      <div :class="$style.contentContainer">
        <div v-if="isLoading" :class="$style.loadingGrid">
          <div v-for="i in 6" :key="i" :class="$style.skeleton" />
        </div>

        <div v-else :class="$style.projectsGrid">
          <div v-for="project in filteredProjects()" :key="project.id" :class="$style.projectCard" @click="openProject(project.id)">
            <div :class="$style.projectImageWrapper">
              <img :src="project.thumbnail || '/placeholder.svg'" :alt="project.title" :class="$style.projectImage" />
              <div :class="$style.projectBadge">
                <Badge :class="$style.typeBadge">{{ project.type }}</Badge>
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
                <span>{{ new Date(project.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!isLoading && filteredProjects().length === 0" :class="$style.emptyState">
          <p :class="$style.emptyText">No projects found in this category</p>
        </div>
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
  // Light mode: cream/beige background matching the page
  background-color: oklch(0.97 0.02 50 / 0.95);
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

.loadingGrid {
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

.skeleton {
  aspect-ratio: 16 / 9;
  background-color: var(--muted);
  border-radius: 0.75rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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

.emptyState {
  text-align: center;
  padding: 5rem 0;
}

.emptyText {
  font-size: $text-xl;
  color: $color-muted-foreground;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
