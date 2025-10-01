interface TypingEffectOptions {
  speed?: number
  delay?: number
  showCursor?: boolean
  onComplete?: () => void
}

class TypingEffect {
  private element: HTMLElement
  private text: string
  private currentIndex: number = 0
  private speed: number
  private delay: number
  private showCursor: boolean
  private onComplete?: () => void
  private cursorElement?: HTMLSpanElement
  private isTyping: boolean = false

  constructor(element: HTMLElement, options: TypingEffectOptions = {}) {
    this.element = element
    this.text = element.textContent || ''
    this.speed = options.speed || 30
    this.delay = options.delay || 0
    this.showCursor = options.showCursor || false
    this.onComplete = options.onComplete

    // Store original HTML content for links
    this.element.setAttribute('data-original-html', element.innerHTML)
  }

  async start(): Promise<void> {
    if (this.isTyping) return
    this.isTyping = true

    // Wait for initial delay
    if (this.delay > 0) {
      await this.wait(this.delay)
    }

    // Make element visible
    this.element.classList.add('typing-active')

    // Get the original HTML content
    const originalHTML = this.element.getAttribute('data-original-html') || ''
    
    // Clear element content
    this.element.innerHTML = ''

    // Add cursor if enabled
    if (this.showCursor) {
      this.cursorElement = document.createElement('span')
      this.cursorElement.className = 'typing-cursor'
      this.element.appendChild(this.cursorElement)
    }

    // Type the text
    await this.typeHTML(originalHTML)

    // Remove cursor after typing
    if (this.cursorElement) {
      this.cursorElement.remove()
    }

    this.isTyping = false

    // Call completion callback
    if (this.onComplete) {
      this.onComplete()
    }
  }

  private async typeHTML(html: string): Promise<void> {
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = html

    await this.typeNode(tempDiv, this.element)
  }

  private async typeNode(sourceNode: Node, targetNode: Node): Promise<void> {
    for (const node of Array.from(sourceNode.childNodes)) {
      if (node.nodeType === Node.TEXT_NODE) {
        // Type text content
        const text = node.textContent || ''
        for (let i = 0; i < text.length; i++) {
          const char = text[i]
          const textNode = document.createTextNode(char)
          
          // Insert before cursor if it exists
          if (this.cursorElement && this.cursorElement.parentNode === targetNode) {
            targetNode.insertBefore(textNode, this.cursorElement)
          } else {
            targetNode.appendChild(textNode)
          }

          await this.wait(this.speed)
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Clone the element
        const element = node as Element
        const clonedElement = element.cloneNode(false) as Element
        
        // Insert before cursor if it exists
        if (this.cursorElement && this.cursorElement.parentNode === targetNode) {
          targetNode.insertBefore(clonedElement, this.cursorElement)
        } else {
          targetNode.appendChild(clonedElement)
        }

        // Recursively type the content of the element
        await this.typeNode(node, clonedElement)
      }
    }
  }

  private wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  stop(): void {
    this.isTyping = false
  }
}

// Sequential typing effect for multiple elements
async function typeSequentially(
  elements: HTMLElement[],
  options: TypingEffectOptions = {}
): Promise<void> {
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i]
    const typing = new TypingEffect(element, {
      ...options,
      showCursor: i === elements.length - 1 ? false : options.showCursor,
    })
    await typing.start()
  }
}

export { TypingEffect, typeSequentially }
export type { TypingEffectOptions }
