'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { BoardFiltersComponent, type BoardFilters } from '@/components/board-filters/board-filters'
import { EmptyState } from '@/components/empty-state/empty-state'
import { FloatingActionButton } from '@/components/floating-action-button/floating-action-button'
import { TaskCard } from '@/components/task-card/task-card'
import type { Board } from '@/lib/data/task-board'

type BoardContentProps = {
  board: Board
}

export const BoardContent = ({ board }: BoardContentProps) => {
  const [filters, setFilters] = useState<BoardFilters>({
    priorities: [],
    labels: [],
    showEmpty: true,
  })

  const totalTasks = board.columns.reduce((total, column) => total + column.tasks.length, 0)

  // Get all unique labels
  const allLabels = useMemo(() => {
    const labels = new Set<string>()
    board.columns.forEach(column => {
      column.tasks.forEach(task => {
        task.labels.forEach(label => labels.add(label))
      })
    })
    return Array.from(labels).sort()
  }, [board])

  // Filter tasks
  const filteredColumns = useMemo(() => {
    return board.columns.map(column => {
      const filteredTasks = column.tasks.filter(task => {
        // Priority filter
        if (filters.priorities.length > 0 && !filters.priorities.includes(task.priority)) {
          return false
        }

        // Label filter
        if (filters.labels.length > 0) {
          const hasMatchingLabel = task.labels.some(label => filters.labels.includes(label))
          if (!hasMatchingLabel) return false
        }

        return true
      })

      return {
        ...column,
        tasks: filteredTasks,
      }
    }).filter(column => filters.showEmpty || column.tasks.length > 0)
  }, [board, filters])

  return (
    <section className='relative min-h-screen overflow-hidden bg-background px-6 pb-16 pt-16 sm:px-10 sm:pb-20 sm:pt-20'>
      <div className='pointer-events-none absolute inset-0'>
        <div className='absolute -left-24 top-28 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.28),transparent_65%)] blur-2xl' />
        <div className='absolute right-[-5rem] top-[-4rem] h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(251,146,60,0.28),transparent_60%)] blur-3xl' />
        <div className='absolute bottom-[-9rem] left-1/2 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.22),transparent_60%)] blur-3xl' />
      </div>
      <div className='relative mx-auto flex w-full max-w-7xl flex-col gap-10'>
        <header className='grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] animate-in fade-in slide-in-from-bottom-6 duration-700'>
          <div className='space-y-4'>
            <Link
              href='/'
              className='inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground'
            >
              <ArrowLeft className='size-4' />
              Back to boards
            </Link>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <Badge variant='outline' className='border-primary/30 bg-primary/10 text-xs font-medium text-primary'>
                  Board
                </Badge>
                <BoardFiltersComponent
                  allLabels={allLabels}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
              <h1 className='text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
                {board.name}
              </h1>
              <p className='max-w-2xl text-sm text-muted-foreground sm:text-base'>
                {board.description}
              </p>
            </div>
          </div>
          <div className='rounded-[32px] border border-border/60 bg-gradient-to-br from-card/95 via-card/80 to-card/60 p-7 shadow-2xl shadow-emerald-500/15 backdrop-blur sm:p-8'>
            <div className='space-y-6'>
              <div className='flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground'>
                <span>Board pulse</span>
                <span className='rounded-full bg-primary/15 px-3 py-1 text-[10px] text-primary'>
                  Active
                </span>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-2xl border border-border/60 bg-card/80 p-4'>
                  <p className='text-xs text-muted-foreground'>Columns</p>
                  <p className='text-2xl font-semibold'>{board.columns.length}</p>
                </div>
                <div className='rounded-2xl border border-border/60 bg-card/80 p-4'>
                  <p className='text-xs text-muted-foreground'>Tasks</p>
                  <p className='text-2xl font-semibold'>{totalTasks}</p>
                </div>
                <div className='rounded-2xl border border-border/60 bg-card/80 p-4'>
                  <p className='text-xs text-muted-foreground'>Focus</p>
                  <p className='text-2xl font-semibold'>High</p>
                </div>
                <div className='rounded-2xl border border-border/60 bg-card/80 p-4'>
                  <p className='text-xs text-muted-foreground'>Cadence</p>
                  <p className='text-2xl font-semibold'>Daily</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className='grid gap-5 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700'>
          {filteredColumns.map((column) => (
            <div key={column.id} className='flex flex-col gap-3.5'>
              {/* Column header */}
              <div className='flex items-center justify-between rounded-2xl border border-border/60 bg-card/85 px-4 py-3 shadow-sm'>
                <h2 className='text-sm font-semibold'>{column.name}</h2>
                <span className='text-xs font-medium text-muted-foreground'>
                  {column.tasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div className='flex flex-col gap-2.5'>
                {column.tasks.length > 0 ? (
                  column.tasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      boardId={board.id}
                      onEdit={() => console.log('Edit task:', task.id)}
                      onDelete={() => console.log('Delete task:', task.id)}
                      onDuplicate={() => console.log('Duplicate task:', task.id)}
                    />
                  ))
                ) : (
                  <EmptyState
                    title='No tasks'
                    description={`No tasks match your filters in ${column.name}`}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <FloatingActionButton />
    </section>
  )
}
