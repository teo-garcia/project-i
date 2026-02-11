'use client'

import { Laptop, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

type ThemeMode = 'light' | 'dark' | 'system'

export const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()

  const activeTheme: ThemeMode = (theme ?? 'system') as ThemeMode

  const getNextTheme = (): ThemeMode => {
    switch (activeTheme) {
      case 'light': {
        return 'dark'
      }
      case 'dark': {
        return 'system'
      }
      default: {
        return 'light'
      }
    }
  }

  const getCurrentIcon = () => {
    switch (activeTheme) {
      case 'light': {
        return <Sun className='size-4' />
      }
      case 'dark': {
        return <Moon className='size-4' />
      }
      default: {
        return <Laptop className='size-4' />
      }
    }
  }

  const handleClick = () => {
    setTheme(getNextTheme())
  }

  return (
    <Button
      onClick={handleClick}
      variant='ghost'
      size='icon'
      aria-label={`Theme switcher, current mode: ${activeTheme}`}
      className='h-9 w-9 rounded-full border border-transparent hover:border-border'
      title={`Current theme: ${activeTheme}. Click to switch to ${getNextTheme()}`}
    >
      {getCurrentIcon()}
    </Button>
  )
}
