export default function RegionTabs() {
  const regions = [
    { name: "All States", active: true },
    { name: "Central Equatoria", active: false },
    { name: "Eastern Equatoria", active: false },
    { name: "Jonglei", active: false },
    { name: "Lakes", active: false },
    { name: "Northern Bahr el Ghazal", active: false },
    { name: "Unity", active: false },
    { name: "Upper Nile", active: false },
    { name: "Warrap", active: false },
    { name: "Western Bahr el Ghazal", active: false },
    { name: "Western Equatoria", active: false },
  ]

  return (
    <div className="border border-[#e1e1e1] rounded mb-8 flex overflow-x-auto">
      {regions.map((region, index) => (
        <button
          key={index}
          className={`px-4 py-3 whitespace-nowrap ${
            region.active ? "bg-[#1e1e1e] text-white" : "bg-[#f3f3f3] text-[#1e1e1e]"
          }`}
        >
          {region.name}
        </button>
      ))}
    </div>
  )
}

