import type { PublicPage } from './discovery'

export async function fetchPublicPage(
  resource: 'projects' | 'articles',
  page = 1,
  limit = 100,
): Promise<PublicPage> {
  const config = useRuntimeConfig()
  const baseURL = (config.apiUrl || config.public.apiUrl || '')
    .trim()
    .replace(/\/$/, '')
  if (!baseURL) throw new Error('Missing API configuration')
  // Do not forward visitor credentials: feeds and sitemaps must always be public.
  const response = await $fetch<PublicPage>(`${baseURL}/${resource}`, {
    query: {
      status: 'published',
      page,
      limit,
      sort: 'publishedAt',
      order: 'desc',
    },
    retry: 0,
    timeout: 10000,
  })
  if (
    !Array.isArray(response?.data) ||
    typeof response.meta?.hasNext !== 'boolean'
  )
    throw new Error('Invalid public content response')
  return response
}
