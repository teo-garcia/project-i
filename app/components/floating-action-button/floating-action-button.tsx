'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type FloatingActionButtonProps = {
  boardId?: string
  onNewTask?: () => void
  onNewBoard?: () => void
}

export const FloatingActionButton = ({
  boardId,
  onNewTask,
  onNewBoard,
}: FloatingActionButtonProps) => {
  const [open, setOpen] = useState(false)
  const shouldShowTaskAction = Boolean(boardId)
  const useTaskModal = Boolean(boardId && onNewTask)
  const useBoardModal = Boolean(onNewBoard)
  let taskAction: ReactNode = null
  let boardAction: ReactNode

  if (shouldShowTaskAction) {
    taskAction = useTaskModal ? (
      <DropdownMenuItem
        onSelect={() => {
          setOpen(false)
          onNewTask?.()
        }}
        className='flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-sm'
      >
        <Plus className='size-4' />
        New task
      </DropdownMenuItem>
    ) : (
      <DropdownMenuItem asChild>
        <Link
          href={`/boards/${boardId}/task/new`}
          className='flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-sm'
        >
          <Plus className='size-4' />
          New task
        </Link>
      </DropdownMenuItem>
    )
  }

  boardAction = useBoardModal ? (
    <DropdownMenuItem
      onSelect={() => {
        setOpen(false)
        onNewBoard?.()
      }}
      className='flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-sm'
    >
      <Plus className='size-4' />
      New board
    </DropdownMenuItem>
  ) : (
    <DropdownMenuItem asChild>
      <Link
        href='/boards/new'
        className='flex cursor-pointer items-center gap-2 rounded-xl px-2.5 py-2 text-sm'
      >
        <Plus className='size-4' />
        New board
      </Link>
    </DropdownMenuItem>
  )

  return (
    <div className='fixed bottom-[max(4.5rem,calc(env(safe-area-inset-bottom)+1rem))] right-4 z-40 sm:bottom-16 sm:right-8'>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size='sm'
            className='h-10 gap-2 rounded-full border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-sm transition-[background-color,border-color,transform,box-shadow] duration-150 hover:-translate-y-px hover:border-foreground/25 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring/60'
          >
            <Plus className='size-4' />
            New
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          side='top'
          sideOffset={10}
          collisionPadding={12}
          className='w-48 max-w-[calc(100vw-1.5rem)] rounded-xl border border-border bg-popover p-1.5 shadow-md'
        >
          {taskAction}
          {boardAction}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
