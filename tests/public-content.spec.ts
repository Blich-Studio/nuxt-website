import { afterEach, expect, it, vi } from 'vitest'
import { fetchPublicPage } from '../server/utils/public-content'

afterEach(() => vi.unstubAllGlobals())

it('uses the gateway pagination envelope and requests only anonymous published content', async () => {
  const response = { data: [], meta: { hasNext: false } }
  const fetch = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('$fetch', fetch)
  vi.stubGlobal('useRuntimeConfig', () => ({
    apiUrl: 'https://api.example.test/',
    public: {},
  }))
  expect(await fetchPublicPage('articles', 2, 30)).toBe(response)
  expect(fetch).toHaveBeenCalledWith('https://api.example.test/articles', {
    query: {
      status: 'published',
      page: 2,
      limit: 30,
      sort: 'publishedAt',
      order: 'desc',
    },
    retry: 0,
    timeout: 10000,
  })
})

it('rejects malformed API responses instead of publishing an empty successful feed', async () => {
  vi.stubGlobal('$fetch', vi.fn().mockResolvedValue({ data: [] }))
  vi.stubGlobal('useRuntimeConfig', () => ({
    apiUrl: 'https://api.example.test',
    public: {},
  }))
  await expect(fetchPublicPage('projects')).rejects.toThrow(
    'Invalid public content response',
  )
})
