import { MapProvider } from "@/context/map-context"
import { MapView } from "@/components/map-view"
import { Header } from "@/components/header"
import type { Event } from "@/types/events"
import { Sidebar } from "@/components/sidebar"
import { useState } from "react"
import { Reports } from "@/components/reports"
import reportImage from "@/assets/Report.jpg"


interface MapDashboardProps {
  events: Event[]
}

export function MapDashboard({ events }: MapDashboardProps) {
  const [selectedView, setSelectedView] = useState("map")
  return (
    <MapProvider>
      <div className="flex h-screen flex-col">
        <Header handleViewSelection={setSelectedView}/>
        {selectedView === "map" && (
          <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <MapView events={events} />
          </div>
        )}
        {selectedView === "alerts" && (
          <div className="flex flex-1 overflow-hidden">
            <Reports />
          </div>
        )}
        {selectedView === "reports" && (
          <div className="flex flex-1 overflow-hidden">
            <img src={reportImage} alt="Report" className="w-full" />
          </div>
        )}
      </div>
    </MapProvider>
  )
}

