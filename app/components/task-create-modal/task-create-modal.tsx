'use client'

import { useRouter } from 'next/navigation'

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
}

export const TaskCreateModal = ({ boardId, columns }: TaskCreateModalProps) => {
  const router = useRouter()

  return (
    <Dialog
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          router.back()
        }
      }}
      open
    >
      <DialogContent className='max-w-3xl border-border/90 bg-background p-6 sm:p-8'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold'>
            Create a task
          </DialogTitle>
        </DialogHeader>
        <TaskCreateForm
          boardId={boardId}
          columns={columns}
          onCancel={() => router.back()}
          onSuccess={() => {
            router.back()
            router.refresh()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
