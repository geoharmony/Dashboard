import { Tabs, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import { useState } from "react"
import { useMapContext } from "../context/map-context"

export function Header({ handleViewSelection }: { handleViewSelection: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState("conflict-risk")
  const {filterLayersByCategory} = useMapContext()

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    filterLayersByCategory(tab)
  }

  return (
    <div className="flex flex-col border-b bg-background">
      {/* Top row with GeoHarmony text */}
      <div className="flex border-b px-4 py-2">
        <h1 className="text-sm font-bold text-primary">GeoHarmony</h1>
        <div className="ml-auto">
          <div className="flex items-center gap-2 rounded-full bg-green-100 px-3">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-sm">UNMISS User</span>
          </div>
        </div>
      </div>

      {/* Main header row with buttons and tabs */}
      <div className="flex h-12 items-center px-4">
        <div className="flex items-center gap-2 mr-4">
          <Button variant="outline" onClick={() => handleViewSelection("map")} className="h-9">
            Map
          </Button>
          <Button variant="outline" onClick={() => handleViewSelection("reports")} className="h-9">
            Reports
          </Button>
          <Button variant="outline" onClick={() => handleViewSelection("alerts")} className="h-9">
            Alerts
          </Button>
        </div>

        <div className="ml-auto overflow-hidden">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="overflow-auto">
              <TabsList className="inline-flex w-max px-1">
                <TabsTrigger value="conflict-risk" className="px-4">
                  Conflict Risk Today
                </TabsTrigger>
                <TabsTrigger value="flood-impacts" className="px-4">
                  Flood Impacts
                </TabsTrigger>
                <TabsTrigger value="higher-ground" className="px-4">
                  Higher Ground
                </TabsTrigger>
                <TabsTrigger value="displacement" className="px-4">
                  Displacement Overview
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

