import '@/lib/styles/globals.css'

import type { Metadata } from 'next'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'

import { AppShell } from './components/app-shell/app-shell'
import { GlobalProviders } from './components/global-providers/global-providers'

export const metadata: Metadata = {
  title: {
    default: 'Home',
    template: '%s',
  },
}

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['500', '600'],
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body
        className={`${ibmPlexMono.variable} ${ibmPlexSans.variable} font-body antialiased`}
      >
        <GlobalProviders>
          <AppShell>{children}</AppShell>
        </GlobalProviders>
      </body>
    </html>
  )
}

export default RootLayout
