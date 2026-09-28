<script setup lang="ts">
import { listingPage } from '~/utils/editorial'
const route = useRoute()
const router = useRouter()
const { getArticles, getTags } = useArticles()
const page = computed(() => listingPage(route.query.page))
const tag = computed(() =>
  typeof route.query.tag === 'string' ? route.query.tag : '',
)
const search = computed(() =>
  typeof route.query.search === 'string' ? route.query.search : '',
)
const input = ref(search.value)
const selection = ref(tag.value)
watch([search, tag], () => {
  input.value = search.value
  selection.value = tag.value
})
const { data: tags } = await useAsyncData('workshop-tags', getTags, {
  default: () => [],
})
const { data, error, status, refresh } = await useAsyncData(
  () => 'articles-' + JSON.stringify([page.value, tag.value, search.value]),
  () =>
    getArticles(
      { tags: tag.value || undefined, search: search.value || undefined },
      { page: page.value, limit: 12, sort: 'publishedAt', order: 'desc' },
    ),
)
function filter() {
  router.push({
    path: '/blog',
    hash: '#results',
    query: {
      ...(input.value.trim() ? { search: input.value.trim() } : {}),
      ...(selection.value ? { tag: selection.value } : {}),
    },
  })
}
function pageLink(value: number) {
  return {
    path: '/blog',
    hash: '#results',
    query: { ...route.query, page: String(value) },
  }
}
useEditorialSeo(
  () => 'Workshop' + (page.value > 1 ? ' — Page ' + page.value : ''),
  'Development notes, making-of stories, and lessons from building games at Blich Studio.',
  undefined,
  () => '/blog' + (page.value > 1 ? '?page=' + page.value : ''),
)
useSeoMeta({
  robots: () => (tag.value || search.value ? 'noindex,follow' : 'index,follow'),
})
</script>
<template>
  <div class="layout-shell">
    <header class="editorial-intro">
      <p class="eyebrow">WORKSHOP / NOTES FROM THE PROCESS</p>
      <h1>
        How it’s made.<br /><span class="text-accent">What we learn.</span>
      </h1>
      <p>
        Development notes, making-of stories, and the decisions behind the work.
      </p>
      <a class="text-link" href="/feed.xml">Follow new notes via RSS ↗</a>
    </header>
    <form class="listing-toolbar" @submit.prevent="filter">
      <label
        >Find a note<input
          v-model="input"
          type="search"
          placeholder="Search the workshop"
          maxlength="200" /></label
      ><label v-if="tags.length"
        >Topic<select v-model="selection">
          <option value="">All topics</option>
          <option v-for="item in tags" :key="item.id" :value="item.slug">
            {{ item.name }}
          </option>
        </select></label
      ><button class="studio-button" type="submit">Search →</button
      ><NuxtLink v-if="search || tag" to="/blog" class="text-link"
        >Clear filters</NuxtLink
      >
    </form>
    <div v-if="error" id="results" class="notice" role="alert">
      <p>The workshop notes could not load. Please try again.</p>
      <button class="quiet-button" @click="refresh()">Try again →</button>
    </div>
    <div v-else id="results" :aria-busy="status === 'pending'">
      <p class="listing-summary" role="status">
        {{ data?.meta.total || 0 }}
        {{ data?.meta.total === 1 ? 'note' : 'notes' }} · Page {{ page }}
      </p>
      <div v-if="data?.articles.length" class="notes-grid">
        <ArticleCard
          v-for="article in data.articles"
          :key="article.id"
          :article="article"
        />
      </div>
      <div v-else class="notice">
        <h2>No notes found.</h2>
        <p>Try another search or browse all workshop notes.</p>
        <NuxtLink to="/blog" class="text-link">All notes →</NuxtLink>
      </div>
      <nav
        v-if="page > 1 || data?.meta.hasNext"
        class="pagination"
        aria-label="Workshop pages"
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
