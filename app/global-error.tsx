'use client'
import { ErrorScreen } from '@/components/error-screen/error-screen'

export interface GlobalErrorProperties {
  error: Error & { digest?: string }
  reset: () => void
}

const GlobalErrorBoundary = (properties: GlobalErrorProperties) => {
  return <ErrorScreen {...properties} />
}

export default GlobalErrorBoundary
