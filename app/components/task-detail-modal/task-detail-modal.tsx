'use client'

import { useRouter } from 'next/navigation'
import { use } from 'react'

import { TaskDetail } from '@/components/task-detail/task-detail'
import { TaskNotFound } from '@/components/task-not-found/task-not-found'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getTaskById } from '@/lib/data/task-board'

type TaskDetailModalProps = {
  params: Promise<{ id: string; taskId: string }>
}

export const TaskDetailModal = ({ params }: TaskDetailModalProps) => {
  const router = useRouter()
  const { id, taskId } = use(params)
  const result = getTaskById(id, taskId)

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className='max-w-4xl border-border/90 bg-background p-6 sm:p-8'>
        <DialogHeader>
          <DialogTitle className='sr-only'>Task details</DialogTitle>
        </DialogHeader>
        {result ? (
          <TaskDetail
            task={result.task}
            columnName={result.column.name}
            boardName={result.board.name}
          />
        ) : (
          <TaskNotFound />
        )}
      </DialogContent>
    </Dialog>
  )
}
