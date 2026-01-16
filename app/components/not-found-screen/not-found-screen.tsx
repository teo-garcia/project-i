import { Info } from 'lucide-react'

export const NotFoundScreen = () => {
  return (
    <section className='flex h-screen flex-col items-center justify-center gap-y-12'>
      <Info className='size-32 text-muted-foreground lg:size-36' />
      <h1 className='text-5xl font-semibold lg:text-7xl'>Page not found</h1>
    </section>
  )
}
