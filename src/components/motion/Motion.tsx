'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface MotionProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  y?: number
  once?: boolean
  amount?: number
}

const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: (custom: { delay: number; duration: number; y: number }) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom.delay,
      duration: custom.duration,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export function Motion({
  children,
  className,
  delay = 0,
  duration = 0.5,
  y = 20,
  once = true,
  amount = 0.1,
}: MotionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={fadeInUp}
      custom={{ delay, duration, y }}
    >
      {children}
    </motion.div>
  )
}

interface MotionListProps {
  children: ReactNode
  className?: string
  staggerDelay?: number
  duration?: number
  y?: number
  once?: boolean
  amount?: number
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
}

export function MotionList({
  children,
  className,
  staggerDelay = 0.1,
  duration = 0.5,
  y = 20,
  once = true,
  amount = 0.1,
}: MotionListProps) {
  const customStaggerContainer: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  }

  const customStaggerItem: Variants = {
    hidden: {
      opacity: 0,
      y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={customStaggerContainer}
    >
      {children}
    </motion.div>
  )
}

export function MotionItem({
  children,
  className,
  duration = 0.5,
  y = 20,
}: {
  children: ReactNode
  className?: string
  duration?: number
  y?: number
}) {
  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  )
}

export { motion }
