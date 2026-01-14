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
    <section className='min-h-screen bg-background px-6 py-10 sm:px-10'>
      <div className='mx-auto flex w-full max-w-6xl flex-col gap-8'>
        <header className='space-y-4'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <LayoutGrid className='size-4' />
            <span>Your Boards</span>
          </div>
          <div className='space-y-2'>
            <h1 className='text-3xl font-semibold sm:text-4xl'>
              Welcome to Task Board
            </h1>
            <p className='max-w-2xl text-sm text-muted-foreground'>
              Select a board to view and manage your tasks with drag-and-drop
              kanban columns.
            </p>
          </div>
        </header>

        <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-2'>
          {boards.map((board) => {
            const taskCount = countBoardTasks(board)
            return (
              <Link
                key={board.id}
                href={`/boards/${board.id}`}
                className='group'
              >
                <Card className='border-border/60 bg-card/80 transition hover:border-foreground/20 hover:shadow-md'>
                  <CardHeader className='space-y-3'>
                    <div className='flex items-start justify-between'>
                      <Badge variant='outline' className='w-fit'>
                        Board
                      </Badge>
                      <ArrowRight className='size-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground' />
                    </div>
                    <CardTitle className='text-xl group-hover:text-foreground'>
                      {board.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <p className='text-sm text-muted-foreground'>
                      {board.description}
                    </p>
                    <div className='flex items-center gap-4 text-xs text-muted-foreground'>
                      <div className='flex items-center gap-2'>
                        <Badge variant='secondary' className='h-5 min-w-5 px-1.5'>
                          {board.columns.length}
                        </Badge>
                        <span>columns</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Badge variant='secondary' className='h-5 min-w-5 px-1.5'>
                          {taskCount}
                        </Badge>
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
