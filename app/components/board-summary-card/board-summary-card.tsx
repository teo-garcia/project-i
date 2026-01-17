import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Board } from '@/lib/data/task-board'

type BoardSummaryCardProps = {
  board: Board
  taskCount: number
}

export const BoardSummaryCard = ({ board, taskCount }: BoardSummaryCardProps) => {
  return (
    <Link
      href={`/boards/${board.id}`}
      className='group'
    >
      <Card className='relative overflow-hidden border border-border/70 bg-card/90 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-28px_rgba(120,72,40,0.5)]'>
        <div className='absolute -right-12 top-4 h-24 w-24 rounded-full bg-blue-200/40 blur-2xl transition-opacity group-hover:opacity-80' />
        <CardHeader className='space-y-3 pb-3'>
          <div className='flex items-start justify-between'>
            <Badge variant='outline' className='border-primary/30 bg-primary/10 text-xs font-medium text-primary'>
              Board
            </Badge>
            <ArrowRight className='size-4 text-muted-foreground transition-transform group-hover:translate-x-1' />
          </div>
          <CardTitle className='text-xl font-bold tracking-tight'>
            {board.name}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-sm text-muted-foreground'>
            {board.description}
          </p>
          <div className='flex items-center gap-4 text-xs text-muted-foreground'>
            <div className='flex items-center gap-1.5'>
              <span className='font-semibold text-foreground'>{board.columns.length}</span>
              <span>columns</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <span className='font-semibold text-foreground'>{taskCount}</span>
              <span>tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
