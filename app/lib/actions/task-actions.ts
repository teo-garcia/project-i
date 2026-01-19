'use server'

import { revalidatePath } from 'next/cache'

import type { TaskPriority } from '@/lib/data/task-board'

import { prisma } from '../../../lib/prisma'

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
  tx: typeof prisma
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
      await resequenceColumn(targetIds, toColumnId, false, prisma)
      return
    }

    await resequenceColumn(sourceIds, sourceColumnId, false, prisma)
    await resequenceColumn(targetIds, toColumnId, true, prisma)
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

export const createTaskAction = async ({
  boardId,
  columnId,
  title,
  description,
  dueDate,
  priority = 'medium',
  labels = [],
  assignees = [],
}: CreateTaskInput) => {
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
  await prisma.$transaction(async (tx) => {
    await tx.task.update({
      where: { id: taskId },
      data: {
        title,
        description,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        priority,
      },
    })

    if (labels) {
      await tx.taskLabel.deleteMany({ where: { taskId } })
      for (const label of labels) {
        const record = await tx.label.upsert({
          where: { name: label },
          update: {},
          create: { name: label },
        })
        await tx.taskLabel.create({
          data: {
            taskId,
            labelId: record.id,
          },
        })
      }
    }

    if (assignees) {
      await tx.taskAssignee.deleteMany({ where: { taskId } })
      for (const assignee of assignees) {
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
            taskId,
            assigneeId: record.id,
          },
        })
      }
    }
  })

  revalidatePath(`/boards/${boardId}`)
  revalidatePath(`/boards/${boardId}/task/${taskId}`)
}

type DeleteTaskInput = {
  boardId: string
  taskId: string
}

export const deleteTaskAction = async ({
  boardId,
  taskId,
}: DeleteTaskInput) => {
  await prisma.task.delete({ where: { id: taskId } })
  revalidatePath(`/boards/${boardId}`)
}
