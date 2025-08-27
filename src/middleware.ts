import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async (context, next) => {
  // Add performance headers
  const response = await next()
  
  // Set security headers
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Add caching headers based on content type
  const url = context.url
  const pathname = url.pathname
  
  if (pathname.match(/\.(js|css|woff2?|jpg|jpeg|png|webp|avif)$/)) {
    // Cache static assets for 1 year
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  } else if (pathname.startsWith('/blog/')) {
    // Cache blog pages for 1 hour, CDN for 1 day
    response.headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400')
  } else if (pathname.endsWith('.html') || pathname === '/' || !pathname.includes('.')) {
    // Cache HTML pages for revalidation
    response.headers.set('Cache-Control', 'public, max-age=0, must-revalidate')
  }
  
  // Add Vary header for content that differs by theme/user preferences
  if (pathname.startsWith('/blog/') || pathname === '/') {
    response.headers.set('Vary', 'Accept-Encoding, Cookie')
  }
  
  return response
})