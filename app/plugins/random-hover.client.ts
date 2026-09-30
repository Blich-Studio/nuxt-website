import { randomFamily, familyVar, familyOnVar, type FamilyName } from '~/composables/useRandomAccent'

export default defineNuxtPlugin(() => {
  let lastShuffleAt = 0
  let previous: FamilyName | undefined
  const handleHover = (event: Event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const target = event.target
    if (!(target instanceof Element)) return
    const control = target.closest('a, button')
    if (!control) return
    // Ignore movement between children of the same link or button.
    if (event instanceof MouseEvent && event.relatedTarget instanceof Node && control.contains(event.relatedTarget)) return
    const now = performance.now()
    if (now - lastShuffleAt < 220) return
    lastShuffleAt = now
    previous = randomFamily(previous)
    const style = document.body.style
    style.setProperty('--accent-secondary', familyVar(previous))
    style.setProperty('--accent-secondary-on', familyOnVar(previous))
    style.setProperty('--clay-rust', familyVar(previous))
    style.setProperty('--sunset-deep', familyVar(previous))
  }
  document.addEventListener('mouseover', handleHover, { passive: true })
  document.addEventListener('focusin', handleHover)
  if (import.meta.hot) import.meta.hot.dispose(() => {
    document.removeEventListener('mouseover', handleHover)
    document.removeEventListener('focusin', handleHover)
  })
})
