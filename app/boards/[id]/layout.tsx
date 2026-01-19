import type { ReactNode } from 'react'

type BoardLayoutProps = {
  children: ReactNode
}

const BoardLayout = ({ children }: BoardLayoutProps) => {
  return <>{children}</>
}

export default BoardLayout
