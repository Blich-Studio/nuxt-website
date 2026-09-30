import { describe, expect, it, vi } from 'vitest'
import {
  collectPublishedPages,
  renderFeed,
  renderSitemap,
  type PublicEntry,
} from '../server/utils/discovery'
import { chooseFeaturedProject, listingPage } from '../app/utils/editorial'
import type { ProjectListItem } from '../app/types/api'

const entry = (slug: string, status = 'published'): PublicEntry => ({
  slug,
  status,
  title: 'A & B <C>',
  perex: 'Code <script> & craft',
  publishedAt: '2026-09-28T10:00:00Z',
})

describe('public discovery', () => {
  it('escapes feed content and excludes unpublished entries', () => {
    const xml = renderFeed([
      entry('hello-world'),
      entry('private-draft', 'draft'),
      entry('old', 'archived'),
    ])
    expect(xml).toContain('A &amp; B &lt;C&gt;')
    expect(xml).toContain('Code &lt;script&gt; &amp; craft')
    expect(xml).toContain('Mon, 28 Sep 2026 10:00:00 GMT')
    expect(xml).toContain('https://blichstudio.com/blog/hello-world')
    expect(xml).not.toContain('private-draft')
    expect(xml).not.toContain('/blog/old')
  })
  it('includes every sitemap page beyond the first twelve entries', async () => {
    const fetchPage = vi.fn(async (page: number) => ({
      data: Array.from({ length: page === 1 ? 12 : 3 }, (_, i) =>
        entry(`game-${(page - 1) * 12 + i}`),
      ),
      meta: { hasNext: page === 1 },
    }))
    const entries = await collectPublishedPages(fetchPage)
    expect(entries).toHaveLength(15)
    expect(fetchPage.mock.calls).toEqual([[1], [2]])
    const xml = renderSitemap(
      [...entries, entry('secret', 'draft')],
      [entry('a/b?c&d')],
    )
    expect(xml).toContain('/projects/game-14</loc>')
    expect(xml).toContain('/blog/a%2Fb%3Fc%26d</loc>')
    expect(xml).not.toContain('secret')
    expect(xml).toContain('https://blichstudio.com/contact</loc>')
  })
  it('fails on repeated pages or upstream failure rather than returning a partial sitemap', async () => {
    await expect(
      collectPublishedPages(async () => ({
        data: [entry('same')],
        meta: { hasNext: true },
      })),
    ).rejects.toThrow('did not advance')
    await expect(
      collectPublishedPages(async (page) => {
        if (page === 2) throw new Error('offline')
        return { data: [entry('one')], meta: { hasNext: true } }
      }),
    ).rejects.toThrow('offline')
  })
  it('omits invalid optional dates without breaking XML', () => {
    expect(
      renderFeed([{ ...entry('note'), publishedAt: 'bad' }]),
    ).not.toContain('<pubDate>')
    expect(
      renderSitemap(
        [{ ...entry('note'), updatedAt: 'bad', publishedAt: null }],
        [],
      ),
    ).not.toContain('<lastmod>')
  })
})

describe('editorial discovery', () => {
  it.each([
    undefined,
    null,
    ['2'],
    '0',
    '-1',
    '1.5',
    'Infinity',
    '1e3',
    '9007199254740992',
  ])('normalizes invalid listing page %j', (value) => {
    expect(listingPage(value)).toBe(1)
  })
  it('keeps valid page numbers for deep links', () => {
    expect(listingPage('12')).toBe(12)
  })
  it('puts games and the games challenge ahead of supporting craft', () => {
    const craft = {
      slug: 'puppet',
      type: 'animation',
      featured: true,
    } as ProjectListItem
    const challenge = {
      slug: '20-games-challenge',
      type: 'other',
      featured: true,
    } as ProjectListItem
    const game = {
      slug: 'game',
      type: 'game',
      featured: true,
    } as ProjectListItem
    expect(chooseFeaturedProject([craft, challenge])).toBe(challenge)
    expect(chooseFeaturedProject([craft, challenge, game])).toBe(game)
    expect(chooseFeaturedProject([])).toBeUndefined()
  })
})
