import type { Metadata } from 'next'

import { BoardsHome } from '@/components/boards-home/boards-home'
import { fetchBoards } from '@/lib/db/boards'

export const metadata: Metadata = {
  title: 'Task Board | Your Boards',
  description: 'Manage your projects with kanban-style boards',
}

const HomePage = async () => {
  const boards = await fetchBoards()

  return <BoardsHome boards={boards} />
}

export default HomePage
