import 'dotenv/config'

import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

import { $Enums, PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL ?? ''}`

if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const adapter = new PrismaBetterSqlite3({ url: connectionString })
const prisma = new PrismaClient({ adapter })

const seedBoards = [
  {
    name: 'Launch Prep',
    description: 'Polish the product launch and align the release train.',
    columns: [
      {
        name: 'Backlog',
        tasks: [
          {
            title: 'Narrative for launch page',
            description:
              'Craft the hero copy and supporting story for the public launch page.',
            labels: ['Design', 'Marketing'],
            dueDate: new Date('2025-04-04'),
            priority: 'high',
            assignees: [
              { name: 'Sam Rivera', initials: 'SR' },
              { name: 'Casey Lin', initials: 'CL' },
            ],
          },
          {
            title: 'Beta feedback digest',
            description:
              'Summarize beta program feedback and highlight key takeaways.',
            labels: ['Research'],
            dueDate: new Date('2025-04-06'),
            priority: 'medium',
            assignees: [{ name: 'Jo Singh', initials: 'JS' }],
          },
        ],
      },
      {
        name: 'In Progress',
        tasks: [
          {
            title: 'Pricing page revamp',
            description:
              'Update pricing tiers, add FAQs, and align copy with new positioning.',
            labels: ['Product', 'Marketing'],
            dueDate: new Date('2025-04-09'),
            priority: 'urgent',
            assignees: [{ name: 'Mari Campos', initials: 'MC' }],
          },
          {
            title: 'Launch checklist run-through',
            description:
              'Run a dry launch, confirm tracking pixels, and verify release notes.',
            labels: ['Ops'],
            dueDate: new Date('2025-04-10'),
            priority: 'high',
            assignees: [
              { name: 'Elena Park', initials: 'EP' },
              { name: 'Amir Patel', initials: 'AP' },
            ],
          },
        ],
      },
      {
        name: 'Done',
        tasks: [
          {
            title: 'Investor update draft',
            description:
              'Draft the launch update for investors and internal stakeholders.',
            labels: ['Comms'],
            dueDate: new Date('2025-04-02'),
            priority: 'low',
            assignees: [{ name: 'Taylor Reese', initials: 'TR' }],
          },
        ],
      },
    ],
  },
  {
    name: 'Growth Sprints',
    description: 'Experiment roadmap for Q2 acquisition and retention.',
    columns: [
      {
        name: 'Ideas',
        tasks: [
          {
            title: 'Referral program concept',
            description:
              'Outline incentives and guardrails for a multi-sided referral program.',
            labels: ['Growth'],
            dueDate: new Date('2025-04-12'),
            priority: 'medium',
            assignees: [{ name: 'Jamie Fox', initials: 'JF' }],
          },
        ],
      },
      {
        name: 'Design',
        tasks: [
          {
            title: 'Lifecycle email refresh',
            description:
              'Rework onboarding email series with new activation milestones.',
            labels: ['Lifecycle', 'Email'],
            dueDate: new Date('2025-04-14'),
            priority: 'high',
            assignees: [{ name: 'Riley Jones', initials: 'RJ' }],
          },
        ],
      },
      {
        name: 'Experimenting',
        tasks: [
          {
            title: 'Landing page A/B test',
            description:
              'Run a split test on the hero CTA and social proof module.',
            labels: ['Experiment'],
            dueDate: new Date('2025-04-16'),
            priority: 'low',
            assignees: [
              { name: 'Dev Anand', initials: 'DA' },
              { name: 'Min Lee', initials: 'ML' },
            ],
          },
        ],
      },
    ],
  },
]

// Collect all label names used across the seed data.
const collectUniqueLabels = (boards: typeof seedBoards) => {
  const labels = new Set<string>()
  for (const board of boards) {
    for (const column of board.columns) {
      for (const task of column.tasks) {
        for (const label of task.labels) {
          labels.add(label)
        }
      }
    }
  }
  return [...labels]
}

// Collect unique assignees by name so we can connect them later.
const collectUniqueAssignees = (boards: typeof seedBoards) => {
  const assignees = new Map<string, { name: string; initials: string }>()
  for (const board of boards) {
    for (const column of board.columns) {
      for (const task of column.tasks) {
        for (const assignee of task.assignees) {
          assignees.set(assignee.name, assignee)
        }
      }
    }
  }
  return [...assignees.values()]
}

// Reset the database to a clean state for repeatable seeding.
const clearDatabase = async () => {
  await prisma.taskLabel.deleteMany()
  await prisma.taskAssignee.deleteMany()
  await prisma.task.deleteMany()
  await prisma.column.deleteMany()
  await prisma.board.deleteMany()
  await prisma.label.deleteMany()
  await prisma.assignee.deleteMany()
}

// Seed labels and assignees first so tasks can connect by name.
const seedReferenceData = async () => {
  const labels = collectUniqueLabels(seedBoards)
  const assignees = collectUniqueAssignees(seedBoards)

  await prisma.label.createMany({
    data: labels.map((name) => ({ name })),
  })

  await prisma.assignee.createMany({
    data: assignees.map((assignee) => ({
      name: assignee.name,
      initials: assignee.initials,
    })),
  })
}

// Create boards, columns, and tasks in order so ordering stays stable.
const seedBoardsAndTasks = async () => {
  for (const board of seedBoards) {
    const createdBoard = await prisma.board.create({
      data: {
        name: board.name,
        description: board.description,
      },
    })

    for (const [columnIndex, column] of board.columns.entries()) {
      const createdColumn = await prisma.column.create({
        data: {
          name: column.name,
          order: columnIndex,
          boardId: createdBoard.id,
        },
      })

      for (const [taskIndex, task] of column.tasks.entries()) {
        await prisma.task.create({
          data: {
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority as $Enums.TaskPriority,
            order: taskIndex,
            columnId: createdColumn.id,
            labels: {
              create: task.labels.map((label) => ({
                label: { connect: { name: label } },
              })),
            },
            assignees: {
              create: task.assignees.map((assignee) => ({
                assignee: { connect: { name: assignee.name } },
              })),
            },
          },
        })
      }
    }
  }
}

// Seed flow focuses on repeatability: clear, seed reference data, then build boards.
const main = async () => {
  await clearDatabase()
  await seedReferenceData()
  await seedBoardsAndTasks()
}

try {
  await main()
} catch (error) {
  console.error(error)
  throw error
} finally {
  await prisma.$disconnect()
}
