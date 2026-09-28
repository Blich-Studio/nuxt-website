<script setup lang="ts">
import type { ProjectListItem } from '~/types/api'
import { projectLabel } from '~/utils/editorial'
defineProps<{ project: ProjectListItem; eager?: boolean }>()
</script>
<template>
  <NuxtLink :to="'/projects/' + project.slug" class="work-card">
    <div class="work-image">
      <img
        v-if="project.coverImageUrl"
        :src="project.coverImageUrl"
        alt=""
        :loading="eager ? 'eager' : 'lazy'"
        :fetchpriority="eager ? 'high' : 'auto'"
        width="960"
        height="720"
      /><span v-else class="image-placeholder" aria-hidden="true">✱</span>
    </div>
    <div class="card-heading">
      <p class="eyebrow">{{ projectLabel(project) }}</p>
      <span aria-hidden="true">↗</span>
    </div>
    <h3>{{ project.title }}</h3>
    <p v-if="project.shortDescription" class="card-description">
      {{ project.shortDescription }}
    </p>
    <span class="text-link"
      >Explore the project <span aria-hidden="true">→</span></span
    >
  </NuxtLink>
</template>
