const CACHE_NAME = 'aditya-vijayvargiya-v1.6.1'
const OFFLINE_URL = '/offline.html'

// Assets to cache on install
const STATIC_CACHE_URLS = [
  '/',
  '/projects',
  '/experience',
  '/offline.html',
]

// Cache strategies
const CACHE_STRATEGIES = {
  images: 'cache-first',
  pages: 'network-first',
  assets: 'cache-first',
  api: 'network-only'
}

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(STATIC_CACHE_URLS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        return self.clients.claim()
      })
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return
  }
  
  // Handle different types of requests
  if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request))
  } else if (request.destination === 'document') {
    event.respondWith(handlePageRequest(request))
  } else if (request.url.includes('/api/')) {
    // Don't cache API requests
    return
  } else {
    event.respondWith(handleAssetRequest(request))
  }
})

// Cache-first strategy for images
async function handleImageRequest(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Failed to fetch image:', error)
    return new Response('Image not available', { status: 404 })
  }
}

// Network-first strategy for pages
async function handlePageRequest(request) {
  try {
    const networkResponse = await fetch(request)
    const cache = await caches.open(CACHE_NAME)
    cache.put(request, networkResponse.clone())
    return networkResponse
  } catch (error) {
    const cache = await caches.open(CACHE_NAME)
    const cachedResponse = await cache.match(request)
    
    if (cachedResponse) {
      return cachedResponse
    }
    
    // Return offline page if no cache
    return cache.match(OFFLINE_URL)
  }
}

// Cache-first strategy for static assets
async function handleAssetRequest(request) {
  const cache = await caches.open(CACHE_NAME)
  const cachedResponse = await cache.match(request)
  
  if (cachedResponse) {
    return cachedResponse
  }
  
  try {
    const networkResponse = await fetch(request)
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone())
    }
    return networkResponse
  } catch (error) {
    console.log('Failed to fetch asset:', error)
    throw error
  }
}