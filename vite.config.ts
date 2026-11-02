import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { caseStudies } from './src/cases'
import { appCatalogue } from './src/showcase'

const SITE = 'https://armonnasiri.com'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

type RouteMeta = { path: string; title: string; description: string; image: string; heading: string; body: string }

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
      body: appCatalogue.map((a) => `<li>${esc(a.name)} — ${esc(a.line)}</li>`).join('')
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
      body: `<p>${esc(c.kind)}</p><p>${esc(c.summary)}</p><ul>${c.features.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>${c.url ? `<p><a href="${esc(c.url)}">${esc(c.urlLabel ?? 'Open it live')}</a></p>` : ''}`
    })
  }
  return routes
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
        html = html.replace(
          /<div id="root">[\s\S]*?<\/div>\s*(?=<\/body>|<script)/,
          `<div id="root"><main style="font-family:system-ui,sans-serif;max-width:40rem;margin:4rem auto;padding:0 1.25rem"><p><a href="/">Armon Nasiri</a></p><h1>${esc(r.heading)}</h1>${r.body.startsWith('<li>') ? `<ul>${r.body}</ul>` : r.body}</main></div>\n    `
        )
        const dir = join(outDir, r.path)
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), html)
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
  server: process.env.PORT ? { port: Number(process.env.PORT), strictPort: true } : undefined,
})
