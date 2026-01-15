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
    <div className='fixed bottom-6 right-6 z-40 sm:bottom-8 sm:right-8'>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size='lg'
            className='size-14 rounded-full shadow-2xl shadow-primary/30 transition-transform hover:scale-105 active:scale-95'
          >
            <Plus className='size-6' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-48'>
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
