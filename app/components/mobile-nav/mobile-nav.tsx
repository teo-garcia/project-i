'use client'

import { BarChart3, LayoutGrid, Menu, Settings, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

export const MobileNav = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon' className='rounded-full border-border/60'>
          <Menu className='size-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-[360px] rounded-[28px] border-border/60 p-6'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-lg font-semibold'>
            <span className='flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20'>
              <Sparkles className='size-5' />
            </span>
            Task Board
          </DialogTitle>
          <DialogDescription>
            Keep your team aligned with a clear, focused flow.
          </DialogDescription>
        </DialogHeader>
        <nav className='mt-6 flex flex-col gap-2 text-sm font-medium'>
          <Link
            href='/'
            className='flex items-center gap-3 rounded-2xl border border-transparent px-4 py-2.5 text-foreground transition hover:border-primary/40 hover:bg-primary/10'
          >
            <LayoutGrid className='size-4' />
            Boards
          </Link>
          <span className='flex items-center gap-3 rounded-2xl border border-border/40 px-4 py-2.5 text-muted-foreground'>
            <BarChart3 className='size-4' />
            Insights
          </span>
          <span className='flex items-center gap-3 rounded-2xl border border-border/40 px-4 py-2.5 text-muted-foreground'>
            <Settings className='size-4' />
            Settings
          </span>
        </nav>
      </DialogContent>
    </Dialog>
  )
}
