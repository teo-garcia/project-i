'use client'

import { LayoutGrid, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <header className='sticky top-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur'>
      <div className='app-container flex h-16 items-center justify-between'>
        {/* Logo and Nav */}
        <div className='flex items-center gap-8'>
          <Link href='/' className='flex items-center gap-2 font-bold'>
            <div className='flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground'>
              <LayoutGrid className='size-4' />
            </div>
            <span className='text-lg'>Task Board</span>
          </Link>

          <nav className='hidden items-center gap-1 md:flex'>
            <Link
              href='/'
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                isHomePage
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              Boards
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2'>
          <ThemeSwitch />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='h-9 w-9 rounded-full'
              >
                <Avatar className='size-8'>
                  <AvatarFallback className='bg-primary/10 text-primary text-xs font-semibold'>
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <div className='flex items-center gap-2 px-2 py-2'>
                <Avatar className='size-8'>
                  <AvatarFallback className='bg-primary/10 text-primary text-xs font-semibold'>
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className='flex flex-col'>
                  <span className='text-sm font-semibold'>John Doe</span>
                  <span className='text-xs text-muted-foreground'>
                    john@example.com
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
