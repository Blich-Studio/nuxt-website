<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Badge from '../../components/ui/Badge.vue'
import Button from '../../components/ui/Button.vue'
import Skeleton from '../../components/ui/Skeleton.vue'
import EmptyState from '../../components/ui/EmptyState.vue'
import { useRouter } from 'vue-router'

interface Article {
  id: string
  title: string
  excerpt: string
  content: string
  author: string
  authorAvatar?: string
  publishedAt: string
  readTime: number
  thumbnail?: string
  tags: string[]
  likes: number
}

const mockArticles: Article[] = [
  { id: '1', title: 'Building Worlds: Our Level Design Process', excerpt: 'How we craft immersive environments that tell stories without words, from initial concept to final polish', content: '...', author: 'Sarah Chen', authorAvatar: '/author-sarah.jpg', publishedAt: '2024-12-15', readTime: 8, thumbnail: '/blog-level-design.jpg', tags: ['Game Dev', 'Design', 'Tutorial'], likes: 234 },
  { id: '2', title: 'Animation Principles for Indie Studios', excerpt: 'Essential techniques for creating fluid motion on a budget, including tips for small teams', content: '...', author: 'Marcus Liu', authorAvatar: '/author-marcus.jpg', publishedAt: '2024-12-10', readTime: 6, thumbnail: '/blog-animation-tips.jpg', tags: ['Animation', 'Tutorial', 'Workflow'], likes: 189 },
  { id: '3', title: 'The Art of Desert Aesthetics', excerpt: 'Finding beauty in minimalism and warm color palettes inspired by natural landscapes', content: '...', author: 'Elena Rodriguez', authorAvatar: '/author-elena.jpg', publishedAt: '2024-12-05', readTime: 5, thumbnail: '/blog-desert-aesthetics.jpg', tags: ['Design', 'Art Direction', 'Inspiration'], likes: 312 },
  { id: '4', title: 'Optimizing Game Performance on Mobile', excerpt: 'Practical strategies for maintaining smooth framerates without sacrificing visual quality', content: '...', author: 'Alex Kim', authorAvatar: '/author-alex.jpg', publishedAt: '2024-11-28', readTime: 10, thumbnail: '/blog-mobile-performance.jpg', tags: ['Game Dev', 'Technical', 'Mobile'], likes: 456 },
  { id: '5', title: 'Behind the Scenes: Sunset Chronicles', excerpt: 'A deep dive into the production process of our latest animated short film', content: '...', author: 'Sarah Chen', authorAvatar: '/author-sarah.jpg', publishedAt: '2024-11-20', readTime: 12, thumbnail: '/blog-sunset-chronicles.jpg', tags: ['Animation', 'Behind the Scenes', 'Film'], likes: 567 },
  { id: '6', title: 'Creating Memorable Sound Design', excerpt: 'How audio shapes player experience and emotional connection in games and animations', content: '...', author: 'Marcus Liu', authorAvatar: '/author-marcus.jpg', publishedAt: '2024-11-15', readTime: 7, thumbnail: '/blog-sound-design.jpg', tags: ['Audio', 'Game Dev', 'Tutorial'], likes: 278 },
]

const allTags = Array.from(new Set(mockArticles.flatMap((a) => a.tags))).sort()

const articles = ref<Article[]>(mockArticles)
const selectedTags = ref<string[]>([])
const isLoading = ref(true)
const router = useRouter()

onMounted(async () => {
  isLoading.value = true
  await new Promise((r) => setTimeout(r, 400))
  articles.value = mockArticles
  isLoading.value = false
})

function toggleTag(tag: string) {
  selectedTags.value = selectedTags.value.includes(tag) ? selectedTags.value.filter((t) => t !== tag) : [...selectedTags.value, tag]
}

function clearFilters() {
  selectedTags.value = []
}

const filteredArticles = computed(() => (selectedTags.value.length === 0 ? articles.value : articles.value.filter((a) => a.tags.some((tag) => selectedTags.value.includes(tag)))))

const firstArticle = computed(() => (filteredArticles.value.length > 0 ? filteredArticles.value[0] : null))

function openArticle(id: string) {
  router.push(`/blog/${id}`)
}
</script>

<template>
  <div :class="$style.page">
    <section :class="$style.hero">
      <div :class="$style.heroContainer">
        <h1 :class="$style.heroTitle">Our Blog</h1>
        <p :class="$style.heroSubtitle">Insights, tutorials, and behind-the-scenes stories from our creative journey</p>
      </div>
    </section>

    <section :class="$style.filterSection">
      <div :class="$style.filterContainer">
        <div :class="$style.filterHeader">
          <Icon name="lucide:tag" :class="$style.filterIcon" />
          <h2 :class="$style.filterTitle">Filter by Tags</h2>
          <Button v-if="selectedTags.length > 0" variant="ghost" size="sm" :class="$style.clearButton" @click="clearFilters">Clear All</Button>
        </div>
        <div :class="$style.tagsList">
          <Badge
            v-for="tag in allTags"
            :key="tag"
            :class="[$style.tagBadge, selectedTags.includes(tag) && $style.tagBadgeActive]"
            :variant="selectedTags.includes(tag) ? 'default' : 'outline'"
            @click="() => toggleTag(tag)"
          >{{ tag }}</Badge>
        </div>
      </div>
    </section>

    <section :class="$style.contentSection">
      <div :class="$style.contentContainer">
        <div v-if="isLoading" :class="$style.loadingGrid">
          <div v-for="i in 6" :key="i" :class="$style.skeletonCard">
            <Skeleton variant="image" height="200px" />
            <Skeleton variant="text" width="80%" height="1.5rem" :class="$style.skeletonTitle" />
            <Skeleton variant="text" :lines="2" />
            <div :class="$style.skeletonMeta">
              <Skeleton variant="rectangular" width="60px" height="20px" />
              <Skeleton variant="rectangular" width="80px" height="20px" />
            </div>
          </div>
        </div>

        <template v-else>
          <div v-if="firstArticle">
            <div :class="$style.featuredCard" @click="openArticle(firstArticle.id)">
              <div :class="$style.featuredGrid">
                <div :class="$style.featuredImageWrapper">
                  <img :src="firstArticle.thumbnail || '/placeholder.svg'" :alt="firstArticle.title" :class="$style.featuredImage" />
                </div>
                <div :class="$style.featuredContent">
                  <Badge :class="$style.featuredBadge">Featured</Badge>
                  <h2 :class="$style.featuredTitle">{{ firstArticle.title }}</h2>
                  <p :class="$style.featuredExcerpt">{{ firstArticle.excerpt }}</p>
                  <div :class="$style.featuredTags">
                    <Badge v-for="tag in firstArticle.tags" :key="tag" variant="secondary" :class="$style.tagSmall">{{ tag }}</Badge>
                  </div>
                  <div :class="$style.featuredMeta">
                    <div :class="$style.metaItem"><Icon name="lucide:calendar" :class="$style.metaIcon" /> {{ new Date(firstArticle.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}</div>
                    <div :class="$style.metaItem"><Icon name="lucide:clock" :class="$style.metaIcon" /> {{ firstArticle.readTime }} min read</div>
                    <div :class="$style.metaItem"><Icon name="lucide:heart" :class="$style.metaIcon" /> {{ firstArticle.likes }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div :class="$style.articlesGrid">
              <div v-for="article in filteredArticles.slice(1)" :key="article.id" :class="$style.articleCard" @click="openArticle(article.id)">
                <div :class="$style.articleImageWrapper">
                  <img :src="article.thumbnail || '/placeholder.svg'" :alt="article.title" :class="$style.articleImage" />
                </div>
                <div :class="$style.articleContent">
                  <h3 :class="$style.articleTitle">{{ article.title }}</h3>
                  <p :class="$style.articleExcerpt">{{ article.excerpt }}</p>
                  <div :class="$style.articleTags">
                    <Badge v-for="tag in article.tags.slice(0,2)" :key="tag" variant="secondary" :class="$style.tagSmall">{{ tag }}</Badge>
                  </div>
                  <div :class="$style.articleMeta">
                    <div :class="$style.metaItem"><Icon name="lucide:clock" :class="$style.metaIcon" /> {{ article.readTime }} min</div>
                    <div :class="$style.metaItem"><Icon name="lucide:heart" :class="$style.metaIcon" /> {{ article.likes }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else :class="$style.emptyStateWrapper">
            <EmptyState
              icon="lucide:search-x"
              title="No articles found"
              description="No articles match your selected tags. Try adjusting your filters."
              action-label="Clear Filters"
              @action="clearFilters"
            />
          </div>
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

.filterHeader {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.filterIcon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--sunset-orange);
}

.filterTitle {
  font-weight: 600;
}

.clearButton {
  margin-left: auto;
  font-size: $text-xs;
}

.tagsList {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tagBadge {
  cursor: pointer;
  transition: all 0.2s ease;
}

.tagBadgeActive {
  background-color: var(--sunset-orange);
  color: white;

  &:hover {
    background-color: var(--sunset-deep);
  }
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

.skeletonCard {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeletonTitle {
  margin-top: 0.5rem;
}

.skeletonMeta {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.emptyStateWrapper {
  grid-column: 1 / -1;
}

.featuredCard {
  margin-bottom: 4rem;
  border-radius: 1rem;
  overflow: hidden;
  background-color: $color-card;
  border: 1px solid $color-border;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(var(--sunset-orange-rgb, 200, 100, 50), 0.5);
    box-shadow: 0 20px 25px -5px rgba(var(--sunset-orange-rgb, 200, 100, 50), 0.1);
  }

  &:hover .featuredImage {
    transform: scale(1.1);
  }

  &:hover .featuredTitle {
    color: var(--sunset-orange);
  }
}

.featuredGrid {
  display: grid;
  grid-template-columns: 1fr;

  @media (min-width: $breakpoint-md) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.featuredImageWrapper {
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  background-color: var(--muted);

  @media (min-width: $breakpoint-md) {
    aspect-ratio: auto;
  }
}

.featuredImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.featuredContent {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.featuredBadge {
  width: fit-content;
  margin-bottom: 1rem;
  background-color: rgba(var(--sunset-orange-rgb, 200, 100, 50), 0.1);
  color: var(--sunset-orange);
  border-color: rgba(var(--sunset-orange-rgb, 200, 100, 50), 0.2);
}

.featuredTitle {
  font-family: $font-display;
  font-size: $text-3xl;
  font-weight: 700;
  margin-bottom: 1rem;
  transition: color 0.3s ease;
  text-wrap: balance;
}

.featuredExcerpt {
  color: $color-muted-foreground;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.featuredTags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tagSmall {
  font-size: $text-xs;
}

.featuredMeta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1.5rem;
  font-size: $text-sm;
  color: $color-muted-foreground;
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

.articlesGrid {
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

.articleCard {
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: $color-card;
  border: 1px solid $color-border;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: rgba(var(--sunset-orange-rgb, 200, 100, 50), 0.5);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  &:hover .articleImage {
    transform: scale(1.1);
  }

  &:hover .articleTitle {
    color: var(--sunset-orange);
  }
}

.articleImageWrapper {
  aspect-ratio: 16 / 9;
  position: relative;
  overflow: hidden;
  background-color: var(--muted);
}

.articleImage {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.articleContent {
  padding: 1.5rem;
}

.articleTitle {
  font-family: $font-display;
  font-size: $text-xl;
  font-weight: 700;
  margin-bottom: 0.75rem;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.articleExcerpt {
  color: $color-muted-foreground;
  font-size: $text-sm;
  margin-bottom: 1rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.articleTags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.articleMeta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: $text-xs;
  color: $color-muted-foreground;
}
</style>
