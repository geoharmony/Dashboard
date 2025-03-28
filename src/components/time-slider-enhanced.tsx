"use client"

import { useState, useEffect, useCallback } from "react"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { format, addDays, subDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useMapContext } from "@/context/map-context"

export function TimeSliderEnhanced() {
  const { selectedDate, setSelectedDate, dateRange } = useMapContext()
  const [date, setDate] = useState<Date | undefined>(selectedDate || undefined)

  // Update local date when context date changes
  useEffect(() => {
    if (selectedDate) {
      setDate(selectedDate)
    }
  }, [selectedDate])

  // Handle date selection
  const handleSelect = useCallback(
    (newDate: Date | undefined) => {
      setDate(newDate)
      if (newDate) {
        setSelectedDate(newDate)
      }
    },
    [setSelectedDate],
  )

  // Navigate to previous day
  const goToPreviousDay = () => {
    if (date) {
      const newDate = subDays(date, 1)
      if (dateRange && newDate >= dateRange.start) {
        handleSelect(newDate)
      }
    }
  }

  // Navigate to next day
  const goToNextDay = () => {
    if (date) {
      const newDate = addDays(date, 1)
      if (dateRange && newDate <= dateRange.end) {
        handleSelect(newDate)
      }
    }
  }

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[9999] bg-white rounded-md shadow-md p-2 flex items-center">
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPreviousDay}
        disabled={!date || (dateRange && date <= dateRange.start)}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[9999]" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
            fromDate={dateRange?.start}
            toDate={dateRange?.end}
          />
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        size="icon"
        onClick={goToNextDay}
        disabled={!date || (dateRange && date >= dateRange.end)}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

