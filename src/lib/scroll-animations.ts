interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  animationClass?: string
  staggerDelay?: number
  once?: boolean
}

class ScrollAnimationObserver {
  private observer: IntersectionObserver
  private animatedElements: Set<Element> = new Set()
  
  constructor(options: ScrollAnimationOptions = {}) {
    const {
      threshold = 0.1,
      rootMargin = '0px 0px -50px 0px',
      once = true
    } = options
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target)
          
          if (once && this.animatedElements.has(entry.target)) {
            this.observer.unobserve(entry.target)
          }
        } else if (!once) {
          this.resetElement(entry.target)
        }
      })
    }, { threshold, rootMargin })
  }
  
  private animateElement(element: Element): void {
    // Add in-view class for CSS animations
    element.classList.add('in-view')
    
    // Get animation type from data attribute (default to fade-in for opacity-only)
    const animationType = element.getAttribute('data-scroll-animation') || 'fade-in'
    const animationDelay = element.getAttribute('data-scroll-delay') || '0'
    const animationDuration = element.getAttribute('data-scroll-duration')
    
    // Apply animation class
    element.classList.add(`animate-${animationType}`)
    
    // Apply custom delay if specified
    if (animationDelay !== '0') {
      (element as HTMLElement).style.animationDelay = `${animationDelay}ms`
    }
    
    // Apply custom duration if specified
    if (animationDuration) {
      (element as HTMLElement).style.animationDuration = `${animationDuration}ms`
    }
    
    // Mark as animated
    this.animatedElements.add(element)
  }
  
  private resetElement(element: Element): void {
    element.classList.remove('in-view')
    
    // Remove all animation classes
    const animationClasses = Array.from(element.classList).filter(cls => cls.startsWith('animate-'))
    animationClasses.forEach(cls => element.classList.remove(cls))
    
    // Reset inline styles
    ;(element as HTMLElement).style.animationDelay = ''
    ;(element as HTMLElement).style.animationDuration = ''
    
    // Remove from animated set
    this.animatedElements.delete(element)
  }
  
  observe(element: Element): void {
    this.observer.observe(element)
  }
  
  observeAll(selector: string = '[data-scroll]'): void {
    const elements = document.querySelectorAll(selector)
    
    // Apply stagger effect to elements with data-stagger
    elements.forEach((element, index) => {
      const staggerGroup = element.getAttribute('data-stagger-group')
      if (staggerGroup) {
        const groupIndex = this.getGroupIndex(element, staggerGroup)
        const staggerDelay = parseInt(element.getAttribute('data-stagger-delay') || '50')
        ;(element as HTMLElement).style.animationDelay = `${groupIndex * staggerDelay}ms`
      }
      
      this.observe(element)
    })
  }
  
  private getGroupIndex(element: Element, groupName: string): number {
    const groupElements = document.querySelectorAll(`[data-stagger-group="${groupName}"]`)
    return Array.from(groupElements).indexOf(element)
  }
  
  disconnect(): void {
    this.observer.disconnect()
  }
}

// Parallax scroll effect
class ParallaxController {
  private elements: NodeListOf<HTMLElement>
  private ticking = false
  
  constructor() {
    this.elements = document.querySelectorAll('.parallax') as NodeListOf<HTMLElement>
    this.init()
  }
  
  private init(): void {
    if (this.elements.length === 0) return
    
    window.addEventListener('scroll', () => this.handleScroll(), { passive: true })
    this.updateElements()
  }
  
  private handleScroll(): void {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.updateElements()
        this.ticking = false
      })
      this.ticking = true
    }
  }
  
  private updateElements(): void {
    const scrollY = window.scrollY
    
    this.elements.forEach(element => {
      const rect = element.getBoundingClientRect()
      const speed = parseFloat(element.getAttribute('data-parallax-speed') || '0.5')
      const offset = (rect.top + scrollY) * speed
      
      element.style.transform = `translateY(${offset}px)`
    })
  }
}

// Initialize on DOMContentLoaded
let scrollObserver: ScrollAnimationObserver | null = null
let parallaxController: ParallaxController | null = null

function initializeAnimations() {
  // Initialize scroll animations
  scrollObserver = new ScrollAnimationObserver({
    threshold: 0.05,
    rootMargin: '0px 0px -10% 0px',
    once: true
  })
  
  scrollObserver.observeAll()
  
  // Initialize parallax if elements exist
  if (document.querySelectorAll('.parallax').length > 0) {
    parallaxController = new ParallaxController()
  }
  
  // Add page load animations with stagger
  const pageAnimateElements = document.querySelectorAll('.page-animate')
  pageAnimateElements.forEach((element, index) => {
    const customIndex = element.getAttribute('data-stagger-index')
    const staggerIndex = customIndex ? parseInt(customIndex) : index
    element.classList.add(`stagger-${Math.min(staggerIndex + 1, 8)}`)
  })
}

// Cleanup function for page transitions
function cleanupAnimations() {
  if (scrollObserver) {
    scrollObserver.disconnect()
    scrollObserver = null
  }
  
  // Remove animation classes
  document.querySelectorAll('[data-scroll]').forEach(element => {
    element.classList.remove('in-view')
    const animationClasses = Array.from(element.classList).filter(cls => cls.startsWith('animate-'))
    animationClasses.forEach(cls => element.classList.remove(cls))
  })
}

// Handle Astro page transitions
if (typeof window !== 'undefined') {
  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAnimations)
  } else {
    initializeAnimations()
  }
  
  // Handle view transitions
  document.addEventListener('astro:after-swap', () => {
    cleanupAnimations()
    initializeAnimations()
  })
  
  document.addEventListener('astro:page-load', () => {
    cleanupAnimations()
    initializeAnimations()
  })
}

export { ScrollAnimationObserver, ParallaxController, initializeAnimations, cleanupAnimations }
