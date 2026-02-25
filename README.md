# Task Board

<p align="center">
  Kanban-style task management built with Next.js App Router, Prisma, and SQLite.
</p>

<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-16-black" />
  <img alt="React" src="https://img.shields.io/badge/React-19-149ECA" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-3178C6" />
  <img alt="Prisma" src="https://img.shields.io/badge/Prisma-ORM-2D3748" />
  <img alt="SQLite" src="https://img.shields.io/badge/SQLite-Local%20DB-003B57" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind-4-06B6D4" />
</p>

A modern, production-style learning project focused on:

- App Router architecture
- Server Actions + validation
- Optimistic drag-and-drop updates
- Polished UI patterns for real workflows

## Demo

### Main Workflow (GIF placeholder)

![Main Workflow Placeholder](docs/media/demo-main-workflow.gif)

### Screenshots (image placeholders)

![Boards Home Placeholder](docs/media/screenshot-boards-home.png)
![Board Detail Placeholder](docs/media/screenshot-board-detail.png)
![Task Modal Placeholder](docs/media/screenshot-task-modal.png)
![Task Full Page Placeholder](docs/media/screenshot-task-page.png)

## Features

- Multi-board workspace with dedicated board routes
- Kanban columns and sortable task cards
- Drag-and-drop across columns with optimistic UI
- Task detail in modal and full page route
- Task actions: create, edit, duplicate, delete
- Board actions: create, edit, delete
- Filters for priority, labels, and empty columns
- Priority and due-date status indicators
- Theme switching (light/dark/system)
- Prisma-backed persistence with SQLite

## Tech Stack

| Layer      | Technology                                                 |
| ---------- | ---------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Server Components, Server Actions) |
| UI         | React 19, Tailwind CSS 4, shadcn/ui, Radix UI              |
| Data       | Prisma ORM, SQLite                                         |
| Language   | TypeScript                                                 |
| Validation | Zod                                                        |
| DnD        | dnd-kit                                                    |
| Tooling    | ESLint, Prettier, Vitest                                   |

## Quick Start

### Prerequisites

- Node.js `>= 22`
- `pnpm`

### 1. Install

```bash
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

### 3. Initialize database

```bash
pnpm db:migrate
pnpm db:seed
```

### 4. Run locally

```bash
pnpm dev
```

Open your local app URL (from `.env`) in the browser.

## Environment Variables

| Variable          | Description              |
| ----------------- | ------------------------ |
| `APP_PORT`        | Local app port           |
| `NEXT_PUBLIC_URL` | Public app base URL      |
| `DATABASE_URL`    | SQLite connection string |

## Scripts

| Command              | Purpose               |
| -------------------- | --------------------- |
| `pnpm dev`           | Start dev server      |
| `pnpm build`         | Production build      |
| `pnpm start`         | Run production server |
| `pnpm db:migrate`    | Run Prisma migrations |
| `pnpm db:seed`       | Seed sample data      |
| `pnpm lint:es:check` | ESLint checks         |
| `pnpm lint:ts`       | TypeScript check      |
| `pnpm test -- --run` | Run tests             |

## Implementation Plan And Progress

Status date: **February 17, 2026**

### Completed

- [x] 1. Base UI primitives (shadcn/ui)
- [x] 2. App Router routes + layouts
- [x] 3. Kanban UI + task detail modal
- [x] 4. Filters + theme integration
- [x] 5. Business logic in `app/lib`
- [x] 6. Drag-and-drop + optimistic UI
- [x] 7. Prisma schema + SQLite wiring
- [x] 8. Server Actions for CRUD
- [x] 9. Zod validation for inputs
- [x] 10. Wire update/delete flows in UI

### Recent Delivered Changes

- [x] Task and board update/delete flows wired from UI to server actions
- [x] Update/delete input validation added with field-level error returns
- [x] Drag-and-drop resequencing fixed to use transaction client consistently
- [x] Toast infrastructure wired (sonner, next-themes integration)
- [x] Success toasts on task/board create, update, delete, and duplicate
- [x] Error toasts replace all `alert()` calls for action failures
- [x] Accessible confirm Dialog replaces `confirm()` for destructive actions
- [x] DnD optimistic rollback: restores columns and shows toast on persistence
      failure
- [x] Removed floating action button, replaced with header CTAs
- [x] Keyboard nav: `aria-label` added to all icon-only buttons (task options,
      board options, account menu, open navigation)
- [x] Keyboard nav: `focus-visible` ring added to links missing it (back link,
      mobile nav link)
- [x] Keyboard nav: dialog close button uses `focus-visible` instead of `focus`
- [x] ARIA: drop placeholders marked `aria-hidden`
- [x] ARIA: Kanban columns annotated with `role="group"` and `aria-label`
- [x] ARIA: task card interactive wrappers have `aria-label` with task title
- [x] ARIA: due date Popover trigger has dynamic `aria-label`

### Completed

- [x] 11. Polish + accessibility

### Optional Future

- [ ] 12. Sharing + real-time ordering
- [ ] Multi-user board viewing
- [ ] Real-time ordering updates

### Deferred Quality Track

- [ ] Fix Vitest 4 browser provider config migration (`browser.provider`
      factory)
- [ ] Add unit tests for server actions and board/task interaction helpers
- [ ] Add interaction tests for toast flows (success/error) across CRUD actions
- [ ] Add interaction tests for optimistic DnD rollback and failure feedback

## Project Structure

```text
app/
  boards/
  components/
  lib/
prisma/
  schema.prisma
  seed.ts
```

## Notes

- This repo is intentionally built as a practical learning project with
  production-style patterns.
- Replace all files in `docs/media/*` placeholders with your own screenshots and
  GIFs.
