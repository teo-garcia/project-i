'use client'

import { useRouter } from 'next/navigation'

import { BoardCreateForm } from '@/components/board-create-form/board-create-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export const BoardCreateModal = () => {
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
      <DialogContent className='max-w-2xl border-border/90 bg-background p-6 sm:p-8'>
        <DialogHeader>
          <DialogTitle className='text-2xl font-semibold'>
            Create a board
          </DialogTitle>
        </DialogHeader>
        <BoardCreateForm
          onCancel={() => router.back()}
          onSuccess={(boardId) => {
            router.back()
            router.replace(`/boards/${boardId}`)
            router.refresh()
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
