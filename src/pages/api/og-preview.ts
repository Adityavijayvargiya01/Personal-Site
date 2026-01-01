import type { APIRoute } from 'astro'

export const prerender = false // This route needs server-side rendering

interface OGData {
  title?: string
  description?: string
  image?: string
  siteName?: string
  url?: string
  favicon?: string
}

function extractMetaContent(html: string, property: string): string | undefined {
  // Match both property="og:X" and name="og:X" patterns
  const patterns = [
    new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${property}["']`, 'i'),
    new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'),
    new RegExp(`<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${property}["']`, 'i'),
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) return match[1]
  }
  return undefined
}

function extractTitle(html: string): string | undefined {
  const match = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return match ? match[1].trim() : undefined
}

function extractFavicon(html: string, baseUrl: string): string | undefined {
  // Look for various favicon link tags
  const patterns = [
    /<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["']/i,
    /<link[^>]*href=["']([^"']+)["'][^>]*rel=["'](?:shortcut )?icon["']/i,
    /<link[^>]*rel=["']apple-touch-icon["'][^>]*href=["']([^"']+)["']/i,
  ]

  for (const pattern of patterns) {
    const match = html.match(pattern)
    if (match) {
      const favicon = match[1]
      if (favicon.startsWith('http')) return favicon
      if (favicon.startsWith('//')) return `https:${favicon}`
      if (favicon.startsWith('/')) return `${new URL(baseUrl).origin}${favicon}`
      return `${new URL(baseUrl).origin}/${favicon}`
    }
  }

  // Default to /favicon.ico
  return `${new URL(baseUrl).origin}/favicon.ico`
}

function resolveUrl(url: string | undefined, baseUrl: string): string | undefined {
  if (!url) return undefined
  if (url.startsWith('http')) return url
  if (url.startsWith('//')) return `https:${url}`
  if (url.startsWith('/')) return `${new URL(baseUrl).origin}${url}`
  return `${new URL(baseUrl).origin}/${url}`
}

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url).searchParams.get('url')

  if (!url) {
    return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    // Validate URL
    new URL(url)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LinkPreviewBot/1.0)',
        Accept: 'text/html',
      },
      signal: AbortSignal.timeout(5000),
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }

    const html = await response.text()

    const ogData: OGData = {
      title: extractMetaContent(html, 'og:title') || extractTitle(html),
      description:
        extractMetaContent(html, 'og:description') || extractMetaContent(html, 'description'),
      image: resolveUrl(extractMetaContent(html, 'og:image'), url),
      siteName: extractMetaContent(html, 'og:site_name') || new URL(url).hostname,
      url: extractMetaContent(html, 'og:url') || url,
      favicon: extractFavicon(html, url),
    }

    return new Response(JSON.stringify(ogData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    })
  } catch (error) {
    console.error('Error fetching OG data:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch preview',
        url,
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
