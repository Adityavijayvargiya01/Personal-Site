'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { cn } from '@/lib/utils'

interface OGData {
  title?: string
  description?: string
  image?: string
  siteName?: string
  url?: string
  favicon?: string
  error?: string
}

interface LinkPreviewCardProps {
  data: OGData | null
  isLoading: boolean
  isVisible: boolean
  position: { x: number; y: number }
}

const springConfig = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 30,
}

export function LinkPreviewCard({
  data,
  isLoading,
  isVisible,
  position,
}: LinkPreviewCardProps) {
  const [imageError, setImageError] = React.useState(false)
  const [faviconError, setFaviconError] = React.useState(false)

  // Reset error states when data changes
  React.useEffect(() => {
    setImageError(false)
    setFaviconError(false)
  }, [data?.image, data?.favicon])

  const showCard = isVisible && (isLoading || (data && !data.error && (data.title || data.description)))

  return (
    <AnimatePresence>
      {showCard && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 5 }}
          transition={springConfig}
          style={{
            left: position.x,
            top: position.y,
            pointerEvents: 'none',
          }}
          className={cn(
            'fixed z-50 w-80 overflow-hidden rounded-xl',
            'border border-border bg-background shadow-2xl'
          )}
        >
          {/* Image Section */}
          <div className="relative h-40 w-full bg-secondary overflow-hidden">
            {data?.image && !imageError ? (
              <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={data.image}
                alt={data.title || ''}
                className="h-full w-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                <svg
                  className="h-12 w-12 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Content Section */}
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springConfig, delay: 0.05 }}
            className="p-4"
          >
            <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-foreground">
              {data?.title || 'Untitled'}
            </h3>
            {data?.description && (
              <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                {data.description}
              </p>
            )}
            <div className="flex items-center gap-2">
              {data?.favicon && !faviconError && (
                <img
                  src={data.favicon}
                  alt=""
                  className="h-4 w-4 rounded"
                  onError={() => setFaviconError(true)}
                />
              )}
              <span className="text-xs text-muted-foreground">
                {data?.siteName || ''}
              </span>
            </div>
          </motion.div>

          {/* Loading Overlay */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute inset-0 flex items-center justify-center bg-background"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  className="h-6 w-6 rounded-full border-2 border-muted-foreground border-t-foreground"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
