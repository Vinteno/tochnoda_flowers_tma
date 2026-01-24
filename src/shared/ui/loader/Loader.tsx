import { cn } from '@shared/lib'
import { LuLoaderCircle } from 'react-icons/lu'

interface LoaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'size-4',
  md: 'size-8',
  lg: 'size-12',
}

export function Loader({ className, size = 'md' }: LoaderProps) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <LuLoaderCircle className={cn('animate-spin text-muted-foreground', sizeClasses[size])} />
    </div>
  )
}
