<script setup lang="ts">
import { ref } from 'vue'

// Composables are auto-imported in Nuxt
const { signIn } = useAuth()
const { show, close } = useAuthModal()

const mode = ref<'signin' | 'signup'>('signin')
const name = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

function toggleMode() {
  mode.value = mode.value === 'signin' ? 'signup' : 'signin'
  error.value = null
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
  loading.value = true
  error.value = null
  try {
    await signIn({ email: email.value.trim(), password: password.value })
    close()
  } catch (e: any) {
    error.value = e?.message ?? 'Authentication failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="show" class="overlay" @click.self="close">
    <div class="modal">
      <button class="close-btn" @click="close">✕</button>
      
      <h2 class="title">{{ mode === 'signin' ? 'Sign In' : 'Create Account' }}</h2>

      <form class="form" @submit.prevent="submit">
        <div v-if="mode === 'signup'" class="field">
          <label class="label">Name</label>
          <input v-model="name" type="text" class="input" required />
        </div>

        <div class="field">
          <label class="label">Email</label>
          <input v-model="email" type="email" class="input" required />
        </div>

        <div class="field">
          <label class="label">Password</label>
          <input v-model="password" type="password" class="input" required />
        </div>

        <div v-if="error" class="error">{{ error }}</div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? 'Loading...' : (mode === 'signin' ? 'Sign In' : 'Sign Up') }}
        </button>
      </form>

      <div class="switch-mode">
        <button @click="toggleMode" class="switch-btn">
          {{ mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in' }}
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

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--sunset-orange, var(--clay-orange));
  color: white;
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
