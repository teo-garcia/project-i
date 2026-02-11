import { Inbox, Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
  className?: string
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/15 p-10 text-center',
        className
      )}
    >
      <div className='mb-3 rounded-full bg-muted p-3 text-muted-foreground'>
        {icon || <Inbox className='size-6' />}
      </div>
      <h3 className='mb-1.5 text-base font-semibold tracking-tight'>{title}</h3>
      <p className='mb-5 max-w-sm text-sm leading-relaxed text-muted-foreground'>
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size='sm' className='gap-2'>
          <Plus className='size-4' />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
