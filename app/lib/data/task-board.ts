export type TaskAssignee = {
  id: string
  name: string
  initials: string
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type Task = {
  id: string
  title: string
  description: string
  labels: string[]
  dueDate: string
  priority: TaskPriority
  assignees: TaskAssignee[]
}

export type Column = {
  id: string
  name: string
  tasks: Task[]
}

export type Board = {
  id: string
  name: string
  description: string
  columns: Column[]
}

const boards: Board[] = [
  {
    id: 'launch-prep',
    name: 'Launch Prep',
    description: 'Polish the product launch and align the release train.',
    columns: [
      {
        id: 'backlog',
        name: 'Backlog',
        tasks: [
          {
            id: 'task-1',
            title: 'Narrative for launch page',
            description:
              'Craft the hero copy and supporting story for the public launch page.',
            labels: ['Design', 'Marketing'],
            dueDate: '2025-04-04',
            priority: 'high',
            assignees: [
              { id: 'sam', name: 'Sam Rivera', initials: 'SR' },
              { id: 'casey', name: 'Casey Lin', initials: 'CL' },
            ],
          },
          {
            id: 'task-2',
            title: 'Beta feedback digest',
            description:
              'Summarize beta program feedback and highlight key takeaways.',
            labels: ['Research'],
            dueDate: '2025-04-06',
            priority: 'medium',
            assignees: [{ id: 'jo', name: 'Jo Singh', initials: 'JS' }],
          },
        ],
      },
      {
        id: 'in-progress',
        name: 'In Progress',
        tasks: [
          {
            id: 'task-3',
            title: 'Pricing page revamp',
            description:
              'Update pricing tiers, add FAQs, and align copy with new positioning.',
            labels: ['Product', 'Marketing'],
            dueDate: '2025-04-09',
            priority: 'urgent',
            assignees: [{ id: 'mari', name: 'Mari Campos', initials: 'MC' }],
          },
          {
            id: 'task-4',
            title: 'Launch checklist run-through',
            description:
              'Run a dry launch, confirm tracking pixels, and verify release notes.',
            labels: ['Ops'],
            dueDate: '2025-04-10',
            priority: 'high',
            assignees: [
              { id: 'elena', name: 'Elena Park', initials: 'EP' },
              { id: 'amir', name: 'Amir Patel', initials: 'AP' },
            ],
          },
        ],
      },
      {
        id: 'done',
        name: 'Done',
        tasks: [
          {
            id: 'task-5',
            title: 'Investor update draft',
            description:
              'Draft the launch update for investors and internal stakeholders.',
            labels: ['Comms'],
            dueDate: '2025-04-02',
            priority: 'low',
            assignees: [{ id: 'taylor', name: 'Taylor Reese', initials: 'TR' }],
          },
        ],
      },
    ],
  },
  {
    id: 'growth-sprints',
    name: 'Growth Sprints',
    description: 'Experiment roadmap for Q2 acquisition and retention.',
    columns: [
      {
        id: 'ideas',
        name: 'Ideas',
        tasks: [
          {
            id: 'task-6',
            title: 'Referral program concept',
            description:
              'Outline incentives and guardrails for a multi-sided referral program.',
            labels: ['Growth'],
            dueDate: '2025-04-12',
            priority: 'medium',
            assignees: [{ id: 'jamie', name: 'Jamie Fox', initials: 'JF' }],
          },
        ],
      },
      {
        id: 'design',
        name: 'Design',
        tasks: [
          {
            id: 'task-7',
            title: 'Lifecycle email refresh',
            description:
              'Rework onboarding email series with new activation milestones.',
            labels: ['Lifecycle', 'Email'],
            dueDate: '2025-04-14',
            priority: 'high',
            assignees: [{ id: 'riley', name: 'Riley Jones', initials: 'RJ' }],
          },
        ],
      },
      {
        id: 'experimenting',
        name: 'Experimenting',
        tasks: [
          {
            id: 'task-8',
            title: 'Landing page A/B test',
            description:
              'Run a split test on the hero CTA and social proof module.',
            labels: ['Experiment'],
            dueDate: '2025-04-16',
            priority: 'low',
            assignees: [
              { id: 'dev', name: 'Dev Anand', initials: 'DA' },
              { id: 'min', name: 'Min Lee', initials: 'ML' },
            ],
          },
        ],
      },
    ],
  },
]

// Read all boards (mock data source for now).
export const getBoards = () => boards

// Fetch a board by id.
export const getBoardById = (boardId: string) =>
  boards.find((board) => board.id === boardId)

// Find a task inside a board and return its board/column context.
export const getTaskById = (boardId: string, taskId: string) => {
  const board = getBoardById(boardId)

  if (!board) {
    return null
  }

  for (const column of board.columns) {
    const task = column.tasks.find((item) => item.id === taskId)

    if (task) {
      return {
        board,
        column,
        task,
      }
    }
  }

  return null
}

// Count tasks across all columns in a board.
export const countBoardTasks = (board: Board) =>
  board.columns.reduce((total, column) => total + column.tasks.length, 0)

// Map priority to badge variant for consistent UI color.
export const getPriorityVariant = (
  priority: TaskPriority
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (priority) {
    case 'urgent': {
      return 'destructive'
    }
    case 'high': {
      return 'default'
    }
    case 'medium': {
      return 'secondary'
    }
    case 'low': {
      return 'outline'
    }
  }
}

// Overdue if due date is before now.
export const isTaskOverdue = (dueDate: string): boolean => {
  return new Date(dueDate) < new Date()
}

// Due soon if the task lands within the next 3 days.
export const isTaskDueSoon = (dueDate: string): boolean => {
  const due = new Date(dueDate)
  const now = new Date()
  const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
  return due > now && due <= threeDaysFromNow
}
