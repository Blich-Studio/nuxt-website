import { randomFamily, familyVar, familyOnVar } from '~/composables/useRandomAccent'

/**
 * random-hover.client — delegates mouseover events and randomizes the
 * body-level --accent-secondary (+ legacy hover aliases) on each interactive
 * element encountered. Every hover is a surprise.
 *
 * Throttled so rapid mouse sweeps don't cause a strobe effect.
 */

const HOVER_TARGET_SELECTOR = 'a, button, [class*="card" i], [class*="btn" i], [class*="badge" i], [class*="tag" i]'
const THROTTLE_MS = 220

export default defineNuxtPlugin(() => {
  if (typeof document === 'undefined') return

  let lastShuffleAt = 0

  const shuffleSecondary = () => {
    const pickedFamily = randomFamily()
    const s = document.body.style
    s.setProperty('--accent-secondary', familyVar(pickedFamily))
    s.setProperty('--accent-secondary-on', familyOnVar(pickedFamily))
    s.setProperty('--clay-rust', familyVar(pickedFamily))
    s.setProperty('--sunset-deep', familyVar(pickedFamily))
    s.setProperty('--clay-terracotta', familyVar(pickedFamily))
  }

  const handleMouseOver = (e: MouseEvent) => {
    const now = performance.now()
    if (now - lastShuffleAt < THROTTLE_MS) return

    const target = e.target as HTMLElement | null
    if (!target?.closest?.(HOVER_TARGET_SELECTOR)) return

    lastShuffleAt = now
    shuffleSecondary()
  }

  document.addEventListener('mouseover', handleMouseOver, { passive: true })
})
