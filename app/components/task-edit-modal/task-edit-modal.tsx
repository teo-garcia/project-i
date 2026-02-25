'use client'

import { TaskEditForm } from '@/components/task-edit-form/task-edit-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { Task } from '@/lib/data/task-board'

type TaskEditModalProps = {
  boardId: string
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const TaskEditModal = ({
  boardId,
  task,
  open,
  onOpenChange,
  onSuccess,
}: TaskEditModalProps) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='max-w-3xl border-border/90 bg-background p-6 sm:p-8'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold'>
            Edit task
          </DialogTitle>
        </DialogHeader>
        {task ? (
          <TaskEditForm
            key={task.id}
            boardId={boardId}
            task={task}
            onCancel={() => onOpenChange(false)}
            onSuccess={() => {
              onSuccess?.()
              onOpenChange(false)
            }}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
