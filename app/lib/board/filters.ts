// Centralized board filtering logic.
// Keeps UI components focused on rendering and delegates filter rules here.
import type { Board, Task, TaskPriority } from '@/lib/data/task-board'

export type BoardFiltersState = {
  priorities: TaskPriority[]
  labels: string[]
  showEmpty: boolean
}

const priorityOptions: TaskPriority[] = ['urgent', 'high', 'medium', 'low']

// Decide if a single task should survive the current filter set.
const taskMatchesFilters = (task: Task, filters: BoardFiltersState) => {
  if (
    filters.priorities.length > 0 &&
    !filters.priorities.includes(task.priority)
  ) {
    return false
  }

  if (filters.labels.length === 0) {
    return true
  }

  return task.labels.some((label) => filters.labels.includes(label))
}

// Default filter state used when a board first loads.
export const getDefaultBoardFilters = (): BoardFiltersState => ({
  priorities: [],
  labels: [],
  showEmpty: true,
})

// Count how many filters are actively narrowing the board.
export const getBoardFilterCount = (filters: BoardFiltersState) =>
  filters.priorities.length +
  filters.labels.length +
  (filters.showEmpty ? 0 : 1)

// Priority options are controlled here so UI can stay dumb.
export const getBoardFilterOptions = () => priorityOptions

// Flip a priority filter on/off and return the next state.
export const togglePriorityFilter = (
  filters: BoardFiltersState,
  priority: TaskPriority
) => {
  const priorities = filters.priorities.includes(priority)
    ? filters.priorities.filter((value) => value !== priority)
    : [...filters.priorities, priority]

  return { ...filters, priorities }
}

// Flip a label filter on/off and return the next state.
export const toggleLabelFilter = (
  filters: BoardFiltersState,
  label: string
) => {
  const labels = filters.labels.includes(label)
    ? filters.labels.filter((value) => value !== label)
    : [...filters.labels, label]

  return { ...filters, labels }
}

// Control whether empty columns remain visible.
export const setShowEmptyColumns = (
  filters: BoardFiltersState,
  showEmpty: boolean
) => ({
  ...filters,
  showEmpty,
})

// Reset filters back to the defaults.
// Reset filters back to the defaults.
export const clearBoardFilters = (): BoardFiltersState =>
  getDefaultBoardFilters()

// Gather every unique label across a board for the filter menu.
export const collectBoardLabels = (board: Board) => {
  const labels = new Set<string>()
  for (const column of board.columns) {
    for (const task of column.tasks) {
      for (const label of task.labels) {
        labels.add(label)
      }
    }
  }
  // eslint-disable-next-line unicorn/no-array-sort
  return [...labels].sort((a, b) => a.localeCompare(b))
}

// Apply filters to columns while optionally preserving empty columns.
export const filterBoardColumns = (
  board: Board,
  filters: BoardFiltersState
) => {
  const filteredColumns: Board['columns'] = []

  for (const column of board.columns) {
    const tasks = []

    for (const task of column.tasks) {
      if (taskMatchesFilters(task, filters)) {
        tasks.push(task)
      }
    }

    if (filters.showEmpty || tasks.length > 0) {
      filteredColumns.push({
        ...column,
        tasks,
      })
    }
  }

  return filteredColumns
}
