'use client'

import { Plus, Sparkles } from 'lucide-react'
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
      );
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
    );

  return (
    <div className='fixed bottom-24 right-6 z-40 sm:bottom-28 sm:right-8'>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size='lg'
            className='relative h-12 gap-2 rounded-full border border-primary/30 bg-gradient-to-br from-primary via-primary/90 to-primary/70 px-5 text-sm font-semibold text-primary-foreground shadow-[0_22px_46px_-18px_rgba(30,64,175,0.6)] ring-2 ring-primary/20 transition hover:-translate-y-0.5 hover:shadow-[0_24px_54px_-20px_rgba(30,64,175,0.7)] active:translate-y-0 after:absolute after:inset-0 after:rounded-full after:shadow-[0_0_20px_rgba(59,130,246,0.45)] after:opacity-0 after:transition after:duration-200 hover:after:opacity-100'
          >
            <Sparkles className='size-4' />
            Quick actions
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          side='top'
          sideOffset={10}
          collisionPadding={12}
          className='w-52 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-border/80 bg-popover/95 p-1.5 shadow-lg backdrop-blur'
        >
          {taskAction}
          {boardAction}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
