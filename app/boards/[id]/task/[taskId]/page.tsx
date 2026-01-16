import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { TaskDetailPage } from '@/components/task-detail-page/task-detail-page'
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
    <TaskDetailPage
      boardId={id}
      task={result.task}
      columnName={result.column.name}
      boardName={result.board.name}
    />
  )
}

export default TaskPage
