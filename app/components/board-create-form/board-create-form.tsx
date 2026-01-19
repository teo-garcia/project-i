'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { createBoardAction } from '@/lib/actions/board-actions'

const defaultColumns = ['Backlog', 'In Progress', 'Done']

type BoardCreateFormProps = {
  onCancel?: () => void
  onSuccess?: (boardId: string) => void
}

export const BoardCreateForm = ({
  onCancel,
  onSuccess,
}: BoardCreateFormProps) => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') ?? '').trim()
    const description = String(formData.get('description') ?? '').trim()
    const columnInput = String(formData.get('columns') ?? '')
    const columns = columnInput
      .split(',')
      .map((column) => column.trim())
      .filter(Boolean)

    startTransition(() => {
      void (async () => {
        const result = await createBoardAction({
          name,
          description,
          columns: columns.length > 0 ? columns : defaultColumns,
        })

        if (!result.ok) {
          setFieldErrors(result.errors)
          setError(result.errors.form ?? 'Fix the highlighted fields.')
          return
        }

        if (onSuccess) {
          onSuccess(result.boardId)
          return
        }

        router.replace(`/boards/${result.boardId}`)
        router.refresh()
      })()
    })
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='space-y-2'>
        <label htmlFor='board-name' className='text-sm font-semibold'>
          Board name
        </label>
        <input
          id='board-name'
          name='name'
          placeholder='Launch HQ'
          className='w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
        />
        {fieldErrors.name ? (
          <p className='text-xs text-destructive'>{fieldErrors.name}</p>
        ) : null}
      </div>
      <div className='space-y-2'>
        <label htmlFor='board-description' className='text-sm font-semibold'>
          Description
        </label>
        <textarea
          id='board-description'
          name='description'
          rows={3}
          placeholder='What is this board focused on?'
          className='w-full resize-none rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
        />
      </div>
      <div className='space-y-2'>
        <label htmlFor='board-columns' className='text-sm font-semibold'>
          Columns
        </label>
        <input
          id='board-columns'
          name='columns'
          placeholder='Backlog, In Progress, Done'
          className='w-full rounded-2xl border border-border/80 bg-background px-4 py-3 text-sm shadow-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/20'
        />
        <p className='text-xs text-muted-foreground'>
          Leave blank to use the default workflow.
        </p>
        {fieldErrors.columns ? (
          <p className='text-xs text-destructive'>{fieldErrors.columns}</p>
        ) : null}
      </div>
      {error ? <p className='text-sm text-destructive'>{error}</p> : null}
      <div className='flex flex-wrap gap-3'>
        <Button type='submit' disabled={isPending} className='min-w-[140px]'>
          {isPending ? 'Creating...' : 'Create board'}
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
