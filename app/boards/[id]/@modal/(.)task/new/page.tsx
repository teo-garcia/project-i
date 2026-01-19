import { notFound } from 'next/navigation'

import { TaskCreateModal } from '@/components/task-create-modal/task-create-modal'
import { fetchBoardById } from '@/lib/db/boards'

type NewTaskModalPageProps = {
  params: Promise<{ id: string }>
}

const NewTaskModalPage = async ({ params }: NewTaskModalPageProps) => {
  const { id } = await params
  const board = await fetchBoardById(id)

  if (!board) {
    notFound()
  }

  const columns = board.columns.map((column) => ({
    id: column.id,
    name: column.name,
  }))

  return <TaskCreateModal boardId={board.id} columns={columns} />
}

export default NewTaskModalPage
