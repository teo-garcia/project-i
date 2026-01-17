'use client'

import { Plus } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const FloatingActionButton = () => {
  const [open, setOpen] = useState(false)

  return (
    <div className='fixed bottom-20 right-6 z-40 sm:bottom-24 sm:right-8'>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size='lg'
            className='relative size-14 rounded-full border border-primary/25 bg-gradient-to-br from-primary via-primary to-primary/70 text-primary-foreground shadow-[0_22px_48px_-18px_rgba(30,64,175,0.75)] ring-2 ring-primary/25 transition-transform hover:scale-105 active:scale-95 after:absolute after:inset-0 after:rounded-full after:shadow-[0_0_18px_rgba(59,130,246,0.45)] after:opacity-0 after:transition after:duration-200 hover:after:opacity-100'
          >
            <Plus className='size-6' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align='end'
          sideOffset={10}
          collisionPadding={12}
          className='w-48 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-border/80 bg-popover p-1.5 shadow-lg backdrop-blur'
        >
          <DropdownMenuItem className='cursor-pointer'>
            <Plus className='mr-2 size-4' />
            New Task
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer'>
            <Plus className='mr-2 size-4' />
            New Board
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
