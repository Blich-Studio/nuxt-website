<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import Skeleton from '~/components/ui/Skeleton.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import CommentSection from '~/components/CommentSection.vue'

interface Project {
  id: string
  title: string
  description: string
  thumbnail?: string
  tags: string[]
  likes: number
  releaseDate: string
  content: string
}

const route = useRoute()
const id = (route.params.id as string) || '1'

const project = ref<Project | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Mock lookup - will be replaced with real API
const mockProjects: Record<string, Project> = {
  '1': { id: '1', title: 'Desert Wanderer', description: 'An open-world adventure game set in a vast desert landscape', thumbnail: '/desert-game-landscape.jpg', tags: ['Action', 'Adventure', 'Open World'], likes: 245, releaseDate: '2024-12', content: 'Desert Wanderer is our flagship open-world adventure game that takes players on an epic journey across vast, sun-scorched landscapes. With stunning visuals, deep exploration mechanics, and a rich narrative, players discover ancient mysteries buried beneath the sands.' },
  '2': { id: '2', title: 'Sunset Chronicles', description: 'A heartwarming animated short about finding home', thumbnail: '/animated-sunset-scene.jpg', tags: ['Drama', 'Family', 'Short Film'], likes: 189, releaseDate: '2024-11', content: 'Sunset Chronicles tells the touching story of a traveler searching for home. Through beautiful hand-painted animation and an evocative soundtrack, we explore themes of belonging, memory, and the places that shape us.' },
}

onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Simulate API call - replace with real fetch
    await new Promise((r) => setTimeout(r, 500))
    
    const fetchedProject = mockProjects[id]
    if (fetchedProject) {
      project.value = fetchedProject
    } else {
      error.value = 'not_found'
    }
  } catch (e) {
    error.value = 'error'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.container">
      <!-- Loading State -->
      <template v-if="isLoading">
        <div :class="$style.loadingState">
          <Skeleton variant="text" width="60%" height="2.5rem" />
          <Skeleton variant="text" width="30%" height="1rem" :class="$style.loadingMeta" />
          <Skeleton variant="image" height="400px" :class="$style.loadingImage" />
          <Skeleton variant="text" :lines="4" :class="$style.loadingContent" />
          <div :class="$style.loadingTags">
            <Skeleton variant="rectangular" width="80px" height="24px" />
            <Skeleton variant="rectangular" width="100px" height="24px" />
            <Skeleton variant="rectangular" width="90px" height="24px" />
          </div>
        </div>
      </template>

      <!-- Not Found State -->
      <template v-else-if="error === 'not_found'">
        <EmptyState
          icon="lucide:folder-x"
          title="Project Not Found"
          description="The project you're looking for doesn't exist or may have been removed."
          action-label="Browse All Projects"
          action-to="/projects"
        />
      </template>

      <!-- Error State -->
      <template v-else-if="error">
        <EmptyState
          icon="lucide:alert-circle"
          title="Something Went Wrong"
          description="We couldn't load this project. Please try again later."
          action-label="Go Back"
          action-to="/projects"
        />
      </template>

      <!-- Project Content -->
      <template v-else-if="project">
        <div :class="$style.projectSection">
          <h1 :class="$style.title">{{ project.title }}</h1>
          <div :class="$style.meta">{{ new Date(project.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) }} • {{ project.likes }} likes</div>
          <div :class="$style.imageWrapper">
            <img :src="project.thumbnail" :alt="project.title" :class="$style.image" />
          </div>
          <div :class="$style.prose">
            <p>{{ project.description }}</p>
            <p>{{ project.content }}</p>
          </div>

          <div :class="$style.tagsSection">
            <div :class="$style.tagsList">
              <Badge v-for="tag in project.tags" :key="tag" variant="secondary">{{ tag }}</Badge>
            </div>
          </div>
        </div>

        <CommentSection content-type="project" :content-id="id" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../assets/styles/variables' as *;

.page {
  min-height: 100vh;
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem;
}

.loadingState {
  padding: 2rem 0;
}

.loadingMeta {
  margin-top: 0.75rem;
}

.loadingImage {
  margin-top: 1.5rem;
}

.loadingContent {
  margin-top: 1.5rem;
}

.loadingTags {
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.projectSection {
  margin-bottom: 2rem;
}

.title {
  font-family: $font-display;
  font-size: $text-4xl;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.meta {
  color: $color-muted-foreground;
  font-size: $text-sm;
  margin-bottom: 1rem;
}

.imageWrapper {
  margin-bottom: 1.5rem;
}

.image {
  width: 100%;
  height: auto;
  border-radius: 0.75rem;
  object-fit: cover;
}

.prose {
  line-height: 1.75;
  color: $color-foreground;

  p {
    margin-bottom: 1rem;
  }
}

.tagsSection {
  margin-top: 1.5rem;
}

.tagsList {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
