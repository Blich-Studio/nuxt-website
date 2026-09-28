import { collectPublishedPages, renderSitemap } from '../utils/discovery'
import { fetchPublicPage } from '../utils/public-content'

export default defineEventHandler(async (event) => {
  try {
    const [projects, articles] = await Promise.all([
      collectPublishedPages((page) => fetchPublicPage('projects', page)),
      collectPublishedPages((page) => fetchPublicPage('articles', page)),
    ])
    const sitemap = renderSitemap(projects, articles)
    setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
    setHeader(event, 'Cache-Control', 'public, max-age=300')
    return sitemap
  } catch {
    throw createError({
      statusCode: 503,
      statusMessage: 'The sitemap is temporarily unavailable',
    })
  }
})
