<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import Skeleton from '~/components/ui/Skeleton.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import CommentSection from '~/components/CommentSection.vue'
import type { Project as ApiProject } from '~/types/api'

interface DisplayProject {
  id: string
  slug: string
  title: string
  description: string
  thumbnail?: string
  galleryUrls: string[]
  videoUrl?: string
  externalUrl?: string
  githubUrl?: string
  tags: string[]
  likes: number
  isLiked: boolean
  publishedAt: string
  featured: boolean
}

function transformProject(project: ApiProject): DisplayProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    description: project.description,
    thumbnail: project.coverImageUrl ?? undefined,
    galleryUrls: project.galleryUrls || [],
    videoUrl: project.videoUrl ?? undefined,
    externalUrl: project.externalUrl ?? undefined,
    githubUrl: project.githubUrl ?? undefined,
    tags: project.tags.map(t => t.name),
    likes: project.likesCount || 0,
    isLiked: project.isLiked || false,
    publishedAt: project.publishedAt || project.createdAt,
    featured: project.featured,
  }
}

const { getProject, likeProject, unlikeProject } = useProjects()

const route = useRoute()
const id = (route.params.id as string) || '1'

const project = ref<DisplayProject | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isLiked = ref(false)
const likes = ref(0)

onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const result = await getProject(id)
    
    if (result) {
      project.value = transformProject(result)
      likes.value = project.value.likes
      isLiked.value = project.value.isLiked
    } else {
      error.value = 'not_found'
    }
  } catch (e: any) {
    console.error('Failed to fetch project:', e)
    error.value = e.message || 'error'
  } finally {
    isLoading.value = false
  }
})

async function handleLike() {
  if (!project.value) return
  
  try {
    if (isLiked.value) {
      const result = await unlikeProject(project.value.id)
      isLiked.value = false
      likes.value = result.likesCount
    } else {
      const result = await likeProject(project.value.id)
      isLiked.value = true
      likes.value = result.likesCount
    }
  } catch (e: any) {
    // If like fails (e.g., not logged in), show auth modal
    const { showAuthModal } = useAuth()
    showAuthModal()
  }
}
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
          <div :class="$style.meta">{{ new Date(project.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) }} • {{ likes }} likes</div>
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
