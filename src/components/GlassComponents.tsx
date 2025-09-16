import { motion, HTMLMotionProps } from 'framer-motion'
import { useState, useRef, MouseEvent } from 'react'

interface GlassCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  glowEffect?: boolean
}

export const GlassCard = ({ 
  children, 
  className = '', 
  glowEffect = false, 
  whileHover = { scale: 1.02, y: -2 },
  transition = { type: 'spring', stiffness: 300, damping: 20 },
  ...props 
}: GlassCardProps) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !glowEffect) return
    
    const rect = cardRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      ref={cardRef}
      className={`glass-card relative ${glowEffect ? 'glow-effect' : ''} ${className}`}
      onMouseMove={handleMouseMove}
      style={glowEffect ? {
        '--x': `${mousePosition.x}%`,
        '--y': `${mousePosition.y}%`,
      } as React.CSSProperties : {}}
      whileHover={whileHover}
      transition={transition}
      {...props}
    >
      {children}
    </motion.div>
  )
}

interface GlassButtonProps extends HTMLMotionProps<'button'> {
  children: React.ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
}

export const GlassButton = ({ 
  children, 
  className = '', 
  variant = 'primary',
  ...props 
}: GlassButtonProps) => {
  return (
    <motion.button
      className={`glass-button ${
        variant === 'primary' 
          ? 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-100' 
          : 'bg-white/10 hover:bg-white/20'
      } ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...props}
    >
      {children}
    </motion.button>
  )
}