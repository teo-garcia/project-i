import type { ReactNode } from 'react'

type BoardLayoutProps = {
  children: ReactNode
  modal: ReactNode
}

const BoardLayout = ({ children, modal }: BoardLayoutProps) => {
  return (
    <>
      {children}
      {modal}
    </>
  )
}

export default BoardLayout
