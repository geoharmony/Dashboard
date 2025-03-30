import { Search, ChevronRight, Layers, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"
import { useMapContext } from "@/context/map-context"

export function Sidebar() {
  const {
    filteredLayers,
    toggleLayer,
    activeCategory,
    searchQuery,
    setSearchQuery,
    isSearchVisible,
    setIsSearchVisible,
  } = useMapContext()

  // Filter layers by search query
  const searchFilteredLayers = filteredLayers.filter((layer) =>
    layer.name.toLowerCase().includes(searchQuery?.toLowerCase() || ""),
  )

  // Group layers by their group property
  const groupedLayers = searchFilteredLayers.reduce(
    (acc, layer) => {
      if (!acc[layer.group]) {
        acc[layer.group] = []
      }
      acc[layer.group].push(layer)
      return acc
    },
    {} as Record<string, typeof filteredLayers>,
  )

  return (
    <div className="w-64 border-r bg-background flex flex-col h-full overflow-hidden">
      <div className="flex flex-col h-full overflow-auto">
          <div className="sticky top-0 z-10 p-3 border-b bg-background">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4" />
                Layers
              </h2>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setIsSearchVisible(!isSearchVisible)}
              >
                <Search className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>

            {isSearchVisible && (
              <div className="relative mt-2">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search layers..."
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1 h-7 w-7"
                  onClick={() => {
                    setSearchQuery("")
                    setIsSearchVisible(false)
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 p-3 overflow-auto">
            {Object.entries(groupedLayers).length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-4">
                No layers available for the selected date
              </div>
            ) : (
              Object.entries(groupedLayers).map(([group, groupLayers]) => (
                <Collapsible key={group} defaultOpen className="mb-3">
                  <CollapsibleTrigger className="flex w-full items-center justify-between font-medium">
                    <span className="text-sm">{group}</span>
                    <ChevronRight className="h-4 w-4 transition-transform duration-200 ui-open:rotate-90" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-1 space-y-1">
                    {groupLayers.map((layer) => (
                      <div key={layer.id} className="flex items-center space-x-2 py-1">
                        <Checkbox
                          id={`layer-${layer.id}`}
                          checked={layer.visible}
                          onCheckedChange={() => toggleLayer(layer.id)}
                        />
                        <Label
                          htmlFor={`layer-${layer.id}`}
                          className={`text-sm cursor-pointer ${layer.tabAssociations.includes(activeCategory) ? "font-medium" : ""}`}
                        >
                          {layer.name}
                          {layer.tabAssociations.includes(activeCategory) && (
                            <span className="ml-1 text-xs text-primary">•</span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))
            )}
          </div>
        </div>
    </div>
  )
}

