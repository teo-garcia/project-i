'use client'

import { TaskDetailModal } from '@/components/task-detail-modal/task-detail-modal'

type TaskModalPageProps = {
  params: Promise<{ id: string; taskId: string }>
}

const TaskModalPage = ({ params }: TaskModalPageProps) => {
  return <TaskDetailModal params={params} />
}

export default TaskModalPage
