# Blich Studio Website (Nuxt)

The public marketing website for Blich Studio, built with **Nuxt 4 + Vue 3 + TypeScript + SCSS**.

> Migrated from Next.js/React to Nuxt/Vue for stack unification with the CMS.

---

## 🚀 Production Readiness Checklist

### ✅ Completed

- [x] **Core Pages** - Home, Projects, Blog, About pages implemented
- [x] **Navigation** - Fixed header with scroll effects, mobile menu, theme toggle
- [x] **Footer** - Brand section, links, social icons, light/dark mode support
- [x] **Design System** - SCSS variables, CSS custom properties, light/dark themes
- [x] **Icons** - Lucide icons via @nuxt/icon (replaced all emojis)
- [x] **Auth UI** - Sign in modal, auth state management via composables
- [x] **API Proxy** - Server proxy for API gateway with cookie forwarding
- [x] **Blog Listing** - Tag filtering, article cards, featured article
- [x] **Blog Detail** - Article view with like/share, comments section
- [x] **Projects Listing** - Type filtering (games, films, animations)
- [x] **Projects Detail** - Project view with metadata
- [x] **About Page** - Team section, "Join Us" CTA
- [x] **Comment Section** - Comments with replies, likes
- [x] **Light/Dark Mode** - Theme toggle with localStorage persistence
- [x] **Responsive Design** - Mobile-first, breakpoints for tablet/desktop
- [x] **Environment Config** - .env.example, .gitignore for secrets

### 🔲 TODO Before Production

#### Critical (Must Have)

- [ ] **Connect to Real API** - Replace mock data with actual API calls
  - [ ] Projects API integration (`GET /projects`, `GET /projects/:id`)
  - [ ] Blog/Articles API integration (`GET /articles`, `GET /articles/:id`)
  - [ ] Comments API integration (`GET/POST /comments`, likes, replies)
  - [ ] Auth endpoints (`POST /auth/login`, `POST /auth/register`, `GET /auth/me`)
- [ ] **SEO Meta Tags** - Dynamic meta titles, descriptions, Open Graph tags
- [ ] **Error Pages** - Custom 404, 500 error pages
- [ ] **Loading States** - Skeleton loaders for all data-fetching components
- [ ] **Form Validation** - Client-side validation for auth forms, comment forms

#### Important (Should Have)

- [ ] **Image Optimization** - Use Nuxt Image for optimized loading
- [ ] **Fonts** - Self-host Space Grotesk, Inter fonts (currently using system fallbacks)
- [ ] **Analytics** - Google Analytics or Plausible integration
- [ ] **Cookie Consent** - GDPR-compliant cookie banner
- [ ] **Sitemap** - Auto-generated sitemap.xml
- [ ] **Robots.txt** - Production robots.txt configuration
- [ ] **Performance Audit** - Lighthouse score optimization
- [ ] **Accessibility Audit** - WCAG 2.1 AA compliance check

#### Nice to Have

- [ ] **Search** - Site-wide search functionality
- [ ] **Newsletter Signup** - Email subscription form
- [ ] **Social Sharing** - Share buttons with proper OG images
- [ ] **Blog RSS Feed** - RSS/Atom feed for blog articles
- [ ] **Animations** - Page transitions, scroll animations
- [ ] **PWA Support** - Service worker, offline support
- [ ] **i18n** - Multi-language support (if needed)

#### DevOps / Deployment

- [ ] **CI/CD Pipeline** - GitHub Actions for build/test/deploy
- [ ] **Staging Environment** - Preview deployments for PRs
- [ ] **Production Hosting** - Vercel, Netlify, or custom server setup
- [ ] **Domain Configuration** - DNS, SSL certificate
- [ ] **Environment Variables** - Production API_URL configured
- [ ] **Error Monitoring** - Sentry or similar for error tracking
- [ ] **Uptime Monitoring** - Health checks and alerts

---

## Setup

### Prerequisites

- Node.js 18+ or Bun
- Access to the API gateway (for full functionality)

### Installation

```bash
# Install dependencies (using bun)
bun install

# Copy environment file
cp .env.example .env

# Edit .env with your API URL
# API_URL=https://api.blichstudio.com
```

### Development

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
bun run build
bun run preview  # Preview locally
```

---

## Project Structure

```
app/
├── assets/styles/     # SCSS variables, utilities, main styles
├── components/        # Vue components (Navigation, Footer, UI, etc.)
├── composables/       # Vue composables (useAuth, useApi, etc.)
├── pages/             # File-based routing
│   ├── index.vue      # Home page
│   ├── about.vue      # About page
│   ├── blog/          # Blog listing and detail
│   └── projects/      # Projects listing and detail
server/
├── api/_proxy/        # API gateway proxy
└── utils/             # Server utilities
```

---

## Auth Integration

The app uses a Nuxt server proxy for API authentication. Set `API_URL` in your environment.

**Required API Endpoints:**

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | Login, returns user + sets cookie |
| `/auth/register` | POST | Register new user |
| `/auth/me` | GET | Get current user from session |
| `/auth/logout` | POST | Clear session cookie |

The proxy forwards `Set-Cookie` headers for SSR-compatible cookie-based auth.

---

## Tech Stack

- **Framework:** Nuxt 4 (Vue 3.5)
- **Styling:** SCSS modules + CSS custom properties
- **Icons:** Lucide via @nuxt/icon
- **Package Manager:** Bun
- **API:** Proxied to external API gateway

---

## License

Private - Blich Studio © 2025

