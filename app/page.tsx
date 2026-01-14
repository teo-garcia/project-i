import { ArrowRight, LayoutGrid } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { countBoardTasks, getBoards } from '@/lib/data/task-board'

export const metadata: Metadata = {
  title: 'Task Board | Your Boards',
  description: 'Manage your projects with kanban-style boards',
}

const HomePage = () => {
  const boards = getBoards()

  return (
    <section className='min-h-screen bg-background px-6 py-12 sm:px-10'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-8'>
        <header className='space-y-4'>
          <div className='flex items-center gap-2 text-sm font-medium text-muted-foreground'>
            <LayoutGrid className='size-4' />
            <span>Your Boards</span>
          </div>
          <div className='space-y-2'>
            <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
              Task Board
            </h1>
            <p className='max-w-2xl text-muted-foreground'>
              Organize your projects with kanban boards.
            </p>
          </div>
        </header>

        <div className='grid gap-4 sm:grid-cols-2'>
          {boards.map((board) => {
            const taskCount = countBoardTasks(board)
            return (
              <Link
                key={board.id}
                href={`/boards/${board.id}`}
                className='group'
              >
                <Card className='border border-border bg-card transition-colors hover:border-primary/50 hover:bg-muted/30'>
                  <CardHeader className='space-y-3 pb-3'>
                    <div className='flex items-start justify-between'>
                      <Badge variant='outline' className='text-xs font-medium'>
                        Board
                      </Badge>
                      <ArrowRight className='size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
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
          })}
        </div>
      </div>
    </section>
  )
}

export default HomePage
