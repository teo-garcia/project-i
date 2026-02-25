'use client'

import { LayoutGrid, User } from 'lucide-react'
import Link from 'next/link'

import { ThemeSwitch } from '@/components/theme-switch/theme-switch'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const AppHeader = () => {
  return (
    <header className='sticky top-0 z-50 border-b border-border/70 bg-background/90 px-4 backdrop-blur-sm sm:px-8'>
      <div className='app-container flex h-14 items-center justify-between sm:h-16'>
        <div className='flex items-center gap-3'>
          <Link
            href='/'
            className='flex items-center gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60'
          >
            <div className='flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary'>
              <LayoutGrid className='size-3.5 sm:size-4' />
            </div>
            <span className='text-[1.05rem] font-semibold tracking-tight sm:text-xl'>
              Task Board
            </span>
          </Link>
        </div>

        <div className='flex items-center gap-0.5 sm:gap-1'>
          <ThemeSwitch />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                aria-label='Account menu'
                className='h-8 w-8 rounded-full border border-transparent hover:border-border sm:h-9 sm:w-9'
              >
                <Avatar className='size-7 sm:size-8'>
                  <AvatarFallback className='bg-muted text-xs font-semibold text-foreground'>
                    MG
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <div className='flex items-center gap-2 px-2 py-2'>
                <Avatar className='size-8'>
                  <AvatarFallback className='bg-muted text-xs font-semibold text-foreground'>
                    MG
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold'>Mateo Garcia</span>
                  <span className='text-xs text-muted-foreground'>
                    mateo@example.com
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className='mr-2 size-4' />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem>Keyboard Shortcuts</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className='text-destructive'>
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
