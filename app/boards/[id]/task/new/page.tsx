import { notFound } from 'next/navigation'

import { TaskCreatePage } from '@/components/task-create-page/task-create-page'
import { fetchBoardById } from '@/lib/db/boards'

type NewTaskPageProps = {
  params: Promise<{ id: string }>
}

const NewTaskPage = async ({ params }: NewTaskPageProps) => {
  const { id } = await params
  const board = await fetchBoardById(id)

  if (!board) {
    notFound()
  }

  const columns = board.columns.map((column) => ({
    id: column.id,
    name: column.name,
  }))

  return <TaskCreatePage boardId={board.id} columns={columns} />
}

export default NewTaskPage
