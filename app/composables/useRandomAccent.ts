/**
 * useRandomAccent — primitives for chameleon randomness.
 *
 * The brand's chameleon-graffiti identity is reinforced by unpredictability
 * within a curated family. These helpers let any surface pick a random family
 * color while staying on-brand.
 *
 * See: _bmad-output/planning-artifacts/ux-design-specification.md
 */

export const FAMILY_NAMES = ['lime', 'magenta', 'cyan', 'oxblood', 'marigold'] as const
export type FamilyName = (typeof FAMILY_NAMES)[number]

/**
 * Pick a random family name. Optionally exclude one (e.g., to pick a secondary
 * that differs from the primary).
 */
export function randomFamily(exclude?: FamilyName): FamilyName {
  const pool = exclude ? FAMILY_NAMES.filter((n) => n !== exclude) : [...FAMILY_NAMES]
  return pool[Math.floor(Math.random() * pool.length)] as FamilyName
}

/**
 * Pick two distinct family names as a [primary, secondary] pair.
 */
export function randomFamilyPair(): [FamilyName, FamilyName] {
  const primary = randomFamily()
  const secondary = randomFamily(primary)
  return [primary, secondary]
}

/**
 * Build the CSS `var()` reference for a family base color.
 */
export function familyVar(name: FamilyName): string {
  return `var(--family-${name})`
}

/**
 * Build the CSS `var()` reference for a family's paired text-on color.
 */
export function familyOnVar(name: FamilyName): string {
  return `var(--family-${name}-on)`
}

/**
 * Apply a random primary + secondary accent pair to <body>.
 * Overrides the CSS rotation defined via body[data-page='...'].
 * Client-only — safe to call from onMounted.
 */
export function applyRandomPageAccent(): void {
  if (typeof document === 'undefined') return
  const [primary, secondary] = randomFamilyPair()
  const s = document.body.style
  s.setProperty('--accent-primary', familyVar(primary))
  s.setProperty('--accent-primary-on', familyOnVar(primary))
  s.setProperty('--accent-secondary', familyVar(secondary))
  s.setProperty('--accent-secondary-on', familyOnVar(secondary))
  // Legacy aliases follow the random pair so existing components rotate too.
  s.setProperty('--clay-orange', familyVar(primary))
  s.setProperty('--sunset-orange', familyVar(primary))
  s.setProperty('--clay-rust', familyVar(secondary))
  s.setProperty('--sunset-deep', familyVar(secondary))
  s.setProperty('--clay-terracotta', familyVar(secondary))
}

/**
 * Per-item random accent (Layer 3).
 *
 * Returns a function `accentFor(key)` that yields a stable random family
 * color for that key — once assigned, the same key always returns the same
 * color. Useful for tag/badge lists where each item should have its own
 * random family color that persists across re-renders.
 *
 * SSR-safe: returns undefined until onMounted fires, so server-rendered HTML
 * shows the default styles and no hydration mismatch occurs.
 */
export function useRandomItemAccent() {
  const cache = reactive<Record<string, string>>({})
  const active = ref(false)

  onMounted(() => {
    active.value = true
  })

  return function accentFor(key: string): Record<string, string> | undefined {
    if (!active.value) return undefined
    if (!cache[key]) {
      cache[key] = familyVar(randomFamily())
    }
    const color = cache[key]
    return {
      color,
      borderColor: `color-mix(in oklch, ${color} 40%, transparent)`,
      backgroundColor: `color-mix(in oklch, ${color} 12%, transparent)`,
    }
  }
}

/**
 * Per-letter random color generator (Layer 4).
 *
 * Returns a function `colorFor(key)` that yields a stable random family color
 * per letter-key. Like useRandomItemAccent but returns just a color string.
 * Client-only via the same onMounted gate.
 */
export function useRandomLetterColor() {
  const cache = reactive<Record<string, string>>({})
  const active = ref(false)

  onMounted(() => {
    active.value = true
  })

  return function colorFor(key: string): string | undefined {
    if (!active.value) return undefined
    if (!cache[key]) {
      cache[key] = familyVar(randomFamily())
    }
    return cache[key]
  }
}
