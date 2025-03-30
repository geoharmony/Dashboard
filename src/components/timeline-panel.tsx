"use client"

import { useState, useEffect } from "react"
import { AlertCircle, ChevronLeft, MapPin, ArrowLeft } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getTimelineEvents } from "@/lib/events-utils"
import type { Event } from "@/types/events"
import type * as L from "leaflet"

interface TimelinePanelProps {
  events: Event[]
  selectedDate: Date | null
  mapInstance: L.Map | null
  onTimelineSelect?: (timelineId: string) => void
}

export function TimelinePanel({ events, selectedDate, mapInstance, onTimelineSelect }: TimelinePanelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [focusedTimelineId, setFocusedTimelineId] = useState<string | null>(null)
  const [focusedEvents, setFocusedEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])

  // Filter events based on selected date (10-day window)
  useEffect(() => {
    if (!selectedDate) {
      setFilteredEvents([])
      return
    }

    const selectedTimestamp = selectedDate.getTime()
    const earliestTimestamp = selectedTimestamp - 10 * 24 * 60 * 60 * 1000

    const filtered = events.filter((event) => {
      const eventDate = new Date(event.date)
      const eventTimestamp = eventDate.getTime()
      return eventTimestamp <= selectedTimestamp && eventTimestamp >= earliestTimestamp
    })

    setFilteredEvents(filtered)

    // Clear focused timeline if we change dates
    setFocusedTimelineId(null)
    setFocusedEvents([])
  }, [events, selectedDate])

  // Auto-open panel if there are alerts
  useEffect(() => {
    const hasAlerts = filteredEvents.length > 0
    setIsOpen(hasAlerts)
  }, [filteredEvents.length])

  // Handle focusing on a specific timeline
  const handleFocusTimeline = (timelineId: string) => {
    if (!selectedDate) return

    // Get all events with this timeline ID up to the selected date
    const timelineEvents = getTimelineEvents(events, timelineId, selectedDate)
    setFocusedEvents(timelineEvents)
    setFocusedTimelineId(timelineId)

    if (onTimelineSelect) {
      onTimelineSelect(timelineId)
    }

    // If we have map instance and events with location, focus the map on the most recent event
    if (mapInstance && timelineEvents.length > 0) {
      const mostRecentEvent = [...timelineEvents].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0]

      if (mostRecentEvent.location) {
        mapInstance.setView([mostRecentEvent.location.lat, mostRecentEvent.location.lon], 10, { animate: true })
      }
    }
  }

  // Clear focused timeline
  const clearFocus = () => {
    setFocusedTimelineId(null)
    setFocusedEvents([])
  }

  // If no events, show empty state
  if (filteredEvents.length === 0 && !focusedTimelineId) {
    return (
      <div className="absolute top-16 right-4 z-[9999] w-80 bg-white rounded-md shadow-md">
        <div className="p-3 border-b bg-background">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              Alerts
            </h2>
            <ChevronLeft className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">No alerts for the selected date range.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-16 right-4 z-[9999] w-60 bg-white rounded-md shadow-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-3 bg-background border-b">
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <h2 className="text-base font-semibold">
                {focusedTimelineId ? `Timeline ${focusedTimelineId}` : "Alerts"}
              </h2>
              <Badge variant="destructive" className="rounded-full px-2 py-0 text-xs">
                {focusedTimelineId ? focusedEvents.length : filteredEvents.length}
              </Badge>
            </div>
            <div className="flex items-center">
              {focusedTimelineId && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 mr-1"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearFocus()
                  }}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <ChevronLeft className={cn("h-4 w-4 transition-transform duration-200", isOpen && "-rotate-90")} />
            </div>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="px-3 pb-3 max-h-[400px] overflow-auto">
            <div className="space-y-2 pt-2">
              {(focusedTimelineId ? focusedEvents : filteredEvents).map((event, index) => (
                <div
                  key={`${event.narrative_id}-${event.date}-${index}`}
                  className={cn("rounded-md border p-2 transition-colors", "hover:bg-accent/50 cursor-pointer")}
                  onClick={() => {
                    if (!focusedTimelineId) {
                      handleFocusTimeline(event.narrative_id)
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-sm">
                          <span className="h-2 w-2 rounded-full inline-block bg-red-500 mr-1" />
                          {event.location.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs mt-1">{event.event}</p>
                      {event.context && <p className="text-xs text-muted-foreground mt-1 italic">{event.context}</p>}
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="text-xs">
                          Timeline {event.narrative_id}
                        </Badge>
                        <Badge variant="outline" className="text-xs ml-1">
                          {event.location.admin1}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 shrink-0 ml-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (mapInstance) {
                          mapInstance.setView([event.location.lat, event.location.lon], 10, { animate: true })
                        }
                      }}
                    >
                      <MapPin className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

