import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { TaskDetail } from '@/components/task-detail/task-detail'
import { getTaskById } from '@/lib/data/task-board'

type TaskPageProps = {
  params: Promise<{ id: string; taskId: string }>
}

export const generateMetadata = async (props: TaskPageProps): Promise<Metadata> => {
  const { id, taskId } = await props.params
  const result = getTaskById(id, taskId)

  if (!result) {
    return { title: 'Task not found | Task Board' }
  }

  return {
    title: `${result.task.title} | ${result.board.name}`,
    description: result.task.description,
  }
}

const TaskPage = async (props: TaskPageProps) => {
  const { id, taskId } = await props.params
  const result = getTaskById(id, taskId)

  if (!result) {
    notFound()
  }

  return (
    <section className='min-h-screen bg-background px-6 py-12 sm:px-10'>
      <div className='mx-auto flex w-full max-w-4xl flex-col gap-6'>
        <Link
          href={`/boards/${id}`}
          className='inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground'
        >
          <ArrowLeft className='size-4' />
          Back to board
        </Link>
        <TaskDetail
          task={result.task}
          columnName={result.column.name}
          boardName={result.board.name}
        />
      </div>
    </section>
  )
}

export default TaskPage
