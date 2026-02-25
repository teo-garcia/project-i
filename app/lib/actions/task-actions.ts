'use server'

import { revalidatePath } from 'next/cache'

import type { TaskPriority } from '@/lib/data/task-board'
import { prisma } from '@/lib/prisma'
import {
  taskCreateSchema,
  taskDeleteSchema,
  taskMoveSchema,
  taskUpdateSchema,
} from '@/lib/validation/schemas'
import { formatZodErrors } from '@/lib/validation/utils'

import type { Prisma } from '../../../generated/prisma/client'

type MoveTaskInput = {
  boardId: string
  taskId: string
  toColumnId: string
  toIndex: number
}

const resequenceColumn = async (
  taskIds: string[],
  columnId: string,
  updateColumn: boolean,
  tx: Prisma.TransactionClient
) => {
  await Promise.all(
    taskIds.map((taskId, order) =>
      tx.task.update({
        where: { id: taskId },
        data: updateColumn ? { order, columnId } : { order },
      })
    )
  )
}

export const moveTaskAction = async ({
  boardId,
  taskId,
  toColumnId,
  toIndex,
}: MoveTaskInput) => {
  const parsed = taskMoveSchema.safeParse({
    boardId,
    taskId,
    toColumnId,
    toIndex,
  })

  if (!parsed.success) {
    return
  }

  await prisma.$transaction(async (tx) => {
    const task = await tx.task.findUnique({
      where: { id: taskId },
      select: { columnId: true },
    })

    if (!task) {
      return
    }

    const sourceColumnId = task.columnId
    const sourceTasks = await tx.task.findMany({
      where: { columnId: sourceColumnId },
      orderBy: { order: 'asc' },
      select: { id: true },
    })

    const targetTasks =
      sourceColumnId === toColumnId
        ? sourceTasks
        : await tx.task.findMany({
            where: { columnId: toColumnId },
            orderBy: { order: 'asc' },
            select: { id: true },
          })

    const sourceIds = sourceTasks
      .map((item) => item.id)
      .filter((id) => id !== taskId)
    const targetIds =
      sourceColumnId === toColumnId
        ? sourceIds
        : targetTasks.map((item) => item.id)

    const clampedIndex = Math.max(0, Math.min(toIndex, targetIds.length))
    targetIds.splice(clampedIndex, 0, taskId)

    if (sourceColumnId === toColumnId) {
      await resequenceColumn(targetIds, toColumnId, false, tx)
      return
    }

    await resequenceColumn(sourceIds, sourceColumnId, false, tx)
    await resequenceColumn(targetIds, toColumnId, true, tx)
  })

  revalidatePath(`/boards/${boardId}`)
  revalidatePath(`/boards/${boardId}/task/${taskId}`)
}

type CreateTaskInput = {
  boardId: string
  columnId: string
  title: string
  description?: string
  dueDate?: string
  priority?: TaskPriority
  labels?: string[]
  assignees?: { name: string; initials: string }[]
}

type CreateTaskResult =
  | { ok: true }
  | { ok: false; errors: Record<string, string> }

export const createTaskAction = async (
  input: CreateTaskInput
): Promise<CreateTaskResult> => {
  const parsed = taskCreateSchema.safeParse(input)

  if (!parsed.success) {
    return { ok: false, errors: formatZodErrors(parsed.error) }
  }

  const {
    boardId,
    columnId,
    title,
    description,
    dueDate,
    priority,
    labels = [],
    assignees = [],
  } = parsed.data
  const lastTask = await prisma.task.findFirst({
    where: { columnId },
    orderBy: { order: 'desc' },
    select: { order: true },
  })

  const nextOrder = (lastTask?.order ?? -1) + 1

  await prisma.task.create({
    data: {
      title,
      description: description ?? '',
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      priority,
      order: nextOrder,
      columnId,
      labels: {
        create: labels.map((label) => ({
          label: {
            connectOrCreate: {
              where: { name: label },
              create: { name: label },
            },
          },
        })),
      },
      assignees: {
        create: assignees.map((assignee) => ({
          assignee: {
            connectOrCreate: {
              where: { name: assignee.name },
              create: {
                name: assignee.name,
                initials: assignee.initials,
              },
            },
          },
        })),
      },
    },
  })

  revalidatePath(`/boards/${boardId}`)
  return { ok: true }
}

type UpdateTaskInput = {
  boardId: string
  taskId: string
  title?: string
  description?: string
  dueDate?: string
  priority?: TaskPriority
  labels?: string[]
  assignees?: { name: string; initials: string }[]
}

export const updateTaskAction = async ({
  boardId,
  taskId,
  title,
  description,
  dueDate,
  priority,
  labels,
  assignees,
}: UpdateTaskInput) => {
  const parsed = taskUpdateSchema.safeParse({
    boardId,
    taskId,
    title,
    description,
    dueDate,
    priority,
    labels,
    assignees,
  })

  if (!parsed.success) {
    return { ok: false, errors: formatZodErrors(parsed.error) } as const
  }

  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: parsed.data.taskId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        dueDate: parsed.data.dueDate
          ? new Date(parsed.data.dueDate)
          : undefined,
        priority: parsed.data.priority,
      },
    })

    if (parsed.data.labels) {
      await tx.taskLabel.deleteMany({ where: { taskId: parsed.data.taskId } })
      for (const label of parsed.data.labels) {
        const record = await tx.label.upsert({
          where: { name: label },
          update: {},
          create: { name: label },
        })
        await tx.taskLabel.create({
          data: {
            taskId: parsed.data.taskId,
            labelId: record.id,
          },
        })
      }
    }

    if (parsed.data.assignees) {
      await tx.taskAssignee.deleteMany({
        where: { taskId: parsed.data.taskId },
      })
      for (const assignee of parsed.data.assignees) {
        const record = await tx.assignee.upsert({
          where: { name: assignee.name },
          update: { initials: assignee.initials },
          create: {
            name: assignee.name,
            initials: assignee.initials,
          },
        })
        await tx.taskAssignee.create({
          data: {
            taskId: parsed.data.taskId,
            assigneeId: record.id,
          },
        })
      }
    }
  })

  revalidatePath(`/boards/${parsed.data.boardId}`)
  revalidatePath(`/boards/${parsed.data.boardId}/task/${parsed.data.taskId}`)

  return { ok: true } as const
}

type DeleteTaskInput = {
  boardId: string
  taskId: string
}

export const deleteTaskAction = async ({
  boardId,
  taskId,
}: DeleteTaskInput) => {
  const parsed = taskDeleteSchema.safeParse({ boardId, taskId })

  if (!parsed.success) {
    return { ok: false, errors: formatZodErrors(parsed.error) } as const
  }

  await prisma.task.delete({ where: { id: parsed.data.taskId } })
  revalidatePath(`/boards/${parsed.data.boardId}`)

  return { ok: true } as const
}
