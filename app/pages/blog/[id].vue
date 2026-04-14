<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import { useRoute, useRouter } from 'vue-router'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
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

const { data: article, error } = await useAsyncData(`article-${id}`, async () => {
  const result = await getArticle(id)
  return result ? transformArticle(result) : null
})

const isLiked = ref(article.value?.isLiked || false)
const likes = ref(article.value?.likes || 0)
const isLiking = ref(false)

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

const renderedContent = ref('')

watch(() => article.value?.content, async (content) => {
  if (!content) return
  renderedContent.value = await marked(content)
}, { immediate: true })
</script>

<template>
  <div :class="$style.page">
    <!-- Error State -->
    <template v-if="error">
      <div :class="$style.notFound">
        <EmptyState
          icon="lucide:alert-circle"
          title="Something Went Wrong"
          :description="error?.message || 'We couldn\'t load this article. Please try again later.'"
          action-label="Back to Blog"
          action-to="/blog"
        />
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
            <div :class="$style.content" v-html="renderedContent" />
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

  :deep(em) {
    font-style: italic;
  }

  :deep(a) {
    color: var(--clay-orange);
    text-decoration: underline;
  }

  :deep(ul),
  :deep(ol) {
    margin-bottom: 1.5rem;
    padding-left: 1.5rem;
  }

  :deep(li) {
    margin-bottom: 0.5rem;
  }

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
