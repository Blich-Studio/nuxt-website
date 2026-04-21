<script setup lang="ts">
import { ref, computed } from 'vue'
import { marked } from 'marked'
import { useRoute } from 'vue-router'
import Badge from '~/components/ui/Badge.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import CommentSection from '~/components/CommentSection.vue'
import { useRandomItemAccent } from '~/composables/useRandomAccent'
import type { Project as ApiProject, LinkedArticle } from '~/types/api'

const tagAccent = useRandomItemAccent()

interface DisplayProject {
  id: string
  slug: string
  title: string
  type: string
  shortDescription: string | null
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
  articles: LinkedArticle[]
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
    shortDescription: project.shortDescription ?? null,
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
    articles: project.articles || [],
  }
}

const { getProject, likeProject, unlikeProject } = useProjects()
const { user, showAuthModal, initialized, fetchUser } = useAuth()

const route = useRoute()
const id = (route.params.id as string) || '1'

const { data: project, error } = await useAsyncData(`project-${id}`, async () => {
  const result = await getProject(id)
  return result ? transformProject(result) : null
})

useHead({ bodyAttrs: { class: 'project-detail' } })

const renderedDescription = computed(() =>
  project.value?.description ? (marked.parse(project.value.description) as string) : ''
)

const renderedShortDescription = computed(() =>
  project.value?.shortDescription ? (marked.parseInline(project.value.shortDescription) as string) : ''
)

const isLiked = ref(project.value?.isLiked || false)
const likes = ref(project.value?.likes || 0)
const isLiking = ref(false)

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
      <!-- Error State -->
      <template v-if="error">
        <EmptyState
          icon="lucide:alert-circle"
          title="Something Went Wrong"
          :description="error?.message || 'We couldn\'t load this project. Please try again later.'"
          action-label="Go Back"
          action-to="/projects"
        />
      </template>

      <!-- Not Found State -->
      <template v-else-if="!project">
        <EmptyState
          icon="lucide:folder-x"
          title="Project Not Found"
          description="The project you're looking for doesn't exist or may have been removed."
          action-label="Browse All Projects"
          action-to="/projects"
        />
      </template>

      <!-- Project Content -->
      <template v-else>
        <div :class="$style.projectSection">
          <div :class="$style.typeLabel">{{ typeLabels[project.type] || 'Project' }}</div>
          <h1 :class="$style.title">{{ project.title }}</h1>
          <div :class="$style.meta">{{ new Date(project.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) }} • {{ likes }} likes</div>
          <p v-if="project.shortDescription" :class="$style.shortDescription" v-html="renderedShortDescription" />

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
          <div :class="$style.prose" v-html="renderedDescription" />

          <div :class="$style.tagsSection">
            <div :class="$style.tagsList">
              <Badge v-for="tag in project.tags" :key="tag" variant="secondary" :style="tagAccent('detail:' + tag)">{{ tag }}</Badge>
            </div>
          </div>
        </div>

        <!-- Related Articles -->
        <div v-if="project.articles.length > 0" :class="$style.relatedArticles">
          <h2 :class="$style.relatedTitle">Related Articles</h2>
          <div :class="$style.articlesList">
            <NuxtLink
              v-for="article in project.articles"
              :key="article.id"
              :to="`/blog/${article.slug}`"
              :class="$style.articleCard"
            >
              <div v-if="article.coverImageUrl" :class="$style.articleImageWrapper">
                <img :src="article.coverImageUrl" :alt="article.title" :class="$style.articleImage" @error="(e) => ((e.target as HTMLImageElement).src = '/placeholder.svg')" />
              </div>
              <div :class="$style.articleBody">
                <h3 :class="$style.articleTitle">{{ article.title }}</h3>
                <p v-if="article.perex" :class="$style.articlePerex">{{ article.perex }}</p>
                <div :class="$style.articleMeta">
                  <span v-if="article.readTime">{{ article.readTime }} min read</span>
                  <span v-if="article.publishedAt">{{ new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) }}</span>
                </div>
              </div>
            </NuxtLink>
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
  padding-top: 4rem;

  @media (min-width: $breakpoint-md) {
    padding-top: 5rem;
  }
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem;
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

.shortDescription {
  font-size: $text-lg;
  color: $color-muted-foreground;
  line-height: 1.6;
  margin-bottom: 1.5rem;
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
  line-height: 1.8;
  color: var(--foreground);

  :deep(h1),
  :deep(h2),
  :deep(h3),
  :deep(h4) {
    font-family: $font-display;
    font-weight: 700;
    color: $color-foreground;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
  }

  :deep(h1) { font-size: $text-3xl; }
  :deep(h2) { font-size: $text-2xl; }
  :deep(h3) { font-size: $text-xl; }

  :deep(p) {
    margin-bottom: 1.5rem;
    opacity: 0.85;
  }

  :deep(strong) {
    font-weight: 700;
    opacity: 1;
  }

  :deep(em) { font-style: italic; }

  :deep(a) {
    color: var(--clay-orange);
    text-decoration: underline;
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
  }

  :deep(ul) { list-style: disc; }
  :deep(ol) { list-style: decimal; }

  :deep(li) { margin-bottom: 0.5rem; }

  :deep(blockquote) {
    border-left: 3px solid var(--clay-orange);
    padding-left: 1rem;
    margin: 1.5rem 0;
    opacity: 0.85;
    font-style: italic;
  }

  :deep(code) {
    background: var(--muted);
    padding: 0.15rem 0.4rem;
    border-radius: $radius-sm;
    font-size: 0.9em;
  }

  :deep(pre) {
    background: var(--muted);
    padding: 1rem;
    border-radius: $radius-md;
    overflow-x: auto;
    margin-bottom: 1.5rem;

    code {
      background: none;
      padding: 0;
    }
  }

  :deep(img) {
    max-width: 100%;
    border-radius: $radius-md;
    margin: 1.5rem 0;
  }

  :deep(hr) {
    border: none;
    border-top: 1px solid var(--border);
    margin: 2rem 0;
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

.relatedArticles {
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.relatedTitle {
  font-family: $font-display;
  font-size: $text-2xl;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.articlesList {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.articleCard {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: $color-card;
  border: 1px solid $color-border;
  border-radius: 0.75rem;
  text-decoration: none;
  color: $color-foreground;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: color-mix(in oklch, var(--sunset-orange) 50%, transparent);
    box-shadow: 0 4px 12px color-mix(in oklch, var(--sunset-orange) 10%, transparent);
  }

  &:hover .articleTitle {
    color: var(--sunset-orange);
  }
}

.articleImageWrapper {
  flex-shrink: 0;
  width: 5rem;
  height: 5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  background: var(--muted);
}

.articleImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.articleBody {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.articleTitle {
  font-family: $font-display;
  font-size: $text-base;
  font-weight: 700;
  transition: color 0.2s ease;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.articlePerex {
  font-size: $text-sm;
  color: $color-muted-foreground;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.articleMeta {
  display: flex;
  gap: 0.75rem;
  font-size: $text-xs;
  color: $color-muted-foreground;
  margin-top: auto;
}
</style>
