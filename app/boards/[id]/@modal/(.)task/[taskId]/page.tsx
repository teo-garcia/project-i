import { TaskDetailModal } from '@/components/task-detail-modal/task-detail-modal'
import { fetchTaskById } from '@/lib/db/boards'

type TaskModalPageProps = {
  params: Promise<{ id: string; taskId: string }>
}

const TaskModalPage = async ({ params }: TaskModalPageProps) => {
  const { id, taskId } = await params
  const result = await fetchTaskById(id, taskId)

  return (
    <TaskDetailModal
      task={result?.task ?? null}
      columnName={result?.column.name}
      boardName={result?.board.name}
    />
  )
}

export default TaskModalPage
