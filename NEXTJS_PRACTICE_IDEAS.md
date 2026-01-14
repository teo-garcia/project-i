# Next.js Practice Projects

Goal: Build small, focused apps that each highlight different Next.js features. All follow the "list + detail + create" pattern but with different domains.

---

## The Projects

### 1) Task Board

Classic kanban-style task manager with drag-and-drop.

**Routes:**
- `/` - Dashboard with board list
- `/boards/[id]` - Kanban view with columns
- `/boards/[id]/task/[taskId]` - Task detail modal (intercepting route)

**Features:**
- Drag-and-drop between columns with `@dnd-kit`
- Optimistic updates when moving tasks
- Real-time column reordering
- Task labels, due dates, assignees
- Board sharing with unique URLs

**Next.js Focus:**
- Client Components for DnD interactions
- Server Actions for CRUD with `revalidatePath`
- Intercepting routes for task modal overlay
- `useOptimistic` for instant feedback

**Schema:**
```
Board: id, name, createdAt
Column: id, boardId, name, position
Task: id, columnId, title, description, dueDate, position, labels[]
```

**UI Components:** Card, Dialog, Badge, Avatar, DropdownMenu

---

### 2) Expense Tracker

Track spending with categories and monthly breakdowns.

**Routes:**
- `/` - Monthly overview with totals
- `/transactions` - Paginated transaction list
- `/transactions/new` - Add transaction form
- `/transactions/[id]` - Edit transaction
- `/reports` - Charts and category breakdown
- `/reports/[month]` - Specific month deep-dive

**Features:**
- Add income/expense with category
- Monthly/yearly summaries
- Category-based pie charts
- Recurring transactions
- CSV export

**Next.js Focus:**
- Server Components for aggregation queries
- ISR for reports (regenerate daily)
- Streaming for chart data with Suspense
- `generateStaticParams` for recent months

**Schema:**
```
Transaction: id, amount, type (income|expense), categoryId, date, note, recurring
Category: id, name, color, icon, budget
```

**UI Components:** Table, Select, Calendar, Chart (recharts), Tabs

---

### 3) Reading List

Save articles/books with progress tracking and notes.

**Routes:**
- `/` - Reading list with filters
- `/items/[id]` - Item detail with notes
- `/items/[id]/notes` - Notes for item
- `/tags/[tag]` - Filtered by tag
- `/archive` - Completed items

**Features:**
- Save URL and auto-fetch title/description/image
- Progress tracking (pages read, % complete)
- Highlight excerpts and add notes
- Tag-based organization
- Reading streaks

**Next.js Focus:**
- Server Actions for URL metadata fetching
- `generateMetadata` for rich previews
- Route Handlers for OG image proxy
- Parallel data fetching

**Schema:**
```
Item: id, url, title, description, image, type (article|book), progress, totalPages, status
Tag: id, name
Note: id, itemId, content, highlight, createdAt
```

**UI Components:** Card, Input, Textarea, Progress, Badge, Popover

---

### 4) Workout Log

Log exercises with sets/reps and view history.

**Routes:**
- `/` - Today's workout or start new
- `/workouts/[id]` - Workout detail with exercises
- `/exercises` - Exercise library
- `/exercises/[slug]` - Exercise info + history
- `/stats` - Progress charts (parallel route `@stats`)
- `/history` - Past workouts calendar

**Features:**
- Pre-built exercise templates
- Track sets, reps, weight, RPE
- Rest timer between sets
- Personal records tracking
- Volume/frequency charts

**Next.js Focus:**
- Nested layouts for workout flow
- Parallel routes for side-by-side stats
- Streaming for history charts
- Client Components for timer

**Schema:**
```
Workout: id, date, duration, notes
Exercise: id, name, slug, muscleGroup, instructions
WorkoutExercise: id, workoutId, exerciseId, order
Set: id, workoutExerciseId, reps, weight, rpe, completed
```

**UI Components:** Button, Input, Timer, Chart, Calendar, Accordion

---

### 5) Link Shortener

Create and track short URLs with click analytics.

**Routes:**
- `/` - Create new short link
- `/links` - Your links dashboard
- `/links/[id]` - Link analytics detail
- `/[shortCode]` - Redirect (middleware)

**Features:**
- Generate short codes or custom aliases
- Click tracking with referrer/country/device
- QR code generation
- Link expiration dates
- Password-protected links

**Next.js Focus:**
- Edge runtime for fast redirects
- Middleware for redirect logic
- Route Handlers for click tracking
- `generateStaticParams` for popular links

**Schema:**
```
Link: id, originalUrl, shortCode, customAlias, expiresAt, password, createdAt
Click: id, linkId, timestamp, referrer, country, device, browser
```

**UI Components:** Input, Button, Table, QRCode, CopyButton, Chart

---

### 6) Mood Journal

Daily mood logging with streaks and insights.

**Routes:**
- `/` - Today's entry or calendar view
- `/entries/[date]` - Specific day entry
- `/entries/[date]/edit` - Edit entry
- `/insights` - Mood trends and patterns
- `/streaks` - Streak history

**Features:**
- Daily mood rating (1-5 or emoji scale)
- Journal notes with prompts
- Activity/sleep/weather correlation
- Streak tracking with milestones
- Weekly/monthly mood averages

**Next.js Focus:**
- Server Actions for quick mood logging
- Suspense boundaries for insights loading
- `useFormStatus` for pending states
- Dynamic OG images for streak sharing

**Schema:**
```
Entry: id, date, mood (1-5), note, activities[], sleepHours, weather
Streak: id, startDate, endDate, length, type (current|completed)
```

**UI Components:** Calendar, Slider, Textarea, EmojiPicker, Chart, Badge

---

## Feature Matrix

| Project | Server Actions | Streaming | Edge | Parallel Routes | Intercepting Routes | Middleware |
|---------|:-------------:|:---------:|:----:|:---------------:|:------------------:|:----------:|
| Task Board | x | | | | x | |
| Expense Tracker | x | x | | | | |
| Reading List | x | | | | | |
| Workout Log | x | x | | x | | |
| Link Shortener | | | x | | | x |
| Mood Journal | x | x | | | | |

---

## Stack

- **DB:** Prisma + SQLite (swap to Postgres for prod)
- **UI:** shadcn/ui + Tailwind
- **Auth:** NextAuth v5 (add last)
- **Validation:** Zod
- **Charts:** Recharts or Chart.js

---

## Build Order

1. Routes and layouts (mock data)
2. UI components with shadcn/ui
3. Database schema with Prisma
4. Server Actions / Route Handlers
5. Polish (loading states, error boundaries)
6. Auth (if needed)
