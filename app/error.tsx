'use client'
import { ErrorScreen } from '@/components/error-screen/error-screen'

export interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorPage = (properties: ErrorProps) => {
  return <ErrorScreen {...properties} />
}

export default ErrorPage
