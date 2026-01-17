# Lib Overview

This folder holds app-level logic and shared helpers so UI components can stay
focused on rendering.

## board/

- `filters.ts` centralizes filter state, rules, and derived data used by board
  views.
- `dnd.ts` contains drag-and-drop ID helpers and task movement rules.

## formatting/

- `date.ts` standardizes how dates are displayed in cards and detail views.

## data/

- `task-board.ts` holds mock data and shared domain types/helpers.

Guiding principles:

- Keep view components thin; move rules and calculations here.
- Favor pure functions for predictable behavior.
- Keep helpers small and composable to avoid hidden side effects.
