import { Inbox,Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'

type EmptyStateProps = {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: EmptyStateProps) => {
  return (
    <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/60 bg-muted/20 p-12 text-center'>
      <div className='mb-4 rounded-full bg-muted p-4 text-muted-foreground'>
        {icon || <Inbox className='size-8' />}
      </div>
      <h3 className='mb-2 text-lg font-semibold'>{title}</h3>
      <p className='mb-6 max-w-sm text-sm text-muted-foreground'>{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className='gap-2'>
          <Plus className='size-4' />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
