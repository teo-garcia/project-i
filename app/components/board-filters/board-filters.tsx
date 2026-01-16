'use client'

import { Filter } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { TaskPriority } from '@/lib/data/task-board'

export type BoardFiltersState = {
  priorities: TaskPriority[]
  labels: string[]
  showEmpty: boolean
}

type BoardFiltersProps = {
  allLabels: string[]
  filters: BoardFiltersState
  onFiltersChange: (filters: BoardFiltersState) => void
}

const priorityOptions: TaskPriority[] = ['urgent', 'high', 'medium', 'low']

export const BoardFilters = ({ allLabels, filters, onFiltersChange }: BoardFiltersProps) => {
  const activeFilterCount = filters.priorities.length + filters.labels.length + (filters.showEmpty ? 0 : 1)

  const togglePriority = (priority: TaskPriority) => {
    const newPriorities = filters.priorities.includes(priority)
      ? filters.priorities.filter(p => p !== priority)
      : [...filters.priorities, priority]

    onFiltersChange({ ...filters, priorities: newPriorities })
  }

  const toggleLabel = (label: string) => {
    const newLabels = filters.labels.includes(label)
      ? filters.labels.filter(l => l !== label)
      : [...filters.labels, label]

    onFiltersChange({ ...filters, labels: newLabels })
  }

  const clearFilters = () => {
    onFiltersChange({
      priorities: [],
      labels: [],
      showEmpty: true,
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <Filter className='size-4' />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <Badge variant='secondary' className='ml-1 size-5 rounded-full p-0 text-xs'>
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Priority Filters */}
        <DropdownMenuLabel className='text-xs font-normal text-muted-foreground'>
          Priority
        </DropdownMenuLabel>
        {priorityOptions.map((priority) => (
          <DropdownMenuCheckboxItem
            key={priority}
            checked={filters.priorities.includes(priority)}
            onCheckedChange={() => togglePriority(priority)}
            className='capitalize'
          >
            {priority}
          </DropdownMenuCheckboxItem>
        ))}

        <DropdownMenuSeparator />

        {/* Label Filters */}
        {allLabels.length > 0 && (
          <>
            <DropdownMenuLabel className='text-xs font-normal text-muted-foreground'>
              Labels
            </DropdownMenuLabel>
            {allLabels.slice(0, 6).map((label) => (
              <DropdownMenuCheckboxItem
                key={label}
                checked={filters.labels.includes(label)}
                onCheckedChange={() => toggleLabel(label)}
              >
                {label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        {/* Show Empty Columns */}
        <DropdownMenuCheckboxItem
          checked={filters.showEmpty}
          onCheckedChange={(checked) => onFiltersChange({ ...filters, showEmpty: checked })}
        >
          Show empty columns
        </DropdownMenuCheckboxItem>

        {activeFilterCount > 0 && (
          <>
            <DropdownMenuSeparator />
            <Button
              variant='ghost'
              size='sm'
              className='w-full'
              onClick={clearFilters}
            >
              Clear filters
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
