"use client"

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { DayPicker } from "react-day-picker"

import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2.5", className)}
      classNames={{
        root: "w-fit",
        months: "flex flex-col gap-2.5",
        month: "relative space-y-2.5",
        month_caption: "flex h-7 items-center justify-center px-7",
        caption: "flex h-7 items-center justify-center px-7",
        caption_label:
          "inline-flex items-center gap-1 text-[13px] font-medium capitalize tracking-tight",
        dropdowns: "flex h-7 items-center justify-center gap-1",
        dropdown_root: "relative inline-flex h-6 items-center px-0.5",
        dropdown: "absolute inset-0 z-10 cursor-pointer opacity-0",
        months_dropdown: "capitalize",
        years_dropdown: "capitalize",
        chevron: "size-3.5 text-muted-foreground",
        nav: "flex items-center gap-1",
        button_previous: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "absolute left-0 top-0 size-6 rounded-md p-0 text-muted-foreground hover:text-foreground"
        ),
        button_next: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "absolute right-0 top-0 size-6 rounded-md p-0 text-muted-foreground hover:text-foreground"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-muted-foreground w-8 rounded-md text-[0.68rem] font-medium",
        week: "mt-1 flex w-full",
        day: cn(
          buttonVariants({ variant: "ghost", size: "icon-sm" }),
          "size-8 p-0 text-[0.95rem] font-normal aria-selected:opacity-100"
        ),
        day_button: "size-8",
        selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        today: "border border-primary/30 text-primary",
        outside: "text-muted-foreground opacity-45 aria-selected:opacity-30",
        disabled: "text-muted-foreground opacity-40",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({
          orientation,
          className: chevronClassName,
          ...chevronProps
        }) => {
          if (orientation === "left") {
            return (
              <ChevronLeft
                className={cn("size-4", chevronClassName)}
                {...chevronProps}
              />
            )
          }
          if (orientation === "right") {
            return (
              <ChevronRight
                className={cn("size-4", chevronClassName)}
                {...chevronProps}
              />
            )
          }
          return (
            <ChevronDown
              className={cn("size-4", chevronClassName)}
              {...chevronProps}
            />
          )
        },
      }}
      {...props}
    />
  )
}

export { Calendar }
