'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { boardCreateSchema } from '@/lib/validation/schemas'
import { formatZodErrors } from '@/lib/validation/utils'

type CreateBoardInput = {
  name: string
  description?: string
  columns?: string[]
}

type CreateBoardResult =
  | { ok: true; boardId: string }
  | { ok: false; errors: Record<string, string> }

export const createBoardAction = async (
  input: CreateBoardInput
): Promise<CreateBoardResult> => {
  const parsed = boardCreateSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, errors: formatZodErrors(parsed.error) }
  }

  const { name, description, columns = [] } = parsed.data
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

  return { ok: true, boardId: board.id }
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
