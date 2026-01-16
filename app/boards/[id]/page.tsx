import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BoardPage } from '@/components/board-page/board-page'
import { getBoardById } from '@/lib/data/task-board'

type BoardPageProps = {
  params: Promise<{ id: string }>
}

export const generateMetadata = async (props: BoardPageProps): Promise<Metadata> => {
  const { id } = await props.params
  const board = getBoardById(id)

  if (!board) {
    return {
      title: 'Board not found | Task Board',
    }
  }

  return {
    title: `${board.name} | Task Board`,
    description: board.description,
  }
}

const BoardRoutePage = async (props: BoardPageProps) => {
  const { id } = await props.params
  const board = getBoardById(id)

  if (!board) {
    notFound()
  }

  return <BoardPage board={board} />
}

export default BoardRoutePage
