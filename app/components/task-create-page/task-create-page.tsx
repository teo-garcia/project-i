import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { TaskCreateForm } from '@/components/task-create-form/task-create-form'

type TaskCreatePageProps = {
  boardId: string
  columns: { id: string; name: string }[]
}

export const TaskCreatePage = ({ boardId, columns }: TaskCreatePageProps) => {
  return (
    <section className='min-h-screen bg-background px-6 py-12 sm:px-10 sm:py-14'>
      <div className='app-container flex flex-col gap-8'>
        <Link
          href={`/boards/${boardId}`}
          className='inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground'
        >
          <ArrowLeft className='size-4' />
          Back to board
        </Link>
        <div className='space-y-4'>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Create a task
          </h1>
          <p className='max-w-xl text-sm text-muted-foreground sm:text-base'>
            Capture the work, tag it, and keep it moving across your flow.
          </p>
        </div>
        <div className='max-w-3xl rounded-[28px] border border-border/70 bg-card/80 p-6 shadow-[0_16px_48px_-32px_rgba(120,72,40,0.5)] sm:p-8'>
          <TaskCreateForm boardId={boardId} columns={columns} />
        </div>
      </div>
    </section>
  )
}
