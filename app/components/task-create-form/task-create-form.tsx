'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { createTaskAction } from '@/lib/actions/task-actions'
import type { TaskPriority } from '@/lib/data/task-board'

type ColumnOption = {
  id: string
  name: string
}

type TaskCreateFormProps = {
  boardId: string
  columns: ColumnOption[]
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
    .filter(Boolean)

export const TaskCreateForm = ({
  boardId,
  columns,
  onCancel,
  onSuccess,
}: TaskCreateFormProps) => {
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
    const columnId = String(formData.get('columnId') ?? columns[0]?.id ?? '')
    const labels = parseCommaList(String(formData.get('labels') ?? ''))
    const assignees = parseAssignees(
      String(formData.get('assignees') ?? '')
    ).filter(Boolean) as { name: string; initials: string }[]

    startTransition(() => {
      void (async () => {
        const result = await createTaskAction({
          boardId,
          columnId,
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

        router.replace(`/boards/${boardId}`)
        router.refresh()
      })()
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <label htmlFor='task-title' className='text-sm font-semibold'>
          Task title
        </label>
        <input
          id='task-title'
          name='title'
          placeholder='Write pricing update'
          className='w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
        />
        {fieldErrors.title ? (
          <p className='text-xs text-destructive'>{fieldErrors.title}</p>
        ) : null}
      </div>
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='space-y-2'>
          <label htmlFor='task-column' className='text-sm font-semibold'>
            Column
          </label>
          <select
            id='task-column'
            name='columnId'
            defaultValue={columns[0]?.id}
            className='w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
          >
            {columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>
          {fieldErrors.columnId ? (
            <p className='text-xs text-destructive'>{fieldErrors.columnId}</p>
          ) : null}
        </div>
        <div className='space-y-2'>
          <label htmlFor='task-priority' className='text-sm font-semibold'>
            Priority
          </label>
          <select
            id='task-priority'
            name='priority'
            defaultValue='medium'
            className='w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
          >
            {priorityOptions.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
          {fieldErrors.priority ? (
            <p className='text-xs text-destructive'>{fieldErrors.priority}</p>
          ) : null}
        </div>
      </div>
      <div className='space-y-2'>
        <label htmlFor='task-due-date' className='text-sm font-semibold'>
          Due date
        </label>
        <input
          id='task-due-date'
          name='dueDate'
          type='date'
          className='w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
        />
        {fieldErrors.dueDate ? (
          <p className='text-xs text-destructive'>{fieldErrors.dueDate}</p>
        ) : null}
      </div>
      <div className='space-y-2'>
        <label htmlFor='task-description' className='text-sm font-semibold'>
          Description
        </label>
        <textarea
          id='task-description'
          name='description'
          rows={3}
          placeholder='What needs to happen for this task?'
          className='w-full resize-none rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
        />
      </div>
      <div className='space-y-2'>
        <label htmlFor='task-labels' className='text-sm font-semibold'>
          Labels
        </label>
        <input
          id='task-labels'
          name='labels'
          placeholder='Design, Marketing'
          className='w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
        />
        {fieldErrors.labels ? (
          <p className='text-xs text-destructive'>{fieldErrors.labels}</p>
        ) : null}
      </div>
      <div className='space-y-2'>
        <label htmlFor='task-assignees' className='text-sm font-semibold'>
          Assignees
        </label>
        <input
          id='task-assignees'
          name='assignees'
          placeholder='Sam Rivera:SR, Casey Lin:CL'
          className='w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
        />
        <p className='text-xs text-muted-foreground'>
          Use “Name:Initials” pairs separated by commas.
        </p>
        {fieldErrors.assignees ? (
          <p className='text-xs text-destructive'>{fieldErrors.assignees}</p>
        ) : null}
      </div>
      {error ? <p className='text-sm text-destructive'>{error}</p> : null}
      <div className='flex flex-wrap gap-3'>
        <Button type='submit' disabled={isPending} className='min-w-[140px]'>
          {isPending ? 'Creating...' : 'Create task'}
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
