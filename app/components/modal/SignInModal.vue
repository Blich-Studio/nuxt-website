<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

// Composables are auto-imported in Nuxt
const { signIn, register } = useAuth()
const { show, close } = useAuthModal()

const mode = ref<'signin' | 'signup'>('signin')
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)
const success = ref<string | null>(null)
const modal = ref<HTMLElement>()
let previousFocus: HTMLElement | null = null
watch(show, async (visible) => {
  if (visible) {
    previousFocus = document.activeElement as HTMLElement | null
    await nextTick()
    modal.value?.querySelector<HTMLInputElement>('input')?.focus()
  } else {
    previousFocus?.focus()
  }
})
function handleKey(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    event.preventDefault()
    close()
    return
  }
  if (event.key !== 'Tab') return
  const controls = modal.value?.querySelectorAll<HTMLElement>(
    'button:not(:disabled), input:not(:disabled)',
  )
  if (!controls?.length) return
  const first = controls[0]!
  const last = controls[controls.length - 1]!
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

function toggleMode() {
  mode.value = mode.value === 'signin' ? 'signup' : 'signin'
  error.value = null
  success.value = null
}

async function submit() {
  if (mode.value === 'signup' && !name.value.trim()) {
    error.value = 'Please enter your name.'
    return
  }
  if (!email.value.trim()) {
    error.value = 'Please enter your email.'
    return
  }
  if (mode.value === 'signup' && !password.value.trim()) {
    error.value = 'Please enter a password.'
    return
  }
  loading.value = true
  error.value = null
  success.value = null
  try {
    if (mode.value === 'signup') {
      await register({
        email: email.value.trim(),
        password: password.value,
        nickname: name.value.trim(),
      })
      success.value =
        'Account created. Check your email to verify, then sign in.'
      mode.value = 'signin'
    } else {
      await signIn({ email: email.value.trim(), password: password.value })
      close()
    }
  } catch (e: any) {
    error.value = e?.message ?? 'Authentication failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="show" class="overlay" @click.self="close">
    <div
      ref="modal"
      class="modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
      @keydown="handleKey"
    >
      <button aria-label="Close sign in" class="close-btn" @click="close">
        ✕
      </button>

      <h2 id="auth-title" class="title">
        {{ mode === 'signin' ? 'Sign In' : 'Create Account' }}
      </h2>

      <form class="form" @submit.prevent="submit">
        <div v-if="mode === 'signup'" class="field">
          <label for="auth-name" class="label">Name</label>
          <input
            id="auth-name"
            v-model="name"
            type="text"
            class="input"
            required
          />
        </div>

        <div class="field">
          <label for="auth-email" class="label">Email</label>
          <input
            id="auth-email"
            v-model="email"
            type="email"
            class="input"
            required
          />
        </div>

        <div class="field">
          <label for="auth-password" class="label">Password</label>
          <input
            id="auth-password"
            v-model="password"
            type="password"
            class="input"
            required
          />
        </div>

        <div v-if="error" class="error" role="alert">{{ error }}</div>
        <div v-if="success" class="success" role="status">{{ success }}</div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{
            loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Sign Up'
          }}
        </button>
      </form>

      <div class="switch-mode">
        <button @click="toggleMode" class="switch-btn">
          {{
            mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'
          }}
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
}

.modal {
  position: relative;
  background-color: var(--card);
  border: 1px solid var(--border);
  border-radius: 1rem;
  padding: 2rem;
  width: 100%;
  max-width: 28rem;
  max-height: calc(100dvh - 2rem);
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--muted-foreground);
  cursor: pointer;
  font-size: 1.25rem;
  transition: color 0.2s ease;

  &:hover {
    color: var(--foreground);
  }
}

.title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: var(--foreground);
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
}

.label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--foreground);
}

.input {
  width: 100%;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background-color: var(--background);
  color: var(--foreground);
  font-size: 1rem;

  &::placeholder {
    color: var(--muted-foreground);
  }

  &:focus {
    outline: none;
    border-color: var(--clay-orange);
    box-shadow: 0 0 0 2px rgba(200, 120, 60, 0.2);
  }
}

.error {
  color: var(--destructive);
  font-size: 0.875rem;
}

.success {
  color: var(--clay-orange);
  font-size: 0.875rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--sunset-orange, var(--clay-orange));
  color: var(--primary-foreground);
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: var(--sunset-deep, var(--clay-rust));
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.switch-mode {
  margin-top: 1.5rem;
  text-align: center;
}

.switch-btn {
  background: none;
  border: none;
  color: var(--muted-foreground);
  font-size: 0.875rem;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: var(--clay-orange);
  }
}
</style>
