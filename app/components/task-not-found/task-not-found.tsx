type TaskNotFoundProps = {
  message?: string
}

export const TaskNotFound = ({ message }: TaskNotFoundProps) => {
  return (
    <div className='rounded-lg border border-dashed p-6 text-sm text-muted-foreground'>
      {message ?? 'We could not find that task. Try closing this view and selecting a different task.'}
    </div>
  )
}
