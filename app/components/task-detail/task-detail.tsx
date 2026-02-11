'use client'

import {
  CalendarDays,
  ClipboardList,
  Flag,
  Layers3,
  UserRound,
} from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { getPriorityVariant, type Task } from '@/lib/data/task-board'
import { formatLongDate } from '@/lib/formatting/date'

type TaskDetailProps = {
  task: Task
  columnName: string
  boardName: string
}

export const TaskDetail = ({
  task,
  columnName,
  boardName,
}: TaskDetailProps) => {
  const description =
    task.description.trim().length > 0
      ? task.description
      : 'No description yet.'

  const propertyRows = [
    {
      key: 'due',
      icon: CalendarDays,
      label: 'Due date',
      value: formatLongDate(task.dueDate),
    },
    {
      key: 'priority',
      icon: Flag,
      label: 'Priority',
      value: task.priority,
      className: 'capitalize',
    },
    {
      key: 'column',
      icon: ClipboardList,
      label: 'Column',
      value: columnName,
    },
    {
      key: 'labels',
      icon: Layers3,
      label: 'Labels',
      value: task.labels.length > 0 ? String(task.labels.length) : 'None',
    },
    {
      key: 'assignees',
      icon: UserRound,
      label: 'Assignees',
      value:
        task.assignees.length > 0 ? `${task.assignees.length} assigned` : 'Unassigned',
    },
  ]

  return (
    <div className='space-y-4 px-1 py-0.5 sm:space-y-5'>
      <section className='space-y-3'>
        <div className='flex flex-wrap items-center gap-1.5'>
          <Badge variant='outline' className='font-meta text-[10px] uppercase'>
            {boardName}
          </Badge>
          <Badge variant='outline' className='font-meta text-[10px] uppercase'>
            {columnName}
          </Badge>
          <Badge
            variant={getPriorityVariant(task.priority)}
            className='text-[11px] capitalize'
          >
            {task.priority}
          </Badge>
        </div>
        <h2 className='text-balance break-words text-[1.5rem] font-semibold leading-tight tracking-tight sm:text-[1.95rem]'>
          {task.title}
        </h2>
        <p className='max-w-4xl text-base leading-relaxed text-muted-foreground'>
          {description}
        </p>
        {task.labels.length > 0 ? (
          <div className='flex flex-wrap gap-1.5'>
            {task.labels.map((label) => (
              <Badge key={label} variant='outline' className='text-xs'>
                {label}
              </Badge>
            ))}
          </div>
        ) : null}
      </section>

      <section className='border-t border-border/70 pt-4'>
        <p className='font-meta text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
          Properties
        </p>
        <ul className='mt-2 divide-y divide-border/70'>
          {propertyRows.map((row) => (
            <li key={row.key} className='flex items-center justify-between gap-3 py-2'>
              <span className='inline-flex items-center gap-2 text-sm text-muted-foreground'>
                <row.icon className='size-4 text-primary' />
                {row.label}
              </span>
              <span className={`text-sm font-semibold ${row.className ?? ''}`}>
                {row.value}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {task.assignees.length > 0 ? (
        <section className='border-t border-border/70 pt-4'>
          <p className='font-meta text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
            People
          </p>
          <div className='mt-2 space-y-1.5'>
            {task.assignees.map((assignee) => (
              <div
                key={assignee.id}
                className='flex items-center gap-2.5 rounded-md border border-border/80 bg-muted/20 px-2.5 py-2'
              >
                <Avatar className='size-7'>
                  <AvatarFallback className='bg-background text-xs font-semibold text-foreground'>
                    {assignee.initials}
                  </AvatarFallback>
                </Avatar>
                <span className='text-sm font-medium'>{assignee.name}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
