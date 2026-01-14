'use client'

import { CalendarDays, ClipboardList } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Task } from '@/lib/data/task-board'

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

type TaskDetailProps = {
  task: Task
  columnName: string
  boardName: string
}

export const TaskDetail = ({ task, columnName, boardName }: TaskDetailProps) => {
  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-3'>
        <Badge variant='outline' className='text-xs font-medium'>
          {boardName} · {columnName}
        </Badge>
        <h2 className='text-2xl font-bold tracking-tight'>{task.title}</h2>
        <p className='text-muted-foreground'>{task.description}</p>
      </div>

      {/* Labels */}
      {task.labels.length > 0 && (
        <div className='space-y-2'>
          <h3 className='text-sm font-semibold'>Labels</h3>
          <div className='flex flex-wrap gap-2'>
            {task.labels.map((label) => (
              <Badge key={label} variant='secondary' className='text-xs'>
                {label}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Metadata */}
      <div className='grid gap-4 sm:grid-cols-2'>
        {/* Due date */}
        <div className='rounded-lg border border-border bg-muted/30 p-4'>
          <div className='flex items-center gap-3'>
            <div className='rounded-md bg-primary/10 p-2'>
              <CalendarDays className='size-4 text-primary' />
            </div>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>Due Date</p>
              <p className='text-sm font-semibold'>{formatDate(task.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Assignees count */}
        <div className='rounded-lg border border-border bg-muted/30 p-4'>
          <div className='flex items-center gap-3'>
            <div className='rounded-md bg-primary/10 p-2'>
              <ClipboardList className='size-4 text-primary' />
            </div>
            <div>
              <p className='text-xs font-medium text-muted-foreground'>Assignees</p>
              <p className='text-sm font-semibold'>{task.assignees.length} assigned</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignees list */}
      {task.assignees.length > 0 && (
        <div className='space-y-3'>
          <h3 className='text-sm font-semibold'>Team Members</h3>
          <div className='space-y-2'>
            {task.assignees.map((assignee) => (
              <div key={assignee.id} className='flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3'>
                <Avatar className='size-9'>
                  <AvatarFallback className='bg-primary text-primary-foreground text-xs font-semibold'>
                    {assignee.initials}
                  </AvatarFallback>
                </Avatar>
                <span className='text-sm font-medium'>{assignee.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
