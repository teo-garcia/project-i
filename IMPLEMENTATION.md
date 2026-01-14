# Implementation Log

Project: Task Board (Project 1)
Approach: Small, documented steps with short lessons.

---

## Roadmap (high level)

1. shadcn/ui setup + base UI primitives.
2. Routes/layouts with mock data.
3. Kanban UI + task detail modal.
4. Drag-and-drop and optimistic UI.
5. Prisma schema + SQLite wiring.
6. Server Actions for CRUD.
7. Task metadata + Zod validation.
8. Polish + accessibility.
9. Optional: sharing + real-time ordering.

---

## Step 1 - shadcn/ui setup

Lesson: Tailwind v4 uses a CSS entrypoint instead of a `tailwind.config.js`.
In this repo, it lives at `app/lib/styles/globals.css` and is imported by
`app/layout.tsx`. shadcn/ui should point to that file during init.

Goal:
- Initialize shadcn/ui and generate `components.json`.

Deliverables:
- `components.json` configured for Next + Tailwind v4.
- `lib/utils` (for `cn`) and base styles wired.

Next action:
- Run `pnpm dlx shadcn@latest init` and select `app/lib/styles/globals.css`.

---

## Step 2 - Core UI primitives

Lesson: Building shared UI primitives early reduces rework in layout and
interaction code.

Goal:
- Add the UI blocks used across the Task Board.

Deliverables:
- Card, Dialog, Badge, Avatar, DropdownMenu components installed.

Next action:
- Use the shadcn CLI to add each component after init.

---

## Step 3 - Routes and layouts (mock data)

Lesson: Layouts are easier to refine when the data is predictable and fake.

Goal:
- Scaffold routes and layouts with static mock data.

Deliverables:
- `/` dashboard.
- `/boards/[id]` board view.
- `/boards/[id]/task/[taskId]` intercepting route for modal.

Next action:
- Create route structure + stub UI with placeholders.

---

## Step 4 - Kanban UI + task modal

Lesson: Establish visual hierarchy before adding drag-and-drop.

Goal:
- Render columns and tasks with a usable layout.
- Show task details in a modal overlay.

Deliverables:
- Columns layout + task cards.
- Task detail modal with basic fields.

Next action:
- Build board UI and modal with client components.

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
