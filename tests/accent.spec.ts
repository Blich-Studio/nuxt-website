import { readFileSync } from 'node:fs'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { applyRandomPageAccent, FAMILY_NAMES, randomFamilyPair } from '../app/composables/useRandomAccent'

afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals() })

describe('restored color rotation', () => {
  it('chooses different primary/secondary accents and rotates away from the previous page', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(randomFamilyPair('lime')).toEqual(['magenta', 'lime'])
    const properties = new Map<string, string>()
    const body = { dataset: { accentFamily: 'lime' }, style: { setProperty: (name: string, value: string) => properties.set(name, value) } }
    vi.stubGlobal('document', { body })
    applyRandomPageAccent()
    expect(properties.get('--primary')).toBe('var(--family-magenta)')
    expect(properties.get('--primary-foreground')).toBe('var(--family-magenta-on)')
    expect(properties.get('--accent-secondary')).toBe('var(--family-lime)')
    expect(properties.get('--link')).toBe(properties.get('--primary'))
    applyRandomPageAccent()
    expect(body.dataset.accentFamily).toBe('lime')
  })
  it('keeps every family readable as text, buttons and logo letters on the dark surfaces', () => {
    const css = readFileSync(new URL('../app/assets/styles/main.scss', import.meta.url), 'utf8')
    const value = (token: string) => css.match(new RegExp(`--${token}:\\s*(#[0-9a-f]{6})`, 'i'))![1]!
    const luminance = (hex: string) => {
      const values = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255).map(v => v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)
      return values[0]! * 0.2126 + values[1]! * 0.7152 + values[2]! * 0.0722
    }
    const contrast = (a: string, b: string) => (Math.max(luminance(a), luminance(b)) + 0.05) / (Math.min(luminance(a), luminance(b)) + 0.05)
    for (const name of FAMILY_NAMES) {
      expect(contrast(value(`family-${name}`), value('background'))).toBeGreaterThanOrEqual(4.5)
      expect(contrast(value(`family-${name}`), value('card'))).toBeGreaterThanOrEqual(4.5)
      expect(contrast(value(`family-${name}`), value(`family-${name}-on`))).toBeGreaterThanOrEqual(4.5)
    }
  })
})
