<script setup lang="ts">
import { useAttrs } from 'vue'

const props = defineProps({
  variant: { type: String as () => 'default' | 'secondary' | 'destructive' | 'outline', default: 'default' },
})

const attrs = useAttrs()
</script>

<template>
  <span :class="[$style.badge, $style[`variant-${props.variant}`], attrs.class]">
    <slot />
  </span>
</template>

<style lang="scss" module>
@use '../../assets/styles/variables' as *;

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  border: 1px solid transparent;
  font-size: $text-xs;
  font-weight: 500;
  white-space: nowrap;
  flex-shrink: 0;
  width: fit-content;
}

.variant-default {
  background-color: $color-clay-rust;
  color: $color-background;
}

.variant-secondary {
  background-color: $color-clay-beige;
  color: $color-background;
}

.variant-destructive {
  background-color: var(--destructive);
  color: white;
}

.variant-outline {
  border-color: $color-border;
  color: $color-foreground;
  background-color: transparent;

  &:hover {
    background-color: var(--accent);
  }
}
</style>
