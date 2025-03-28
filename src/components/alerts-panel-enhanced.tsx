"use client"

import { useState, useEffect } from "react"
import { AlertCircle, ChevronRight, MapPin, ArrowLeft } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMapContext } from "@/context/map-context"
import { cn } from "@/lib/utils"
import { filterEventsByNarrativeId } from "@/lib/events-utils"
import type { Event } from "@/types/events"

interface AlertsPanelProps {
  events: Event[]
}

export function AlertsPanelEnhanced({ events }: AlertsPanelProps) {
  const { mapInstance } = useMapContext()
  const [isOpen, setIsOpen] = useState(true)
  const [focusedNarrativeId, setFocusedNarrativeId] = useState<string | null>(null)
  const [focusedEvents, setFocusedEvents] = useState<Event[]>([])

  // Auto-open panel if there are alerts
  useEffect(() => {
    const alertCount = events.length
    if (alertCount > 0 && !isOpen) {
      setIsOpen(true)
    } else if (alertCount === 0 && isOpen) {
      setIsOpen(false)
    }
  }, [events.length, isOpen])

  // Handle focusing on a specific narrative
  const handleFocusNarrative = (narrativeId: string) => {
    const relatedEvents = filterEventsByNarrativeId(events, narrativeId)
    setFocusedEvents(relatedEvents)
    setFocusedNarrativeId(narrativeId)

    // If we have map instance and events with location, focus the map on the most recent event
    if (mapInstance && relatedEvents.length > 0) {
      const mostRecentEvent = [...relatedEvents].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      )[0]

      if (mostRecentEvent.location) {
        mapInstance.setView([mostRecentEvent.location.lat, mostRecentEvent.location.lon], 10, { animate: true })
      }
    }
  }

  // Clear focused narrative
  const clearFocus = () => {
    setFocusedNarrativeId(null)
    setFocusedEvents([])
  }

  // If no events, show empty state
  if (events.length === 0) {
    return (
      <div className="absolute top-16 right-4 z-[9999] w-80 bg-white rounded-md shadow-md">
        <div className="p-3 border-b bg-background">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
              Alerts
            </h2>
            <ChevronRight className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
          </div>
          <p className="text-sm text-muted-foreground mt-1">No alerts for the selected date range.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="absolute top-16 right-4 z-[9999] w-80 bg-white rounded-md shadow-md">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="p-3 bg-background border-b">
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <h2 className="text-base font-semibold">
                {focusedNarrativeId ? `Narrative ${focusedNarrativeId}` : "Alerts"}
              </h2>
              <Badge variant="destructive" className="rounded-full px-2 py-0 text-xs">
                {focusedNarrativeId ? focusedEvents.length : events.length}
              </Badge>
            </div>
            <div className="flex items-center">
              {focusedNarrativeId && (
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
              <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-90")} />
            </div>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent>
          <div className="px-3 pb-3 max-h-[400px] overflow-auto">
            <div className="space-y-2 pt-2">
              {(focusedNarrativeId ? focusedEvents : events).map((event, index) => (
                <div
                  key={`${event.narrative_id}-${event.date}-${index}`}
                  className={cn("rounded-md border p-2 transition-colors", "hover:bg-accent/50 cursor-pointer")}
                  onClick={() => {
                    if (!focusedNarrativeId) {
                      handleFocusNarrative(event.narrative_id)
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
                          {event.narrative_id}
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

