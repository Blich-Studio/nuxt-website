<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import Button from '~/components/ui/Button.vue'

const route = useRoute()
const { showAuthModal } = useAuth()

const status = ref<'loading' | 'success' | 'error'>('loading')
const message = ref('Verifying your email...')

const resendEmail = ref('')
const resendStatus = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')

useHead({
  title: 'Verify Email',
})

const redirectCountdown = ref(0)
let countdownInterval: ReturnType<typeof setInterval> | undefined

onMounted(async () => {
  const token = typeof route.query.token === 'string' ? route.query.token : ''
  if (!token) {
    status.value = 'error'
    message.value = 'No verification token provided.'
    return
  }

  const minDelay = new Promise(resolve => setTimeout(resolve, 500))
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Request timed out. Please try again.')), 15000)
  )

  try {
    await Promise.all([
      Promise.race([
        $fetch('/api/_proxy/auth/verify', {
          query: { token },
        }),
        timeout,
      ]),
      minDelay,
    ])
    status.value = 'success'
    message.value = 'Your email has been verified.'

    // Auto-redirect countdown
    redirectCountdown.value = 5
    countdownInterval = setInterval(() => {
      redirectCountdown.value--
      if (redirectCountdown.value <= 0) {
        clearInterval(countdownInterval)
        navigateTo('/')
      }
    }, 1000)
  } catch (e: any) {
    status.value = 'error'
    message.value =
      e?.data?.error?.message ||
      e?.statusMessage ||
      'Verification failed. Please request a new link.'
  }
})

onBeforeUnmount(() => {
  if (countdownInterval) clearInterval(countdownInterval)
})

async function handleResend() {
  if (!resendEmail.value.trim()) return
  resendStatus.value = 'sending'
  try {
    await $fetch('/api/_proxy/auth/resend-verification', {
      method: 'POST',
      body: { email: resendEmail.value.trim() },
      credentials: 'include',
    })
    resendStatus.value = 'sent'
  } catch {
    resendStatus.value = 'error'
  }
}
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

      <div v-if="status === 'success'" :class="$style.actions">
        <Button @click="showAuthModal">Log In</Button>
        <Button variant="ghost" to="/">Go to Homepage</Button>
      </div>
      <p v-if="status === 'success' && redirectCountdown > 0" :class="$style.redirectNote">
        Redirecting to homepage in {{ redirectCountdown }}s...
      </p>

      <div v-if="status === 'error'" :class="$style.actions">
        <Button variant="ghost" to="/">Go Home</Button>
        <Button variant="ghost" to="/blog">Browse Blog</Button>
      </div>

      <div v-if="status === 'error'" :class="$style.resendSection">
        <p :class="$style.resendLabel">Didn't receive the email?</p>
        <form :class="$style.resendRow" @submit.prevent="handleResend">
          <input
            v-model="resendEmail"
            type="email"
            placeholder="Enter your email"
            :class="$style.resendInput"
            :disabled="resendStatus === 'sending' || resendStatus === 'sent'"
            required
          />
          <Button
            type="submit"
            size="sm"
            :disabled="resendStatus === 'sending' || resendStatus === 'sent'"
          >
            {{ resendStatus === 'sending' ? 'Sending...' : 'Resend' }}
          </Button>
        </form>
        <p v-if="resendStatus === 'sent'" :class="$style.resendMessage">
          If this email is registered, a new verification link has been sent.
        </p>
        <p v-if="resendStatus === 'error'" :class="$style.resendError">
          Something went wrong. Please try again.
        </p>
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
  background-color: color-mix(in oklch, var(--clay-rust) 20%, transparent);
  filter: blur(40px);
}

.blobOrange {
  top: 8rem;
  left: 12%;
  width: 12rem;
  height: 12rem;
  border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
  background-color: color-mix(in oklch, var(--clay-orange) 10%, transparent);
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

.redirectNote {
  color: $color-muted-foreground;
  font-size: $text-sm;
  margin-top: 0.75rem;
  text-align: center;
}

.resendSection {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border);
}

.resendLabel {
  color: $color-muted-foreground;
  font-size: $text-sm;
  margin: 0 0 0.75rem;
}

.resendRow {
  display: flex;
  gap: 0.5rem;
}

.resendInput {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--border);
  border-radius: $radius-md;
  background: var(--background);
  color: var(--foreground);
  font-size: $text-sm;

  &:focus {
    outline: none;
    border-color: var(--clay-orange);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--clay-orange) 15%, transparent);
  }

  &:disabled {
    opacity: 0.5;
  }
}

.resendMessage {
  color: var(--clay-orange);
  font-size: $text-sm;
  margin: 0.75rem 0 0;
  text-align: left;
}

.resendError {
  color: var(--destructive);
  font-size: $text-sm;
  margin: 0.75rem 0 0;
  text-align: left;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
