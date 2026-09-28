<script setup lang="ts">
import type { ArticleListItem } from '~/types/api'
import { formatEditorialDate } from '~/utils/editorial'
defineProps<{ article: ArticleListItem }>()
</script>
<template>
  <NuxtLink :to="'/blog/' + article.slug" class="note-card">
    <div class="note-meta">
      <span class="eyebrow">{{ article.tags[0]?.name || 'Studio notes' }}</span
      ><span v-if="article.readTime">{{ article.readTime }} min read</span>
    </div>
    <h3>{{ article.title }}</h3>
    <p>{{ article.perex }}</p>
    <div class="note-meta">
      <time :datetime="article.publishedAt || article.createdAt">{{
        formatEditorialDate(article.publishedAt || article.createdAt)
      }}</time
      ><span aria-hidden="true">↗</span>
    </div>
  </NuxtLink>
</template>
