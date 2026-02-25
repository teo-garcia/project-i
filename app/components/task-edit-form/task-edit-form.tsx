'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { updateTaskAction } from '@/lib/actions/task-actions'
import type { Task, TaskPriority } from '@/lib/data/task-board'

type TaskEditFormProps = {
  boardId: string
  task: Task
  onCancel?: () => void
  onSuccess?: () => void
}

const priorityOptions: TaskPriority[] = ['urgent', 'high', 'medium', 'low']

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return ''
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  // eslint-disable-next-line unicorn/prefer-at
  const lastPart = parts[parts.length - 1] ?? ''
  return `${parts[0][0]}${lastPart[0] ?? ''}`.toUpperCase()
}

const parseCommaList = (input: string) =>
  input
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

const parseAssignees = (input: string) =>
  parseCommaList(input)
    .map((entry) => {
      const [namePart, initialsPart] = entry
        .split(':')
        .map((part) => part.trim())
      if (!namePart) return null
      return {
        name: namePart,
        initials: initialsPart || getInitials(namePart),
      }
    })
    .filter(Boolean) as { name: string; initials: string }[]

export const TaskEditForm = ({
  boardId,
  task,
  onCancel,
  onSuccess,
}: TaskEditFormProps) => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const title = String(formData.get('title') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const dueDate = String(formData.get('dueDate') ?? '').trim()
    const priority = String(
      formData.get('priority') ?? 'medium'
    ) as TaskPriority
    const labels = parseCommaList(String(formData.get('labels') ?? ''))
    const assignees = parseAssignees(String(formData.get('assignees') ?? ''))

    startTransition(() => {
      void (async () => {
        const result = await updateTaskAction({
          boardId,
          taskId: task.id,
          title,
          description,
          dueDate: dueDate || undefined,
          priority,
          labels,
          assignees,
        })

        if (!result.ok) {
          setFieldErrors(result.errors)
          setError(result.errors.form ?? 'Fix the highlighted fields.')
          return
        }

        if (onSuccess) {
          onSuccess()
          return
        }

        router.refresh()
      })()
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-5 sm:space-y-6'>
      <div className='space-y-1.5 sm:space-y-2'>
        <label htmlFor='task-title' className='text-sm font-semibold'>
          Task title
        </label>
        <input
          id='task-title'
          name='title'
          defaultValue={task.title}
          placeholder='Write pricing update'
          className='w-full rounded-lg border border-border/80 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15 sm:px-3.5'
        />
        {fieldErrors.title ? (
          <p className='text-xs text-destructive'>{fieldErrors.title}</p>
        ) : null}
      </div>
      <div className='grid gap-3 sm:grid-cols-2 sm:gap-4'>
        <div className='space-y-1.5 sm:space-y-2'>
          <label htmlFor='task-priority' className='text-sm font-semibold'>
            Priority
          </label>
          <select
            id='task-priority'
            name='priority'
            defaultValue={task.priority}
            className='w-full rounded-lg border border-border/80 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15 sm:px-3.5'
          >
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {fieldErrors.priority ? (
            <p className='text-xs text-destructive'>{fieldErrors.priority}</p>
          ) : null}
        </div>
        <div className='space-y-1.5 sm:space-y-2'>
          <label htmlFor='task-due-date' className='text-sm font-semibold'>
            Due date
          </label>
          <input
            id='task-due-date'
            name='dueDate'
            type='date'
            defaultValue={task.dueDate.slice(0, 10)}
            className='w-full rounded-lg border border-border/80 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15 sm:px-3.5'
          />
          {fieldErrors.dueDate ? (
            <p className='text-xs text-destructive'>{fieldErrors.dueDate}</p>
          ) : null}
        </div>
      </div>
      <div className='space-y-1.5 sm:space-y-2'>
        <label htmlFor='task-description' className='text-sm font-semibold'>
          Description
        </label>
        <textarea
          id='task-description'
          name='description'
          defaultValue={task.description}
          rows={4}
          placeholder='Describe the work...'
          className='w-full resize-none rounded-lg border border-border/80 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15 sm:px-3.5'
        />
      </div>
      <div className='grid gap-3 sm:grid-cols-2 sm:gap-4'>
        <div className='space-y-1.5 sm:space-y-2'>
          <label htmlFor='task-labels' className='text-sm font-semibold'>
            Labels
          </label>
          <input
            id='task-labels'
            name='labels'
            defaultValue={task.labels.join(', ')}
            placeholder='frontend, bugfix'
            className='w-full rounded-lg border border-border/80 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15 sm:px-3.5'
          />
        </div>
        <div className='space-y-1.5 sm:space-y-2'>
          <label htmlFor='task-assignees' className='text-sm font-semibold'>
            Assignees
          </label>
          <input
            id='task-assignees'
            name='assignees'
            defaultValue={task.assignees
              .map((assignee) => `${assignee.name}:${assignee.initials}`)
              .join(', ')}
            placeholder='Jane Doe:JD, Alex Kim:AK'
            className='w-full rounded-lg border border-border/80 bg-background px-3 py-2.5 text-sm outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15 sm:px-3.5'
          />
        </div>
      </div>
      {error ? <p className='text-sm text-destructive'>{error}</p> : null}
      <div className='flex flex-wrap gap-3'>
        <Button type='submit' disabled={isPending} className='min-w-[140px]'>
          {isPending ? 'Saving...' : 'Save changes'}
        </Button>
        {onCancel ? (
          <Button type='button' variant='ghost' onClick={onCancel}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}
