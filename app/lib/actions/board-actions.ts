'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '../../../lib/prisma'

type CreateBoardInput = {
  name: string
  description?: string
  columns?: string[]
}

export const createBoardAction = async ({
  name,
  description,
  columns = [],
}: CreateBoardInput) => {
  const board = await prisma.board.create({
    data: {
      name,
      description: description ?? '',
      columns: {
        create: columns.map((columnName, index) => ({
          name: columnName,
          order: index,
        })),
      },
    },
  })

  revalidatePath('/')
  revalidatePath(`/boards/${board.id}`)

  return board.id
}

type UpdateBoardInput = {
  boardId: string
  name?: string
  description?: string
}

export const updateBoardAction = async ({
  boardId,
  name,
  description,
}: UpdateBoardInput) => {
  await prisma.board.update({
    where: { id: boardId },
    data: { name, description },
  })

  revalidatePath('/')
  revalidatePath(`/boards/${boardId}`)
}

type DeleteBoardInput = {
  boardId: string
}

export const deleteBoardAction = async ({ boardId }: DeleteBoardInput) => {
  await prisma.board.delete({ where: { id: boardId } })

  revalidatePath('/')
}
