<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Badge from '~/components/ui/Badge.vue'
import Skeleton from '~/components/ui/Skeleton.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import CommentSection from '~/components/CommentSection.vue'
import type { Project as ApiProject } from '~/types/api'

interface DisplayProject {
  id: string
  slug: string
  title: string
  type: string
  description: string
  thumbnail?: string
  galleryUrls: string[]
  githubUrl?: string
  itchioUrl?: string
  steamUrl?: string
  youtubeUrl?: string
  tags: string[]
  likes: number
  isLiked: boolean
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

function transformProject(project: ApiProject): DisplayProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    type: project.type,
    description: project.description,
    thumbnail: project.coverImageUrl ?? undefined,
    galleryUrls: project.galleryUrls || [],
    githubUrl: project.githubUrl ?? undefined,
    itchioUrl: project.itchioUrl ?? undefined,
    steamUrl: project.steamUrl ?? undefined,
    youtubeUrl: project.youtubeUrl ?? undefined,
    tags: project.tags.map(t => t.name),
    likes: project.likesCount || 0,
    isLiked: project.isLiked || false,
    publishedAt: project.publishedAt || project.createdAt,
    featured: project.featured,
  }
}

const { getProject, likeProject, unlikeProject } = useProjects()
const { user, showAuthModal, initialized, fetchUser } = useAuth()

const route = useRoute()
const id = (route.params.id as string) || '1'

const project = ref<DisplayProject | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)
const isLiked = ref(false)
const likes = ref(0)
const isLiking = ref(false)

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

  // Ensure auth is initialized
  if (!initialized.value) {
    await fetchUser(true)
  }

  // Check if user is logged in
  if (!user.value?.userId) {
    showAuthModal()
    return
  }

  // Prevent double-clicks
  if (isLiking.value) return
  isLiking.value = true

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
    console.error('Failed to like project:', e)
    // If 401, show auth modal
    if (e?.statusCode === 401 || e?.response?.status === 401) {
      showAuthModal()
    }
  } finally {
    isLiking.value = false
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
          <div :class="$style.typeLabel">{{ typeLabels[project.type] || 'Project' }}</div>
          <h1 :class="$style.title">{{ project.title }}</h1>
          <div :class="$style.meta">{{ new Date(project.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) }} • {{ likes }} likes</div>

          <!-- Project Links -->
          <div v-if="project.githubUrl || project.itchioUrl || project.steamUrl || project.youtubeUrl" :class="$style.linksSection">
            <a v-if="project.githubUrl" :href="project.githubUrl" target="_blank" rel="noopener noreferrer" :class="$style.linkButton" title="View on GitHub">
              <Icon name="simple-icons:github" :class="$style.linkIcon" />
              <span>GitHub</span>
            </a>
            <a v-if="project.itchioUrl" :href="project.itchioUrl" target="_blank" rel="noopener noreferrer" :class="$style.linkButton" title="View on itch.io">
              <Icon name="simple-icons:itchdotio" :class="$style.linkIcon" />
              <span>itch.io</span>
            </a>
            <a v-if="project.steamUrl" :href="project.steamUrl" target="_blank" rel="noopener noreferrer" :class="$style.linkButton" title="View on Steam">
              <Icon name="simple-icons:steam" :class="$style.linkIcon" />
              <span>Steam</span>
            </a>
            <a v-if="project.youtubeUrl" :href="project.youtubeUrl" target="_blank" rel="noopener noreferrer" :class="$style.linkButton" title="Watch on YouTube">
              <Icon name="simple-icons:youtube" :class="$style.linkIcon" />
              <span>YouTube</span>
            </a>
          </div>
          <div :class="$style.imageWrapper">
            <img :src="project.thumbnail || '/placeholder.svg'" :alt="project.title" :class="$style.image" @error="(e) => ((e.target as HTMLImageElement).src = '/placeholder.svg')" />
          </div>
          <div :class="$style.prose">
            <p>{{ project.description }}</p>
          </div>

          <div :class="$style.tagsSection">
            <div :class="$style.tagsList">
              <Badge v-for="tag in project.tags" :key="tag" variant="secondary">{{ tag }}</Badge>
            </div>
          </div>
        </div>

        <CommentSection content-type="project" :content-id="project.id" />
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

.typeLabel {
  display: inline-block;
  font-size: $text-xs;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: $color-primary;
  margin-bottom: 0.5rem;
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
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  background-color: var(--muted);
}

.image {
  width: 100%;
  height: 100%;
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

.linksSection {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.linkButton {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: $color-card;
  color: $color-foreground;
  border: 1px solid $color-border;
  border-radius: 0.5rem;
  font-size: $text-sm;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease, transform 0.1s ease, border-color 0.2s ease;

  &:hover {
    background: $color-primary;
    color: $color-primary-foreground;
    border-color: $color-primary;
    transform: translateY(-1px);
  }
}

.linkIcon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
