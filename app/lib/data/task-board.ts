export type TaskAssignee = {
  id: string
  name: string
  initials: string
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type Task = {
  id: string
  title: string
  description: string
  labels: string[]
  dueDate: string
  priority: TaskPriority
  assignees: TaskAssignee[]
}

export type Column = {
  id: string
  name: string
  tasks: Task[]
}

export type Board = {
  id: string
  name: string
  description: string
  columns: Column[]
}

// Count tasks across all columns in a board.
export const countBoardTasks = (board: Board) =>
  board.columns.reduce((total, column) => total + column.tasks.length, 0)

// Map priority to badge variant for consistent UI color.
export const getPriorityVariant = (
  priority: TaskPriority
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (priority) {
    case 'urgent': {
      return 'destructive'
    }
    case 'high': {
      return 'default'
    }
    case 'medium': {
      return 'secondary'
    }
    case 'low': {
      return 'outline'
    }
  }
}

// Overdue if due date is before now.
export const isTaskOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date()
}

// Due soon if the task lands within the next 3 days.
export const isTaskDueSoon = (dueDate: string): boolean => {
  const due = new Date(dueDate)
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  return due > now && due <= threeDaysFromNow
}
