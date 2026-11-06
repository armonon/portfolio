import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { caseStudies } from './src/cases'
import { appCatalogue } from './src/showcase'
import { caseDetails } from './src/caseDetails'
import { families, services } from './src/services'
import { entry, STATUS } from './src/registry'

const SITE = 'https://armonnasiri.com'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

type RouteMeta = { path: string; title: string; description: string; image: string; heading: string; body: string; ld?: object }

// One static HTML file per route, so link previews and search engines see the right
// title, description and share image for every page (the app still renders client-side).
function routeMeta(): RouteMeta[] {
  const routes: RouteMeta[] = [
    {
      path: '/work',
      title: 'Work — Armon Nasiri',
      description: `${caseStudies.length} step-by-step walkthroughs recorded live from real apps, websites and tools, plus every other project and client site.`,
      image: '/og/work.jpg',
      heading: 'All the work',
      body: caseStudies.map((c) => `<li><a href="/work/${c.slug}">${esc(c.title)}</a> — ${esc(c.kind)}</li>`).join('')
    },
    {
      path: '/apps',
      title: `${appCatalogue.length} apps — Armon Nasiri`,
      description: `${appCatalogue.length} apps designed and built by Armon Nasiri: creative tools, audio, productivity, community and AI. Most run free in the browser.`,
      image: '/og/apps.jpg',
      heading: `${appCatalogue.length} apps and counting`,
      body: appCatalogue.map((a) => `<li>${esc(a.name)} — ${esc(a.line)}${entry(a.name) ? ` (${STATUS[entry(a.name)!.status].label})` : ''}</li>`).join('')
    },
    {
      path: '/services',
      title: 'Services — Armon Nasiri',
      description: 'Digital products, creative technology and AI & automation, designed and built by one person: websites, web apps, 3D, AI media and local AI agent setup.',
      image: '/og-image.jpg',
      heading: 'Services',
      body: families.map((f) => `<h2>${esc(f.title)}</h2><p>${esc(f.line)}</p><ul>${f.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`).join('') +
        `<h2>Everything else</h2><ul>${services.map((x) => `<li>${esc(x.title)}</li>`).join('')}</ul>`
    },
    {
      path: '/tools',
      title: 'Free tools — Armon Nasiri',
      description: 'Free browser tools built by Armon Nasiri: file conversion, background removal, captions, stem separation and more. Files stay on your device.',
      image: '/og/converter.jpg',
      heading: 'Free tools',
      body: '<p>Converter, Cutout, Captions, Split and more, free in the browser.</p>'
    },
    {
      path: '/hire',
      title: 'For engineering teams — Armon Nasiri',
      description: 'Background, specialties, engineering case studies and public repositories of Armon Nasiri, a product designer and engineer in Los Angeles.',
      image: '/og-image.jpg',
      heading: 'For engineering teams',
      body: '<p>Product engineer working across TypeScript and React, Rust and C++, serverless back-ends and on-device AI.</p><p><a href="https://github.com/armonon">GitHub</a></p>'
    }
  ]
  for (const c of caseStudies) {
    const desc = c.summary.length > 158 ? c.summary.slice(0, 155).replace(/\s+\S*$/, '') + '…' : c.summary
    routes.push({
      path: `/work/${c.slug}`,
      title: `${c.title} — Armon Nasiri`,
      description: desc,
      image: `/og/${c.slug}.jpg`,
      heading: c.title,
      body: `<p>${esc(c.kind)}</p><p>${esc(c.summary)}</p>${caseDetails[c.slug] ? `<h2>The problem</h2><p>${esc(caseDetails[c.slug].problem)}</p>` : ''}<ul>${c.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>${c.url ? `<p><a href="${esc(c.url)}">${esc(c.urlLabel ?? 'Open it live')}</a></p>` : ''}`,
      ld: caseLd(c.slug, c.title, desc, c.url)
    })
  }
  return routes
}

// CreativeWork / SoftwareApplication data for case-study pages. Statuses come from the registry.
function caseLd(slug: string, title: string, description: string, url?: string) {
  const reg = entry(slug) ?? entry(title)
  const isApp = reg?.type === 'app'
  const d = caseDetails[slug]
  return {
    '@context': 'https://schema.org',
    '@type': isApp ? 'SoftwareApplication' : 'CreativeWork',
    name: title,
    description,
    url: `${SITE}/work/${slug}`,
    image: `${SITE}/og/${slug}.jpg`,
    author: { '@type': 'Person', name: 'Armon Nasiri', url: `${SITE}/` },
    ...(isApp ? { applicationCategory: 'MultimediaApplication' } : {}),
    ...(url ? { sameAs: url } : {}),
    ...(d?.source ? { codeRepository: d.source.href } : {}),
    ...(d?.tech ? { keywords: d.tech.join(', ') } : {})
  }
}

function seoPages(): Plugin {
  let outDir = 'dist'
  return {
    name: 'seo-pages',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir
    },
    closeBundle() {
      const template = readFileSync(join(outDir, 'index.html'), 'utf8')
      const routes = routeMeta()
      for (const r of routes) {
        const url = SITE + r.path
        let html = template
          .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(r.title)}</title>`)
          .replace(/(<meta name="description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
          .replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${SITE}${r.image}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${esc(r.title)}$2`)
          .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${esc(r.description)}$2`)
          .replace(/(<meta name="twitter:image" content=")[^"]*(")/, `$1${SITE}${r.image}$2`)
          // Case studies get their own structured data; other pages keep the site-wide graph
          .replace(/<script type="application\/ld\+json" id="ld-site">[\s\S]*?<\/script>/, (m) => (r.ld ? `<script type="application/ld+json">${JSON.stringify(r.ld).replace(/</g, '\\u003c')}</script>` : m))
        html = html.replace(
          /<div id="root">[\s\S]*?<\/div>\s*(?=<\/body>|<script)/,
          `<div id="root"><main style="font-family:system-ui,sans-serif;max-width:40rem;margin:0 auto;padding:4rem 1.25rem"><p><a href="/">Armon Nasiri</a></p><h1>${esc(r.heading)}</h1>${r.body.startsWith('<li>') ? `<ul>${r.body}</ul>` : r.body}</main></div>\n    `
        )
        // Flat files (work/sattari.html, not work/sattari/index.html): Netlify serves them at
        // the clean URL with no trailing-slash redirect, matching the canonical address.
        const file = join(outDir, `${r.path.slice(1)}.html`)
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, html)
      }
      const today = new Date().toISOString().slice(0, 10)
      const urls = ['/', ...routes.map((r) => r.path)]
      writeFileSync(
        join(outDir, 'sitemap.xml'),
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc><lastmod>${today}</lastmod><priority>${u === '/' ? '1.0' : u.startsWith('/work/') ? '0.7' : '0.8'}</priority></url>`)
          .join('\n')}\n</urlset>\n`
      )
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPages()],
  define: { __HAS_RESUME__: JSON.stringify(existsSync('public/resume.pdf')) },
  server: process.env.PORT ? { port: Number(process.env.PORT), strictPort: true } : undefined,
})
