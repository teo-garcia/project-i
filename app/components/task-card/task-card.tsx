'use client'

import {
  CalendarClock,
  Copy,
  GripVertical,
  MoreVertical,
  Pencil,
  Trash2,
  UserRound,
} from 'lucide-react'
import Link from 'next/link'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Task } from '@/lib/data/task-board'
import {
  getPriorityVariant,
  isTaskDueSoon,
  isTaskOverdue,
} from '@/lib/data/task-board'
import { formatShortDate } from '@/lib/formatting/date'

type TaskCardProps = {
  task: Task
  boardId: string
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
  onOpen?: () => void
  dragProps?: React.HTMLAttributes<HTMLDivElement>
  dragRef?: React.Ref<HTMLDivElement>
  interactive?: boolean
}

const handleCardAction = (event: React.MouseEvent, action?: () => void) => {
  event.preventDefault()
  event.stopPropagation()
  action?.()
}

export const TaskCard = ({
  task,
  boardId,
  onEdit,
  onDelete,
  onDuplicate,
  onOpen,
  dragProps,
  dragRef,
  interactive = true,
}: TaskCardProps) => {
  const overdue = isTaskOverdue(task.dueDate)
  const dueSoon = isTaskDueSoon(task.dueDate)
  const description =
    task.description.trim().length > 0 ? task.description : 'No description yet.'

  const card = (
    <Card
      className='relative flex h-[188px] flex-col gap-0 overflow-hidden rounded-xl border border-border/80 bg-card py-0 shadow-[0_1px_0_rgba(15,23,42,0.03)] transition-[border-color,box-shadow] duration-200 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-primary/20 hover:border-primary/35 hover:shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:h-[198px]'
    >
      <CardContent className='flex flex-1 flex-col p-2.5 sm:p-3'>
        <div className='mb-2 flex items-center justify-between gap-2'>
          <div className='inline-flex items-center gap-1.5'>
            <Badge
              variant='outline'
              className='font-meta rounded-md px-2 py-0 text-[10px] uppercase tracking-[0.12em] text-muted-foreground'
            >
              Task
            </Badge>
            <span
              aria-hidden
              className='inline-flex size-5 items-center justify-center rounded-md text-muted-foreground/70'
            >
              <GripVertical className='size-3.5 opacity-70' />
            </span>
          </div>
          <div className='opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-6 rounded-md text-muted-foreground/85 hover:text-foreground sm:size-7'
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <MoreVertical className='size-3.5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                sideOffset={8}
                collisionPadding={12}
                className='w-40 rounded-xl border border-border bg-popover p-1.5 shadow-md'
              >
                <DropdownMenuItem onClick={(e) => handleCardAction(e, onEdit)}>
                  <Pencil className='mr-2 size-3.5' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => handleCardAction(e, onDuplicate)}
                >
                  <Copy className='mr-2 size-3.5' />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className='text-destructive focus:text-destructive'
                  onClick={(e) => handleCardAction(e, onDelete)}
                >
                  <Trash2 className='mr-2 size-3.5' />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className='space-y-1.5'>
          <p className='pr-6 text-base font-semibold leading-snug tracking-tight sm:text-lg'>
            {task.title}
          </p>
          <p className='min-h-[2.5rem] line-clamp-2 text-[13px] leading-relaxed text-muted-foreground sm:text-sm'>
            {description}
          </p>
        </div>

        <div className='mt-1.5 flex flex-wrap items-center gap-1.5 sm:mt-2'>
          <Badge
            variant={getPriorityVariant(task.priority)}
            className='px-2 py-0 text-xs capitalize'
          >
            {task.priority}
          </Badge>

          {overdue && (
            <Badge variant='destructive' className='px-2 py-0 text-xs'>
              Overdue
            </Badge>
          )}
          {!overdue && dueSoon && (
            <Badge variant='secondary' className='px-2 py-0 text-xs'>
              Due Soon
            </Badge>
          )}

          {task.labels.slice(0, 1).map((label) => (
            <Badge key={label} variant='outline' className='px-2 py-0 text-xs'>
              {label}
            </Badge>
          ))}
          {task.labels.length > 1 && (
            <span className='text-xs text-muted-foreground'>
              +{task.labels.length - 1}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className='mt-auto border-t border-border/70 bg-muted/10 p-1.5 sm:p-2'>
        <div className='flex w-full items-center justify-between gap-2'>
          {task.assignees.length > 0 ? (
            <div className='flex -space-x-2'>
              {task.assignees.slice(0, 3).map((assignee) => (
                <Tooltip key={assignee.id}>
                  <TooltipTrigger asChild>
                    <Avatar className='size-5 border-2 border-card sm:size-6'>
                      <AvatarFallback className='bg-muted text-[10px] font-semibold text-foreground'>
                        {assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{assignee.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {task.assignees.length > 3 && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className='flex size-5 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-semibold text-muted-foreground sm:size-6'>
                      +{task.assignees.length - 3}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {task.assignees
                        .slice(3)
                        .map((a) => a.name)
                        .join(', ')}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          ) : (
            <span className='inline-flex items-center gap-1 rounded-md border border-border/90 bg-background px-2 py-0.5 text-[11px] text-muted-foreground'>
              <UserRound className='size-3' />
              Unassigned
            </span>
          )}

          <div className='inline-flex items-center gap-1 text-muted-foreground'>
            <CalendarClock className='size-3.5' />
            <span className='font-meta text-[11px] tabular-nums uppercase tracking-[0.08em]'>
              {formatShortDate(task.dueDate)}
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )

  let content: React.ReactNode

  if (!interactive) {
    content = card
  } else if (onOpen) {
    content = (
      <button
        type='button'
        onClick={onOpen}
        className='block w-full rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60'
      >
        {card}
      </button>
    )
  } else {
    content = (
      <Link
        href={`/boards/${boardId}/task/${task.id}`}
        className='block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60'
      >
        {card}
      </Link>
    )
  }

  return (
    <div
      ref={dragRef}
      {...dragProps}
      className='group relative cursor-grab active:cursor-grabbing'
    >
      {content}
    </div>
  )
}
