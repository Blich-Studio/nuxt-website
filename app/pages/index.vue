<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import type { ProjectListItem, ArticleListItem } from '~/types/api'

const { getFeaturedProjects } = useProjects()
const { getArticles } = useArticles()

const scrollY = ref(0)
const mousePosition = ref({ x: 0, y: 0 })

const { data: featuredProjects } = await useAsyncData('home-featured-projects', () => getFeaturedProjects(4), {
  default: () => [] as ProjectListItem[],
})

const { data: articlesData } = await useAsyncData('home-featured-articles', () => getArticles(undefined, { limit: 3 }), {
  default: () => ({ articles: [] as ArticleListItem[], meta: {} }),
})

const featuredArticles = computed(() => articlesData.value.articles)

onMounted(() => {
  const handleScroll = () => (scrollY.value = window.scrollY)
  const handleMouseMove = (e: MouseEvent) => (mousePosition.value = { x: e.clientX, y: e.clientY })

  window.addEventListener('scroll', handleScroll)
  window.addEventListener('mousemove', handleMouseMove)

  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('mousemove', handleMouseMove)
  })
})

const logoScale = computed(() => Math.max(0.3, 1 - scrollY.value * 0.002))
const logoY = computed(() => Math.min(scrollY.value * 0.8, 400))
const logoOpacity = computed(() => Math.max(0, 1 - scrollY.value * 0.0025))

const steps = [
  { num: '01', title: 'Sculpt', desc: 'Every character starts as clay in our hands' },
  { num: '02', title: 'Animate', desc: 'Frame by frame, bringing life to the lifeless' },
  { num: '03', title: 'Polish', desc: 'Adding the digital magic that makes it pop' },
]

// Type labels for project types
const typeLabels: Record<string, string> = {
  game: 'GAME',
  engine: 'ENGINE',
  tool: 'TOOL',
  animation: 'ANIMATION',
  artwork: 'ARTWORK',
  other: 'PROJECT',
}

// Helper to get type display name
function getProjectTag(project: ProjectListItem): string {
  return typeLabels[project.type] || 'PROJECT'
}

// Helper to get tag display name from article
function getArticleTag(article: ArticleListItem): string {
  return article.tags?.[0]?.name?.toUpperCase() || 'ARTICLE'
}

// Helper to format read time
function getReadTime(article: ArticleListItem): string {
  const minutes = article.readTime || 5
  return `${minutes} min read`
}
</script>

<template>
  <div class="page">
    <!-- Hero Section -->
    <section class="hero-section">
      <!-- Floating blobs -->
      <div
        class="blob blob-rust"
        :style="{ transform: `translate(${mousePosition.x * 0.03}px, ${mousePosition.y * 0.03 - scrollY * 0.1}px)` }"
      />
      <div
        class="blob blob-orange"
        :style="{ transform: `translate(${mousePosition.x * -0.04}px, ${mousePosition.y * -0.04 - scrollY * 0.15}px)` }"
      />
      <div
        class="blob blob-beige"
        :style="{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02 - scrollY * 0.2}px)` }"
      />
      <div
        class="blob blob-grain"
        :style="{ transform: `translate(${mousePosition.x * -0.025}px, ${mousePosition.y * -0.025 - scrollY * 0.12}px)` }"
      />

      <div class="hero-content">
        <div class="hero-inner">
          <div
            class="tagline"
            :style="{ transform: `rotate(-1deg) translateY(${scrollY * 0.5}px)`, opacity: Math.max(0, 1 - scrollY * 0.004) }"
          >
            <span>EST. 2024 • STOP MOTION & GAMES</span>
          </div>

          <h1
            class="hero-title"
            :style="{ transform: `translateY(-${logoY}px) scale(${logoScale})`, opacity: logoOpacity }"
          >
            <span class="hero-title-main">BLICH</span>
            <span class="hero-title-accent">
              STUDIO
              <span class="hero-star">✱</span>
            </span>
          </h1>

          <p
            class="hero-description"
            :style="{ transform: `translateY(${scrollY * 0.3}px)`, opacity: Math.max(0, 1 - scrollY * 0.003) }"
          >
            We breathe life into clay, pixels, and code. Crafting tactile stop-motion animations and games with soul.
          </p>

          <div
            class="hero-actions"
            :style="{ transform: `translateY(${scrollY * 0.3}px)`, opacity: Math.max(0, 1 - scrollY * 0.003) }"
          >
            <NuxtLink to="/projects" class="btn btn-primary">
              View Projects
              <Icon name="lucide:arrow-right" class="btn-icon" />
            </NuxtLink>
            <NuxtLink to="/blog" class="btn btn-outline">
              Behind the Scenes
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="scroll-hint">SCROLL TO EXPLORE</div>
    </section>

    <!-- Featured Work Section -->
    <section class="featured-section">
      <div class="blob blob-featured" :style="{ transform: `translateY(${scrollY * 0.08}px)` }" />
      <div class="container">
        <div class="section-header">
          <div>
            <h2 class="section-title">Featured <span class="accent">Work</span></h2>
            <p class="section-subtitle">Where frames meet imagination. Each project is handcrafted with care and animated with love.</p>
          </div>
          <NuxtLink to="/projects" class="btn btn-outline-orange">
            View All Projects <Icon name="lucide:arrow-right" class="btn-icon-sm" />
          </NuxtLink>
        </div>

        <!-- Empty state -->
        <div v-if="featuredProjects.length === 0" class="featured-empty">
          <Icon name="lucide:image" class="empty-icon" />
          <p>No featured projects yet. Check back soon!</p>
          <NuxtLink to="/projects" class="btn btn-outline-orange">
            Browse All Projects
          </NuxtLink>
        </div>

        <!-- Dynamic projects grid -->
        <div v-else class="projects-grid">
          <NuxtLink
            v-for="(project, index) in featuredProjects"
            :key="project.id"
            :to="`/projects/${project.slug}`"
            class="project-card"
            :class="{ 'project-card-large': index === 0 || index === 3 }"
          >
            <img
              :src="project.coverImageUrl || '/placeholder.svg'"
              :alt="project.title"
              class="project-image"
            />
            <div class="project-overlay" />
            <div class="project-content" :class="{ 'project-content-sm': index !== 0 && index !== 3 }">
              <div class="project-tag" :class="['tag-orange', 'tag-beige', 'tag-rust', 'tag-grain'][index % 4]">
                {{ getProjectTag(project) }}
              </div>
              <h3 :class="index === 0 || index === 3 ? 'project-title-lg' : 'project-title'">
                {{ project.title }}
              </h3>
              <p v-if="(index === 0 || index === 3) && project.shortDescription" class="project-desc">
                {{ project.shortDescription }}
              </p>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Made by Hand Section -->
    <section class="hand-section">
      <div class="blob blob-hand" :style="{ transform: `translateY(${scrollY * -0.05}px)` }" />
      <div class="container container-narrow">
        <div class="hand-header">
          <Icon name="lucide:hand-metal" class="hand-icon" />
          <h2 class="section-title">Made by <span class="accent">Hand</span></h2>
          <p class="section-subtitle-center">No AI. No shortcuts. Just craft.</p>
        </div>

        <div class="steps-container">
          <div v-for="step in steps" :key="step.num" class="step">
            <span class="step-number">{{ step.num }}</span>
            <div>
              <h3 class="step-title">{{ step.title }}</h3>
              <p class="step-desc">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Blog Section -->
    <section class="blog-section">
      <div class="blob blob-blog" :style="{ transform: `translateY(${scrollY * 0.06}px)` }" />
      <div class="container">
        <div class="blog-header">
          <h2 class="section-title">From the <span class="accent">Studio</span></h2>
          <p class="section-subtitle">Thoughts, tutorials, and behind-the-scenes chaos</p>
        </div>

        <!-- Empty state -->
        <div v-if="featuredArticles.length === 0" class="blog-empty">
          <Icon name="lucide:file-text" class="empty-icon" />
          <p>No articles yet. Check back soon!</p>
        </div>

        <!-- Dynamic articles grid -->
        <div v-else class="blog-grid">
          <NuxtLink v-for="article in featuredArticles" :key="article.id" :to="`/blog/${article.slug}`" class="blog-card">
            <div class="blog-card-header">
              <span class="blog-tag">{{ getArticleTag(article) }}</span>
              <span class="blog-time">{{ getReadTime(article) }}</span>
            </div>
            <h3 class="blog-title">{{ article.title }}</h3>
            <Icon name="lucide:arrow-right" class="blog-arrow" />
          </NuxtLink>
        </div>

        <div class="blog-footer">
          <NuxtLink to="/blog" class="btn btn-outline">
            All Articles <Icon name="lucide:arrow-right" class="btn-icon-sm" />
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="scss" scoped>
// Page
.page {
  min-height: 100vh;
}

// ============================
// Hero Section
// ============================
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

// Blobs
.blob {
  position: absolute;
  transition: transform 0.1s ease-out;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.blob-rust {
  top: 5rem;
  right: 10%;
  width: 8rem;
  height: 8rem;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  background-color: color-mix(in oklch, var(--clay-rust) 20%, transparent);
  filter: blur(40px);
}

.blob-orange {
  top: 10rem;
  left: 15%;
  width: 12rem;
  height: 12rem;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  background-color: color-mix(in oklch, var(--clay-orange) 10%, transparent);
  filter: blur(48px);
}

.blob-beige {
  bottom: 8rem;
  right: 20%;
  width: 10rem;
  height: 10rem;
  border-radius: 30% 70% 70% 30% / 30% 60% 40% 70%;
  background-color: oklch(0.78 0.06 60 / 0.15);
  filter: blur(40px);
}

.blob-grain {
  top: 50%;
  left: 5%;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background-color: oklch(0.88 0.03 70 / 0.1);
  filter: blur(24px);
}

.blob-featured {
  position: absolute;
  top: 2.5rem;
  right: 2.5rem;
  width: 16rem;
  height: 16rem;
  border-radius: 50%;
  background-color: color-mix(in oklch, var(--clay-orange) 5%, transparent);
  filter: blur(48px);
  transition: transform 0.1s ease-out;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.blob-hand {
  position: absolute;
  bottom: 5rem;
  left: 2.5rem;
  width: 18rem;
  height: 18rem;
  border-radius: 50%;
  background-color: color-mix(in oklch, var(--clay-rust) 5%, transparent);
  filter: blur(48px);
  transition: transform 0.1s ease-out;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.blob-blog {
  position: absolute;
  top: 50%;
  right: 0;
  width: 24rem;
  height: 24rem;
  border-radius: 50%;
  background-color: oklch(0.78 0.06 60 / 0.05);
  filter: blur(48px);
  transition: transform 0.1s ease-out;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

// Hero content
.hero-content {
  max-width: 80rem;
  margin: 0 auto;
  padding: 5rem 1rem;
  position: relative;
  z-index: 10;
}

.hero-inner {
  max-width: 56rem;
}

.tagline {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border: 2px solid color-mix(in srgb, var(--clay-orange) 30%, transparent);
  background-color: color-mix(in srgb, var(--clay-orange) 5%, transparent);
  transition: all 0.2s ease;

  span {
    color: var(--clay-orange);
    font-family: var(--font-mono);
    font-size: 0.875rem;
    letter-spacing: 0.05em;
  }
}

.hero-title {
  font-family: var(--font-display);
  font-size: clamp(4.5rem, 12vw, 9rem);
  font-weight: 700;
  margin-bottom: 2rem;
  line-height: 0.9;
  letter-spacing: -0.05em;
  transition: all 0.2s ease;
  transform-origin: top left;
}

.hero-title-main {
  display: block;
  color: var(--foreground);
}

.hero-title-accent {
  display: block;
  color: var(--clay-orange);
  position: relative;
}

.hero-star {
  position: absolute;
  right: -3rem;
  top: -1.5rem;
  font-size: 2.5rem;
  animation: wiggle 4s ease-in-out infinite;
}

.hero-description {
  font-size: clamp(1.125rem, 2vw, 1.5rem);
  color: var(--muted-foreground);
  margin-bottom: 2rem;
  max-width: 42rem;
  line-height: 1.7;
  border-left: 4px solid var(--clay-rust);
  padding-left: 1.5rem;
  transition: all 0.2s ease;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
  transition: all 0.2s ease;
}

.scroll-hint {
  position: absolute;
  bottom: 3rem;
  left: 2rem;
  color: color-mix(in srgb, var(--clay-beige) 40%, transparent);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  transform: rotate(-90deg);
  transform-origin: left center;
}

// ============================
// Buttons
// ============================
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 2rem;
  font-weight: 700;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn-primary {
  background-color: var(--clay-orange);
  color: var(--background);

  &:hover {
    background-color: var(--clay-rust);
  }

  .btn-icon {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.2s ease;
  }

  &:hover .btn-icon {
    transform: translateX(4px);
  }
}

.btn-outline {
  background-color: transparent;
  border: 2px solid color-mix(in srgb, var(--clay-beige) 30%, transparent);
  color: var(--foreground);

  &:hover {
    background-color: color-mix(in srgb, var(--clay-beige) 5%, transparent);
  }
}

.btn-outline-orange {
  background-color: transparent;
  border: 2px solid color-mix(in srgb, var(--clay-orange) 30%, transparent);
  color: var(--foreground);

  &:hover {
    background-color: color-mix(in srgb, var(--clay-orange) 10%, transparent);
  }
}

.btn-icon {
  width: 1.25rem;
  height: 1.25rem;
}

.btn-icon-sm {
  width: 1rem;
  height: 1rem;
  margin-left: 0.5rem;
}

// ============================
// Featured Section
// ============================
.featured-section {
  padding: 8rem 1rem;
  position: relative;
  overflow: hidden;
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  position: relative;
  z-index: 10;
}

.container-narrow {
  max-width: 72rem;
}

.section-header {
  margin-bottom: 4rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
}

.section-title {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6vw, 4.5rem);
  font-weight: 700;
  margin-bottom: 1rem;
}

.accent {
  color: var(--clay-orange);
}

.section-subtitle {
  color: var(--muted-foreground);
  font-size: 1.125rem;
  max-width: 36rem;
}

.section-subtitle-center {
  color: var(--muted-foreground);
  font-size: 1.125rem;
}

// Projects Grid
.projects-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  grid-auto-rows: 280px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(12, 1fr);
  }
}

.project-card {
  position: relative;
  overflow: hidden;
  background-color: var(--card);
  border: 2px solid var(--border);
  transition: all 0.5s ease;
  display: block;

  @media (min-width: 768px) {
    grid-column: span 5;
  }

  &:hover {
    border-color: color-mix(in srgb, var(--clay-orange) 50%, transparent);
  }

  &:hover .project-image {
    transform: scale(1.05);
  }
}

.project-card-large {
  @media (min-width: 768px) {
    grid-column: span 7;
    grid-row: span 2;
  }
}

.project-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.project-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, var(--background), color-mix(in srgb, var(--background) 60%, transparent), transparent);
  opacity: 0.9;
}

.project-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
}

.project-content-sm {
  padding: 1.5rem;
}

.project-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  margin-bottom: 0.75rem;
}

.tag-orange {
  background-color: color-mix(in srgb, var(--clay-orange) 20%, transparent);
  border: 1px solid color-mix(in srgb, var(--clay-orange) 30%, transparent);
  color: var(--clay-orange);
}

.tag-beige {
  background-color: color-mix(in srgb, var(--clay-beige) 20%, transparent);
  border: 1px solid color-mix(in srgb, var(--clay-beige) 30%, transparent);
  color: var(--clay-beige);
}

.tag-rust {
  background-color: color-mix(in srgb, var(--clay-rust) 20%, transparent);
  border: 1px solid color-mix(in srgb, var(--clay-rust) 30%, transparent);
  color: var(--clay-rust);
}

.tag-grain {
  background-color: color-mix(in srgb, var(--film-grain) 20%, transparent);
  border: 1px solid color-mix(in srgb, var(--film-grain) 30%, transparent);
  color: var(--film-grain);
}

.project-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--foreground);
}

.project-title-lg {
  font-family: var(--font-display);
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 0.5rem;
}

.project-desc {
  color: var(--muted-foreground);
}

// Empty state
.featured-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--muted-foreground);
  gap: 1rem;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  opacity: 0.5;
}

// ============================
// Made by Hand Section
// ============================
.hand-section {
  padding: 8rem 1rem;
  background: linear-gradient(to bottom, var(--background), var(--card));
  position: relative;
  overflow: hidden;
}

.hand-header {
  text-align: center;
  margin-bottom: 5rem;
}

.hand-icon {
  width: 3rem;
  height: 3rem;
  color: var(--clay-orange);
  margin: 0 auto 1rem;
}

.steps-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

.step {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
  border-left: 4px solid color-mix(in srgb, var(--clay-orange) 30%, transparent);
  padding-left: 2rem;
  transition: border-color 0.3s ease;

  &:hover {
    border-color: var(--clay-orange);
  }
}

.step-number {
  font-family: var(--font-display);
  font-size: 3.75rem;
  font-weight: 700;
  color: color-mix(in srgb, var(--clay-orange) 20%, transparent);
}

.step-title {
  font-family: var(--font-display);
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.step-desc {
  font-size: 1.25rem;
  color: var(--muted-foreground);
}

// ============================
// Blog Section
// ============================
.blog-section {
  padding: 8rem 1rem;
  position: relative;
  overflow: hidden;
}

.blog-header {
  margin-bottom: 4rem;
}

.blog-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.blog-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 2rem;
  background-color: var(--card);
  border: 2px solid var(--border);
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    border-color: color-mix(in srgb, var(--clay-orange) 50%, transparent);
  }

  &:hover .blog-title {
    color: var(--clay-orange);
  }

  &:hover .blog-arrow {
    color: var(--clay-orange);
    transform: translateX(8px);
  }
}

.blog-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.blog-tag {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--clay-orange);
  border: 1px solid color-mix(in srgb, var(--clay-orange) 30%, transparent);
  padding: 0.25rem 0.5rem;
  background-color: color-mix(in srgb, var(--clay-orange) 5%, transparent);
}

.blog-time {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--muted-foreground);
}

.blog-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.25;
  transition: color 0.3s ease;
  color: var(--foreground);
}

.blog-arrow {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--muted-foreground);
  transition: all 0.3s ease;
}

.blog-footer {
  margin-top: 3rem;
  text-align: center;
}

// Blog empty state
.blog-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--muted-foreground);
  gap: 1rem;
}

// ============================
// Animations
// ============================
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes drift {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(10px, -10px) rotate(2deg);
  }
  66% {
    transform: translate(-10px, 10px) rotate(-2deg);
  }
}

@keyframes wiggle {
  0%, 100% {
    transform: rotate(-2deg);
  }
  50% {
    transform: rotate(2deg);
  }
}
</style>
