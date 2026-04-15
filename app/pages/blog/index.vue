<script setup lang="ts">
import { ref, computed } from 'vue'
import Badge from '../../components/ui/Badge.vue'
import Button from '../../components/ui/Button.vue'
import EmptyState from '../../components/ui/EmptyState.vue'
import { useRouter } from 'vue-router'
import type { ArticleListItem, Tag } from '~/types/api'

// Transform API article to display format
interface DisplayArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  author: string
  authorAvatar?: string
  publishedAt: string
  readTime: number
  thumbnail?: string
  tags: string[]
  likes: number
}

function transformArticle(article: ArticleListItem): DisplayArticle {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.perex,
    author: article.author?.displayName || 'Unknown',
    authorAvatar: article.author?.avatarUrl ?? undefined,
    publishedAt: article.publishedAt || article.createdAt,
    readTime: article.readTime || 5,
    thumbnail: article.coverImageUrl ?? undefined,
    tags: article.tags.map(t => t.name),
    likes: article.likesCount || 0,
  }
}

const { getArticles, getTags } = useArticles()

const selectedTags = ref<string[]>([])
const router = useRouter()

const { data: blogData, error } = await useAsyncData('blog-list', async () => {
  const [articlesResult, tagsResult] = await Promise.all([
    getArticles(),
    getTags(),
  ])
  return {
    articles: articlesResult.articles.map(transformArticle),
    tags: tagsResult.map(t => t.name).sort(),
  }
}, {
  default: () => ({ articles: [] as DisplayArticle[], tags: [] as string[] }),
})

const articles = computed(() => blogData.value.articles)
const allTags = computed(() => blogData.value.tags)

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
        <!-- Error State -->
        <EmptyState
          v-if="error"
          icon="lucide:alert-circle"
          title="Failed to Load Articles"
          :description="error?.message || 'Failed to load articles'"
          action-label="Try Again"
          @action="() => $router.go(0)"
        />

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
  background: linear-gradient(to bottom, color-mix(in oklch, var(--sunset-sky) 20%, transparent), $color-background);
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
  background-color: color-mix(in oklch, var(--background) 95%, transparent);
  backdrop-filter: blur(12px);
  z-index: 40;

  @media (min-width: $breakpoint-md) {
    top: 5rem;
  }
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
    border-color: color-mix(in oklch, var(--sunset-orange) 50%, transparent);
    box-shadow: 0 20px 25px -5px color-mix(in oklch, var(--sunset-orange) 10%, transparent);
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
  background-color: color-mix(in oklch, var(--sunset-orange) 10%, transparent);
  color: var(--sunset-orange);
  border-color: color-mix(in oklch, var(--sunset-orange) 20%, transparent);
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
    border-color: color-mix(in oklch, var(--sunset-orange) 50%, transparent);
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
