import type { Event } from "../types/events"

// Function to filter events by date range
export function filterEventsByDateRange(events: Event[], selectedDate: Date, daysBack = 10): Event[] {
  if (!selectedDate) return []

  const selectedTimestamp = selectedDate.getTime()
  const earliestTimestamp = selectedTimestamp - daysBack * 24 * 60 * 60 * 1000

  return events.filter((event) => {
    const eventDate = new Date(event.date)
    const eventTimestamp = eventDate.getTime()
    return eventTimestamp <= selectedTimestamp && eventTimestamp >= earliestTimestamp
  })
}

// Function to filter events by timeline ID (formerly narrative ID)
export function filterEventsByTimelineId(events: Event[], timelineId: string): Event[] {
  return events.filter((event) => event.narrative_id === timelineId)
}

// Function to get all events with the same timeline ID up to the selected date
export function getTimelineEvents(events: Event[], timelineId: string, selectedDate: Date): Event[] {
  if (!selectedDate) return []

  const selectedTimestamp = selectedDate.getTime()

  return events
    .filter((event) => {
      const eventDate = new Date(event.date)
      const eventTimestamp = eventDate.getTime()
      return event.narrative_id === timelineId && eventTimestamp <= selectedTimestamp
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
}

// Function to group events by timeline ID
export function groupEventsByTimelineId(events: Event[]): Record<string, Event[]> {
  return events.reduce(
    (acc, event) => {
      const id = event.narrative_id
      if (!acc[id]) {
        acc[id] = []
      }
      acc[id].push(event)
      return acc
    },
    {} as Record<string, Event[]>,
  )
}

// Function to get unique timeline IDs from events
export function getUniqueTimelineIds(events: Event[]): string[] {
  return [...new Set(events.map((event) => event.narrative_id))]
}

// Function to get the most recent event for each timeline ID
export function getMostRecentEventsByTimelineId(events: Event[]): Event[] {
  const grouped = groupEventsByTimelineId(events)

  return Object.values(grouped).map((timelineEvents) => {
    // Sort by date descending and take the first one
    return timelineEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
  })
}

// Function to filter events by narrative ID
export function filterEventsByNarrativeId(events: Event[], narrativeId: string): Event[] {
  return events.filter((event) => event.narrative_id === narrativeId)
}

