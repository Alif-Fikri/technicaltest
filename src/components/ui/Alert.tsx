import type { ReactNode } from 'react'
import './ui.css'

interface AlertProps {
  variant?: 'error' | 'success' | 'info'
  children: ReactNode
}

export function Alert({ variant = 'error', children }: AlertProps) {
  return (
    <div className={`alert alert--${variant}`} role={variant === 'error' ? 'alert' : 'status'}>
      {children}
    </div>
  )
}
