'use client'

import { useRouter } from 'next/navigation'

import { TaskDetail } from '@/components/task-detail/task-detail'
import { TaskNotFound } from '@/components/task-not-found/task-not-found'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Task } from '@/lib/data/task-board'

type TaskDetailModalProps = {
  task: Task | null
  columnName?: string
  boardName?: string
}

export const TaskDetailModal = ({
  task,
  columnName,
  boardName,
}: TaskDetailModalProps) => {
  const router = useRouter()

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className='max-w-5xl border-border/90 bg-background p-6 sm:p-8'>
        <DialogHeader>
          <DialogTitle className='sr-only'>Task details</DialogTitle>
        </DialogHeader>
        {task && columnName && boardName ? (
          <TaskDetail
            task={task}
            columnName={columnName}
            boardName={boardName}
          />
        ) : (
          <TaskNotFound />
        )}
      </DialogContent>
    </Dialog>
  )
}
