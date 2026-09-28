import type { ProjectListItem } from '../types/api'
export function projectLabel(
  project: Pick<ProjectListItem, 'type' | 'slug'>,
): string {
  if (project.slug === '20-games-challenge')
    return 'Game development · Learning in public'
  const labels = {
    game: 'Game',
    engine: 'Game engine',
    tool: 'Development tool',
    animation: 'Animation & craft',
    artwork: 'Artwork',
    other: 'Experiment',
  }
  return labels[project.type] || 'Experiment'
}
export function chooseFeaturedProject(
  projects: ProjectListItem[],
): ProjectListItem | undefined {
  return (
    projects.find((p) => p.type === 'game' && p.featured) ||
    projects.find((p) => p.slug === '20-games-challenge') ||
    projects.find((p) => p.type === 'game') ||
    projects.find((p) => p.featured) ||
    projects[0]
  )
}
export function formatEditorialDate(date: string): string {
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}
export function listingPage(value: unknown): number {
  const text = typeof value === 'string' ? value : ''
  return /^[1-9]\d*$/.test(text) && Number.isSafeInteger(Number(text))
    ? Number(text)
    : 1
}
