'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ThemeProvider, useTheme } from 'next-themes'
import { useEffect } from 'react'
import { Toaster } from 'sonner'

import { ViewportInfo } from '@/components/viewport-info/viewport-info'
import { createNewQueryClient } from '@/lib/misc/react-query'

export const GlobalProviders = (properties: React.PropsWithChildren) => {
  const { children } = properties

  useEffect(() => {
    if (globalThis.window != undefined) {
      import('@/lib/mocks').then(({ setupMSWBrowser }) => setupMSWBrowser())
    }
  }, [])

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <QueryClientProvider client={createNewQueryClient()}>
        <ThemeProviderContent>{children}</ThemeProviderContent>
        <ReactQueryDevtools buttonPosition='bottom-left' />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

const ThemeProviderContent = ({ children }: React.PropsWithChildren) => {
  const { resolvedTheme } = useTheme()
  return (
    <>
      {children}
      <ViewportInfo />
      <Toaster
        theme={resolvedTheme as 'light' | 'dark' | 'system'}
        richColors
        closeButton
        position='bottom-right'
      />
    </>
  )
}
