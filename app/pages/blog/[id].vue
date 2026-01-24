<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import Skeleton from '~/components/ui/Skeleton.vue'
import EmptyState from '~/components/ui/EmptyState.vue'
import CommentSection from '~/components/CommentSection.vue'
import type { Article as ApiArticle } from '~/types/api'

interface DisplayArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  authorBio: string
  authorAvatar?: string
  publishedAt: string
  readTime: number
  thumbnail?: string
  tags: string[]
  likes: number
  isLiked: boolean
}

useHead({
  bodyAttrs: {
    class: 'article-detail',
  },
})

function transformArticle(article: ApiArticle): DisplayArticle {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.perex,
    content: article.content,
    author: article.author?.displayName || 'Unknown',
    authorBio: '', // Not available from API yet
    authorAvatar: article.author?.avatarUrl ?? undefined,
    publishedAt: article.publishedAt || article.createdAt,
    readTime: article.readTime || Math.ceil(article.content.split(/\s+/).length / 200),
    thumbnail: article.coverImageUrl ?? undefined,
    tags: article.tags.map(t => t.name),
    likes: article.likesCount || 0,
    isLiked: article.isLiked || false,
  }
}

const { getArticle, likeArticle, unlikeArticle } = useArticles()
const { user, showAuthModal, initialized, fetchUser } = useAuth()

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const article = ref<DisplayArticle | null>(null)
const isLiked = ref(false)
const likes = ref(0)
const isLoading = ref(true)
const isLiking = ref(false)
const error = ref<string | null>(null)

onMounted(async () => {
  isLoading.value = true
  error.value = null

  try {
    const result = await getArticle(id)
    
    if (result) {
      article.value = transformArticle(result)
      likes.value = article.value.likes
      isLiked.value = article.value.isLiked
    } else {
      article.value = null
    }
  } catch (e: any) {
    console.error('Failed to fetch article:', e)
    error.value = e.message || 'Failed to load article'
  } finally {
    isLoading.value = false
  }
})

async function handleLike() {
  if (!article.value) return

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
      const result = await unlikeArticle(article.value.id)
      isLiked.value = false
      likes.value = result.likesCount
    } else {
      const result = await likeArticle(article.value.id)
      isLiked.value = true
      likes.value = result.likesCount
    }
  } catch (e: any) {
    console.error('Failed to like article:', e)
    // If 401, show auth modal
    if (e?.statusCode === 401 || e?.response?.status === 401) {
      showAuthModal()
    }
  } finally {
    isLiking.value = false
  }
}

function handleShare() {
  if (navigator.share) {
    navigator.share({
      title: article.value?.title,
      text: article.value?.excerpt,
      url: window.location.href,
    })
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function renderContent(content: string) {
  return content.split('\n\n')
}
</script>

<template>
  <div :class="$style.page">
    <!-- Loading State -->
    <template v-if="isLoading">
      <div :class="$style.loadingContainer">
        <div :class="$style.loadingInner">
          <Skeleton variant="image" height="24rem" :class="$style.skeletonHero" />
          <Skeleton variant="text" width="80%" height="3rem" :class="$style.skeletonTitle" />
          <div :class="$style.skeletonMeta">
            <Skeleton variant="circular" width="48px" height="48px" />
            <Skeleton variant="text" width="150px" height="1rem" />
            <Skeleton variant="text" width="100px" height="1rem" />
          </div>
          <Skeleton variant="text" :lines="6" :class="$style.skeletonContent" />
        </div>
      </div>
    </template>

    <!-- Not Found State -->
    <template v-else-if="!article">
      <div :class="$style.notFound">
        <EmptyState
          icon="lucide:file-x"
          title="Article Not Found"
          description="The article you're looking for doesn't exist or may have been removed."
          action-label="Back to Blog"
          action-to="/blog"
        />
      </div>
    </template>

    <!-- Article Content -->
    <template v-else>
      <!-- Hero Section -->
      <section :class="$style.heroSection">
        <img :src="article.thumbnail || '/placeholder.svg'" :alt="article.title" :class="$style.heroImage" />
        <div :class="$style.heroOverlay" />
      </section>

      <!-- Article Header -->
      <section :class="$style.articleSection">
        <div :class="$style.articleContainer">
          <NuxtLink to="/blog" :class="$style.backButton">
            <Icon name="lucide:arrow-left" :class="$style.backIcon" />
            Back to Blog
          </NuxtLink>

          <article :class="$style.articleCard">
            <!-- Tags -->
            <div :class="$style.tags">
              <Badge v-for="tag in article.tags" :key="tag" variant="secondary">
                {{ tag }}
              </Badge>
            </div>

            <!-- Title -->
            <h1 :class="$style.articleTitle">{{ article.title }}</h1>

            <!-- Meta -->
            <div :class="$style.articleMeta">
              <div :class="$style.authorInfo">
                <img :src="article.authorAvatar || '/placeholder-user.jpg'" :alt="article.author" :class="$style.authorAvatar" />
                <div>
                  <div :class="$style.authorName">{{ article.author }}</div>
                  <div :class="$style.authorBio">{{ article.authorBio }}</div>
                </div>
              </div>
              <div :class="$style.metaItem">
                <Icon name="lucide:calendar" :class="$style.metaIcon" />
                {{ formatDate(article.publishedAt) }}
              </div>
              <div :class="$style.metaItem">
                <Icon name="lucide:clock" :class="$style.metaIcon" />
                {{ article.readTime }} min read
              </div>
            </div>

            <!-- Actions -->
            <div :class="$style.actions">
              <Button :variant="isLiked ? 'default' : 'outline'" :class="isLiked && $style.likedButton" @click="handleLike">
                <Icon name="lucide:heart" :class="$style.actionIcon" />
                {{ likes }}
              </Button>
              <Button variant="outline" @click="handleShare">
                <Icon name="lucide:share" :class="$style.actionIcon" />
                Share
              </Button>
            </div>

            <!-- Content -->
            <div :class="$style.content">
              <template v-for="(paragraph, idx) in renderContent(article.content)" :key="idx">
                <h2 v-if="paragraph.startsWith('## ')" :class="$style.contentHeading">
                  {{ paragraph.replace('## ', '') }}
                </h2>
                <p v-else :class="$style.contentParagraph">
                  {{ paragraph }}
                </p>
              </template>
            </div>
          </article>

          <!-- Comments -->
          <div :class="$style.commentsSection">
            <CommentSection content-type="article" :content-id="article.id" />
          </div>
        </div>
      </section>

      <div :class="$style.spacer" />
    </template>
  </div>
</template>

<style lang="scss" module>
@use '../../assets/styles/variables' as *;

.page {
  min-height: 100vh;
}

.loadingContainer {
  min-height: 100vh;
  padding: 5rem 1rem;
}

.loadingInner {
  max-width: 48rem;
  margin: 0 auto;
}

.skeletonHero {
  margin-bottom: 2rem;
}

.skeletonTitle {
  margin-bottom: 1.5rem;
}

.skeletonMeta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.skeletonContent {
  margin-top: 1rem;
}

.notFound {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heroSection {
  position: relative;
  height: 50vh;
  overflow: hidden;
  background-color: var(--muted);
}

.heroImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.heroOverlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--background), rgba(0, 0, 0, 0.5), transparent);
}

.articleSection {
  padding: 0 1rem;
  margin-top: -8rem;
  position: relative;
  z-index: 10;
}

.articleContainer {
  max-width: 48rem;
  margin: 0 auto;
}

.backButton {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  margin-left: -1rem;
  font-size: $text-sm;
  font-weight: 500;
  color: var(--foreground);
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
}

.backIcon {
  width: 1rem;
  height: 1rem;
}

.articleCard {
  background-color: var(--card);
  backdrop-filter: blur(4px);
  border-radius: 1rem;
  border: 1px solid var(--border);
  padding: 2rem;

  @media (min-width: $breakpoint-md) {
    padding: 3rem;
  }
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.articleTitle {
  font-family: $font-display;
  font-size: clamp(2rem, 5vw, $text-5xl);
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-wrap: balance;
}

.articleMeta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  font-size: $text-sm;
  color: $color-muted-foreground;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid $color-border;
}

.authorInfo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.authorAvatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.authorName {
  font-weight: 500;
  color: $color-foreground;
}

.authorBio {
  font-size: $text-xs;
}

.metaItem {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.metaIcon {
  width: 1rem;
  height: 1rem;
  opacity: 0.7;
}

.actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.likedButton {
  background-color: var(--sunset-orange);

  &:hover {
    background-color: var(--sunset-deep);
  }
}

.actionIcon {
  width: 1rem;
  height: 1rem;
}

.content {
  // Prose-like styling
}

.contentHeading {
  font-family: $font-display;
  font-size: $text-2xl;
  font-weight: 700;
  margin-top: 3rem;
  margin-bottom: 1rem;
  color: $color-foreground;
}

.contentParagraph {
  margin-bottom: 1.5rem;
  line-height: 1.7;
  color: var(--foreground);
  opacity: 0.85;
}

.commentsSection {
  margin-top: 3rem;
}

.spacer {
  height: 5rem;
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
