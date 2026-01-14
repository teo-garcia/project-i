import { ArrowLeft, CircleDot } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getBoardById } from '@/lib/data/task-board'

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

type BoardPageProps = {
  params: Promise<{ id: string }>
}

export const generateMetadata = async (props: BoardPageProps): Promise<Metadata> => {
  const { id } = await props.params
  const board = getBoardById(id)

  if (!board) {
    return {
      title: 'Board not found | Task Board',
    }
  }

  return {
    title: `${board.name} | Task Board`,
    description: board.description,
  }
}

const BoardPage = async (props: BoardPageProps) => {
  const { id } = await props.params
  const board = getBoardById(id)

  if (!board) {
    notFound()
  }

  const totalTasks = board.columns.reduce((total, column) => total + column.tasks.length, 0)

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
              <Badge variant='outline' className='border-primary/30 bg-primary/10 text-xs font-medium text-primary'>
                Board
              </Badge>
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
          {board.columns.map((column) => (
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
                {column.tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/boards/${board.id}/task/${task.id}`}
                    className='group'
                  >
                    <Card className='relative overflow-hidden border border-border/60 bg-card/85 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-emerald-500/15'>
                      <div className='absolute -right-10 top-3 h-20 w-20 rounded-full bg-emerald-200/30 blur-2xl transition-opacity group-hover:opacity-80' />
                      <CardContent className='p-3.5'>
                        <div className='flex items-start justify-between gap-3'>
                          <div className='flex-1 space-y-1.5'>
                            <p className='text-sm font-semibold leading-tight'>
                              {task.title}
                            </p>
                            <p className='text-xs text-muted-foreground line-clamp-2'>
                              {task.description}
                            </p>
                          </div>
                          <CircleDot className='mt-0.5 size-3.5 shrink-0 text-muted-foreground/40' />
                        </div>
                        {task.labels.length > 0 && (
                          <div className='mt-3 flex flex-wrap items-center gap-1.5'>
                            {task.labels.slice(0, 2).map((label) => (
                              <Badge key={label} variant='secondary' className='text-xs px-2.5 py-0.5'>
                                {label}
                              </Badge>
                            ))}
                            {task.labels.length > 2 && (
                              <span className='text-xs text-muted-foreground'>
                                +{task.labels.length - 2}
                              </span>
                            )}
                            <span className='ml-auto text-xs text-muted-foreground'>
                              {formatDate(task.dueDate)}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BoardPage
