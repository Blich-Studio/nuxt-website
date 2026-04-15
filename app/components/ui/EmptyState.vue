<script setup lang="ts">
import Button from './Button.vue'

interface Props {
  icon?: string
  title: string
  description?: string
  actionLabel?: string
  actionTo?: string
}

defineProps<Props>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div :class="$style.emptyState">
    <div :class="$style.iconWrapper">
      <Icon :name="icon || 'lucide:inbox'" :class="$style.icon" />
    </div>
    <h3 :class="$style.title">{{ title }}</h3>
    <p v-if="description" :class="$style.description">{{ description }}</p>
    <Button
      v-if="actionLabel"
      :as="actionTo ? 'a' : 'button'"
      :to="actionTo"
      variant="outline"
      :class="$style.action"
      @click="!actionTo && emit('action')"
    >
      {{ actionLabel }}
    </Button>
  </div>
</template>

<style lang="scss" module>
@use '../../assets/styles/variables' as *;

.emptyState {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  min-height: 300px;
}

.iconWrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--canvas-card);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.icon {
  width: 40px;
  height: 40px;
  color: $color-muted-foreground;
}

.title {
  font-family: $font-display;
  font-size: $text-xl;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: $color-foreground;
}

.description {
  font-size: $text-base;
  color: $color-muted-foreground;
  max-width: 400px;
  margin-bottom: 1.5rem;
}

.action {
  margin-top: 0.5rem;
}
</style>
