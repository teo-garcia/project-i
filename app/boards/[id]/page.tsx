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
    <section className='min-h-screen bg-background px-6 py-10 sm:px-10'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-8'>
        <header className='flex flex-col gap-6'>
          <Link
            href='/'
            className='inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground'
          >
            <ArrowLeft className='size-4' />
            Back to boards
          </Link>
          <div className='flex flex-wrap items-center justify-between gap-4'>
            <div className='space-y-2'>
              <Badge variant='outline' className='w-fit'>
                Board
              </Badge>
              <h1 className='text-3xl font-semibold sm:text-4xl'>
                {board.name}
              </h1>
              <p className='max-w-2xl text-sm text-muted-foreground'>
                {board.description}
              </p>
            </div>
          </div>
        </header>

        <div className='grid gap-6 lg:grid-cols-3'>
          {board.columns.map((column) => (
            <Card key={column.id} className='border-border/60 bg-card/80'>
              <CardHeader className='space-y-2'>
                <div className='flex items-center justify-between'>
                  <CardTitle className='text-lg'>{column.name}</CardTitle>
                  <Badge variant='secondary'>{column.tasks.length}</Badge>
                </div>
                <p className='text-xs text-muted-foreground'>
                  Click a task to open the modal route.
                </p>
              </CardHeader>
              <CardContent className='space-y-3'>
                {column.tasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/boards/${board.id}/task/${task.id}`}
                    className='group block rounded-lg border border-border/60 bg-background px-4 py-3 transition hover:border-foreground/20 hover:shadow-sm'
                  >
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <p className='text-sm font-medium group-hover:text-foreground'>
                          {task.title}
                        </p>
                        <p className='mt-1 text-xs text-muted-foreground'>
                          {task.description}
                        </p>
                      </div>
                      <CircleDot className='mt-1 size-4 text-muted-foreground' />
                    </div>
                    <div className='mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                      {task.labels.map((label) => (
                        <Badge key={label} variant='outline'>
                          {label}
                        </Badge>
                      ))}
                      <span className='ml-auto text-xs'>
                        Due {formatDate(task.dueDate)}
                      </span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BoardPage
