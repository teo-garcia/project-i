// DnD helpers live here so UI code stays declarative.
// The goal is to make task moves predictable and easy to test.
import type { Board } from '@/lib/data/task-board'

// Task drag/drop IDs are prefixed to avoid collisions with column IDs.
// These helpers keep DnD state decoding consistent across the app.
const TASK_PREFIX = 'task:'
const COLUMN_PREFIX = 'column:'

// Encode a task id for drag/drop payloads.
export const toTaskId = (id: string) => `${TASK_PREFIX}${id}`
// Encode a column id for drag/drop payloads.
export const toColumnId = (id: string) => `${COLUMN_PREFIX}${id}`
// Decode a task id coming from drag/drop payloads.
export const fromTaskId = (id: string) => id.replace(TASK_PREFIX, '')
// Decode a column id coming from drag/drop payloads.
export const fromColumnId = (id: string) => id.replace(COLUMN_PREFIX, '')

// Guard helpers for id types.
export const isTaskDragId = (id: string) => id.startsWith(TASK_PREFIX)
export const isColumnDragId = (id: string) => id.startsWith(COLUMN_PREFIX)

// Locate the column that currently owns a task.
export const findColumnForTask = (columns: Board['columns'], taskId: string) =>
  columns.find((column) => column.tasks.some((task) => task.id === taskId))

// Fetch the task record from a board column list.
export const findTaskById = (columns: Board['columns'], taskId: string) => {
  for (const column of columns) {
    const task = column.tasks.find((item) => item.id === taskId)
    if (task) return task
  }
  return undefined
}

// Resolve the intended drop target from a DnD "over" id.
export const getDropTarget = (columns: Board['columns'], overId: string) => {
  if (isColumnDragId(overId)) {
    return { columnId: fromColumnId(overId), taskId: null }
  }

  if (isTaskDragId(overId)) {
    const taskId = fromTaskId(overId)
    return { columnId: findColumnForTask(columns, taskId)?.id ?? null, taskId }
  }

  return { columnId: null, taskId: null }
}

// Apply a drag move and return the next column state.
export const moveTask = (
  columns: Board['columns'],
  activeId: string,
  overId: string
) => {
  if (!isTaskDragId(activeId)) return columns

  const activeTaskId = fromTaskId(activeId)
  const sourceColumn = findColumnForTask(columns, activeTaskId)

  if (!sourceColumn) return columns

  const target = getDropTarget(columns, overId)
  if (!target.columnId) return columns

  const sourceIndex = columns.findIndex(
    (column) => column.id === sourceColumn.id
  )
  const targetIndex = columns.findIndex(
    (column) => column.id === target.columnId
  )

  if (sourceIndex === -1 || targetIndex === -1) return columns

  if (sourceIndex === targetIndex) {
    if (!target.taskId) return columns

    const tasks = columns[sourceIndex].tasks
    const activeTaskIndex = tasks.findIndex((task) => task.id === activeTaskId)
    const overTaskIndex = tasks.findIndex((task) => task.id === target.taskId)

    if (activeTaskIndex === -1 || overTaskIndex === -1) return columns

    const reordered = [...tasks]
    const [moved] = reordered.splice(activeTaskIndex, 1)
    reordered.splice(overTaskIndex, 0, moved)

    return columns.map((column, index) =>
      index === sourceIndex ? { ...column, tasks: reordered } : column
    )
  }

  const sourceTasks = [...columns[sourceIndex].tasks]
  const targetTasks = [...columns[targetIndex].tasks]
  const activeTaskIndex = sourceTasks.findIndex(
    (task) => task.id === activeTaskId
  )

  if (activeTaskIndex === -1) return columns

  const [movedTask] = sourceTasks.splice(activeTaskIndex, 1)
  const overTaskIndex = target.taskId
    ? targetTasks.findIndex((task) => task.id === target.taskId)
    : -1
  const insertIndex = overTaskIndex === -1 ? targetTasks.length : overTaskIndex
  targetTasks.splice(insertIndex, 0, movedTask)

  return columns.map((column, index) => {
    if (index === sourceIndex) return { ...column, tasks: sourceTasks }
    if (index === targetIndex) return { ...column, tasks: targetTasks }
    return column
  })
}
