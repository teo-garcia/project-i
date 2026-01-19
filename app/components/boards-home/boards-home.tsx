'use client'

import { LayoutGrid, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { BoardCreateModal } from '@/components/board-create-modal/board-create-modal'
import { BoardSummaryCard } from '@/components/board-summary-card/board-summary-card'
import { GradientOrbs } from '@/components/gradient-orbs/gradient-orbs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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

  return (
    <section className='relative min-h-screen overflow-hidden bg-background px-6 pb-14 pt-12 sm:px-10 sm:pb-16 sm:pt-14'>
      <GradientOrbs variant='home' />
      <div className='app-container relative flex flex-col gap-12'>
        <header className='grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] animate-in fade-in slide-in-from-bottom-6 duration-700'>
          <div className='space-y-6'>
            <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground'>
              <LayoutGrid className='size-4' />
              <span>Your Boards</span>
            </div>
            <div className='space-y-3'>
              <h1 className='text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl'>
                Task Board for teams that ship with clarity.
              </h1>
              <p className='max-w-2xl text-base text-muted-foreground sm:text-lg'>
                Build momentum with kanban boards that feel alive. Snap tasks
                into motion, spotlight priorities, and keep every project
                crystal clear.
              </p>
            </div>
            <div className='flex flex-wrap items-center gap-4'>
              <Badge className='rounded-full border-0 bg-primary px-4 py-1.5 text-sm text-primary-foreground shadow-md shadow-primary/20'>
                Live teamwork
              </Badge>
              <Badge className='rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-sm text-foreground'>
                Clear priorities
              </Badge>
              <Badge className='rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-sm text-foreground'>
                Instant momentum
              </Badge>
              <Button
                size='sm'
                className='rounded-full border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
                onClick={() => setIsCreateOpen(true)}
              >
                <span className='flex items-center gap-2'>
                  <Plus className='size-4' />
                  New board
                </span>
              </Button>
            </div>
          </div>
          <div className='rounded-[28px] border border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/60 p-6 shadow-[0_18px_60px_-40px_rgba(120,72,40,0.5)] backdrop-blur sm:p-8'>
            <div className='space-y-6'>
              <div className='flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground'>
                <span>At a glance</span>
                <span className='rounded-full bg-primary/15 px-3 py-1 text-[10px] text-primary'>
                  Today
                </span>
              </div>
              <div className='space-y-2'>
                <p className='text-2xl font-semibold'>Focus flow unlocked.</p>
                <p className='text-sm text-muted-foreground'>
                  Every board comes with a tuned cadence for fast-moving teams.
                </p>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-2xl border border-border/70 bg-background/70 p-4'>
                  <p className='text-xs text-muted-foreground'>Active boards</p>
                  <p className='text-2xl font-semibold'>{boards.length}</p>
                </div>
                <div className='rounded-2xl border border-border/70 bg-background/70 p-4'>
                  <p className='text-xs text-muted-foreground'>Total tasks</p>
                  <p className='text-2xl font-semibold'>{taskCount}</p>
                </div>
                <div className='rounded-2xl border border-border/70 bg-background/70 p-4'>
                  <p className='text-xs text-muted-foreground'>Columns</p>
                  <p className='text-2xl font-semibold'>{columnCount}</p>
                </div>
                <div className='rounded-2xl border border-border/70 bg-background/70 p-4'>
                  <p className='text-xs text-muted-foreground'>Team rhythm</p>
                  <p className='text-2xl font-semibold'>Steady</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className='grid gap-6 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-700'>
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
          setIsCreateOpen(false)
          router.push(`/boards/${boardId}`)
          router.refresh()
        }}
      />
    </section>
  )
}
