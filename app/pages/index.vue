<script setup lang="ts">
import { chooseFeaturedProject } from '~/utils/editorial'
const { getProjects } = useProjects()
const { getArticles } = useArticles()
const { data, error, refresh } = await useAsyncData(
  'workshop-home',
  async () => {
    const [projects, articles] = await Promise.all([
      getProjects(undefined, { limit: 12 }),
      getArticles(undefined, { limit: 3, sort: 'publishedAt', order: 'desc' }),
    ])
    return { projects: projects.projects, articles: articles.articles }
  },
)
const featured = computed(() =>
  chooseFeaturedProject(data.value?.projects || []),
)
const moreProjects = computed(() =>
  (data.value?.projects || [])
    .filter((p) => p.id !== featured.value?.id)
    .slice(0, 2),
)
useEditorialSeo(
  'Independent games, open workshop',
  'We make indie games and share what we learn building them. Explore projects, experiments, and development notes from Blich Studio.',
  () => featured.value?.coverImageUrl || undefined,
)
</script>
<template>
  <div class="layout-shell home-page">
    <section class="home-hero" aria-labelledby="home-title">
      <div class="hero-copy">
        <p class="eyebrow">INDEPENDENT GAMES / OPEN WORKSHOP</p>
        <h1 id="home-title">
          Small games.<br />Big <span class="outlined-word">curiosity.</span>
        </h1>
        <p class="hero-summary">
          We make indie games and share what we learn building them.
        </p>
        <p class="hero-detail">
          Code, design, handmade worlds. The finished work and the experiments
          that get us there.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/projects" class="studio-button"
            >Explore the games <span aria-hidden="true">↗</span></NuxtLink
          ><NuxtLink to="/blog" class="text-link"
            >Inside the workshop →</NuxtLink
          >
        </div>
      </div>
      <div v-if="featured" class="hero-feature">
        <div class="feature-label">
          <span class="eyebrow">ON THE WORKBENCH</span
          ><span class="eyebrow" aria-hidden="true">01 /</span>
        </div>
        <ProjectCard :project="featured" eager />
      </div>
      <div v-else class="hero-fallback">
        <span aria-hidden="true">✱</span>
        <p>One idea. One small game.<br />Something learned along the way.</p>
      </div>
    </section>
    <div class="workshop-rule">
      <span>BUILD SMALL.</span><span>FINISH THINGS.</span
      ><span>SHARE THE PROCESS.</span>
    </div>
    <div v-if="error" class="notice" role="status">
      <p>The latest work could not load. Please try again.</p>
      <button class="quiet-button" @click="refresh()">Reload the work →</button>
    </div>
    <section
      v-if="data?.articles.length"
      class="studio-section"
      aria-labelledby="workshop-title"
    >
      <div class="section-heading">
        <div>
          <p class="eyebrow">01 / FIELD NOTES</p>
          <h2 id="workshop-title">Inside the workshop.</h2>
        </div>
        <NuxtLink to="/blog" class="text-link">All notes →</NuxtLink>
      </div>
      <div class="notes-grid">
        <ArticleCard
          v-for="article in data.articles"
          :key="article.id"
          :article="article"
        />
      </div>
    </section>
    <section
      v-if="moreProjects.length"
      class="studio-section"
      aria-labelledby="craft-title"
    >
      <div class="section-heading">
        <div>
          <p class="eyebrow">02 / MATERIALS & EXPERIMENTS</p>
          <h2 id="craft-title">The other side of making.</h2>
          <p>Characters, animation, and the craft around the games.</p>
        </div>
      </div>
      <div class="supporting-grid">
        <ProjectCard
          v-for="project in moreProjects"
          :key="project.id"
          :project="project"
        />
      </div>
    </section>
    <section class="maker-strip">
      <span class="maker-mark" aria-hidden="true">✱</span>
      <div>
        <p class="eyebrow">A NOTE FROM FILIP</p>
        <h2>A place to build.<br />And figure things out.</h2>
        <p>
          Blich Studio is my space for making games, exploring their design, and
          keeping the craft of programming close. The workshop is where I share
          the process.
        </p>
        <NuxtLink to="/about" class="text-link">Meet the maker →</NuxtLink>
      </div>
    </section>
  </div>
</template>
<style scoped>
.home-hero {
  padding: 4.5rem 0 4rem;
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 5%;
  align-items: center;
}
h1 {
  font-size: clamp(3.7rem, 6.4vw, 6.2rem);
  line-height: 0.98;
  letter-spacing: -0.065em;
  margin: 1.8rem 0;
}
.outlined-word {
  color: var(--primary);
}
.hero-summary {
  font-size: clamp(1.15rem, 2vw, 1.45rem);
  line-height: 1.5;
  max-width: 28rem;
}
.hero-detail {
  max-width: 28rem;
  color: var(--muted-foreground);
}
.hero-actions {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-top: 2rem;
  flex-wrap: wrap;
}
.hero-feature {
  padding: 1.2rem;
  background: var(--card);
  border: 1px solid var(--border);
  transform: rotate(1deg);
}
.hero-feature :deep(.work-image) {
  aspect-ratio: 4 / 3;
}
.hero-feature :deep(.card-description) {
  font-size: 0.9rem;
}
.feature-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}
.feature-label .eyebrow {
  margin: 0;
}
.hero-fallback {
  text-align: center;
  background: var(--card);
  padding: 3rem;
}
.hero-fallback > span {
  font-size: 10rem;
  color: var(--primary);
  line-height: 1;
}
.workshop-rule {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.1rem 0;
  border-block: 1px solid var(--border);
  font: 0.72rem var(--font-mono);
  color: var(--muted-foreground);
  letter-spacing: 0.08em;
}
.supporting-grid {
  max-width: 46rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
  gap: 2rem;
}
.maker-strip {
  display: grid;
  grid-template-columns: 1fr 1.7fr;
  gap: 4rem;
  padding: 4rem 0;
  border-top: 1px solid var(--border);
}
.maker-mark {
  color: var(--primary);
  font-size: clamp(8rem, 22vw, 18rem);
  line-height: 1;
  text-align: center;
}
.maker-strip h2 {
  font-size: clamp(2.2rem, 4vw, 3.5rem);
}
.maker-strip p:not(.eyebrow) {
  color: var(--muted-foreground);
  max-width: 38rem;
}
@media (max-width: 800px) {
  .home-hero {
    grid-template-columns: 1fr;
    gap: 3rem;
    padding-top: 2.5rem;
  }
  .hero-copy {
    max-width: 40rem;
  }
  .hero-feature {
    transform: none;
  }
  .maker-strip {
    gap: 1rem;
    grid-template-columns: 1fr;
  }
  .maker-mark {
    display: none;
  }
}
@media (max-width: 450px) {
  h1 {
    font-size: clamp(2.5rem, 13vw, 3.4rem);
  }
  .workshop-rule {
    flex-wrap: wrap;
    font-size: 0.61rem;
  }
}
</style>
