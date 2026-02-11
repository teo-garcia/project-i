'use client'

import { ChevronDown, ListFilter, RotateCcw } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  type BoardFiltersState,
  clearBoardFilters,
  getBoardFilterCount,
  getBoardFilterOptions,
  setShowEmptyColumns,
  toggleLabelFilter,
  togglePriorityFilter,
} from '@/lib/board/filters'
import { cn } from '@/lib/utils'

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
  const activeSummary = [
    ...filters.priorities.map((priority) => `Priority: ${priority}`),
    ...filters.labels.map((label) => `Label: ${label}`),
    ...(filters.showEmpty ? [] : ['Hide empty columns']),
  ]

  return (
    <div className='flex flex-wrap items-center gap-2 rounded-xl border border-border/80 bg-card px-2.5 py-2 sm:px-3'>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type='button'
            size='sm'
            variant='outline'
            className='h-8 gap-2 rounded-md px-2.5 text-xs'
          >
            <ListFilter className='size-3.5' />
            Filters
            {activeFilterCount > 0 ? (
              <Badge
                variant='secondary'
                className='h-4 rounded-sm px-1.5 text-[10px]'
              >
                {activeFilterCount}
              </Badge>
            ) : null}
            <ChevronDown className='size-3.5 text-muted-foreground' />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align='start'
          className='w-[min(42rem,calc(100vw-2rem))] rounded-xl border border-border/90 p-3'
        >
          <div className='space-y-3'>
            <div className='flex items-center justify-between gap-2'>
              <p className='font-meta text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
                Filter Tasks
              </p>
              <Button
                type='button'
                size='sm'
                variant='ghost'
                className='h-7 rounded-md px-2.5 text-xs'
                disabled={activeFilterCount === 0}
                onClick={() => onFiltersChange(clearBoardFilters())}
              >
                <RotateCcw className='mr-1.5 size-3.5' />
                Reset
              </Button>
            </div>

            <div className='grid gap-1.5 sm:grid-cols-[110px_1fr] sm:items-start'>
              <span className='font-meta text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
                Priority
              </span>
              <div className='flex flex-wrap gap-1.5'>
                {getBoardFilterOptions().map((priority) => {
                  const isActive = filters.priorities.includes(priority)
                  return (
                    <Button
                      key={priority}
                      type='button'
                      size='sm'
                      variant={isActive ? 'secondary' : 'outline'}
                      onClick={() =>
                        onFiltersChange(togglePriorityFilter(filters, priority))
                      }
                      className={cn(
                        'h-7 rounded-md px-2.5 text-xs capitalize',
                        isActive && 'text-primary'
                      )}
                    >
                      {priority}
                    </Button>
                  )
                })}
              </div>
            </div>

            {allLabels.length > 0 ? (
              <div className='grid gap-1.5 sm:grid-cols-[110px_1fr] sm:items-start'>
                <span className='font-meta text-[11px] uppercase tracking-[0.14em] text-muted-foreground'>
                  Labels
                </span>
                <div className='flex flex-wrap gap-1.5'>
                  {allLabels.map((label) => {
                    const isActive = filters.labels.includes(label)
                    return (
                      <Button
                        key={label}
                        type='button'
                        size='sm'
                        variant={isActive ? 'secondary' : 'outline'}
                        onClick={() =>
                          onFiltersChange(toggleLabelFilter(filters, label))
                        }
                        className={cn(
                          'h-7 rounded-md px-2.5 text-xs',
                          isActive && 'text-primary'
                        )}
                      >
                        {label}
                      </Button>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </PopoverContent>
      </Popover>

      <div className='min-w-0 flex-1'>
        {activeSummary.length > 0 ? (
          <div className='flex flex-wrap gap-1.5'>
            {activeSummary.slice(0, 3).map((entry) => (
              <Badge
                key={entry}
                variant='outline'
                className='rounded-md text-[11px]'
              >
                {entry}
              </Badge>
            ))}
            {activeSummary.length > 3 ? (
              <Badge variant='outline' className='rounded-md text-[11px]'>
                +{activeSummary.length - 3} more
              </Badge>
            ) : null}
          </div>
        ) : (
          <span className='text-xs text-muted-foreground'>No active filters</span>
        )}
      </div>

      <div className='ml-auto flex items-center gap-1.5'>
        <Button
          type='button'
          size='sm'
          variant={filters.showEmpty ? 'secondary' : 'outline'}
          className='h-8 rounded-md px-2.5 text-xs'
          onClick={() =>
            onFiltersChange(setShowEmptyColumns(filters, !filters.showEmpty))
          }
        >
          {filters.showEmpty ? 'Hide empty' : 'Show empty'}
        </Button>
        <Button
          type='button'
          size='sm'
          variant='ghost'
          className='h-8 rounded-md px-2.5 text-xs'
          disabled={activeFilterCount === 0}
          onClick={() => onFiltersChange(clearBoardFilters())}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
