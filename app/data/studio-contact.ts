export interface StudioLink {
  name: string
  href: string
  description: string
}

// Confirm these destinations before publishing the contact-page release.
export const studioEmail = ''
export const studioDiscord = ''
export const studioItchio = ''

export const studioSocialLinks: StudioLink[] = [
  { name: 'YouTube', href: 'https://www.youtube.com/@blichstudio.prague', description: 'Videos from the studio and the work behind the games.' },
  { name: 'GitHub', href: 'https://github.com/Blich-Studio', description: 'Code, tools, and open development.' },
  { name: 'Instagram', href: 'https://instagram.com/blichstudio.prague', description: 'Artwork, making-of photos, and studio moments.' },
  { name: 'TikTok', href: 'https://tiktok.com/@blichstudio.prague', description: 'Short videos from the workbench.' },
  { name: 'X', href: 'https://x.com/BlichStudio', description: 'Studio updates and conversations.' },
]
