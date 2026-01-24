import type { ComponentProps, ReactNode } from 'react'
import { cn } from '@shared/lib'

interface EmptyStateProps extends ComponentProps<'div'> {
  icon?: ReactNode
  title?: string
  description?: string
  action?: ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(`flex flex-col items-center justify-center gap-2 py-12`, className)}
      {...props}
    >
      {icon && (
        <div className="text-muted-foreground">
          {icon}
        </div>
      )}
      {title && (
        <p className={cn('font-medium text-muted-foreground', { 'mt-1': !!icon })}>{title}</p>
      )}
      {description && (
        <p className="max-w-sm text-center text-sm text-muted-foreground">{description}</p>
      )}
      {action && (
        <div className={cn({ 'mt-2': !!description || !!title || !!icon })}>
          {action}
        </div>
      )}
    </div>
  )
}
