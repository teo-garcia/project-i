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

  return (
    <section className='min-h-screen bg-background px-6 py-8 sm:px-10'>
      <div className='mx-auto flex w-full max-w-7xl flex-col gap-6'>
        <header className='flex flex-col gap-4'>
          <Link
            href='/'
            className='inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground'
          >
            <ArrowLeft className='size-4' />
            Back to boards
          </Link>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='space-y-2'>
              <Badge variant='outline' className='text-xs font-medium'>
                Board
              </Badge>
              <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
                {board.name}
              </h1>
              <p className='max-w-2xl text-sm text-muted-foreground'>
                {board.description}
              </p>
            </div>
          </div>
        </header>

        <div className='grid gap-4 lg:grid-cols-3'>
          {board.columns.map((column) => (
            <div key={column.id} className='flex flex-col gap-3'>
              {/* Column header */}
              <div className='flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-2.5'>
                <h2 className='text-sm font-semibold'>{column.name}</h2>
                <span className='text-xs font-medium text-muted-foreground'>
                  {column.tasks.length}
                </span>
              </div>

              {/* Tasks */}
              <div className='flex flex-col gap-2'>
                {column.tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/boards/${board.id}/task/${task.id}`}
                    className='group'
                  >
                    <Card className='border border-border bg-card transition-colors hover:border-primary/50 hover:bg-muted/20'>
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
                              <Badge key={label} variant='secondary' className='text-xs px-2 py-0'>
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
