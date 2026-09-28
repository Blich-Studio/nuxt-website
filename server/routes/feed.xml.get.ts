import { renderFeed } from '../utils/discovery'
import { fetchPublicPage } from '../utils/public-content'

export default defineEventHandler(async (event) => {
  try {
    const page = await fetchPublicPage('articles', 1, 30)
    const feed = renderFeed(page.data)
    setHeader(event, 'Content-Type', 'application/rss+xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=300')
    return feed
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: 'The feed is temporarily unavailable',
    })
  }
})
