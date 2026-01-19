import type { z } from 'zod'

export const formatZodErrors = (error: z.ZodError): Record<string, string> => {
  const flattened = error.flatten((issue) => issue.message)
  const fieldErrors: Record<string, string> = {}

  for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
    if (Array.isArray(messages) && messages.length > 0) {
      fieldErrors[field] = messages[0] ?? 'Invalid value.'
    }
  }

  if (flattened.formErrors.length > 0) {
    fieldErrors.form = flattened.formErrors[0] ?? 'Invalid input.'
  }

  return fieldErrors
}
