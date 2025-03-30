import { useState, useEffect } from "react"
import { MapProvider } from "../context/map-context"
import { MapView } from "./map-view"
import { Header } from "./header"
import type { Event } from "../types/events"
import { Sidebar } from "@/components/sidebar"


interface MapDashboardProps {
  events: Event[]
}

export function MapDashboard({ events }: MapDashboardProps) {
  const [activeTab, setActiveTab] = useState("conflict-risk")



  return (
    <MapProvider>
      <div className="flex h-screen flex-col">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <MapView events={events} />
        </div>
      </div>
    </MapProvider>
  )
}

