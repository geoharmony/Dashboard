export default function TimeFilters() {
  const filters = [
    { name: "All", active: true },
    { name: "Today", active: false },
    { name: "This Week", active: false },
    { name: "This Month", active: false },
  ]

  return (
    <div className="flex space-x-2">
      {filters.map((filter, index) => (
        <button
          key={index}
          className={`px-6 py-2 rounded ${filter.active ? "bg-[#1e1e1e] text-white" : "bg-[#e7e7e7] text-[#1e1e1e]"}`}
        >
          {filter.name}
        </button>
      ))}
    </div>
  )
}

