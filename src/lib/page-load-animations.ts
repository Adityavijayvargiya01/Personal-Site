/**
 * Page Load Animation System
 * Handles animations that trigger when the page loads instead of on scroll
 */

interface PageLoadAnimationOptions {
  staggerDelay?: number;
  animationDelay?: number;
}

class PageLoadAnimationManager {
  private options: PageLoadAnimationOptions;

  constructor(options: PageLoadAnimationOptions = {}) {
    this.options = {
      staggerDelay: 50,
      animationDelay: 100,
      ...options,
    };
    this.init();
  }

  private init() {
    // Check if user prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.showAllElements();
      return;
    }

    // Start animations after a brief delay to ensure DOM is ready
    setTimeout(() => {
      this.animateElements();
    }, this.options.animationDelay);
  }

  private animateElements() {
    const elements = document.querySelectorAll('.page-animate');
    
    elements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      
      // Get custom stagger index or use array index
      const staggerIndex = parseInt(htmlElement.dataset.staggerIndex || index.toString());
      const delay = staggerIndex * this.options.staggerDelay!;

      // Apply animation with stagger delay
      setTimeout(() => {
        htmlElement.style.animationDelay = '0ms';
        htmlElement.style.opacity = '0';
        htmlElement.style.transform = 'translateY(30px)';
        
        // Force reflow
        htmlElement.offsetHeight;
        
        // Trigger animation
        htmlElement.style.animation = 'pageLoadFadeIn 0.4s ease forwards';
      }, delay);
    });
  }

  private showAllElements() {
    // For users who prefer reduced motion, show all elements immediately
    document.querySelectorAll('.page-animate').forEach((element) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.opacity = '1';
      htmlElement.style.transform = 'none';
      htmlElement.style.animation = 'none';
    });
  }

  public refresh() {
    // Re-run animations (useful for dynamic content)
    this.animateElements();
  }
}

// Global instance
let pageLoadAnimationManager: PageLoadAnimationManager | null = null;

export function initPageLoadAnimations(options?: PageLoadAnimationOptions) {
  // Clean up existing instance
  if (pageLoadAnimationManager) {
    pageLoadAnimationManager = null;
  }

  pageLoadAnimationManager = new PageLoadAnimationManager(options);
  return pageLoadAnimationManager;
}

export function refreshPageLoadAnimations() {
  if (pageLoadAnimationManager) {
    pageLoadAnimationManager.refresh();
  }
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initPageLoadAnimations();
    });
  } else {
    initPageLoadAnimations();
  }

  // Re-initialize on Astro page transitions
  document.addEventListener('astro:page-load', () => {
    // Small delay to ensure DOM is fully updated
    setTimeout(() => {
      initPageLoadAnimations();
    }, 50);
  });
}
