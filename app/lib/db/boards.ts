import 'server-only'

import type {
  Board,
  Task,
  TaskAssignee,
  TaskPriority,
} from '@/lib/data/task-board'

import { Prisma } from '../../../generated/prisma/client'
import { prisma } from '../../../lib/prisma'

type TaskWithRelations = Prisma.TaskGetPayload<{
  include: {
    labels: { include: { label: true } }
    assignees: { include: { assignee: true } }
  }
}>

type BoardWithRelations = Prisma.BoardGetPayload<{
  include: {
    columns: {
      include: {
        tasks: {
          include: {
            labels: { include: { label: true } }
            assignees: { include: { assignee: true } }
          }
        }
      }
    }
  }
}>

const mapAssignees = (
  assignees: {
    assignee: { id: string; name: string; initials: string }
  }[]
): TaskAssignee[] =>
  assignees.map(({ assignee }) => ({
    id: assignee.id,
    name: assignee.name,
    initials: assignee.initials,
  }))

const mapTask = (task: TaskWithRelations): Task => ({
  id: task.id,
  title: task.title,
  description: task.description,
  dueDate: task.dueDate.toISOString(),
  priority: task.priority as TaskPriority,
  labels: task.labels.map(({ label }) => label.name),
  assignees: mapAssignees(task.assignees),
})

const mapBoard = (board: BoardWithRelations): Board => ({
  id: board.id,
  name: board.name,
  description: board.description,
  columns: board.columns.map((column) => ({
    id: column.id,
    name: column.name,
    tasks: column.tasks.map((element) => mapTask(element)),
  })),
})

// Fetch all boards with their columns and tasks.
export const fetchBoards = async (): Promise<Board[]> => {
  const boards = await prisma.board.findMany({
    orderBy: { createdAt: 'asc' },
    include: {
      columns: {
        orderBy: { order: 'asc' },
        include: {
          tasks: {
            orderBy: { order: 'asc' },
            include: {
              labels: { include: { label: true } },
              assignees: { include: { assignee: true } },
            },
          },
        },
      },
    },
  })

  return boards.map((element) => mapBoard(element))
}

// Fetch a single board by id with full column/task detail.
export const fetchBoardById = async (
  boardId: string
): Promise<Board | null> => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      columns: {
        orderBy: { order: 'asc' },
        include: {
          tasks: {
            orderBy: { order: 'asc' },
            include: {
              labels: { include: { label: true } },
              assignees: { include: { assignee: true } },
            },
          },
        },
      },
    },
  })

  return board ? mapBoard(board) : null
}

// Find a task plus its board/column context.
export const fetchTaskById = async (boardId: string, taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      column: { include: { board: true } },
      labels: { include: { label: true } },
      assignees: { include: { assignee: true } },
    },
  })

  if (!task || task.column.boardId !== boardId) {
    return null
  }

  return {
    board: {
      id: task.column.board.id,
      name: task.column.board.name,
      description: task.column.board.description,
      columns: [],
    },
    column: {
      id: task.column.id,
      name: task.column.name,
      tasks: [],
    },
    task: mapTask(task),
  }
}
