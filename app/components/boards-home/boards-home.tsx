'use client'

import { Columns3, LayoutGrid, ListTodo, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'

import { BoardCreateModal } from '@/components/board-create-modal/board-create-modal'
import { BoardSummaryCard } from '@/components/board-summary-card/board-summary-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Board } from '@/lib/data/task-board'
import { countBoardTasks } from '@/lib/data/task-board'

type BoardsHomeProps = {
  boards: Board[]
}

export const BoardsHome = ({ boards }: BoardsHomeProps) => {
  const router = useRouter()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const taskCount = boards.reduce(
    (total, board) => total + countBoardTasks(board),
    0
  )
  const columnCount = boards.reduce(
    (total, board) => total + board.columns.length,
    0
  )
  const stats = [
    { label: 'Boards', value: boards.length, icon: LayoutGrid },
    { label: 'Tasks', value: taskCount, icon: ListTodo },
    { label: 'Columns', value: columnCount, icon: Columns3 },
  ]

  return (
    <section className='min-h-screen bg-background px-4 pb-10 pt-6 sm:px-8 sm:pb-14 sm:pt-12'>
      <div className='app-container flex flex-col gap-5 sm:gap-8'>
        <header className='space-y-4 border-b border-border/70 pb-5 sm:space-y-5 sm:pb-7'>
          <div className='flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground'>
            <LayoutGrid className='size-4' />
            <span>Your Boards</span>
          </div>
          <div className='space-y-2.5 sm:space-y-3'>
            <h1 className='max-w-4xl text-balance text-3xl font-semibold leading-[1.05] tracking-tight sm:text-5xl'>
              Structured boards for focused execution.
            </h1>
            <p className='max-w-3xl text-[13px] leading-relaxed text-muted-foreground sm:text-base'>
              Consistent lanes, cleaner cards, and task signals you can scan in
              seconds.
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-2.5'>
            <Button
              size='sm'
              className='h-8 gap-2 px-3 sm:h-9 sm:px-3.5'
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className='size-4' />
              New board
            </Button>
          </div>
          <div className='grid gap-2 sm:grid-cols-3 sm:gap-3'>
            {stats.map((stat) => (
              <Card
                key={stat.label}
                className='rounded-xl border border-primary/20 bg-primary/5 py-0 shadow-none'
              >
                <CardContent className='flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3'>
                  <div className='flex items-center gap-2'>
                    <span className='inline-flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <stat.icon className='size-3.5' />
                    </span>
                    <span className='font-meta text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
                      {stat.label}
                    </span>
                  </div>
                  <span className='text-lg font-semibold tabular-nums text-primary'>
                    {stat.value}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </header>

        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {boards.map((board) => (
            <BoardSummaryCard
              key={board.id}
              board={board}
              taskCount={countBoardTasks(board)}
            />
          ))}
        </div>
      </div>
      <BoardCreateModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        onSuccess={(boardId) => {
          toast.success('Board created.')
          router.push(`/boards/${boardId}`)
          router.refresh()
        }}
      />
    </section>
  )
}
