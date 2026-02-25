'use client'

import { BoardEditForm } from '@/components/board-edit-form/board-edit-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type BoardEditModalProps = {
  boardId: string
  defaultName: string
  defaultDescription: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export const BoardEditModal = ({
  boardId,
  defaultName,
  defaultDescription,
  open,
  onOpenChange,
  onSuccess,
}: BoardEditModalProps) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='max-w-2xl border-border/90 bg-background p-6 sm:p-8'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold'>
            Edit board
          </DialogTitle>
        </DialogHeader>
        <BoardEditForm
          key={`${boardId}-${defaultName}-${defaultDescription}`}
          boardId={boardId}
          defaultName={defaultName}
          defaultDescription={defaultDescription}
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
