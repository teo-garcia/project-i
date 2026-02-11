# Task Board - Learning Next.js

A modern Kanban-style task board built as a learning project for Next.js,
Prisma, and SQLite. The focus is to learn App Router patterns, server actions,
and data modeling while shipping a polished UI.

---

## Project Overview

This app lets you manage tasks across columns, filter by priority and labels,
see details in a modal or full page, and reorder tasks with drag-and-drop.
The UI is intentionally polished to practice real-world frontend decisions
alongside full-stack data flow.

---

## Tech Stack

- Next.js 16 (App Router, Server Components, Server Actions)
- React 19
- TypeScript
- Prisma + SQLite
- Tailwind CSS 4 + shadcn/ui

---

## Setup From Zero

### Prereqs

- Node.js >= 22
- pnpm

### Environment Setup

- Copy `.env.example` to `.env`
- The app reads `APP_PORT` and `NEXT_PUBLIC_URL` from `.env`
- SQLite uses `DATABASE_URL` and stores data in `dev.db` at the repo root

### Database Setup

- Run the Prisma migration to create tables and initialize `dev.db`
- Run the seed step to populate sample boards, columns, tasks, and labels
- If you reset the database, rerun the migration and seed steps

### Running Locally

- Start the dev server
- Open the app in the browser at the local URL
- The first load should show seeded boards if you ran the seed step

### Troubleshooting Setup

- If the database is missing, rerun the migration
- If the UI looks empty, confirm the seed step completed
- If env variables are ignored, ensure `.env` is in the project root

---

## Features

- Multiple boards with unique routes
- Kanban columns with task cards
- Task detail view (modal + full page)
- Priority badges and due-date status
- Filters for priority, labels, and empty columns
- Drag-and-drop with optimistic UI
- Light/dark/system theme toggle
- Context menu UI for task actions

---

## Roadmap / Implementation Plan

### 1) Base UI primitives (shadcn/ui)

- Install foundational UI components (cards, dialogs, badges, menus, tooltips)
- Establish theme tokens and component styling conventions

### 2) App Router routes + layouts

- Build the home dashboard with board listings
- Add board detail routes and task detail routes
- Establish server vs client component boundaries

### 3) Kanban UI + task detail modal

- Build columns and task cards
- Add a detailed task view in a modal and as a full page
- Ensure tasks can be opened from the board view

### 4) Filters + theme integration

- Add filters for priority, labels, and empty columns
- Integrate theme switcher with persisted preferences
- Improve visual hierarchy and density for scanning tasks

### 5) Business logic in lib modules

- Move filtering, formatting, and DnD logic into shared modules
- Centralize domain types and helper utilities

### 6) Drag-and-drop + optimistic UI

- Enable drag-and-drop within and across columns
- Update the UI optimistically while persisting changes

### 7) Prisma schema + SQLite wiring

- Model boards, columns, tasks, labels, and assignees
- Implement Prisma client setup and local SQLite database
- Add seed data for realistic boards

### 8) Server Actions for CRUD

- Create board and task actions for create, update, delete
- Add action-based persistence for drag-and-drop ordering
- Revalidate routes after mutations

### 9) Zod validation for inputs

- Validate board/task inputs in server actions
- Return field-level error messages to the UI

### 10) Wire update/delete flows in the UI

- Connect edit/delete UI to server actions
- Add confirmation patterns for destructive actions

### 11) Polish + accessibility

- Improve keyboard navigation and focus states
- Audit contrast and ARIA usage

### 12) Optional: sharing + real-time ordering

- Consider multi-user viewing
- Add real-time ordering updates

---

## Current Status (as of Feb 2, 2026)

- CRUD server actions exist for boards and tasks
- Create flows are wired in the UI (modals + pages)
- Update/delete actions are not wired in the UI yet

---

## Development Commands (names only)

- dev server
- database migration
- database seed
- lint and typecheck
- unit tests

