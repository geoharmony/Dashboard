import { useState, useEffect } from "react"
import { MapDashboard } from "./components/map-dashboard"
import type { Event } from "./types/events"
import eventsData from "./data/unmiss-events-chronological.json"

function App() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    // For this example, we're using the imported JSON data
    setEvents(eventsData as Event[])
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading UNMISS Dashboard</h2>
          <p className="text-muted-foreground">Please wait while we load the data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen w-full">
      <MapDashboard events={events} />
    </div>
  )
}

export default App