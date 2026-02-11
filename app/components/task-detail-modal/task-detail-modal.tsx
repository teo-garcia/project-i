'use client'

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
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const TaskDetailModal = ({
  task,
  columnName,
  boardName,
  open,
  onOpenChange,
}: TaskDetailModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[92vh] w-[min(860px,calc(100vw-1.5rem))] max-w-[860px] overflow-hidden border-border/90 bg-background p-0'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Task detail</DialogTitle>
        </DialogHeader>
        <div className='overflow-y-auto px-4 pb-4 pt-12 sm:px-6 sm:pb-6 sm:pt-12'>
          {task && columnName && boardName ? (
            <TaskDetail
              task={task}
              columnName={columnName}
              boardName={boardName}
            />
          ) : (
            <TaskNotFound />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
