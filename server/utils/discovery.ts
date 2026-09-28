export const siteUrl = 'https://blichstudio.com'

export interface PublicEntry {
  slug: string
  title: string
  status: string
  perex?: string
  publishedAt?: string | null
  updatedAt?: string | null
}

export interface PublicPage {
  data: PublicEntry[]
  meta: { hasNext: boolean }
}

export function xmlEscape(value: string): string {
  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(
      /[&<>"']/g,
      (char) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&apos;',
        })[char]!,
    )
}

function publicEntries(entries: PublicEntry[]): PublicEntry[] {
  return entries.filter(
    (entry) => entry.status === 'published' && entry.slug && entry.title,
  )
}

function dateValue(value?: string | null): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isFinite(date.getTime()) ? date : undefined
}

export function renderFeed(entries: PublicEntry[]): string {
  const items = publicEntries(entries)
    .map((entry) => {
      const url = xmlEscape(`${siteUrl}/blog/${encodeURIComponent(entry.slug)}`)
      const published = dateValue(entry.publishedAt)
      return `<item><title>${xmlEscape(entry.title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><description>${xmlEscape(entry.perex || '')}</description>${published ? `<pubDate>${published.toUTCString()}</pubDate>` : ''}</item>`
    })
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>Blich Studio Workshop</title><link>${siteUrl}/blog</link><description>Development notes, making-of stories, and lessons from building games.</description><language>en</language><atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`
}

// Fail rather than quietly publishing a truncated sitemap when the API stops advancing.
export async function collectPublishedPages(
  fetchPage: (page: number) => Promise<PublicPage>,
): Promise<PublicEntry[]> {
  const entries = new Map<string, PublicEntry>()
  for (let page = 1; page <= 100; page++) {
    const result = await fetchPage(page)
    if (
      !Array.isArray(result.data) ||
      typeof result.meta?.hasNext !== 'boolean'
    )
      throw new Error('Invalid public content page')
    const previousSize = entries.size
    for (const entry of publicEntries(result.data))
      entries.set(entry.slug, entry)
    if (!result.meta.hasNext) return [...entries.values()]
    if (entries.size === previousSize)
      throw new Error('Public content pagination did not advance')
  }
  throw new Error('Public content pagination exceeded sitemap limit')
}

export function renderSitemap(
  projects: PublicEntry[],
  articles: PublicEntry[],
): string {
  const locations = ['/', '/projects', '/blog', '/about'].map(
    (path) => `<url><loc>${siteUrl}${path}</loc></url>`,
  )
  for (const [section, entries] of [
    ['projects', projects],
    ['blog', articles],
  ] as const) {
    for (const entry of publicEntries(entries)) {
      const date = dateValue(entry.updatedAt) || dateValue(entry.publishedAt)
      locations.push(
        `<url><loc>${siteUrl}/${section}/${xmlEscape(encodeURIComponent(entry.slug))}</loc>${date ? `<lastmod>${date.toISOString()}</lastmod>` : ''}</url>`,
      )
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locations.join('')}</urlset>`
}
