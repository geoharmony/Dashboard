"use client"

import { useState, useEffect } from "react"
import { AlertCircle, ChevronRight, MapPin, Map } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useMapContext } from "@/context/map-context"
import { cn } from "@/lib/utils"
import { parse } from "date-fns"

export function AlertsPanel() {
  const { filteredAlerts, focusOnAlert, activeAlerts } = useMapContext()
  const [isOpen, setIsOpen] = useState(true)

  // Auto-open panel if there are alerts, but only when the count changes
  useEffect(() => {
    const alertCount = filteredAlerts.length
    if (alertCount > 0 && !isOpen) {
      setIsOpen(true)
    } else if (alertCount === 0 && isOpen) {
      setIsOpen(false)
    }
  }, [filteredAlerts.length])

  // Debug output
  console.log("AlertsPanel rendering:", {
    filteredAlertsCount: filteredAlerts.length,
    activeAlertsCount: activeAlerts.length,
    isOpen,
  })

  if (filteredAlerts.length === 0) {
    return (
      <div className="p-3 border-b bg-background">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            Alerts
          </h2>
          <ChevronRight className="h-4 w-4 text-muted-foreground cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
        </div>
        <p className="text-sm text-muted-foreground mt-1">No alerts for the selected date.</p>
      </div>
    )
  }

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border-b">
      <div className="p-3 bg-background">
        <CollapsibleTrigger className="flex w-full items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <h2 className="text-base font-semibold">Alerts</h2>
            <Badge variant="destructive" className="rounded-full px-2 py-0 text-xs">
              {filteredAlerts.length}
            </Badge>
          </div>
          <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-90")} />
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="px-3 pb-3 max-h-[250px] overflow-auto">
          <div className="space-y-2">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "rounded-md border p-2 transition-colors",
                  activeAlerts.includes(alert.id) ? "bg-accent border-primary" : "hover:bg-accent/50",
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium flex items-center gap-1 text-sm">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full inline-block",
                          alert.severity === "alert" ? "bg-red-500" : "bg-amber-500",
                        )}
                      />
                      {alert.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{parse(alert.date, "yyyy-MM-dd", new Date()).toLocaleDateString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => {
                      console.log(`Focusing on alert: ${alert.id}`)
                      focusOnAlert(alert.id)
                    }}
                  >
                    {alert.latitude && alert.longitude ? <MapPin className="h-4 w-4" /> : <Map className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

