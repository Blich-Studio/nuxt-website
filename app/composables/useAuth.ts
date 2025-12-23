import { ref } from 'vue'
import { useApi } from './useApi'
import { useAuthModal } from './useAuthModal'

const user = ref<any>(null)
const loading = ref(false)
const initialized = ref(false)

export function useAuth() {
  const api = useApi()
  const config = useRuntimeConfig()

  if (!config?.public?.apiUrl) {
    throw new Error('Missing API_URL runtime config. Set runtimeConfig.public.apiUrl to your API gateway.')
  }

  // Check if there's an auth cookie present
  function hasAuthCookie(): boolean {
    if (typeof document === 'undefined') return false
    // Look for common auth cookie names (adjust based on your API's cookie name)
    const cookies = document.cookie
    return cookies.includes('access_token') || 
           cookies.includes('auth_token') || 
           cookies.includes('session') ||
           cookies.includes('jwt')
  }

  async function fetchUser() {
    // Skip API call if no auth cookie is present
    if (!hasAuthCookie()) {
      user.value = null
      initialized.value = true
      return
    }

    loading.value = true
    try {
      const res: any = await api('/auth/me')
      user.value = res?.user ?? null
    } catch (e) {
      user.value = null
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  async function signIn(credentials?: { name?: string; email?: string }) {
    loading.value = true
    try {
      const res: any = await api('/auth/login', { method: 'POST', body: credentials })
      if (!res || !res.user) throw new Error('Invalid login response')
      user.value = res.user
      return res.user
    } finally {
      loading.value = false
    }
  }

  async function signOut() {
    try {
      await api('/auth/logout', { method: 'POST' })
    } finally {
      user.value = null
    }
  }

  function showAuthModal() {
    const { open } = useAuthModal()
    open()
  }

  // Only fetch user on client-side if not already initialized
  if (typeof window !== 'undefined' && !initialized.value) {
    fetchUser()
  }

  return {
    user,
    loading,
    initialized,
    fetchUser,
    signIn,
    signOut,
    showAuthModal,
  }
}
