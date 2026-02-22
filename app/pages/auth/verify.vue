<script setup lang="ts">
import { onMounted, ref } from 'vue'

const route = useRoute()
const router = useRouter()

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('Verifying your email...')
const showPopup = ref(false)

useHead({
  title: 'Verify Email',
})

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (!token) {
    status.value = 'error'
    message.value = 'Missing verification token.'
    return
  }

  try {
    await $fetch('/api/_proxy/auth/verify', {
      query: { token },
      credentials: 'include',
    })
    status.value = 'success'
    message.value = 'Account activated successfully.'
    showPopup.value = true

    setTimeout(() => {
      router.push('/')
    }, 2200)
  } catch (e: any) {
    status.value = 'error'
    message.value =
      e?.data?.error?.message ||
      e?.statusMessage ||
      'Verification failed. Please request a new link.'
  }
})
</script>

<template>
  <div :class="$style.page">
    <div :class="[$style.blob, $style.blobRust]" />
    <div :class="[$style.blob, $style.blobOrange]" />
    <div :class="[$style.blob, $style.blobBeige]" />
    <div :class="[$style.blob, $style.blobGrain]" />

    <div :class="$style.card">
      <div :class="$style.tagline">
        <span>EMAIL VERIFICATION</span>
      </div>
      <div :class="$style.iconWrap">
        <Icon
          :name="status === 'success' ? 'lucide:badge-check' : status === 'error' ? 'lucide:shield-x' : 'lucide:loader-2'"
          :class="[$style.icon, status === 'loading' && $style.iconSpin]"
        />
      </div>
      <h1 :class="$style.title">
        <span :class="$style.titleMain">BLICH</span>
        <span :class="$style.titleAccent">STUDIO</span>
      </h1>
      <p :class="$style.message">{{ message }}</p>

      <div v-if="status === 'error'" :class="$style.actions">
        <NuxtLink to="/" :class="$style.primaryBtn">Go Home</NuxtLink>
        <NuxtLink to="/blog" :class="$style.ghostBtn">Browse Blog</NuxtLink>
      </div>
    </div>

    <div v-if="showPopup" :class="$style.popup">
      <div :class="$style.popupCard">
        <Icon name="lucide:check-circle-2" :class="$style.popupIcon" />
        <div>
          <div :class="$style.popupTitle">Account activated</div>
          <div :class="$style.popupText">Redirecting to homepage...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" module>
@use '../../assets/styles/variables' as *;

.page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
  position: relative;
  overflow: hidden;
  background: var(--background);
}

.blob {
  position: absolute;
  transition: transform 0.1s ease-out;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.blobRust {
  top: 4rem;
  right: 10%;
  width: 8rem;
  height: 8rem;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  background-color: oklch(0.52 0.12 35 / 0.2);
  filter: blur(40px);
}

.blobOrange {
  top: 8rem;
  left: 12%;
  width: 12rem;
  height: 12rem;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  background-color: oklch(0.68 0.14 45 / 0.1);
  filter: blur(48px);
}

.blobBeige {
  bottom: 6rem;
  right: 18%;
  width: 10rem;
  height: 10rem;
  border-radius: 30% 70% 70% 30% / 30% 60% 40% 70%;
  background-color: oklch(0.78 0.06 60 / 0.15);
  filter: blur(40px);
}

.blobGrain {
  top: 55%;
  left: 6%;
  width: 6rem;
  height: 6rem;
  border-radius: 50%;
  background-color: oklch(0.88 0.03 70 / 0.1);
  filter: blur(24px);
}

.card {
  width: min(32rem, 100%);
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 1.25rem;
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 30px 80px -40px rgba(0, 0, 0, 0.35);
  position: relative;
  z-index: 1;
}

.tagline {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.35rem 0.85rem;
  border: 2px solid color-mix(in srgb, var(--clay-orange) 30%, transparent);
  background-color: color-mix(in srgb, var(--clay-orange) 5%, transparent);
  transform: rotate(-1deg);

  span {
    color: var(--clay-orange);
    font-family: var(--font-mono);
    font-size: 0.75rem;
    letter-spacing: 0.05em;
  }
}

.iconWrap {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1.5rem;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--clay-orange) 16%, transparent);
  border: 1px solid color-mix(in srgb, var(--clay-orange) 35%, transparent);
}

.icon {
  width: 2rem;
  height: 2rem;
  color: var(--clay-orange);
}

.iconSpin {
  animation: spin 1s linear infinite;
}

.title {
  font-family: $font-display;
  font-size: clamp(2.5rem, 6vw, 4rem);
  margin-bottom: 1rem;
  line-height: 0.9;
  letter-spacing: -0.04em;
}

.titleMain {
  display: block;
  color: var(--foreground);
}

.titleAccent {
  display: block;
  color: var(--clay-orange);
}

.message {
  color: $color-muted-foreground;
  font-size: clamp(1rem, 2vw, 1.25rem);
  margin: 0;
  border-left: 4px solid var(--clay-rust);
  padding-left: 1.25rem;
  text-align: left;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 1.75rem;
  flex-wrap: wrap;
}

.primaryBtn,
.ghostBtn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 999px;
  padding: 0.6rem 1.25rem;
  font-size: $text-sm;
  font-weight: 600;
}

.primaryBtn {
  background: var(--clay-orange);
  color: var(--primary-foreground);
}

.ghostBtn {
  border: 1px solid var(--border);
  color: var(--foreground);
}

.popup {
  position: fixed;
  inset: auto 1rem 1.5rem 1rem;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.popupCard {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 0.75rem 1.25rem;
  box-shadow: 0 12px 30px -20px rgba(0, 0, 0, 0.4);
}

.popupIcon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--clay-orange);
}

.popupTitle {
  font-weight: 600;
}

.popupText {
  font-size: $text-xs;
  color: $color-muted-foreground;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
