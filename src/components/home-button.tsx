"use client"

import { Home } from "lucide-react"
import { Button } from "./ui/button"
import type L from "leaflet"

interface HomeButtonProps {
  mapInstance: L.Map | null
}

export function HomeButton({ mapInstance }: HomeButtonProps) {
  const handleClick = () => {
    if (mapInstance) {
      // Center on South Sudan with default zoom level
      mapInstance.setView([7.5, 30], 7, {
        animate: true,
        duration: 1, // 1 second animation
      })
    }
  }

  return (
    <Button
      variant="secondary"
      size="icon"
      className="absolute top-4 right-4 z-[9999] bg-white shadow-md hover:bg-gray-100"
      onClick={handleClick}
      title="Reset map view"
    >
      <Home className="h-5 w-5" />
      <span className="sr-only">Home</span>
    </Button>
  )
}

