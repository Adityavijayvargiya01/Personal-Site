interface PreloadOptions {
  href: string
  as?: 'image' | 'font' | 'style' | 'script'
  type?: string
  crossorigin?: boolean
  fetchpriority?: 'high' | 'low' | 'auto'
}

export function createPreloadLink(options: PreloadOptions): HTMLLinkElement {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = options.href
  
  if (options.as) link.as = options.as
  if (options.type) link.type = options.type
  if (options.crossorigin) link.crossOrigin = 'anonymous'
  if (options.fetchpriority) link.setAttribute('fetchpriority', options.fetchpriority)
  
  return link
}

export function preloadCriticalImages(imageUrls: string[]): void {
  if (typeof window === 'undefined') return
  
  const fragment = document.createDocumentFragment()
  
  imageUrls.forEach(url => {
    const link = createPreloadLink({
      href: url,
      as: 'image',
      fetchpriority: 'high'
    })
    fragment.appendChild(link)
  })
  
  document.head.appendChild(fragment)
}

export function preloadNextPageAssets(href: string): void {
  if (typeof window === 'undefined') return
  
  const link = createPreloadLink({ href })
  document.head.appendChild(link)
}

// Intersection Observer for smart preloading
export class SmartPreloader {
  private observer: IntersectionObserver
  private preloadedLinks = new Set<string>()
  
  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const link = entry.target.closest('a')
            if (link && link.href && !this.preloadedLinks.has(link.href)) {
              this.preloadLink(link.href)
              this.preloadedLinks.add(link.href)
            }
          }
        })
      },
      { rootMargin: '100px' }
    )
  }
  
  private preloadLink(href: string): void {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }
  
  observe(element: Element): void {
    this.observer.observe(element)
  }
  
  disconnect(): void {
    this.observer.disconnect()
  }
}

// Performance monitoring
export function measurePerformance(name: string, fn: () => void | Promise<void>): void {
  if (typeof window === 'undefined' || !performance.mark) return
  
  const startMark = `${name}-start`
  const endMark = `${name}-end`
  const measureName = `${name}-duration`
  
  performance.mark(startMark)
  
  const result = fn()
  
  if (result instanceof Promise) {
    result.finally(() => {
      performance.mark(endMark)
      performance.measure(measureName, startMark, endMark)
    })
  } else {
    performance.mark(endMark)
    performance.measure(measureName, startMark, endMark)
  }
}

// Critical CSS detection
export function loadCriticalCSS(cssText: string): void {
  if (typeof window === 'undefined') return
  
  const style = document.createElement('style')
  style.textContent = cssText
  style.setAttribute('data-critical', 'true')
  document.head.insertBefore(style, document.head.firstChild)
}

// Font loading optimization
export function preloadFonts(fontUrls: string[]): void {
  if (typeof window === 'undefined') return
  
  const fragment = document.createDocumentFragment()
  
  fontUrls.forEach(url => {
    const link = createPreloadLink({
      href: url,
      as: 'font',
      type: 'font/woff2',
      crossorigin: true,
      fetchpriority: 'high'
    })
    fragment.appendChild(link)
  })
  
  document.head.appendChild(fragment)
}