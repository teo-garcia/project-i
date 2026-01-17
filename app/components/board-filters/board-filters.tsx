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
import {
  type BoardFiltersState,
  clearBoardFilters,
  getBoardFilterCount,
  getBoardFilterOptions,
  setShowEmptyColumns,
  toggleLabelFilter,
  togglePriorityFilter,
} from '@/lib/board/filters'

type BoardFiltersProps = {
  allLabels: string[]
  filters: BoardFiltersState
  onFiltersChange: (filters: BoardFiltersState) => void
}

export const BoardFilters = ({
  allLabels,
  filters,
  onFiltersChange,
}: BoardFiltersProps) => {
  const activeFilterCount = getBoardFilterCount(filters)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <Filter className='size-4' />
          <span>Filter</span>
          {activeFilterCount > 0 && (
            <Badge
              variant='secondary'
              className='ml-1 size-5 rounded-full p-0 text-xs'
            >
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
        {getBoardFilterOptions().map((priority) => (
          <DropdownMenuCheckboxItem
            key={priority}
            checked={filters.priorities.includes(priority)}
            onCheckedChange={() =>
              onFiltersChange(togglePriorityFilter(filters, priority))
            }
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
                onCheckedChange={() =>
                  onFiltersChange(toggleLabelFilter(filters, label))
                }
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
          onCheckedChange={(checked) =>
            onFiltersChange(setShowEmptyColumns(filters, checked))
          }
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
              onClick={() => onFiltersChange(clearBoardFilters())}
            >
              Clear filters
            </Button>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
