<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import CommentSection from '~/components/CommentSection.vue'

interface Article {
  id: string
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
}

const route = useRoute()
const router = useRouter()
const id = route.params.id as string

const article = ref<Article | null>(null)
const isLiked = ref(false)
const likes = ref(0)
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  await new Promise((r) => setTimeout(r, 500))

  const mockArticle: Article = {
    id,
    title: 'Building Worlds: Our Level Design Process',
    excerpt: 'How we craft immersive environments that tell stories without words',
    content: `Level design is the backbone of any great game or interactive experience. It's where art meets functionality, where aesthetics blend with player psychology, and where stories unfold through environmental cues rather than exposition.

## The Initial Concept

Every level starts with a question: what experience do we want the player to have? For Desert Wanderer, we wanted players to feel both the vastness and the intimacy of the desert landscape. Wide open spaces would emphasize exploration and freedom, while carefully placed ruins and landmarks would provide moments of discovery and narrative depth.

## Iteration and Playtesting

The key to great level design is iteration. Our first pass is always rough - blocking out spaces, placing key landmarks, establishing flow. Then comes the most important part: playtesting. We watch players navigate the space, noting where they get confused, where they linger, where they rush through.

## Environmental Storytelling

The best stories don't need words. A weathered caravan, half-buried in sand. Ancient carvings on canyon walls. The remains of a campfire with personal belongings scattered nearby. Each element tells part of a larger story, inviting players to piece together what happened here.

## Technical Considerations

While creativity drives the vision, technical constraints shape the execution. We optimize sight lines to manage rendering loads, place landmarks strategically for navigation, and ensure performance targets are met without sacrificing visual quality.

## The Final Polish

The difference between good and great often comes down to polish. Adding particle effects to suggest wind and sand movement. Fine-tuning lighting to emphasize mood. Placing audio cues that enhance immersion. These finishing touches bring the world to life.`,
    author: 'Sarah Chen',
    authorBio: 'Lead Designer with 10 years of experience creating immersive game worlds',
    authorAvatar: '/author-sarah.jpg',
    publishedAt: '2024-12-15',
    readTime: 8,
    thumbnail: '/blog-level-design.jpg',
    tags: ['Game Dev', 'Design', 'Tutorial'],
    likes: 234,
  }

  article.value = mockArticle
  likes.value = mockArticle.likes
  isLoading.value = false
})

function handleLike() {
  isLiked.value = !isLiked.value
  likes.value = isLiked.value ? likes.value + 1 : likes.value - 1
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
          <div :class="$style.skeletonHero" />
          <div :class="$style.skeletonTitle" />
          <div :class="$style.skeletonSubtitle" />
        </div>
      </div>
    </template>

    <!-- Not Found State -->
    <template v-else-if="!article">
      <div :class="$style.notFound">
        <div :class="$style.notFoundContent">
          <h1 :class="$style.notFoundTitle">Article Not Found</h1>
          <Button as="a" to="/blog">Back to Blog</Button>
        </div>
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
          <Button variant="ghost" as="a" to="/blog" :class="$style.backButton">
            <span :class="$style.backIcon">←</span>
            Back to Blog
          </Button>

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
                <img :src="article.authorAvatar || '/placeholder.svg'" :alt="article.author" :class="$style.authorAvatar" />
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
            <CommentSection content-type="article" :content-id="id" />
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
  height: 24rem;
  background-color: var(--muted);
  border-radius: 1rem;
  margin-bottom: 2rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeletonTitle {
  height: 3rem;
  background-color: var(--muted);
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.skeletonSubtitle {
  height: 1.5rem;
  width: 66%;
  background-color: var(--muted);
  border-radius: 0.25rem;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.notFound {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notFoundContent {
  text-align: center;
}

.notFoundTitle {
  font-family: $font-display;
  font-size: $text-4xl;
  font-weight: 700;
  margin-bottom: 1rem;
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
  background: linear-gradient(to top, $color-background, rgba(0, 0, 0, 0.7), transparent);
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
  margin-bottom: 1rem;
  margin-left: -1rem;
}

.backIcon {
  margin-right: 0.5rem;
}

.articleCard {
  background-color: rgba(var(--card-rgb, 0, 0, 0), 0.95);
  backdrop-filter: blur(4px);
  border-radius: 1rem;
  border: 1px solid $color-border;
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
  color: $color-muted-foreground;
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
