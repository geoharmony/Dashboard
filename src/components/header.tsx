import { useState } from "react"

import { useMapContext } from "@/context/map-context"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export function Header({ handleViewSelection }: { handleViewSelection: (view: string) => void }) {
  const [activeTab, setActiveTab] = useState("conflict-risk")
  const {filterLayersByCategory} = useMapContext()

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    filterLayersByCategory(tab)
  }

  const TabList = [
    {
      value: "conflict-risk",
      label: "Conflict Risk Today",
      purpose: "Indentify areas with high potential for violence or instability",
      enabled: true,
    },
    {
      value: "flood-impacts",
      label: "Flood Impacts",
      purpose: "Assess the extent and impact of recent or ongoing floods",
      enabled: true,
    },
    {
      value: "higher-ground",
      label: "Higher Ground",
      purpose: "Identify areas with higher elevation that may provide refuge during floods",
      enabled: true,
    },
    {
      value: "displacement",
      label: "Displacement Overview",
      purpose: "Understand movement and resettlement patterns",
      enabled: true,
    },
    {
      value: "drought-stress",
      label: "Drought Stress",
      purpose: "Monitor regions under agricultural and water stress",
      enabled: false,
    },
    {
      value: "flood-risk-zones",
      label: "Flood Risk Zones",
      purpose: "Identify historically flood-prone areas and terrain vulnerability",
      enabled: false,
    },
    {
      value: "field-operations",
      label: "Field Operations",
      purpose: "Support operational planning using patrol and civil affairs data",
    },
    {
      value: "crop-stress-overview",
      label: "Crop Stress Overview",
      purpose: "Visualize areas at risk of food insecurity or failed harvests",
    },
    {
      value: "environmental-trends",
      label: "Environmental Trends",
      purpose: "Provide long-term environmental insights",
    }
  ]

  return (
    <div className="flex flex-col border-b bg-background">
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
                {TabList.map((tab) => (
                  <TabsTrigger key={tab.value} disabled={!tab.enabled} value={tab.value} className="px-4 {tab.enabled ? '' : 'ghost'}" title={tab.purpose}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

