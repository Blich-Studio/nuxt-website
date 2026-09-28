<script setup lang="ts">
import type { ProjectType } from '~/types/api'
import { listingPage } from '~/utils/editorial'
const route = useRoute()
const router = useRouter()
const { getProjects } = useProjects()
const types: { value: ProjectType; label: string }[] = [
  { value: 'game', label: 'Games' },
  { value: 'other', label: 'Experiments' },
  { value: 'tool', label: 'Tools' },
  { value: 'engine', label: 'Engines' },
  { value: 'animation', label: 'Animation' },
  { value: 'artwork', label: 'Artwork' },
]
const page = computed(() => listingPage(route.query.page))
const type = computed(
  () => types.find((t) => t.value === route.query.type)?.value,
)
const search = computed(() =>
  typeof route.query.search === 'string' ? route.query.search : '',
)
const input = ref(search.value)
const selection = ref(type.value || '')
watch([search, type], () => {
  input.value = search.value
  selection.value = type.value || ''
})
const { data, error, status, refresh } = await useAsyncData(
  () => 'projects-' + JSON.stringify([page.value, type.value, search.value]),
  () =>
    getProjects(
      { type: type.value, search: search.value || undefined },
      { page: page.value, limit: 12, sort: 'publishedAt', order: 'desc' },
    ),
)
function filter() {
  router.push({
    path: '/projects',
    hash: '#results',
    query: {
      ...(input.value.trim() ? { search: input.value.trim() } : {}),
      ...(selection.value ? { type: selection.value } : {}),
    },
  })
}
function pageLink(value: number) {
  return {
    path: '/projects',
    hash: '#results',
    query: { ...route.query, page: String(value) },
  }
}
useEditorialSeo(
  () => 'Games & experiments' + (page.value > 1 ? ' — Page ' + page.value : ''),
  'Games, small experiments, tools, and handmade work from Blich Studio. Explore each project and the process behind it.',
  undefined,
  () => '/projects' + (page.value > 1 ? '?page=' + page.value : ''),
)
useSeoMeta({
  robots: () =>
    type.value || search.value ? 'noindex,follow' : 'index,follow',
})
</script>
<template>
  <div class="layout-shell">
    <header class="editorial-intro">
      <p class="eyebrow">GAMES / EXPERIMENTS / THINGS MADE</p>
      <h1>Built from<br /><span class="text-accent">curiosity.</span></h1>
      <p>
        Small games, ongoing experiments, and the art and tools around them.
        Open a project to see what it is and where it’s going.
      </p>
    </header>
    <form class="listing-toolbar" @submit.prevent="filter">
      <label
        >Find a project<input
          v-model="input"
          type="search"
          placeholder="Search the work"
          maxlength="200" /></label
      ><label
        >Kind of work<select v-model="selection">
          <option value="">All work</option>
          <option v-for="item in types" :key="item.value" :value="item.value">
            {{ item.label }}
          </option>
        </select></label
      ><button class="studio-button" type="submit">Apply filters →</button
      ><NuxtLink v-if="type || search" to="/projects" class="text-link"
        >Clear filters</NuxtLink
      >
    </form>
    <div v-if="error" id="results" class="notice" role="alert">
      <p>The projects could not load. Please try again.</p>
      <button class="quiet-button" @click="refresh()">Try again →</button>
    </div>
    <div v-else id="results" :aria-busy="status === 'pending'">
      <p class="listing-summary" role="status">
        {{ data?.meta.total || 0 }}
        {{ data?.meta.total === 1 ? 'project' : 'projects' }} · Page {{ page }}
      </p>
      <div v-if="data?.projects.length" class="projects-grid">
        <ProjectCard
          v-for="project in data.projects"
          :key="project.id"
          :project="project"
        />
      </div>
      <div v-else class="notice">
        <h2>No projects here yet.</h2>
        <p>Try a different search or return to all the work.</p>
        <NuxtLink class="text-link" to="/projects">Browse all work →</NuxtLink>
      </div>
      <nav
        v-if="page > 1 || data?.meta.hasNext"
        class="pagination"
        aria-label="Project pages"
      >
        <NuxtLink v-if="page > 1" :to="pageLink(page - 1)">← Previous</NuxtLink
        ><span
          >Page {{ page }} of
          {{ Math.max(1, data?.meta.totalPages || 0) }}</span
        ><NuxtLink v-if="data?.meta.hasNext" :to="pageLink(page + 1)"
          >Next →</NuxtLink
        >
      </nav>
    </div>
  </div>
</template>
