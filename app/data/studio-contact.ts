export interface StudioLink {
  name: string
  href: string
  description: string
}

// Studio contact destinations confirmed by Filip on 2026-09-30.
export const studioEmail = 'filip@blichstudio.com'
export const studioDiscord = 'https://discord.gg/Wsem6Fnw8e'
export const studioItchio = 'https://blich-studio.itch.io/'

export const studioSocialLinks: StudioLink[] = [
  { name: 'YouTube', href: 'https://www.youtube.com/@blichstudio.prague', description: 'Videos from the studio and the work behind the games.' },
  { name: 'GitHub', href: 'https://github.com/Blich-Studio', description: 'Code, tools, and open development.' },
  { name: 'Instagram', href: 'https://instagram.com/blichstudio.prague', description: 'Artwork, making-of photos, and studio moments.' },
  { name: 'TikTok', href: 'https://tiktok.com/@blichstudio.prague', description: 'Short videos from the workbench.' },
  { name: 'X', href: 'https://x.com/BlichStudio', description: 'Studio updates and conversations.' },
]
