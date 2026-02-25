import { z } from 'zod'

export const prioritySchema = z.enum(['urgent', 'high', 'medium', 'low'])

const hasValidDate = (value?: string) =>
  !value || !Number.isNaN(Date.parse(value))

export const boardCreateSchema = z.object({
  name: z.string().trim().min(1, 'Board name is required.'),
  description: z.string().trim().optional(),
  columns: z.array(z.string().trim().min(1)).optional(),
})

export const boardUpdateSchema = z
  .object({
    boardId: z.string().trim().min(1, 'Board is required.'),
    name: z.string().trim().min(1, 'Board name is required.').optional(),
    description: z.string().trim().optional(),
  })
  .refine(
    (value) => value.name !== undefined || value.description !== undefined,
    { message: 'At least one field must be updated.' }
  )

export const boardDeleteSchema = z.object({
  boardId: z.string().trim().min(1, 'Board is required.'),
})

export const taskCreateSchema = z.object({
  boardId: z.string().trim().min(1, 'Board is required.'),
  columnId: z.string().trim().min(1, 'Column is required.'),
  title: z.string().trim().min(1, 'Task title is required.'),
  description: z.string().trim().optional(),
  dueDate: z
    .string()
    .optional()
    .refine(hasValidDate, 'Due date must be a valid date.'),
  priority: prioritySchema.default('medium'),
  labels: z.array(z.string().trim().min(1)).optional(),
  assignees: z
    .array(
      z.object({
        name: z.string().trim().min(1, 'Assignee name is required.'),
        initials: z.string().trim().min(1, 'Initials are required.'),
      })
    )
    .optional(),
})

export const taskMoveSchema = z.object({
  boardId: z.string().trim().min(1),
  taskId: z.string().trim().min(1),
  toColumnId: z.string().trim().min(1),
  toIndex: z.number().int().min(0),
})

export const taskUpdateSchema = z
  .object({
    boardId: z.string().trim().min(1, 'Board is required.'),
    taskId: z.string().trim().min(1, 'Task is required.'),
    title: z.string().trim().min(1, 'Task title is required.').optional(),
    description: z.string().trim().optional(),
    dueDate: z
      .string()
      .optional()
      .refine(hasValidDate, 'Due date must be a valid date.'),
    priority: prioritySchema.optional(),
    labels: z.array(z.string().trim().min(1)).optional(),
    assignees: z
      .array(
        z.object({
          name: z.string().trim().min(1, 'Assignee name is required.'),
          initials: z.string().trim().min(1, 'Initials are required.'),
        })
      )
      .optional(),
  })
  .refine(
    (value) =>
      value.title !== undefined ||
      value.description !== undefined ||
      value.dueDate !== undefined ||
      value.priority !== undefined ||
      value.labels !== undefined ||
      value.assignees !== undefined,
    { message: 'At least one field must be updated.' }
  )

export const taskDeleteSchema = z.object({
  boardId: z.string().trim().min(1, 'Board is required.'),
  taskId: z.string().trim().min(1, 'Task is required.'),
})
