<script setup lang="ts">
import { computed, useAttrs } from 'vue'

const props = defineProps({
  variant: { type: String as () => 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link', default: 'default' },
  size: { type: String as () => 'default' | 'sm' | 'lg' | 'icon' | 'icon-sm' | 'icon-lg', default: 'default' },
  to: { type: [String, Object], required: false },
  as: { type: String, required: false },
  type: { type: String as () => 'button' | 'submit' | 'reset', default: 'button' },
})

const attrs = useAttrs()
</script>

<template>
  <component
    :is="props.to ? 'NuxtLink' : (props.as || 'button')"
    v-bind="{ ...attrs, class: undefined }"
    :to="props.to"
    :type="props.to ? undefined : props.type"
    :class="[
      $style.button,
      $style[`variant-${props.variant}`],
      $style[`size-${props.size}`],
      attrs.class
    ]"
  >
    <slot />
  </component>
</template>

<style lang="scss" module>
@use '../../assets/styles/variables' as *;

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  white-space: nowrap;
  border-radius: 0.375rem;
  font-size: $text-sm;
  font-weight: 500;
  transition: all 0.2s ease;
  outline: none;
  flex-shrink: 0;
  cursor: pointer;
  border: none;
  text-decoration: none;

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &:focus-visible {
    box-shadow: 0 0 0 2px $color-background, 0 0 0 4px $color-ring;
  }
}

// Variants
.variant-default {
  background-color: $color-primary;
  color: $color-primary-foreground;

  &:hover {
    opacity: 0.9;
  }
}

.variant-destructive {
  background-color: var(--destructive);
  color: white;

  &:hover {
    opacity: 0.9;
  }
}

.variant-outline {
  border: 1px solid $color-border;
  background-color: transparent;
  color: $color-foreground;

  &:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
}

.variant-secondary {
  background-color: var(--secondary);
  color: var(--secondary-foreground);

  &:hover {
    opacity: 0.8;
  }
}

.variant-ghost {
  background-color: transparent;
  color: $color-foreground;

  &:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
}

.variant-link {
  background-color: transparent;
  color: $color-primary;
  text-underline-offset: 4px;

  &:hover {
    text-decoration: underline;
  }
}

// Sizes
.size-default {
  height: 2.25rem;
  padding: 0.5rem 1rem;
}

.size-sm {
  height: 2rem;
  padding: 0.5rem 0.75rem;
  font-size: $text-xs;
  gap: 0.375rem;
}

.size-lg {
  height: 2.5rem;
  padding: 0.5rem 1.5rem;
}

.size-icon {
  width: 2.25rem;
  height: 2.25rem;
  padding: 0;
}

.size-icon-sm {
  width: 2rem;
  height: 2rem;
  padding: 0;
}

.size-icon-lg {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
}
</style>
