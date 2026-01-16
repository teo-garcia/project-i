import type { Metadata } from 'next'

import { BoardsHome } from '@/components/boards-home/boards-home'
import { getBoards } from '@/lib/data/task-board'

export const metadata: Metadata = {
  title: 'Task Board | Your Boards',
  description: 'Manage your projects with kanban-style boards',
}

const HomePage = () => {
  const boards = getBoards()

  return <BoardsHome boards={boards} />
}

export default HomePage
