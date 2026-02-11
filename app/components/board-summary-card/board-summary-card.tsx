'use client'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { Board } from '@/lib/data/task-board'

type BoardSummaryCardProps = {
  board: Board
  taskCount: number
}

export const BoardSummaryCard = ({
  board,
  taskCount,
}: BoardSummaryCardProps) => {
  const description =
    board.description.trim().length > 0
      ? board.description
      : 'No description yet.'

  return (
    <Link
      href={`/boards/${board.id}`}
      className='group block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60'
    >
      <Card className='h-[204px] gap-0 border border-border/80 bg-card py-0 transition-[border-color,transform] duration-150 group-hover:-translate-y-px group-hover:border-primary/30 sm:h-[214px]'>
        <CardContent className='flex h-full flex-col gap-2 p-3 sm:p-3.5'>
          <div className='flex items-center justify-between'>
            <Badge
              variant='outline'
              className='font-meta rounded-md px-2 py-0 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground'
            >
              Board
            </Badge>
            <ArrowRight className='mt-0.5 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary' />
          </div>
          <p className='line-clamp-1 text-[1.05rem] font-semibold tracking-tight sm:text-[1.1rem]'>
            {board.name}
          </p>
          <p className='min-h-[2.4rem] line-clamp-2 text-[13px] leading-relaxed text-muted-foreground sm:text-sm'>
            {description}
          </p>
          <div className='mt-auto flex items-center gap-4 border-t border-border/70 pt-2 text-xs text-muted-foreground'>
            <div className='flex items-center gap-1.5'>
              <span className='font-semibold text-foreground tabular-nums'>
                {board.columns.length}
              </span>
              <span>columns</span>
            </div>
            <div className='flex items-center gap-1.5'>
              <span className='font-semibold text-foreground tabular-nums'>
                {taskCount}
              </span>
              <span>tasks</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
