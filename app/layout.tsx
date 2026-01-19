import '@/lib/styles/globals.css'

import type { Metadata } from 'next'
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google'

import { AppShell } from './components/app-shell/app-shell'
import { GlobalProviders } from './components/global-providers/global-providers'

export const metadata: Metadata = {
  title: {
    default: 'Home',
    template: '%s',
  },
}

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['600', '700'],
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

type RootLayoutProps = {
  children: React.ReactNode
  modal: React.ReactNode
}

const RootLayout = async ({ children, modal }: RootLayoutProps) => {
  return (
    <html lang='en' suppressHydrationWarning>
      <head />
      <body
        className={`${bricolageGrotesque.variable} ${instrumentSans.variable} font-body antialiased`}
      >
        <GlobalProviders>
          <AppShell>
            <>
              {children}
              {modal}
            </>
          </AppShell>
        </GlobalProviders>
      </body>
    </html>
  )
}

export default RootLayout
