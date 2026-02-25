'use client'

import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useDndContext,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  ArrowLeft,
  Columns3,
  Eye,
  ListTodo,
  MoreVertical,
  Plus,
  Trash2,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react'
import { toast } from 'sonner'

import { BoardCreateModal } from '@/components/board-create-modal/board-create-modal'
import { BoardEditModal } from '@/components/board-edit-modal/board-edit-modal'
import { BoardFilters } from '@/components/board-filters/board-filters'
import { EmptyState } from '@/components/empty-state/empty-state'
import { TaskCard } from '@/components/task-card/task-card'
import { TaskCreateModal } from '@/components/task-create-modal/task-create-modal'
import { TaskDetailModal } from '@/components/task-detail-modal/task-detail-modal'
import { TaskEditModal } from '@/components/task-edit-modal/task-edit-modal'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { deleteBoardAction } from '@/lib/actions/board-actions'
import {
  createTaskAction,
  deleteTaskAction,
  moveTaskAction,
} from '@/lib/actions/task-actions'
import {
  findTaskById,
  fromTaskId,
  getDropTarget,
  isTaskDragId,
  moveTask,
  toColumnId,
  toTaskId,
} from '@/lib/board/dnd'
import {
  type BoardFiltersState,
  collectBoardLabels,
  filterBoardColumns,
  getDefaultBoardFilters,
} from '@/lib/board/filters'
import type { Board, Task } from '@/lib/data/task-board'
import { cn } from '@/lib/utils'

type BoardPageProps = {
  board: Board
}

type PendingConfirm = {
  title: string
  description: string
  onConfirm: () => void
}

type SortableTaskCardProps = {
  task: Task
  boardId: string
  onOpen?: () => void
  onEditTask?: (task: Task) => void
  onDeleteTask?: (task: Task) => void
  onDuplicateTask?: (task: Task) => void
}

// Wrap task cards with sortable wiring while keeping a drag handle.
const SortableTaskCard = ({
  task,
  boardId,
  onOpen,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
}: SortableTaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: toTaskId(task.id),
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative transition-[opacity,transform] duration-150',
        isDragging && 'z-10 scale-[0.99] opacity-70'
      )}
    >
      <TaskCard
        task={task}
        boardId={boardId}
        onEdit={onEditTask ? () => onEditTask(task) : undefined}
        onDelete={onDeleteTask ? () => onDeleteTask(task) : undefined}
        onDuplicate={onDuplicateTask ? () => onDuplicateTask(task) : undefined}
        onOpen={onOpen}
        dragProps={{
          ...attributes,
          ...listeners,
        }}
        dragRef={setActivatorNodeRef}
      />
    </div>
  )
}

type ColumnSectionProps = {
  column: Board['columns'][number]
  boardId: string
  onOpenTask?: (task: Task) => void
  onEditTask?: (task: Task) => void
  onDeleteTask?: (task: Task) => void
  onDuplicateTask?: (task: Task) => void
}

type PlaceholderState = {
  showPlaceholder: boolean
  placeholderIndex: number
}

// Determine if a column should show a drop placeholder and where it should sit.
const getPlaceholderState = (
  column: Board['columns'][number],
  activeId: string | null,
  overId: string | null
): PlaceholderState => {
  const activeTaskId =
    activeId && isTaskDragId(activeId) ? fromTaskId(activeId) : null
  const overTaskId = overId && isTaskDragId(overId) ? fromTaskId(overId) : null
  const isOverColumn = overId === toColumnId(column.id)
  const isOverTaskInColumn = overTaskId
    ? column.tasks.some((task) => task.id === overTaskId)
    : false
  const showPlaceholder =
    Boolean(activeTaskId) && (isOverColumn || isOverTaskInColumn)
  const placeholderIndex = overTaskId
    ? column.tasks.findIndex((task) => task.id === overTaskId)
    : column.tasks.length

  return { showPlaceholder, placeholderIndex }
}

// Build task + placeholder nodes in the correct order for the column.
const buildColumnItems = (
  column: Board['columns'][number],
  boardId: string,
  placeholder: PlaceholderState,
  onOpenTask?: (task: Task) => void,
  onEditTask?: (task: Task) => void,
  onDeleteTask?: (task: Task) => void,
  onDuplicateTask?: (task: Task) => void
) => {
  if (column.tasks.length === 0 && !placeholder.showPlaceholder) {
    return []
  }

  const items: ReactNode[] = []
  const placeholderNode = (
    <div
      key='drop-placeholder'
      aria-hidden='true'
      className='h-[188px] rounded-xl border border-dashed border-foreground/25 bg-muted/40 sm:h-[198px]'
    />
  )

  for (const [index, task] of column.tasks.entries()) {
    if (placeholder.showPlaceholder && index === placeholder.placeholderIndex) {
      items.push(placeholderNode)
    }
    items.push(
      <SortableTaskCard
        key={task.id}
        task={task}
        boardId={boardId}
        onOpen={onOpenTask ? () => onOpenTask(task) : undefined}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onDuplicateTask={onDuplicateTask}
      />
    )
  }

  if (
    placeholder.showPlaceholder &&
    placeholder.placeholderIndex === column.tasks.length
  ) {
    items.push(
      <div
        key='drop-placeholder-end'
        aria-hidden='true'
        className='h-[188px] rounded-xl border border-dashed border-foreground/25 bg-muted/40 sm:h-[198px]'
      />
    )
  }

  return items
}

const removeTaskFromColumns = (
  boardColumns: Board['columns'],
  taskId: string
): Board['columns'] =>
  boardColumns.map((column) => ({
    ...column,
    tasks: column.tasks.filter((task) => task.id !== taskId),
  }))

// Column wrapper keeps DnD drop state and renders task stack.
const ColumnSection = ({
  column,
  boardId,
  onOpenTask,
  onEditTask,
  onDeleteTask,
  onDuplicateTask,
}: ColumnSectionProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: toColumnId(column.id) })
  const { active, over } = useDndContext()

  const activeId = active ? String(active.id) : null
  const overId = over ? String(over.id) : null
  const isDraggingTask = activeId ? isTaskDragId(activeId) : false
  const placeholder = getPlaceholderState(column, activeId, overId)
  const renderItems = buildColumnItems(
    column,
    boardId,
    placeholder,
    onOpenTask,
    onEditTask,
    onDeleteTask,
    onDuplicateTask
  )

  return (
    <div
      role='group'
      aria-label={column.name}
      className='flex flex-col gap-2.5 sm:gap-3'
    >
      <div className='flex items-center justify-between rounded-xl border border-border/80 bg-card px-3.5 py-2 sm:px-4 sm:py-2.5'>
        <h2 className='text-base font-semibold tracking-tight sm:text-[1.02rem]'>
          {column.name}
        </h2>
        <span className='font-meta text-[11px] font-medium tabular-nums tracking-wide text-muted-foreground'>
          {column.tasks.length}
        </span>
      </div>

      <SortableContext
        items={column.tasks.map((task) => toTaskId(task.id))}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={cn(
            'flex min-h-[188px] flex-col gap-3 rounded-xl border border-transparent p-0.5 transition-colors duration-150 sm:min-h-[198px] sm:p-1',
            isDraggingTask && 'bg-muted/20',
            isOver &&
              'border-foreground/35 bg-muted/45 ring-1 ring-foreground/15'
          )}
        >
          {renderItems.length > 0 ? (
            renderItems
          ) : (
            <EmptyState
              title='No tasks'
              description={`No tasks match your filters in ${column.name}`}
              className='h-[188px] p-6 sm:h-[198px]'
            />
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export const BoardPage = ({ board }: BoardPageProps) => {
  const router = useRouter()
  const [filters, setFilters] = useState<BoardFiltersState>(
    getDefaultBoardFilters()
  )
  const [columns, setColumns] = useState<Board['columns']>(board.columns)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [isBoardCreateOpen, setIsBoardCreateOpen] = useState(false)
  const [isBoardEditOpen, setIsBoardEditOpen] = useState(false)
  const [isTaskCreateOpen, setIsTaskCreateOpen] = useState(false)
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const [pendingConfirm, setPendingConfirm] = useState<PendingConfirm | null>(
    null
  )
  const [, startMoveTransition] = useTransition()
  const [, startTaskMutationTransition] = useTransition()
  const [, startBoardMutationTransition] = useTransition()

  const totalTasks = columns.reduce(
    (total, column) => total + column.tasks.length,
    0
  )

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) return null
    return findTaskById(columns, selectedTaskId) ?? null
  }, [columns, selectedTaskId])

  const editingTask = useMemo(() => {
    if (!editingTaskId) return null
    return findTaskById(columns, editingTaskId) ?? null
  }, [columns, editingTaskId])

  const selectedTaskColumnName = useMemo(() => {
    if (!selectedTaskId) return undefined
    for (const column of columns) {
      if (column.tasks.some((task) => task.id === selectedTaskId)) {
        return column.name
      }
    }
    return undefined
  }, [columns, selectedTaskId])

  // Keep DnD state in sync after server refreshes (e.g., task created via modal).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- local DnD state must reset when board data changes.
    setColumns(board.columns)
  }, [board.columns])

  const allLabels = useMemo(() => collectBoardLabels(board), [board])
  const filteredColumns = useMemo(
    () => filterBoardColumns({ ...board, columns }, filters),
    [board, columns, filters]
  )
  const visibleTaskCount = useMemo(
    () =>
      filteredColumns.reduce(
        (currentTotal, column) => currentTotal + column.tasks.length,
        0
      ),
    [filteredColumns]
  )
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleTaskOpen = (task: Task) => {
    setSelectedTaskId(task.id)
  }

  const getTaskColumn = (taskId: string) =>
    columns.find((column) => column.tasks.some((task) => task.id === taskId))

  const handleTaskEdit = (task: Task) => {
    setEditingTaskId(task.id)
  }

  const runTaskDelete = async (task: Task) => {
    const result = await deleteTaskAction({
      boardId: board.id,
      taskId: task.id,
    })

    if (!result.ok) {
      toast.error(result.errors.form ?? 'Unable to delete task.')
      return
    }

    setColumns((current) => removeTaskFromColumns(current, task.id))
    setSelectedTaskId((current) => (current === task.id ? null : current))
    setEditingTaskId((current) => (current === task.id ? null : current))
    toast.success('Task deleted.')
    router.refresh()
  }

  const handleTaskDelete = (task: Task) => {
    setPendingConfirm({
      title: 'Delete task',
      description: `Delete "${task.title}"? This action cannot be undone.`,
      onConfirm: () => {
        startTaskMutationTransition(() => {
          void runTaskDelete(task)
        })
      },
    })
  }

  const runTaskDuplicate = async (task: Task, sourceColumnId: string) => {
    const result = await createTaskAction({
      boardId: board.id,
      columnId: sourceColumnId,
      title: `${task.title} (Copy)`,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
      labels: task.labels,
      assignees: task.assignees.map((assignee) => ({
        name: assignee.name,
        initials: assignee.initials,
      })),
    })

    if (!result.ok) {
      toast.error(result.errors.form ?? 'Unable to duplicate task.')
      return
    }

    toast.success('Task duplicated.')
    router.refresh()
  }

  const handleTaskDuplicate = (task: Task) => {
    const sourceColumn = getTaskColumn(task.id)

    if (!sourceColumn) {
      toast.error('Unable to find source column for duplication.')
      return
    }

    startTaskMutationTransition(() => {
      void runTaskDuplicate(task, sourceColumn.id)
    })
  }

  const runBoardDelete = async () => {
    const result = await deleteBoardAction({ boardId: board.id })

    if (!result.ok) {
      toast.error(result.errors.form ?? 'Unable to delete board.')
      return
    }

    router.push('/')
    router.refresh()
  }

  const handleBoardDelete = () => {
    setPendingConfirm({
      title: 'Delete board',
      description: `Delete board "${board.name}" and all of its tasks? This cannot be undone.`,
      onConfirm: () => {
        startBoardMutationTransition(() => {
          void runBoardDelete()
        })
      },
    })
  }

  const boardStats = [
    { label: 'Columns', value: board.columns.length, icon: Columns3 },
    { label: 'Total tasks', value: totalTasks, icon: ListTodo },
    { label: 'Visible now', value: visibleTaskCount, icon: Eye },
  ]

  const handleDragStart = (event: DragStartEvent) => {
    const activeId = String(event.active.id)
    if (isTaskDragId(activeId)) {
      setActiveTaskId(fromTaskId(activeId))
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) {
      setActiveTaskId(null)
      return
    }

    const activeId = String(active.id)
    const overId = String(over.id)

    if (!isTaskDragId(activeId)) {
      setActiveTaskId(null)
      return
    }

    const target = getDropTarget(columns, overId)
    const targetColumn = target.columnId
      ? columns.find((column) => column.id === target.columnId)
      : null

    if (!targetColumn) {
      setActiveTaskId(null)
      return
    }

    const targetIndex = target.taskId
      ? targetColumn.tasks.findIndex((task) => task.id === target.taskId)
      : targetColumn.tasks.length

    const prevColumns = columns
    setColumns((current) => moveTask(current, activeId, overId))

    startMoveTransition(async () => {
      const result = await moveTaskAction({
        boardId: board.id,
        taskId: fromTaskId(activeId),
        toColumnId: targetColumn.id,
        toIndex: targetIndex === -1 ? targetColumn.tasks.length : targetIndex,
      })

      if (!result.ok) {
        setColumns(prevColumns)
        toast.error(result.message)
      }
    })

    setActiveTaskId(null)
  }

  const handleDragCancel = () => {
    setActiveTaskId(null)
  }

  return (
    <section className='min-h-screen bg-background px-4 pb-10 pt-8 sm:px-8 sm:pb-14 sm:pt-12'>
      <div className='app-container flex flex-col gap-6 sm:gap-7'>
        <header className='space-y-4 border-b border-border/70 pb-6 sm:space-y-5 sm:pb-7'>
          <Link
            href='/'
            className='inline-flex w-fit items-center gap-2 rounded-md text-sm text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60'
          >
            <ArrowLeft className='size-4' />
            Back to boards
          </Link>
          <div className='space-y-2.5 sm:space-y-3'>
            <h1 className='text-3xl font-semibold leading-[1.05] tracking-tight sm:text-[3.35rem]'>
              {board.name} board
            </h1>
            <p className='max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base'>
              {board.description}
            </p>
          </div>
          <div className='flex items-center gap-2.5'>
            <Button
              size='sm'
              className='h-8 gap-2 px-3 sm:h-9 sm:px-3.5'
              onClick={() => setIsTaskCreateOpen(true)}
            >
              <Plus className='size-4' />
              New task
            </Button>
            <Button
              size='sm'
              variant='outline'
              className='h-8 gap-2 px-3 sm:h-9 sm:px-3.5'
              onClick={() => setIsBoardCreateOpen(true)}
            >
              <Plus className='size-4' />
              New board
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  aria-label='Board options'
                  className='size-8 rounded-md border border-border/80 text-muted-foreground hover:text-foreground sm:size-9'
                >
                  <MoreVertical className='size-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='start'
                className='w-48 rounded-xl border border-border bg-popover p-1.5 shadow-md'
              >
                <DropdownMenuItem onClick={() => setIsBoardEditOpen(true)}>
                  Edit board
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='text-destructive focus:text-destructive'
                  onClick={handleBoardDelete}
                >
                  <Trash2 className='mr-2 size-3.5' />
                  Delete board
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='grid gap-2 sm:grid-cols-3 sm:gap-3'>
            {boardStats.map((stat) => (
              <Card
                key={stat.label}
                className='rounded-xl border border-primary/20 bg-primary/5 py-0 shadow-none'
              >
                <CardContent className='flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3'>
                  <div className='flex items-center gap-2'>
                    <span className='inline-flex size-6 items-center justify-center rounded-md bg-primary/10 text-primary'>
                      <stat.icon className='size-3.5' />
                    </span>
                    <span className='font-meta text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
                      {stat.label}
                    </span>
                  </div>
                  <span className='text-lg font-semibold tabular-nums text-primary'>
                    {stat.value}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        </header>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className='space-y-3 sm:space-y-4'>
            <BoardFilters
              allLabels={allLabels}
              filters={filters}
              onFiltersChange={setFilters}
            />
            <div className='grid gap-3 sm:gap-4 lg:grid-cols-3'>
              {filteredColumns.map((column) => (
                <ColumnSection
                  key={column.id}
                  column={column}
                  boardId={board.id}
                  onOpenTask={handleTaskOpen}
                  onEditTask={handleTaskEdit}
                  onDeleteTask={handleTaskDelete}
                  onDuplicateTask={handleTaskDuplicate}
                />
              ))}
            </div>
          </div>
          <DragOverlay>
            {activeTaskId ? (
              <div className='pointer-events-none'>
                <TaskCard
                  task={findTaskById(columns, activeTaskId)!}
                  boardId={board.id}
                  interactive={false}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      <BoardCreateModal
        open={isBoardCreateOpen}
        onOpenChange={setIsBoardCreateOpen}
        onSuccess={(boardId) => {
          toast.success('Board created.')
          router.push(`/boards/${boardId}`)
          router.refresh()
        }}
      />
      <BoardEditModal
        boardId={board.id}
        defaultName={board.name}
        defaultDescription={board.description}
        open={isBoardEditOpen}
        onOpenChange={setIsBoardEditOpen}
        onSuccess={() => {
          toast.success('Board updated.')
          router.refresh()
        }}
      />
      <TaskCreateModal
        boardId={board.id}
        columns={columns.map((column) => ({
          id: column.id,
          name: column.name,
        }))}
        open={isTaskCreateOpen}
        onOpenChange={setIsTaskCreateOpen}
        onSuccess={() => {
          toast.success('Task created.')
          router.refresh()
        }}
      />
      <TaskEditModal
        boardId={board.id}
        task={editingTask}
        open={Boolean(editingTaskId)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setEditingTaskId(null)
          }
        }}
        onSuccess={() => {
          toast.success('Task updated.')
          router.refresh()
        }}
      />
      <TaskDetailModal
        task={selectedTask}
        columnName={selectedTaskColumnName}
        boardName={board.name}
        open={Boolean(selectedTaskId)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setSelectedTaskId(null)
          }
        }}
      />
      <Dialog
        open={Boolean(pendingConfirm)}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) setPendingConfirm(null)
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>{pendingConfirm?.title}</DialogTitle>
            <DialogDescription>{pendingConfirm?.description}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setPendingConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant='destructive'
              onClick={() => {
                pendingConfirm?.onConfirm()
                setPendingConfirm(null)
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
