import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { TaskDetail } from '@/components/task-detail/task-detail'
import type { Task } from '@/lib/data/task-board'

type TaskDetailPageProps = {
  boardId: string
  task: Task
  columnName: string
  boardName: string
}

export const TaskDetailPage = ({
  boardId,
  task,
  columnName,
  boardName,
}: TaskDetailPageProps) => {
  return (
    <section className='min-h-screen bg-background px-4 py-8 sm:px-10 sm:py-14'>
      <div className='app-container flex flex-col gap-6 sm:gap-8'>
        <Link
          href={`/boards/${boardId}`}
          className='inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground'
        >
          <ArrowLeft className='size-4' />
          Back to board
        </Link>
        <TaskDetail task={task} columnName={columnName} boardName={boardName} />
      </div>
    </section>
  )
}
