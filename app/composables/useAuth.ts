import { useAuthModal } from './useAuthModal'

export interface AuthUser {
  userId: string
  email: string
  name?: string
}

export interface RegisterPayload {
  email: string
  password: string
  nickname: string
  firstName?: string
  lastName?: string
}

export interface RegisteredUser {
  id: string
  email: string
  nickname: string
  firstName?: string | null
  lastName?: string | null
  isVerified: boolean
  role: string
  createdAt: string
}

export function useAuth() {
  // SSR-safe shared state using useState
  const user = useState<AuthUser | null>('auth-user', () => null)
  const loading = useState<boolean>('auth-loading', () => false)
  const initialized = useState<boolean>('auth-initialized', () => false)
  const lastFetchTime = useState<number>('auth-last-fetch', () => 0)

  // Minimum time between fetchUser calls (prevents excessive API calls)
  const FETCH_COOLDOWN_MS = 5000

  /**
   * Fetch current user from API
   * Uses the server-side proxy which handles:
   * - HttpOnly cookie-based authentication
   * - Automatic token refresh on 401
   */
  async function fetchUser(force = false): Promise<AuthUser | null> {
    // Prevent concurrent fetches
    if (loading.value) return user.value

    // Respect cooldown unless forced
    const now = Date.now()
    if (!force && initialized.value && now - lastFetchTime.value < FETCH_COOLDOWN_MS) {
      return user.value
    }

    loading.value = true

    try {
      const res = await $fetch<AuthUser>('/api/_proxy/auth/me', {
        credentials: 'include',
      })

      // API returns user object directly: {userId, email, name}
      user.value = res ?? null
      lastFetchTime.value = Date.now()
      return user.value
    } catch (e: any) {
      // 401 means not authenticated (proxy already tried to refresh)
      if (e?.statusCode === 401 || e?.response?.status === 401) {
        user.value = null
      }
      // For other errors (network, 500), don't clear user state
      // This prevents logout on temporary server issues
      return user.value
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  /**
   * Sign in with email and password
   * The server-side proxy stores tokens in HttpOnly cookies
   */
  async function signIn(credentials: { email: string; password: string }): Promise<AuthUser> {
    loading.value = true

    try {
      const res = await $fetch<{ user: { id: string; email: string; name?: string } }>('/api/_proxy/auth/login', {
        method: 'POST',
        body: credentials,
        credentials: 'include',
      })

      // Login response has user.id, map to userId for consistency
      if (res?.user) {
        user.value = {
          userId: res.user.id,
          email: res.user.email,
          name: res.user.name,
        }
      } else {
        user.value = null
      }

      lastFetchTime.value = Date.now()

      if (!user.value) {
        throw new Error('Invalid login response')
      }

      return user.value
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  /**
   * Sign out - clears cookies and user state
   */
  async function signOut(): Promise<void> {
    try {
      await $fetch('/api/_proxy/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })
    } catch (e) {
      // Ignore logout errors - clear state anyway
      console.error('Logout error:', e)
    } finally {
      user.value = null
    }
  }

  /**
   * Register a new user (does not sign in)
   */
  async function register(payload: RegisterPayload): Promise<RegisteredUser> {
    loading.value = true

    try {
      return await $fetch<RegisteredUser>('/api/_proxy/auth/register', {
        method: 'POST',
        body: payload,
        credentials: 'include',
      })
    } finally {
      loading.value = false
      initialized.value = true
    }
  }

  /**
   * Show authentication modal
   */
  function showAuthModal() {
    const { open } = useAuthModal()
    open()
  }

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = computed(() => !!user.value?.userId)

  return {
    user,
    loading,
    initialized,
    isAuthenticated,
    fetchUser,
    signIn,
    register,
    signOut,
    showAuthModal,
  }
}
