'use client'

import { RulerIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

export const ViewportInfo = () => {
  const [{ width: viewportWidth, height: viewportHeight }, setViewportSize] =
    useState(() => ({ width: 0, height: 0 }))

  useEffect(() => {
    if (globalThis.window == undefined) {
      return
    }

    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    handleResize()

    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (process.env.NODE_ENV === 'production') return null

  return (
    <aside className='fixed bottom-4 right-4 z-30 flex max-w-[calc(100vw-1rem)] items-center gap-x-2 overflow-hidden rounded-full border border-border/80 bg-background/90 px-3 py-1.5 text-foreground shadow-lg backdrop-blur-sm pointer-events-none'>
      <RulerIcon className='size-5' />
      <p className='flex items-center gap-x-2 text-xs font-semibold sm:text-sm'>
        <span className='truncate'>{viewportWidth}x{viewportHeight}</span>
        <span className='text-muted-foreground'>|</span>
        <span className='inline sm:hidden'>default</span>
        <span className='hidden sm:inline md:hidden'>sm</span>
        <span className='hidden md:inline lg:hidden'>md</span>
        <span className='hidden lg:inline xl:hidden'>lg</span>
        <span className='hidden xl:inline 2xl:hidden'>xl</span>
        <span className='hidden 2xl:inline'>2xl</span>
      </p>
    </aside>
  )
}
