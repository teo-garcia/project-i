# Task Board - Learning Next.js

A modern task board application built to learn Next.js 15 concepts incrementally. This project demonstrates the App Router, Server Components, intercepting routes, and modern React patterns.

## Project Overview

This is a kanban-style task board where you can organize tasks across columns, filter by priority and labels, and view task details in a modal overlay. Built with a focus on learning Next.js features step-by-step.

## Tech Stack

- **Next.js 16** - App Router, Server Components, Metadata API
- **React 19** - Server Components, Client Components, hooks
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Utility-first styling with oklch colors
- **shadcn/ui** - High-quality UI components built on Radix
- **next-themes** - Theme management (light/dark/system)

## Key Next.js Concepts Learned

### 1. App Router Architecture
- File-based routing with `app/` directory
- Route groups for organization without URL segments
- Nested layouts for shared UI across routes

### 2. Server vs Client Components
- **Server Components** (default): Fetch data, access backend directly, reduce client JS
- **Client Components** (`'use client'`): Interactive state, event handlers, browser APIs
- Strategic placement: server for data fetching, client for interactivity

### 3. Dynamic Routes with Promises (Next.js 15+)
```typescript
// Breaking change: params is now a Promise
type PageProps = {
  params: Promise<{ id: string }>
}

const Page = async (props: PageProps) => {
  const { id } = await props.params  // Must await!
  // ...
}
```

### 4. Intercepting Routes for Modals
```
app/
  boards/
    [id]/
      @modal/              # Parallel route slot
        (.)task/           # Intercepts /boards/[id]/task/[taskId]
          [taskId]/
            page.tsx       # Modal view
      task/
        [taskId]/
          page.tsx         # Full page view (hard navigation)
      page.tsx             # Board view
```
- Soft navigation (clicking from board) → shows modal
- Hard navigation (URL direct) → shows full page
- Clean URLs with `@modal/(.)` convention

### 5. Metadata API
```typescript
export const generateMetadata = async (props: PageProps): Promise<Metadata> => {
  const { id } = await props.params
  const board = getBoardById(id)
  return {
    title: `${board.name} | Task Board`,
    description: board.description,
  }
}
```
- Dynamic and static metadata
- SEO-friendly without manual head management

### 6. Component Patterns
- **Server → Client data flow**: Pass props from Server to Client Components
- **Client state with Server rendering**: Split into `page.tsx` (server) and `*-content.tsx` (client)
- **Memoization**: `useMemo` for expensive filtering operations

### 7. Styling Best Practices
- Tailwind with oklch color space for better color interpolation
- CSS variables in `globals.css` for theme tokens
- Component variants with `cn()` utility
- Responsive design with Tailwind breakpoints

### 8. shadcn/ui Integration
- Component library built on Radix primitives
- Installed per-component (no bloat)
- Fully customizable and owns the code
- Examples: Card, Badge, Avatar, Tooltip, DropdownMenu

## Current Features

- ✅ Multiple boards with unique routes
- ✅ Task columns (Backlog, In Progress, Done)
- ✅ Task cards with priority indicators
- ✅ Priority badges (urgent, high, medium, low)
- ✅ Status badges (Overdue, Due Soon)
- ✅ Filter by priority and labels
- ✅ Toggle empty columns visibility
- ✅ Task detail modal (intercepting route)
- ✅ Theme switcher (light/dark/system)
- ✅ Responsive design
- ✅ Avatar tooltips showing assignee names
- ✅ App header with navigation
- ✅ Floating action button
- ✅ Empty states

## Project Structure

```
app/
├── boards/
│   └── [id]/                    # Dynamic board route
│       ├── @modal/              # Parallel route for modals
│       │   └── (.)task/         # Intercepts task detail
│       │       └── [taskId]/    # Task modal view
│       ├── task/
│       │   └── [taskId]/        # Task full page view
│       ├── board-content.tsx    # Client component with filtering
│       └── page.tsx             # Server component
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── app-header/              # Global navigation
│   ├── board-filters/           # Filter dropdown
│   ├── task-card/               # Task card with badges
│   ├── task-detail/             # Task detail content
│   ├── theme-switch/            # Theme toggle button
│   └── ...
├── lib/
│   ├── data/
│   │   └── task-board.ts        # Mock data and helper functions
│   └── styles/
│       └── globals.css          # Tailwind v4 entrypoint
└── layout.tsx                   # Root layout with providers
```

## Helper Functions

Located in `app/lib/data/task-board.ts`:

```typescript
// Badge variant based on priority
getPriorityVariant(priority: TaskPriority): BadgeVariant

// Check if task is overdue
isTaskOverdue(dueDate: string): boolean

// Check if task is due within 3 days
isTaskDueSoon(dueDate: string): boolean

// Get board by ID
getBoardById(id: string): Board | undefined

// Get task by board and task ID
getTaskById(boardId: string, taskId: string): {...} | null
```

## Development Workflow

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Type checking
pnpm lint:ts

# Linting
pnpm lint:es

# Format code
pnpm format
```

## What's Next

According to `IMPLEMENTATION.md`, we're ready for:

**Step 5 - Drag-and-Drop Interactions**
- Implement task reordering with `@dnd-kit`
- Move tasks between columns
- Optimistic UI updates

See `IMPLEMENTATION.md` for the full roadmap.

## Key Learnings Summary

1. **Server Components are the default** - Use client components sparingly for interactivity
2. **Route organization matters** - Intercepting routes enable smooth modal UX
3. **Params are Promises in Next.js 15+** - Always await them
4. **Split server/client strategically** - Fetch on server, handle state on client
5. **Tailwind v4 uses CSS entrypoint** - No more `tailwind.config.js`
6. **shadcn/ui is component-first** - Install only what you need
7. **Type safety everywhere** - TypeScript + strict mode catches errors early
8. **Metadata API is powerful** - SEO without manual head tags

## Troubleshooting

### 404 on Dynamic Routes
- Ensure params are awaited: `const { id } = await props.params`
- Check route structure matches Next.js conventions

### Theme Not Persisting
- Verify `next-themes` ThemeProvider in root layout
- Check localStorage is enabled in browser

### Components Not Updating
- Verify `'use client'` directive for stateful components
- Check if state is lifted to appropriate component level

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS v4 Beta](https://tailwindcss.com/docs/v4-beta)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)

---

Built while learning Next.js incrementally. See `IMPLEMENTATION.md` for step-by-step progress.
