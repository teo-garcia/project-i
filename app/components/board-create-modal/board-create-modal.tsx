'use client'

import { BoardCreateForm } from '@/components/board-create-form/board-create-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type BoardCreateModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (boardId: string) => void
}

export const BoardCreateModal = ({
  open,
  onOpenChange,
  onSuccess,
}: BoardCreateModalProps) => {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className='max-w-2xl border-border/90 bg-background p-6 sm:p-8'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold'>
            Create a board
          </DialogTitle>
        </DialogHeader>
        <BoardCreateForm
          onCancel={() => onOpenChange(false)}
          onSuccess={(boardId) => {
            onSuccess?.(boardId)
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
