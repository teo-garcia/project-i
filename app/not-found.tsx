import type { Metadata } from 'next'

import { NotFoundScreen } from '@/components/not-found-screen/not-found-screen'
export const metadata: Metadata = {
  title: 'Not Found',
}

const NotFoundPage = () => {
  return <NotFoundScreen />
}

export default NotFoundPage
