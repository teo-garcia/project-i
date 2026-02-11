import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

import { BoardCreateForm } from '@/components/board-create-form/board-create-form'

export const BoardCreatePage = () => {
  return (
    <section className='min-h-screen bg-background px-4 py-8 sm:px-10 sm:py-14'>
      <div className='app-container flex flex-col gap-6 sm:gap-8'>
        <Link
          href='/'
          className='inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground'
        >
          <ArrowLeft className='size-4' />
          Back to boards
        </Link>
        <div className='space-y-3 sm:space-y-4'>
          <h1 className='text-3xl font-bold tracking-tight sm:text-4xl'>
            Create a board
          </h1>
          <p className='max-w-xl text-sm text-muted-foreground sm:text-base'>
            Define the workflow, then start adding tasks to keep work moving.
          </p>
        </div>
        <div className='max-w-2xl rounded-xl border border-border/80 bg-card p-4 sm:p-8'>
          <BoardCreateForm />
        </div>
      </div>
    </section>
  )
}
