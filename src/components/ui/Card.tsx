import type { ReactNode } from 'react'
import './ui.css'

interface CardProps {
  title?: string
  subtitle?: string
  children: ReactNode
}

export function Card({ title, subtitle, children }: CardProps) {
  return (
    <section className="card">
      {(title || subtitle) && (
        <header className="card__header">
          {title && <h1 className="card__title">{title}</h1>}
          {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </header>
      )}
      {children}
    </section>
  )
}
