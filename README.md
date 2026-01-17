# Task Board - Learning Next.js

A modern task board application built to learn Next.js 15 concepts
incrementally. This document tracks our implementation progress, learnings, and
serves as a comprehensive guide to the project.

---

## 📋 Project Overview

This is a kanban-style task board where you can organize tasks across columns,
filter by priority and labels, and view task details in a modal overlay. Built
with a focus on learning Next.js features step-by-step.

### Tech Stack

- **Next.js 16** - App Router, Server Components, Metadata API
- **React 19** - Server Components, Client Components, hooks
- **TypeScript** - Full type safety
- **Tailwind CSS 4** - Utility-first styling with oklch colors
- **shadcn/ui** - High-quality UI components built on Radix
- **next-themes** - Theme management (light/dark/system)

### Quick Start

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open http://localhost:3000
```

---

## 🚀 Implementation Progress

### Roadmap

1. ✅ shadcn/ui setup + base UI primitives
2. ✅ Routes/layouts with mock data
3. ✅ Kanban UI + task detail modal
4. ✅ Enhanced UI + theme integration + filtering
5. ✅ Extract business logic into lib modules
6. 🔄 Drag-and-drop and optimistic UI
7. ⏳ Prisma schema + SQLite wiring
8. ⏳ Server Actions for CRUD
9. ⏳ Task metadata + Zod validation
10. ⏳ Polish + accessibility
11. ⏳ Optional: sharing + real-time ordering

**Legend:** ✅ Complete | 🔄 In Progress | ⏳ Not Started

---

## 📚 Implementation Steps

### Step 1 - shadcn/ui Setup ✅

**Lesson:** Tailwind v4 uses a CSS entrypoint instead of a `tailwind.config.js`.
In this repo, it lives at `app/lib/styles/globals.css` and is imported by
`app/layout.tsx`.

**Deliverables:**

- ✅ `components.json` configured for Next + Tailwind v4
- ✅ `lib/utils` (for `cn`) and base styles wired

**What we learned:**

- Tailwind v4 beta requires CSS-first configuration
- shadcn/ui integrates seamlessly with modern Next.js

---

### Step 2 - Core UI Primitives ✅

**Lesson:** Building shared UI primitives early reduces rework in layout and
interaction code.

**Deliverables:**

- ✅ Card, Dialog, Badge, Avatar, DropdownMenu, Tooltip components installed
- ✅ Theme switch uses shadcn/ui `Button`

**What we learned:**

- shadcn/ui components are installed individually (no bloat)
- Each component is fully owned and customizable
- Radix primitives provide solid accessibility foundation

**Components added:**

```bash
npx shadcn@latest add card dialog badge avatar dropdown-menu tooltip button
```

---

### Step 3 - Routes and Layouts ✅

**Lesson:** Layouts are easier to refine when the data is predictable and fake.
Also, Next.js 15+ introduced a breaking change where `params` is now a Promise.

**Deliverables:**

- ✅ `/` dashboard with board listings
- ✅ `/boards/[id]` board view with columns
- ✅ `/boards/[id]/task/[taskId]` intercepting route for modal
- ✅ Mock data structure in `app/lib/data/task-board.ts`

**What we learned:**

- **Next.js 15+ Breaking Change**: Route params are now Promises and must be
  awaited
- Intercepting routes with `@modal/(.)` enable modal UX
- Parallel routes (@modal) allow soft vs hard navigation

**Critical pattern - Async params:**

```typescript
// ❌ Old way (Next.js 14)
type PageProps = {
  params: { id: string }
}

// ✅ New way (Next.js 15+)
type PageProps = {
  params: Promise<{ id: string }>
}

const Page = async (props: PageProps) => {
  const { id } = await props.params // Must await!
  // ...
}
```

**Intercepting routes structure:**

```
app/
  boards/
    [id]/
      @modal/              # Parallel route slot
        (.)task/           # Intercepts /boards/[id]/task/[taskId]
          [taskId]/
            page.tsx       # Modal view (soft navigation)
      task/
        [taskId]/
          page.tsx         # Full page view (hard navigation)
      page.tsx             # Board view
```

**Key files:**

- `app/boards/[id]/page.tsx` - Board page (server component)
- `app/boards/[id]/@modal/(.)task/[taskId]/page.tsx` - Task modal
- `app/boards/[id]/task/[taskId]/page.tsx` - Task full page
- `app/lib/data/task-board.ts` - Mock data and types

---

### Step 4 - Kanban UI + Task Modal ✅

**Lesson:** Establish visual hierarchy before adding drag-and-drop. Also learned
the importance of splitting Server and Client components strategically.

**Deliverables:**

- ✅ Columns layout with task cards
- ✅ Task detail modal with metadata
- ✅ Professional design with Supabase-style emerald colors
- ✅ Responsive layout with gradients

**What we learned:**

- **Server/Client split pattern**: `page.tsx` (server) → `*-content.tsx`
  (client)
- oklch color space for better color interpolation in dark mode
- Gradient overlays create visual depth
- Use Server Components for data fetching, Client Components for interactivity

**Color system (oklch):**

```css
/* Emerald green primary (Supabase-style) */
--primary: oklch(0.55 0.17 165);
--primary-foreground: oklch(0.99 0 0);
```

**Key files:**

- `app/boards/[id]/board-content.tsx` - Client component with state
- `app/components/task-card/task-card.tsx` - Task card component
- `app/components/task-detail/task-detail.tsx` - Task detail content
- `app/lib/styles/globals.css` - Theme colors

---

### Step 4.5 - Enhanced UI & Features ✅

**Lessons learned:**

1. **Theme integration** - Fixed positioning conflicts with app structure
2. **Filtering patterns** - Client-side filtering with `useMemo` for performance
3. **Badge variants** - Visual hierarchy with shadcn/ui badge system
4. **Tooltip UX** - Improves information density without clutter
5. **Memoization** - Prevent unnecessary re-renders with expensive computations

**Enhancements delivered:**

- ✅ App header with navigation and theme switcher
- ✅ Floating action button for quick task creation
- ✅ Task priority system (urgent, high, medium, low)
- ✅ Status indicators (overdue, due soon)
- ✅ Board filtering by priority, labels, and empty columns
- ✅ Avatar tooltips showing assignee names
- ✅ Empty states for better UX
- ✅ Context menu actions (edit, delete, duplicate)

**Filtering implementation:**

```typescript
// Client component with filtering state
const [filters, setFilters] = useState<BoardFilters>({
  priorities: [],
  labels: [],
  showEmpty: true,
})

// Memoized filtering for performance
const filteredColumns = useMemo(() => {
  return board.columns
    .map((column) => {
      const filteredTasks = column.tasks.filter((task) => {
        if (
          filters.priorities.length > 0 &&
          !filters.priorities.includes(task.priority)
        ) {
          return false
        }
        if (filters.labels.length > 0) {
          const hasMatchingLabel = task.labels.some((label) =>
            filters.labels.includes(label)
          )
          if (!hasMatchingLabel) return false
        }
        return true
      })
      return { ...column, tasks: filteredTasks }
    })
    .filter((column) => filters.showEmpty || column.tasks.length > 0)
}, [board, filters])
```

**Helper functions added:**

```typescript
// app/lib/data/task-board.ts

// Badge variant based on priority
getPriorityVariant(priority: TaskPriority): BadgeVariant
// urgent → destructive (red)
// high → default (green)
// medium → secondary (gray)
// low → outline (border only)

// Date-based status checks
isTaskOverdue(dueDate: string): boolean
isTaskDueSoon(dueDate: string): boolean  // Within 3 days

// Data access
getBoardById(id: string): Board | undefined
getTaskById(boardId: string, taskId: string): {...} | null
countBoardTasks(board: Board): number
```

**Key files:**

- `app/components/app-header/app-header.tsx` - Global navigation
- `app/components/board-filters/board-filters.tsx` - Filter component
- `app/components/floating-action-button/floating-action-button.tsx` - FAB
- `app/components/theme-switch/theme-switch.tsx` - Theme toggle (moved to
  header)
- `app/components/ui/tooltip.tsx` - Tooltip primitive

---

### Step 5 - Drag-and-Drop Interactions 🔄

**Status:** Not started (next step)

**Lesson:** DnD should be client-only and isolated to avoid server rerenders.

**Goal:**

- Allow moving tasks between columns and reordering
- Implement optimistic UI updates

**Planned deliverables:**

- DnD with `@dnd-kit` for tasks
- Optimistic UI updates on move
- Visual feedback during drag operations

---

## 🎓 Key Next.js Concepts Learned

### 1. App Router Architecture

- File-based routing with `app/` directory
- Route groups for organization without URL segments: `(group)/`
- Nested layouts for shared UI across routes
- Parallel routes with `@slot` syntax

### 2. Server vs Client Components

**Server Components (default):**

- Fetch data directly from backend
- Access environment variables securely
- Reduce client-side JavaScript bundle
- Cannot use hooks, event handlers, or browser APIs

**Client Components (`'use client'`):**

- Interactive state with hooks (`useState`, `useEffect`)
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`localStorage`, `window`)
- Third-party libraries that use hooks

**Strategic pattern:**

```typescript
// app/boards/[id]/page.tsx (Server Component)
const BoardPage = async (props: PageProps) => {
  const { id } = await props.params
  const board = getBoardById(id)  // Data fetching
  return <BoardContent board={board} />  // Pass to client
}

// app/boards/[id]/board-content.tsx (Client Component)
'use client'
export const BoardContent = ({ board }: Props) => {
  const [filters, setFilters] = useState(...)  // Client state
  // Interactive UI
}
```

### 3. Dynamic Routes with Promises (Next.js 15+)

**Breaking change in Next.js 15:**

```typescript
// Route params are now Promises
type PageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

const Page = async (props: PageProps) => {
  const { id } = await props.params
  const searchParams = await props.searchParams
  // ...
}
```

### 4. Intercepting Routes for Modals

Creates smooth modal UX while maintaining shareable URLs:

```
@modal/(.)task/[taskId]  → Modal overlay when navigating from board
task/[taskId]            → Full page when accessing URL directly
```

**How it works:**

- Click task card → Soft navigation → Shows modal
- Copy/paste URL → Hard navigation → Shows full page
- Both share the same URL structure

### 5. Metadata API

**Dynamic metadata:**

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

**Benefits:**

- SEO-friendly without manual head management
- Type-safe metadata generation
- Automatic deduplication

### 6. Component Patterns

**Server → Client data flow:**

- Fetch data in Server Component
- Pass as props to Client Component
- Client handles interactivity

**Memoization for performance:**

```typescript
const filteredData = useMemo(() => {
  return expensiveOperation(data, filters)
}, [data, filters]) // Only recompute when dependencies change
```

### 7. Styling Best Practices

**Tailwind CSS 4:**

- CSS-first configuration in `globals.css`
- No `tailwind.config.js` needed
- oklch color space for better gradients

**Component variants with cn():**

```typescript
import { cn } from '@/lib/utils'

<div className={cn(
  'base-classes',
  variant === 'primary' && 'primary-classes',
  variant === 'secondary' && 'secondary-classes'
)} />
```

### 8. shadcn/ui Integration

**Philosophy:**

- Install components individually (no package dependency)
- Own the code (components live in your repo)
- Built on Radix UI primitives (accessibility included)
- Fully customizable

**Usage:**

```bash
# Add specific components
npx shadcn@latest add card badge avatar

# Components appear in app/components/ui/
# You own and can modify them
```

---

## 📁 Project Structure

```
app/
├── boards/
│   └── [id]/                       # Dynamic board route
│       ├── @modal/                 # Parallel route slot for modals
│       │   └── (.)task/            # Intercepts /boards/[id]/task/[taskId]
│       │       └── [taskId]/
│       │           └── page.tsx    # Modal view (soft navigation)
│       ├── task/
│       │   └── [taskId]/
│       │       └── page.tsx        # Full page view (hard navigation)
│       ├── board-content.tsx       # Client component with filtering state
│       └── page.tsx                # Server component (data fetching)
├── components/
│   ├── ui/                         # shadcn/ui components
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── tooltip.tsx
│   │   └── ...
│   ├── app-header/                 # Global navigation header
│   ├── board-filters/              # Filter dropdown component
│   ├── task-card/                  # Task card with badges & tooltips
│   ├── task-detail/                # Task detail content
│   ├── theme-switch/               # Theme toggle button
│   ├── floating-action-button/     # FAB for quick actions
│   ├── empty-state/                # Empty state component
│   └── global-providers/           # Theme & other providers
├── lib/
│   ├── data/
│   │   └── task-board.ts           # Mock data, types, helpers
│   ├── styles/
│   │   └── globals.css             # Tailwind v4 entrypoint + theme
│   └── utils.ts                    # cn() utility
├── layout.tsx                      # Root layout with providers
└── page.tsx                        # Homepage with board listings
```

---

## 🛠️ Development Commands

| Command              | Description                             |
| -------------------- | --------------------------------------- |
| `pnpm dev`           | Start development server with Turbopack |
| `pnpm build`         | Create production build                 |
| `pnpm start`         | Run production server                   |
| `pnpm test`          | Run unit tests                          |
| `pnpm test:browser`  | Run browser tests                       |
| `pnpm lint:es`       | Lint and fix with ESLint                |
| `pnpm lint:es:check` | Check ESLint without fixing             |
| `pnpm lint:ts`       | TypeScript type checking                |
| `pnpm format`        | Format with Prettier                    |
| `pnpm format:check`  | Check formatting                        |

---

## ✨ Current Features

- ✅ Multiple boards with unique routes
- ✅ Task columns (Backlog, In Progress, Done)
- ✅ Task cards with priority indicators
- ✅ Priority badges (urgent=red, high=green, medium=gray, low=outline)
- ✅ Status badges (Overdue, Due Soon)
- ✅ Filter by priority and labels
- ✅ Toggle empty columns visibility
- ✅ Task detail modal (intercepting route)
- ✅ Theme switcher (light/dark/system) in header
- ✅ Responsive design with gradients
- ✅ Avatar tooltips showing assignee names
- ✅ App header with navigation
- ✅ Floating action button
- ✅ Empty states for better UX
- ✅ Context menu actions (edit, delete, duplicate)

---

## 💡 Key Learnings Summary

1. **Server Components are the default** - Use client components sparingly for
   interactivity only
2. **Route organization matters** - Intercepting routes enable smooth modal UX
   with shareable URLs
3. **Params are Promises in Next.js 15+** - Always await them in dynamic routes
4. **Split server/client strategically** - Fetch data on server, handle state on
   client
5. **Tailwind v4 uses CSS entrypoint** - No more `tailwind.config.js`, configure
   in CSS
6. **shadcn/ui is component-first** - Install only what you need, own the code
7. **Type safety everywhere** - TypeScript + strict mode catches errors early
8. **Metadata API is powerful** - SEO without manual head tags
9. **Memoization prevents waste** - Use `useMemo` for expensive
   filtering/computation
10. **oklch colors interpolate better** - Especially for dark mode transitions

---

## 🐛 Troubleshooting

### 404 on Dynamic Routes

**Problem:** Getting 404 errors on `/boards/[id]` routes

**Solution:**

- Ensure params are awaited: `const { id } = await props.params`
- Check route structure matches Next.js App Router conventions
- Verify dynamic segment folder is named with brackets: `[id]`

### Theme Not Persisting

**Problem:** Theme resets on page reload

**Solution:**

- Verify `next-themes` ThemeProvider wraps your app in root layout
- Check localStorage is enabled in browser
- Ensure `suppressHydrationWarning` on `<html>` tag

### Components Not Updating

**Problem:** Changes not reflecting in UI

**Solution:**

- Verify `'use client'` directive at top of file for stateful components
- Check if state is lifted to appropriate component level
- Ensure dependencies array in `useMemo`/`useEffect` is correct

### Type Errors with Params

**Problem:** TypeScript errors: "params is not a Promise"

**Solution:**

- Update type definition: `params: Promise<{ id: string }>`
- Await params: `const { id } = await props.params`
- This is a Next.js 15+ breaking change

---

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS v4 Beta](https://tailwindcss.com/docs/v4-beta)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [React 19 Documentation](https://react.dev)

---

## 🎯 What's Next

**Immediate next step:** Step 5 - Drag-and-Drop Interactions

We'll implement:

- Task reordering within columns
- Moving tasks between columns
- Optimistic UI updates
- Visual feedback during drag operations
- Using `@dnd-kit` library

This will teach us about:

- Client-side state management for DnD
- Optimistic updates before server confirmation
- Complex interaction patterns in React

---

**Last updated:** After completing Step 4.5 (Enhanced UI & Features)

Built while learning Next.js incrementally. This document is continuously
updated with each implementation step.
