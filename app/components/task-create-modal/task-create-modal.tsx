'use client'

import { TaskCreateForm } from '@/components/task-create-form/task-create-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type TaskCreateModalProps = {
  boardId: string
  columns: { id: string; name: string }[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const TaskCreateModal = ({
  boardId,
  columns,
  open,
  onOpenChange,
  onSuccess,
}: TaskCreateModalProps) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='max-w-3xl border-border/90 bg-background p-6 sm:p-8'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold'>
            Create a task
          </DialogTitle>
        </DialogHeader>
        <TaskCreateForm
          boardId={boardId}
          columns={columns}
          onCancel={() => onOpenChange(false)}
          onSuccess={() => {
            onSuccess?.()
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
