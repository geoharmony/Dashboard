import { MapProvider } from "../context/map-context"
import { MapView } from "./map-view"
import { Header } from "./header"
import type { Event } from "../types/events"
import { Sidebar } from "@/components/sidebar"


interface MapDashboardProps {
  events: Event[]
}

export function MapDashboard({ events }: MapDashboardProps) {
  return (
    <MapProvider>
      <div className="flex h-screen flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MapView events={events} />
        </div>
      </div>
    </MapProvider>
  )
}

