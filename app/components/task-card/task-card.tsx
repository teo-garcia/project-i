'use client'

import { CircleDot, Copy,MoreVertical, Pencil, Trash2 } from 'lucide-react'
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { Task } from '@/lib/data/task-board'
import { getPriorityVariant, isTaskDueSoon,isTaskOverdue } from '@/lib/data/task-board'

type TaskCardProps = {
  task: Task
  boardId: string
  onEdit?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
}

const handleCardAction = (event: React.MouseEvent, action?: () => void) => {
  event.preventDefault()
  event.stopPropagation()
  action?.()
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

export const TaskCard = ({ task, boardId, onEdit, onDelete, onDuplicate }: TaskCardProps) => {
  const overdue = isTaskOverdue(task.dueDate)
  const dueSoon = isTaskDueSoon(task.dueDate)

  return (
    <div className='group relative'>
      <Link href={`/boards/${boardId}/task/${task.id}`} className='block'>
        <Card className={`relative overflow-hidden border bg-card/90 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_16px_34px_-24px_rgba(120,72,40,0.45)] ${
          overdue ? 'border-destructive/50' : 'border-border/60'
        }`}>
          <div className='absolute -right-10 top-3 h-20 w-20 rounded-full bg-blue-200/40 blur-2xl transition-opacity group-hover:opacity-80' />

          {/* Actions Menu - appears on hover */}
          <div className='absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='size-7 rounded-md bg-background/90 backdrop-blur-sm hover:bg-background'
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreVertical className='size-3.5' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-40'>
                <DropdownMenuItem onClick={(e) => handleCardAction(e, onEdit)}>
                  <Pencil className='mr-2 size-3.5' />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => handleCardAction(e, onDuplicate)}>
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

          <CardContent className='p-4'>
            <div className='flex items-start justify-between gap-3'>
              <div className='flex-1 space-y-1.5'>
                <p className='text-sm font-semibold leading-tight'>
                  {task.title}
                </p>
                <p className='text-xs text-muted-foreground line-clamp-2'>
                  {task.description}
                </p>
              </div>
              <CircleDot className='mt-0.5 size-3.5 shrink-0 text-muted-foreground/40' />
            </div>

            {/* Labels and Priority */}
            <div className='mt-3 flex flex-wrap items-center gap-1.5'>
              {/* Priority Badge */}
              <Badge variant={getPriorityVariant(task.priority)} className='text-xs px-2 py-0 capitalize'>
                {task.priority}
              </Badge>

              {/* Status Badges */}
              {overdue && (
                <Badge variant='destructive' className='text-xs px-2 py-0'>
                  Overdue
                </Badge>
              )}
              {!overdue && dueSoon && (
                <Badge className='bg-accent text-accent-foreground text-xs px-2 py-0'>
                  Due Soon
                </Badge>
              )}

              {/* Labels */}
              {task.labels.slice(0, 1).map((label) => (
                <Badge key={label} variant='outline' className='text-xs px-2 py-0'>
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

          {/* Card Footer with assignees and due date */}
          <CardFooter className='border-t border-border/50 bg-muted/30 p-3'>
            <div className='flex w-full items-center justify-between'>
              {/* Assignees */}
              <div className='flex -space-x-2'>
                {task.assignees.slice(0, 3).map((assignee) => (
                  <Tooltip key={assignee.id}>
                    <TooltipTrigger asChild>
                      <Avatar className='size-6 border-2 border-card cursor-pointer'>
                        <AvatarFallback className='bg-primary text-primary-foreground text-[10px] font-semibold'>
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
                      <div className='flex size-6 items-center justify-center rounded-full border-2 border-card bg-muted text-[10px] font-semibold text-muted-foreground cursor-pointer'>
                        +{task.assignees.length - 3}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{task.assignees.slice(3).map(a => a.name).join(', ')}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {/* Due Date */}
              <span className='text-xs text-muted-foreground'>
                {formatDate(task.dueDate)}
              </span>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </div>
  )
}
