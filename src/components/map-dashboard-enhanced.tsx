"use client"

import { useState } from "react"
import { MapProvider } from "@/context/map-context"
import { MapViewEnhanced } from "@/components/map-view-enhanced"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import type { Event } from "@/types/events"
import type { FeatureCollection } from "geojson"

interface MapDashboardEnhancedProps {
  events: Event[]
  admin1GeoJSON: FeatureCollection
  admin2GeoJSON: FeatureCollection
}

export function MapDashboardEnhanced({ events, admin1GeoJSON, admin2GeoJSON }: MapDashboardEnhancedProps) {
  const [activeTab, setActiveTab] = useState("conflict-risk")

  return (
    <MapProvider>
      <div className="flex h-screen flex-col">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <div className="relative flex-1">
            <MapViewEnhanced events={events} admin1GeoJSON={admin1GeoJSON} admin2GeoJSON={admin2GeoJSON} />
          </div>
        </div>
      </div>
    </MapProvider>
  )
}

