"use client"

import { useState, useEffect } from "react"
import type L from "leaflet"

interface CoordinatesDisplayProps {
  mapInstance: L.Map | null
}

export function CoordinatesDisplay({ mapInstance }: CoordinatesDisplayProps) {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 })

  useEffect(() => {
    if (!mapInstance) return

    const updateCoordinates = (e: L.LeafletMouseEvent) => {
      setCoordinates({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      })
    }

    mapInstance.on("mousemove", updateCoordinates)

    return () => {
      mapInstance.off("mousemove", updateCoordinates)
    }
  }, [mapInstance])

  if (!mapInstance) return null

  return (
    <div className="absolute bottom-4 right-4 bg-white/90 px-4 py-2 rounded-md shadow-md text-sm z-9999">
      <p>
        <span className="font-semibold">Lat:</span> {coordinates.lat.toFixed(6)}° {coordinates.lat > 0 ? "N" : "S"}
        &nbsp;&nbsp;
        <span className="font-semibold">Lon:</span> {coordinates.lng.toFixed(6)}° {coordinates.lng > 0 ? "E" : "W"}
      </p>
    </div>
  )
}

