"use client"

import { useState, useEffect } from "react"
import { MapProvider } from "../context/map-context"
import { MapView } from "./map-view"
import { Header } from "./header"
import { fetchGeoJSON } from "../lib/geo-utils"
import type { Event } from "../types/events"
import type { FeatureCollection } from "geojson"

// URLs for the GeoJSON files
const ADMIN1_URL = "https://un5vxk64lllr7omb.public.blob.vercel-storage.com/GAUL_South_Sudan_Admin_Layer1.json"
const ADMIN2_URL = "https://un5vxk64lllr7omb.public.blob.vercel-storage.com/GAUL_South_Sudan_Admin_Layer2.json"

interface MapDashboardProps {
  events: Event[]
}

export function MapDashboard({ events }: MapDashboardProps) {
  const [activeTab, setActiveTab] = useState("conflict-risk")
  const [admin1GeoJSON, setAdmin1GeoJSON] = useState<FeatureCollection | null>(null)
  const [admin2GeoJSON, setAdmin2GeoJSON] = useState<FeatureCollection | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch GeoJSON data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [admin1Data, admin2Data] = await Promise.all([fetchGeoJSON(ADMIN1_URL), fetchGeoJSON(ADMIN2_URL)])

        setAdmin1GeoJSON(admin1Data)
        setAdmin2GeoJSON(admin2Data)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching GeoJSON data:", error)
        setIsLoading(false)
      }
    }

    fetchData()
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
    <MapProvider>
      <div className="flex h-screen flex-col">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex flex-1 overflow-hidden">
          <div className="relative flex-1">
            <MapView events={events} admin1GeoJSON={admin1GeoJSON} admin2GeoJSON={admin2GeoJSON} />
          </div>
        </div>
      </div>
    </MapProvider>
  )
}

