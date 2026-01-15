import '@/lib/styles/globals.css'

import type { Metadata } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'

import { AppHeader } from './components/app-header/app-header'
import { GlobalProviders } from './components/global-providers/global-providers'

export const metadata: Metadata = {
  title: {
    default: 'Home',
    template: '%s | RTN',
  },
}

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const RootLayout = async (properties: React.PropsWithChildren) => {
  const { children } = properties
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body className={`${spaceGrotesk.variable} ${dmSans.variable} font-body antialiased`}>
        <GlobalProviders>
          <div className='min-h-screen'>
            <AppHeader />
            <main>{children}</main>
          </div>
        </GlobalProviders>
      </body>
    </html>
  )
}

export default RootLayout
