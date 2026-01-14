'use client'

import { useRouter } from 'next/navigation'
import { use } from 'react'

import { TaskDetail } from '@/components/task-detail/task-detail'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getTaskById } from '@/lib/data/task-board'

type TaskModalPageProps = {
  params: Promise<{ id: string; taskId: string }>
}

const TaskModalPage = ({ params }: TaskModalPageProps) => {
  const router = useRouter()
  const { id, taskId } = use(params)
  const result = getTaskById(id, taskId)

  return (
    <Dialog open onOpenChange={() => router.back()}>
      <DialogContent className='max-w-3xl border-border/70 bg-background'>
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
          <div className='rounded-lg border border-dashed p-6 text-sm text-muted-foreground'>
            We could not find that task. Try closing the modal and selecting a
            different task.
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default TaskModalPage
