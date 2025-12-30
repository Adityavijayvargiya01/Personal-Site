'use client'

import * as React from 'react'
import { motion, type Variants } from 'motion/react'
import { cn } from '@/lib/utils'

// Spring configuration for smooth, natural animations
const gentleSpring = {
  type: 'spring' as const,
  stiffness: 200,
  damping: 25,
}

interface SpringInProps {
  children: React.ReactNode
  className?: string
  delay?: number
  /** Animation direction: 'up', 'down', 'left', 'right', or 'none' for fade only */
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  /** Distance to animate from (in pixels) */
  distance?: number
}

export function SpringIn({
  children,
  className,
  delay = 0,
  direction = 'up',
  distance = 20,
}: SpringInProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: distance }
      case 'down':
        return { opacity: 0, y: -distance }
      case 'left':
        return { opacity: 0, x: distance }
      case 'right':
        return { opacity: 0, x: -distance }
      case 'none':
        return { opacity: 0 }
    }
  }

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { opacity: 1, y: 0 }
      case 'left':
      case 'right':
        return { opacity: 1, x: 0 }
      case 'none':
        return { opacity: 1 }
    }
  }

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={getFinalPosition()}
      transition={{
        ...gentleSpring,
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

interface PageTransitionProps {
  children: React.ReactNode
  className?: string
}

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={gentleSpring}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

interface StaggerContainerProps {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
  initialDelay?: number
}

const staggerItemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: gentleSpring,
  },
}

export function StaggerContainer({
  children,
  className,
  staggerDelay = 0.08,
  initialDelay = 0,
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: initialDelay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  className?: string
}

export function StaggerItem({ children, className }: StaggerItemProps) {
  return (
    <motion.div variants={staggerItemVariants} className={cn(className)}>
      {children}
    </motion.div>
  )
}

// Alias for backward compatibility
export { SpringIn as FadeIn }
