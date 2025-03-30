import * as React from "react"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, isAfter, isBefore, addDays, differenceInDays } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface DateRange {
  start: Date
  end: Date
}

interface DateSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  dateRange: DateRange
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
}

export function DateSlider({
  dateRange,
  selectedDate,
  setSelectedDate,
  className,
  ...props
}: DateSliderProps) {
  // Calculate the total number of days in the range
  const totalDays = differenceInDays(dateRange.end, dateRange.start) + 1
  
  // Calculate the current position (days from start)
  const currentPosition = selectedDate ? differenceInDays(selectedDate, dateRange.start) : 0
  
  // Instead of using percentage calculation, use actual day index directly
  // This ensures each step of the slider corresponds to exactly one day
  const sliderValue = [currentPosition]
  
  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    // Use the exact day index rather than percentage calculation
    const dayIndex = value[0]
    const newDate = addDays(dateRange.start, dayIndex)
    setSelectedDate(newDate)
  }
  
  // Handle previous day button click
  const handlePrevDay = () => {
    const prevDay = addDays(selectedDate || dateRange.start, -1)
    if (!isBefore(prevDay, dateRange.start)) {
      setSelectedDate(prevDay)
    }
  }
  
  // Handle next day button click
  const handleNextDay = () => {
    const nextDay = addDays(selectedDate || dateRange.start, 1)
    if (!isAfter(nextDay, dateRange.end)) {
      setSelectedDate(nextDay)
    }
  }

  // Check if buttons should be disabled
  const isPrevDisabled = isBefore(addDays(selectedDate || dateRange.start, -1), dateRange.start)
  const isNextDisabled = isAfter(addDays(selectedDate || dateRange.start, 1), dateRange.end)

  return (
    <div 
      className={cn(
        "flex items-center justify-between gap-4 p-4 border-t bg-background",
        className
      )}
      {...props}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handlePrevDay}
        disabled={isPrevDisabled}
        aria-label="Previous day"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-center font-medium">
          {format(selectedDate || dateRange.start, "MMMM d, yyyy")}
        </div>
        <Slider
          value={sliderValue}
          min={0}
          max={totalDays - 1}
          step={1}
          onValueChange={handleSliderChange}
          className="cursor-pointer"
          aria-label="Date slider"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{format(dateRange.start, "MMM d")}</span>
          <span>{format(dateRange.end, "MMM d")}</span>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleNextDay}
        disabled={isNextDisabled}
        aria-label="Next day"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}