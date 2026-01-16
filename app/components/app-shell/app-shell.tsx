import { AppHeader } from '@/components/app-header/app-header'

type AppShellProps = {
  children: React.ReactNode
}

export const AppShell = ({ children }: AppShellProps) => {
  return (
    <div className='min-h-screen'>
      <AppHeader />
      <main>{children}</main>
    </div>
  )
}
