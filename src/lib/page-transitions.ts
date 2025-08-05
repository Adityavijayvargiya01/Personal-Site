/**
 * Enhanced Page Transition System
 * Provides smooth transitions between pages using Astro's view transitions
 */

interface TransitionOptions {
  duration?: number;
  easing?: string;
}

class PageTransitionManager {
  private defaultOptions: TransitionOptions = {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  };

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Enhanced page transition animations
    document.addEventListener('astro:before-preparation', () => {
      this.beforeTransition();
    });

    document.addEventListener('astro:after-preparation', () => {
      this.afterPreparation();
    });

    document.addEventListener('astro:before-swap', () => {
      this.beforeSwap();
    });

    document.addEventListener('astro:after-swap', () => {
      this.afterSwap();
    });

    document.addEventListener('astro:page-load', () => {
      this.onPageLoad();
    });
  }

  private beforeTransition() {
    // Add loading state to body
    document.body.classList.add('page-transitioning');
    
    // Create loading indicator
    this.showLoadingIndicator();
  }

  private afterPreparation() {
    // Fade out current content
    const main = document.querySelector('main');
    if (main) {
      main.style.opacity = '0.8';
      main.style.transform = 'translateY(10px)';
      main.style.transition = `opacity ${this.defaultOptions.duration}ms ${this.defaultOptions.easing}, transform ${this.defaultOptions.duration}ms ${this.defaultOptions.easing}`;
    }
  }

  private beforeSwap() {
    // Prepare for content swap
    this.hideLoadingIndicator();
  }

  private afterSwap() {
    // Animate in new content
    const main = document.querySelector('main');
    if (main) {
      main.style.opacity = '0';
      main.style.transform = 'translateY(20px)';
      
      // Force reflow
      main.offsetHeight;
      
      // Animate in
      main.style.transition = `opacity ${this.defaultOptions.duration}ms ${this.defaultOptions.easing}, transform ${this.defaultOptions.duration}ms ${this.defaultOptions.easing}`;
      main.style.opacity = '1';
      main.style.transform = 'translateY(0)';
    }

    // Remove transition class after animation
    setTimeout(() => {
      document.body.classList.remove('page-transitioning');
      if (main) {
        main.style.transition = '';
      }
    }, this.defaultOptions.duration);
  }

  private onPageLoad() {
    // Reinitialize scroll animations and other dynamic content
    if ((window as any).initScrollAnimations) {
      (window as any).initScrollAnimations();
    }

    // Add entrance animations to new page content
    this.addEntranceAnimations();
  }

  private showLoadingIndicator() {
    const existing = document.querySelector('.page-loading-indicator');
    if (existing) return;

    const indicator = document.createElement('div');
    indicator.className = 'page-loading-indicator';
    indicator.innerHTML = `
      <div class="loading-bar"></div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      .page-loading-indicator {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        z-index: 9999;
        background: transparent;
      }
      
      .loading-bar {
        height: 100%;
        background: linear-gradient(90deg, transparent, rgb(var(--primary)), transparent);
        background-size: 200% 100%;
        animation: loading-slide 1s ease-in-out infinite;
      }
      
      @keyframes loading-slide {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      
      .page-transitioning .loading-bar {
        animation-duration: 0.8s;
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(indicator);
  }

  private hideLoadingIndicator() {
    const indicator = document.querySelector('.page-loading-indicator');
    if (indicator) {
      indicator.style.opacity = '0';
      indicator.style.transition = 'opacity 200ms ease-out';
      setTimeout(() => {
        indicator.remove();
      }, 200);
    }
  }

  private addEntranceAnimations() {
    // Add stagger entrance animations to main content sections
    const sections = document.querySelectorAll('main > section, main > div');
    sections.forEach((section, index) => {
      const htmlElement = section as HTMLElement;
      htmlElement.style.opacity = '0';
      htmlElement.style.transform = 'translateY(20px)';
      
      setTimeout(() => {
        htmlElement.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        htmlElement.style.opacity = '1';
        htmlElement.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }
}

// Initialize the page transition manager
if (typeof window !== 'undefined') {
  new PageTransitionManager();
}

export { PageTransitionManager };
