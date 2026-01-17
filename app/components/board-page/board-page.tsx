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
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode, useMemo, useState } from 'react'

import { BoardFilters } from '@/components/board-filters/board-filters'
import { EmptyState } from '@/components/empty-state/empty-state'
import { FloatingActionButton } from '@/components/floating-action-button/floating-action-button'
import { GradientOrbs } from '@/components/gradient-orbs/gradient-orbs'
import { TaskCard } from '@/components/task-card/task-card'
import { Badge } from '@/components/ui/badge'
import {
  findTaskById,
  fromTaskId,
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

type SortableTaskCardProps = {
  task: Task
  boardId: string
}

// Wrap task cards with sortable wiring while keeping a drag handle.
const SortableTaskCard = ({ task, boardId }: SortableTaskCardProps) => {
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
      className={cn('group relative', isDragging && 'z-10 opacity-70')}
    >
      <TaskCard
        task={task}
        boardId={boardId}
        onEdit={() => console.log('Edit task:', task.id)}
        onDelete={() => console.log('Delete task:', task.id)}
        onDuplicate={() => console.log('Duplicate task:', task.id)}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
        dragHandleRef={setActivatorNodeRef}
      />
    </div>
  )
}

type ColumnSectionProps = {
  column: Board['columns'][number]
  boardId: string
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
  placeholder: PlaceholderState
) => {
  if (column.tasks.length === 0 && !placeholder.showPlaceholder) {
    return []
  }

  const items: ReactNode[] = []
  const placeholderNode = (
    <div
      key='drop-placeholder'
      className='h-[148px] rounded-2xl border-2 border-dashed border-primary/30 bg-primary/10'
    />
  )

  for (const [index, task] of column.tasks.entries()) {
    if (placeholder.showPlaceholder && index === placeholder.placeholderIndex) {
      items.push(placeholderNode)
    }
    items.push(<SortableTaskCard key={task.id} task={task} boardId={boardId} />)
  }

  if (
    placeholder.showPlaceholder &&
    placeholder.placeholderIndex === column.tasks.length
  ) {
    items.push(
      <div
        key='drop-placeholder-end'
        className='h-[148px] rounded-2xl border-2 border-dashed border-primary/30 bg-primary/10'
      />
    )
  }

  return items
}

// Column wrapper keeps DnD drop state and renders task stack.
const ColumnSection = ({ column, boardId }: ColumnSectionProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: toColumnId(column.id) })
  const { active, over } = useDndContext()

  const activeId = active ? String(active.id) : null
  const overId = over ? String(over.id) : null
  const placeholder = getPlaceholderState(column, activeId, overId)
  const renderItems = buildColumnItems(column, boardId, placeholder)

  return (
    <div className='flex flex-col gap-3.5'>
      <div className='flex items-center justify-between rounded-2xl border border-border/70 bg-card/90 px-4 py-3 shadow-[0_10px_24px_-20px_rgba(120,72,40,0.35)]'>
        <h2 className='text-sm font-semibold'>{column.name}</h2>
        <span className='text-xs font-medium text-muted-foreground'>
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
            'flex min-h-[120px] flex-col gap-2.5 rounded-2xl border border-transparent p-1',
            isOver && 'border-primary/30 bg-primary/5'
          )}
        >
          {renderItems.length > 0 ? (
            renderItems
          ) : (
            <EmptyState
              title='No tasks'
              description={`No tasks match your filters in ${column.name}`}
            />
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export const BoardPage = ({ board }: BoardPageProps) => {
  const [filters, setFilters] = useState<BoardFiltersState>(
    getDefaultBoardFilters()
  )
  const [columns, setColumns] = useState<Board['columns']>(board.columns)
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)

  const totalTasks = columns.reduce(
    (total, column) => total + column.tasks.length,
    0
  )

  const allLabels = useMemo(() => collectBoardLabels(board), [board])
  const filteredColumns = useMemo(
    () => filterBoardColumns({ ...board, columns }, filters),
    [board, columns, filters]
  )
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

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

    setColumns((current) => moveTask(current, activeId, overId))
    setActiveTaskId(null)
  }

  const handleDragCancel = () => {
    setActiveTaskId(null)
  }

  return (
    <section className='relative min-h-screen overflow-hidden bg-background px-6 pb-14 pt-12 sm:px-10 sm:pb-16 sm:pt-14'>
      <GradientOrbs variant='board' />
      <div className='app-container relative flex flex-col gap-12'>
        <header className='grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] animate-in fade-in slide-in-from-bottom-6 duration-700'>
          <div className='space-y-4'>
            <Link
              href='/'
              className='inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground'
            >
              <ArrowLeft className='size-4' />
              Back to boards
            </Link>
            <div className='space-y-3'>
              <div className='flex items-center gap-3'>
                <Badge
                  variant='outline'
                  className='border-primary/30 bg-primary/10 text-xs font-medium text-primary'
                >
                  Board
                </Badge>
                <BoardFilters
                  allLabels={allLabels}
                  filters={filters}
                  onFiltersChange={setFilters}
                />
              </div>
              <h1 className='text-3xl font-bold leading-[1.05] tracking-tight sm:text-4xl lg:text-5xl'>
                {board.name}
              </h1>
              <p className='max-w-2xl text-sm text-muted-foreground sm:text-base'>
                {board.description}
              </p>
            </div>
          </div>
          <div className='rounded-[28px] border border-border/70 bg-gradient-to-br from-card/95 via-card/80 to-card/60 p-6 shadow-[0_18px_60px_-40px_rgba(120,72,40,0.5)] backdrop-blur sm:p-8'>
            <div className='space-y-6'>
              <div className='flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground'>
                <span>Board pulse</span>
                <span className='rounded-full bg-primary/15 px-3 py-1 text-[10px] text-primary'>
                  Active
                </span>
              </div>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='rounded-2xl border border-border/70 bg-background/70 p-4'>
                  <p className='text-xs text-muted-foreground'>Columns</p>
                  <p className='text-2xl font-semibold'>
                    {board.columns.length}
                  </p>
                </div>
                <div className='rounded-2xl border border-border/70 bg-background/70 p-4'>
                  <p className='text-xs text-muted-foreground'>Tasks</p>
                  <p className='text-2xl font-semibold'>{totalTasks}</p>
                </div>
                <div className='rounded-2xl border border-border/70 bg-background/70 p-4'>
                  <p className='text-xs text-muted-foreground'>Focus</p>
                  <p className='text-2xl font-semibold'>High</p>
                </div>
                <div className='rounded-2xl border border-border/70 bg-background/70 p-4'>
                  <p className='text-xs text-muted-foreground'>Cadence</p>
                  <p className='text-2xl font-semibold'>Daily</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className='grid gap-6 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700'>
            {filteredColumns.map((column) => (
              <ColumnSection
                key={column.id}
                column={column}
                boardId={board.id}
              />
            ))}
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

      <FloatingActionButton />
    </section>
  )
}
