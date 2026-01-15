# Implementation Log

Project: Task Board (Project 1)
Approach: Small, documented steps with short lessons.

---

## Roadmap (high level)

1. ✅ shadcn/ui setup + base UI primitives.
2. ✅ Routes/layouts with mock data.
3. ✅ Kanban UI + task detail modal.
4. ✅ Enhanced UI + theme integration + filtering.
5. 🔄 Drag-and-drop and optimistic UI.
6. ⏳ Prisma schema + SQLite wiring.
7. ⏳ Server Actions for CRUD.
8. ⏳ Task metadata + Zod validation.
9. ⏳ Polish + accessibility.
10. ⏳ Optional: sharing + real-time ordering.

**Legend:** ✅ Complete | 🔄 In Progress | ⏳ Not Started

---

## Step 1 - shadcn/ui setup ✅

**Status:** Complete

**Lesson:** Tailwind v4 uses a CSS entrypoint instead of a `tailwind.config.js`.
In this repo, it lives at `app/lib/styles/globals.css` and is imported by
`app/layout.tsx`. shadcn/ui should point to that file during init.

**Goal:**
- Initialize shadcn/ui and generate `components.json`.

**Deliverables:**
- ✅ `components.json` configured for Next + Tailwind v4.
- ✅ `lib/utils` (for `cn`) and base styles wired.

**What we learned:**
- Tailwind v4 beta requires CSS-first configuration
- shadcn/ui integrates seamlessly with modern Next.js

---

## Step 2 - Core UI primitives ✅

**Status:** Complete

**Lesson:** Building shared UI primitives early reduces rework in layout and
interaction code.

**Goal:**
- Add the UI blocks used across the Task Board.
- Convert the theme switch to a shadcn/ui button for consistency.

**Deliverables:**
- ✅ Card, Dialog, Badge, Avatar, DropdownMenu, Tooltip components installed.
- ✅ Theme switch uses shadcn/ui `Button`.

**What we learned:**
- shadcn/ui components are installed individually (no bloat)
- Each component is fully owned and customizable
- Radix primitives provide solid accessibility foundation

---

## Step 3 - Routes and layouts (mock data) ✅

**Status:** Complete

**Lesson:** Layouts are easier to refine when the data is predictable and fake.

**Goal:**
- Scaffold routes and layouts with static mock data.

**Deliverables:**
- ✅ `/` dashboard with board listings
- ✅ `/boards/[id]` board view with columns
- ✅ `/boards/[id]/task/[taskId]` intercepting route for modal
- ✅ Mock data structure in `app/lib/data/task-board.ts`

**What we learned:**
- Next.js 15+ requires awaiting `params` (breaking change)
- Intercepting routes with `@modal/(.)` enable modal UX
- Parallel routes (@modal) allow soft vs hard navigation

**Key files:**
- `app/boards/[id]/page.tsx` - Board page (server component)
- `app/boards/[id]/@modal/(.)task/[taskId]/page.tsx` - Task modal
- `app/boards/[id]/task/[taskId]/page.tsx` - Task full page
- `app/lib/data/task-board.ts` - Data and types

---

## Step 4 - Kanban UI + task modal ✅

**Status:** Complete

**Lesson:** Establish visual hierarchy before adding drag-and-drop.

**Goal:**
- Render columns and tasks with a usable layout.
- Show task details in a modal overlay.

**Deliverables:**
- ✅ Columns layout with task cards
- ✅ Task detail modal with metadata
- ✅ Professional design with Supabase-style colors
- ✅ Responsive layout

**What we learned:**
- Server/Client component split pattern (`page.tsx` → `*-content.tsx`)
- oklch color space for better color interpolation
- Gradient overlays for visual depth

**Key files:**
- `app/boards/[id]/board-content.tsx` - Client component with state
- `app/components/task-card/task-card.tsx` - Task card component
- `app/components/task-detail/task-detail.tsx` - Task detail content
- `app/lib/styles/globals.css` - Theme colors

---

## Step 4.5 - Enhanced UI & Features ✅

**Status:** Complete (additional enhancements)

**Lessons learned:**
1. **Theme integration** - Fixed positioning conflicts with app structure
2. **Filtering patterns** - Client-side filtering with `useMemo` for performance
3. **Badge variants** - Visual hierarchy with shadcn/ui badge system
4. **Tooltip UX** - Improves information density without clutter

**Enhancements delivered:**
- ✅ App header with navigation and theme switcher
- ✅ Floating action button for quick task creation
- ✅ Task priority system (urgent, high, medium, low)
- ✅ Status indicators (overdue, due soon)
- ✅ Board filtering by priority, labels, and empty columns
- ✅ Avatar tooltips showing assignee names
- ✅ Empty states for better UX
- ✅ Context menu actions (edit, delete, duplicate)

**What we learned:**
- Filter state management with React hooks
- Computed values with `useMemo` prevent unnecessary re-renders
- Helper functions improve maintainability (`getPriorityVariant`, `isTaskOverdue`)
- Strategic use of shadcn/ui components (DropdownMenuCheckboxItem, Tooltip)

**Key files:**
- `app/components/app-header/app-header.tsx` - Global navigation
- `app/components/board-filters/board-filters.tsx` - Filter component
- `app/components/floating-action-button/floating-action-button.tsx` - FAB
- `app/components/theme-switch/theme-switch.tsx` - Theme toggle (moved to header)

**Helper functions added:**
```typescript
// app/lib/data/task-board.ts
getPriorityVariant(priority): BadgeVariant
isTaskOverdue(dueDate): boolean
isTaskDueSoon(dueDate): boolean
getTaskById(boardId, taskId): {...} | null
countBoardTasks(board): number
```

---

## Step 5 - Drag-and-drop interactions

Lesson: DnD should be client-only and isolated to avoid server rerenders.

Goal:
- Allow moving tasks between columns and reordering.

Deliverables:
- DnD with `@dnd-kit` for tasks.
- Optimistic UI updates on move.

Next action:
- Add DnD providers and handlers with optimistic state.

---

## Step 6 - Prisma schema + SQLite

Lesson: A good schema makes server actions and validation simpler.

Goal:
- Define database models for Board, Column, and Task.

Deliverables:
- Prisma schema aligned with the spec.
- SQLite setup for local dev.

Next action:
- Add Prisma and generate the client.

---

## Step 7 - Server Actions for CRUD

Lesson: Server Actions keep mutation logic close to the UI.

Goal:
- Create, update, delete boards, columns, and tasks.

Deliverables:
- Actions for CRUD.
- `revalidatePath` for relevant pages.

Next action:
- Implement actions and wire to forms.

---

## Step 8 - Task metadata + Zod

Lesson: Validation is easier if added before data fan-out.

Goal:
- Add labels, due dates, assignees.
- Validate payloads with Zod.

Deliverables:
- Metadata UI in task modal.
- Zod schemas shared between form and action.

Next action:
- Create schemas and connect to UI.

---

## Step 9 - Polish and a11y

Lesson: UI polish is fastest once behavior is stable.

Goal:
- Loading, empty states, errors, and accessibility checks.

Deliverables:
- Loading skeletons and empty states.
- Error boundaries and basic a11y pass.

Next action:
- Add loading/error UI and run quick checks.

---

## Step 10 - Optional enhancements

Lesson: Optional features are safer after core flows are stable.

Goal:
- Sharing URLs and/or real-time ordering.

Deliverables:
- Unique share URLs.
- Optional real-time updates (if chosen).

Next action:
- Decide on scope and implement incrementally.
