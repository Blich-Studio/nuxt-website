/**
 * Client-side auth initialization plugin
 * Runs on app startup to restore auth state from HttpOnly cookies
 */
export default defineNuxtPlugin(async () => {
  const { fetchUser, initialized } = useAuth()

  // Only fetch if not already initialized (prevents double fetch)
  if (!initialized.value) {
    await fetchUser(true)
  }
})
