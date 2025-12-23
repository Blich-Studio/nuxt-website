<script setup lang="ts">
import { useAttrs } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' },
})

const emits = defineEmits(['update:modelValue'])
const attrs = useAttrs()

function onInput(e: Event) {
  const target = e.target as HTMLTextAreaElement
  emits('update:modelValue', target.value)
}
</script>

<template>
  <textarea
    data-slot="textarea"
    :class="[$style.textarea, attrs.class]"
    :placeholder="props.placeholder"
    :value="props.modelValue"
    @input="onInput"
  />
</template>

<style lang="scss" module>
@use '../../assets/styles/variables' as *;

.textarea {
  display: flex;
  width: 100%;
  min-height: 4rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid $color-border;
  border-radius: 0.375rem;
  background-color: transparent;
  font-size: $text-base;
  line-height: 1.5;
  color: $color-foreground;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  @media (min-width: $breakpoint-md) {
    font-size: $text-sm;
  }

  &::placeholder {
    color: $color-muted-foreground;
  }

  &:focus-visible {
    border-color: $color-ring;
    box-shadow: 0 0 0 3px rgba(var(--ring-rgb, 200, 100, 50), 0.5);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
}
</style>
