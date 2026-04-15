<script setup lang="ts">
interface Props {
  variant?: 'text' | 'circular' | 'rectangular' | 'image'
  width?: string
  height?: string
  lines?: number
}

withDefaults(defineProps<Props>(), {
  variant: 'text',
  width: '100%',
  height: undefined,
  lines: 1,
})
</script>

<template>
  <div
    v-if="variant !== 'text' || lines === 1"
    :class="[$style.skeleton, $style[variant]]"
    :style="{ width, height }"
  />
  <div v-else :class="$style.textBlock">
    <div
      v-for="i in lines"
      :key="i"
      :class="[$style.skeleton, $style.text]"
      :style="{ width: i === lines ? '70%' : '100%' }"
    />
  </div>
</template>

<style lang="scss" module>
@use '../../assets/styles/variables' as *;

.skeleton {
  background: linear-gradient(
    90deg,
    var(--border) 25%,
    var(--canvas-card) 50%,
    var(--border) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: $radius-sm;

  :global([data-theme='dark']) & {
    background: linear-gradient(
      90deg,
      oklch(0.18 0.005 280) 25%,
      oklch(0.22 0.005 280) 50%,
      oklch(0.18 0.005 280) 75%
    );
    background-size: 200% 100%;
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.text {
  height: 1em;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.textBlock {
  display: flex;
  flex-direction: column;
}

.circular {
  border-radius: 50%;
}

.rectangular {
  border-radius: $radius-md;
}

.image {
  border-radius: $radius-lg;
  aspect-ratio: 16 / 9;
}
</style>
