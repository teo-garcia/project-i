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
            className='size-14 rounded-full border border-primary/20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-[0_18px_40px_-20px_rgba(30,64,175,0.6)] transition-transform hover:scale-105 active:scale-95'
          >
            <Plus className='size-6' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48 rounded-xl border border-border/80 bg-card/95 shadow-lg'>
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
