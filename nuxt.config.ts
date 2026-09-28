import process from 'node:process'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon'],
  css: ['~/assets/styles/main.scss'],

  icon: {
    // Use Lucide icons (same as original Next.js site)
    serverBundle: 'remote',
  },

  app: {
    head: {
      title: 'Blich Studio | Independent games & open workshop',
      meta: [
        { name: 'theme-color', content: '#161914' },
        { property: 'og:site_name', content: 'Blich Studio' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/icon.svg' },
        { rel: 'apple-touch-icon', href: '/apple-icon.png' },
        {
          rel: 'alternate',
          type: 'application/rss+xml',
          title: 'Blich Studio Workshop',
          href: '/feed.xml',
        },
        // Google Fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap',
        },
      ],
      htmlAttrs: {
        lang: 'en',
      },
    },
  },

  runtimeConfig: {
    // Server-side only (used by proxy)
    apiUrl: process.env.NUXT_API_URL || process.env.NUXT_PUBLIC_API_URL || '',
    public: {
      // Client-side accessible
      apiUrl: process.env.NUXT_PUBLIC_API_URL || '',
    },
  },
})
