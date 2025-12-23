<script setup lang="ts">
import { useRoute } from 'vue-router'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
import CommentSection from '~/components/CommentSection.vue'

const route = useRoute()
const id = (route.params.id as string) || '1'

// Mock lookup
const projects: Record<string, any> = {
  '1': { id: '1', title: 'Desert Wanderer', description: 'An open-world adventure game set in a vast desert landscape', thumbnail: '/desert-game-landscape.jpg', tags: ['Action', 'Adventure', 'Open World'], likes: 245, releaseDate: '2024-12', content: '...' },
  '2': { id: '2', title: 'Sunset Chronicles', description: 'A heartwarming animated short about finding home', thumbnail: '/animated-sunset-scene.jpg', tags: ['Drama', 'Family', 'Short Film'], likes: 189, releaseDate: '2024-11', content: '...' },
}

const project = projects[id as string] || projects['1']
</script>

<template>
  <div :class="$style.page">
    <div :class="$style.container">
      <div :class="$style.projectSection">
        <h1 :class="$style.title">{{ project.title }}</h1>
        <div :class="$style.meta">{{ new Date(project.releaseDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }) }} • {{ project.likes }} likes</div>
        <div :class="$style.imageWrapper">
          <img :src="project.thumbnail" :alt="project.title" :class="$style.image" />
        </div>
        <div :class="$style.prose">
          <p>{{ project.description }}</p>
          <p>{{ project.content }}</p>
        </div>

        <div :class="$style.tagsSection">
          <div :class="$style.tagsList">
            <Badge v-for="tag in project.tags" :key="tag" variant="secondary">{{ tag }}</Badge>
          </div>
        </div>
      </div>

      <CommentSection content-type="project" :content-id="id" />
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../assets/styles/variables' as *;

.page {
  min-height: 100vh;
}

.container {
  max-width: 80rem;
  margin: 0 auto;
  padding: 1.5rem;
}

.projectSection {
  margin-bottom: 2rem;
}

.title {
  font-family: $font-display;
  font-size: $text-4xl;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.meta {
  color: $color-muted-foreground;
  font-size: $text-sm;
  margin-bottom: 1rem;
}

.imageWrapper {
  margin-bottom: 1.5rem;
}

.image {
  width: 100%;
  height: auto;
  border-radius: 0.75rem;
  object-fit: cover;
}

.prose {
  line-height: 1.75;
  color: $color-foreground;

  p {
    margin-bottom: 1rem;
  }
}

.tagsSection {
  margin-top: 1.5rem;
}

.tagsList {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
