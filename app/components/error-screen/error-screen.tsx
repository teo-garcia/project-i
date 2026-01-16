'use client'

import { useEffect } from 'react'

type ErrorScreenProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export const ErrorScreen = ({ error, reset }: ErrorScreenProps) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang='en'>
      <body>
        <h2>Something went wrong!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}
