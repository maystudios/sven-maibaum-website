/**
 * Post-build prerender script.
 *
 * Generates a static index.html per route with the correct <title>,
 * <meta name="description">, canonical, Open Graph, and Twitter Card tags.
 *
 * GitHub Pages serves dist/projekte/heistline/index.html when a visitor
 * navigates directly to /projekte/heistline/ — the React app then hydrates
 * normally. Social scrapers (LinkedIn, WhatsApp, Slack) see the correct
 * per-page meta without executing JavaScript.
 *
 * Run automatically via: npm run build
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const distDir = join(__dirname, '..', 'dist')
const BASE_URL = 'https://www.sven-maibaum.com'
const DEFAULT_IMAGE = `${BASE_URL}/assets/images/sven_maibaum_profile.webp`

/** Per-route SEO data. Homepage is already set in index.html — skip it here. */
const routes = [
  {
    path: '/projekte/heistline',
    title: 'HeistLine – Prison-Escape & Heist MMO | Sven Maibaum',
    description:
      'Prison-Escape & Heist MMO in Unreal Engine. Wähle Cop oder Criminal, plane Überfälle, baue Basen und dominiere online.',
    image: `${BASE_URL}/assets/projects/heistline/VaultHeist.png`,
  },
  {
    path: '/projekte/mr-dork-3',
    title: 'Mr. Dork 3 – One Last Doodle | Sven Maibaum',
    description:
      'Herausfordernder 2D-Platformer mit Puzzle-Elementen, Retro-Style und modernen Multiplayer-Modi, entwickelt mit Unity.',
    image: `${BASE_URL}/assets/projects/mrdork/mrdork3.png`,
  },
  {
    path: '/projekte/liketik',
    title: 'LikeTik – KI-gestützte Social Commerce Plattform | Sven Maibaum',
    description:
      'Automatisiertes Fulfillment und intelligente Produktempfehlungen für Creator & Brands. Java-Microservices und KI/ML-Architektur.',
    image: `${BASE_URL}/assets/projects/liketik/liketik.png`,
  },
  {
    path: '/projekte/exambyte',
    title: 'Exambyte – Web-Testsystem für Programmierlabore | Sven Maibaum',
    description:
      'Web-basiertes Testsystem als ILIAS-Alternative für Hochschulen. Entwickelt mit Java, Spring Boot und PostgreSQL.',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/projekte/ki-marketing',
    title: 'KI-Marketing Automation | Sven Maibaum',
    description:
      'KI-gestützte Marketingautomatisierung mit Python und modernen LLM-Technologien für effizientere Content-Erstellung.',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/projekte/itchio',
    title: 'Game Jams & itch.io – Indie-Spieleprojekte | Sven Maibaum',
    description:
      'Sammlung von Game-Jam-Projekten und Rapid-Prototyping-Experimenten, darunter der Game-Jam-Gewinner Terrafix.',
    image: `${BASE_URL}/assets/projects/itchio/gamejam-winner.jpg`,
  },
  {
    path: '/impressum',
    title: 'Impressum | Sven Maibaum',
    description: 'Impressum und rechtliche Informationen zum Portfolio von Sven Maibaum.',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/datenschutz',
    title: 'Datenschutzerklärung | Sven Maibaum',
    description: 'Datenschutzerklärung für das Portfolio von Sven Maibaum.',
    image: DEFAULT_IMAGE,
  },
  {
    path: '/agb',
    title: 'AGB | Sven Maibaum',
    description: 'Allgemeine Geschäftsbedingungen von Sven Maibaum.',
    image: DEFAULT_IMAGE,
  },
]

function escapeAttr(str) {
  return str.replace(/&/g, '&amp;').replace(/"/g, '&quot;')
}

function injectMeta(html, { path, title, description, image }) {
  const url = `${BASE_URL}${path}/`
  const t = escapeAttr(title)
  const d = escapeAttr(description)

  return (
    html
      // <title>
      .replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`)
      // <meta name="description">
      .replace(
        /(<meta\s+name="description"\s+content=")[^"]*(")/,
        `$1${d}$2`,
      )
      // canonical
      .replace(
        /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
        `$1${url}$2`,
      )
      // og:url
      .replace(
        /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
        `$1${url}$2`,
      )
      // og:title
      .replace(
        /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
        `$1${t}$2`,
      )
      // og:description
      .replace(
        /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
        `$1${d}$2`,
      )
      // og:image
      .replace(
        /(<meta\s+property="og:image"\s+content=")[^"]*(")/,
        `$1${image}$2`,
      )
      // twitter:title
      .replace(
        /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
        `$1${t}$2`,
      )
      // twitter:description
      .replace(
        /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
        `$1${d}$2`,
      )
      // twitter:image
      .replace(
        /(<meta\s+name="twitter:image"\s+content=")[^"]*(")/,
        `$1${image}$2`,
      )
  )
}

const template = readFileSync(join(distDir, 'index.html'), 'utf-8')

for (const route of routes) {
  const html = injectMeta(template, route)
  const segments = route.path.split('/').filter(Boolean)
  const outDir = join(distDir, ...segments)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, 'index.html'), html)
  console.log(`  ✓ ${route.path}/`)
}

// GitHub Pages 404 fallback: serves the SPA shell for any non-prerendered route
// (e.g. /showcase, /visitenkarte). React Router handles the actual rendering.
writeFileSync(join(distDir, '404.html'), template)
console.log('  ✓ 404.html (GitHub Pages SPA fallback)')

console.log(`\nPrerendering complete — ${routes.length} routes + 404 fallback.\n`)
