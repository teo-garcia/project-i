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
    <Card className='border-border/60 shadow-lg'>
      <CardHeader className='space-y-3'>
        <Badge variant='outline' className='w-fit text-xs uppercase tracking-wide'>
          {boardName} · {columnName}
        </Badge>
        <CardTitle className='text-2xl'>{task.title}</CardTitle>
        <p className='text-sm text-muted-foreground'>{task.description}</p>
      </CardHeader>
      <CardContent className='space-y-6'>
        <div className='flex flex-wrap gap-2'>
          {task.labels.map((label) => (
            <Badge key={label} variant='secondary'>
              {label}
            </Badge>
          ))}
        </div>
        <div className='grid gap-4 sm:grid-cols-2'>
          <div className='flex items-center gap-3 rounded-lg border border-dashed px-3 py-2'>
            <CalendarDays className='size-4 text-muted-foreground' />
            <div>
              <p className='text-xs uppercase text-muted-foreground'>Due</p>
              <p className='font-medium'>{formatDate(task.dueDate)}</p>
            </div>
          </div>
          <div className='flex items-center gap-3 rounded-lg border border-dashed px-3 py-2'>
            <ClipboardList className='size-4 text-muted-foreground' />
            <div>
              <p className='text-xs uppercase text-muted-foreground'>Assignees</p>
              <div className='mt-2 flex items-center gap-2'>
                {task.assignees.map((assignee) => (
                  <div key={assignee.id} className='flex items-center gap-2'>
                    <Avatar className='size-8'>
                      <AvatarFallback>{assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span className='text-sm font-medium'>{assignee.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
