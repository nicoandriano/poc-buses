"use client"

import { useMemo, useState } from "react"
import type { Service, ServiceStatus } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { markets } from "@/lib/mock-data"
import { cn } from "@/lib/utils"

interface TimelineViewProps {
  services: Service[]
}

const statusOrder: ServiceStatus[] = [
  "ahead-3", "ahead-2", "ahead-1", "on-curve",
  "behind-1", "behind-2", "behind-3",
]

const statusLabels: Record<ServiceStatus, string> = {
  "ahead-3": "Muy Adelante",
  "ahead-2": "Adelante",
  "ahead-1": "Lev. Adelante",
  "on-curve": "En Curva",
  "behind-1": "Lev. Atrasado",
  "behind-2": "Atrasado",
  "behind-3": "Muy Atrasado",
}

const statusBarColors: Record<ServiceStatus, string> = {
  "ahead-3": "bg-emerald-600",
  "ahead-2": "bg-emerald-400",
  "ahead-1": "bg-teal-300",
  "on-curve": "bg-blue-500",
  "behind-1": "bg-amber-400",
  "behind-2": "bg-orange-500",
  "behind-3": "bg-red-600",
}

export function TimelineView({ services }: TimelineViewProps) {
  const [filterMarket, setFilterMarket] = useState("all")
  const [hoveredDate, setHoveredDate] = useState<string | null>(null)

  const filteredServices = useMemo(() => {
    if (filterMarket === "all") return services
    return services.filter((s) => s.marketId === filterMarket)
  }, [services, filterMarket])

  // Group by date, sorted chronologically
  const dateGroups = useMemo(() => {
    const groups: Record<string, Service[]> = {}
    filteredServices.forEach((s) => {
      if (!groups[s.date]) groups[s.date] = []
      groups[s.date].push(s)
    })
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredServices])

  const maxServicesInDay = useMemo(() => {
    return Math.max(...dateGroups.map(([, svcs]) => svcs.length), 1)
  }, [dateGroups])

  // Overall distribution
  const overallDistribution = useMemo(() => {
    const counts: Record<ServiceStatus, number> = {} as Record<ServiceStatus, number>
    statusOrder.forEach((s) => (counts[s] = 0))
    filteredServices.forEach((s) => counts[s.status]++)
    const total = filteredServices.length
    return statusOrder.map((status) => ({
      status,
      count: counts[status],
      percentage: total > 0 ? (counts[status] / total) * 100 : 0,
    }))
  }, [filteredServices])

  function getDistribution(svcs: Service[]) {
    const counts: Record<ServiceStatus, number> = {} as Record<ServiceStatus, number>
    statusOrder.forEach((s) => (counts[s] = 0))
    svcs.forEach((s) => counts[s.status]++)
    return statusOrder.map((status) => ({
      status,
      count: counts[status],
    }))
  }

  function formatDateShort(dateStr: string) {
    const d = new Date(dateStr + "T12:00:00")
    return d.toLocaleDateString("es-AR", { day: "numeric" })
  }

  function formatDayName(dateStr: string) {
    const d = new Date(dateStr + "T12:00:00")
    return d.toLocaleDateString("es-AR", { weekday: "short" }).slice(0, 2)
  }

  function isWeekend(dateStr: string) {
    const d = new Date(dateStr + "T12:00:00")
    const day = d.getDay()
    return day === 0 || day === 6
  }

  const hoveredData = useMemo(() => {
    if (!hoveredDate) return null
    const svcs = dateGroups.find(([d]) => d === hoveredDate)?.[1] || []
    const dist = getDistribution(svcs)
    return {
      date: new Date(hoveredDate + "T12:00:00").toLocaleDateString("es-AR", {
        weekday: "long", day: "numeric", month: "long"
      }),
      total: svcs.length,
      distribution: dist.filter(d => d.count > 0),
    }
  }, [hoveredDate, dateGroups])

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div>
          <h3 className="font-semibold text-foreground">Timeline de Servicios</h3>
          <p className="text-sm text-muted-foreground">
            {filteredServices.length} servicios en {dateGroups.length} dias
          </p>
        </div>
        <Select value={filterMarket} onValueChange={setFilterMarket}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Mercado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los mercados</SelectItem>
            {markets.map((m) => (
              <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary bar */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">Resumen General</p>
        <div className="flex h-7 rounded-lg overflow-hidden">
          {overallDistribution.map(({ status, percentage, count }) =>
            count > 0 ? (
              <div
                key={status}
                className={cn("flex items-center justify-center transition-all", statusBarColors[status])}
                style={{ width: `${percentage}%` }}
                title={`${statusLabels[status]}: ${count} (${percentage.toFixed(1)}%)`}
              >
                {percentage > 6 && (
                  <span className="text-[11px] font-semibold text-white drop-shadow-sm">
                    {count}
                  </span>
                )}
              </div>
            ) : null,
          )}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
          {overallDistribution.map(({ status, count, percentage }) =>
            count > 0 ? (
              <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className={cn("h-2.5 w-2.5 rounded-sm shrink-0", statusBarColors[status])} />
                <span>{statusLabels[status]}</span>
                <span className="font-medium text-foreground">{count}</span>
                <span>({percentage.toFixed(0)}%)</span>
              </div>
            ) : null,
          )}
        </div>
      </div>

      {/* Timeline chart area */}
      <div className="p-4">
        {/* Tooltip area */}
        <div className="h-16 mb-2 flex items-end">
          {hoveredData ? (
            <div className="text-sm animate-in fade-in duration-150">
              <p className="font-medium text-foreground capitalize">{hoveredData.date}</p>
              <p className="text-muted-foreground">
                {hoveredData.total} servicios:
                {hoveredData.distribution.map(d => (
                  <span key={d.status} className="ml-2">
                    {statusLabels[d.status]} <span className="font-medium text-foreground">{d.count}</span>
                  </span>
                ))}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Pasar el cursor sobre una barra para ver detalles</p>
          )}
        </div>

        {/* Horizontal timeline with vertical stacked bars */}
        <div className="flex items-end gap-[2px] overflow-x-auto pb-2" style={{ minHeight: 220 }}>
          {dateGroups.map(([date, svcs]) => {
            const dist = getDistribution(svcs)
            const barHeight = (svcs.length / maxServicesInDay) * 180
            const weekend = isWeekend(date)
            const isHovered = hoveredDate === date

            return (
              <div
                key={date}
                className="flex flex-col items-center shrink-0"
                style={{ width: dateGroups.length > 20 ? 28 : 40 }}
                onMouseEnter={() => setHoveredDate(date)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                {/* Stacked bar */}
                <div
                  className={cn(
                    "w-full rounded-t-sm overflow-hidden cursor-pointer transition-all flex flex-col-reverse",
                    isHovered && "ring-2 ring-primary/50 ring-offset-1"
                  )}
                  style={{ height: Math.max(barHeight, 8) }}
                >
                  {dist.map(({ status, count }) => {
                    if (count === 0) return null
                    const segmentHeight = (count / svcs.length) * 100
                    return (
                      <div
                        key={status}
                        className={cn("w-full transition-all", statusBarColors[status])}
                        style={{ height: `${segmentHeight}%` }}
                      />
                    )
                  })}
                </div>

                {/* Date label */}
                <div className={cn(
                  "mt-1 text-center leading-none",
                  weekend ? "text-primary" : "text-muted-foreground"
                )}>
                  <p className="text-[10px] font-medium">{formatDayName(date)}</p>
                  <p className="text-[11px] font-semibold">{formatDateShort(date)}</p>
                </div>

                {/* Count below */}
                <p className="text-[9px] text-muted-foreground mt-0.5">{svcs.length}</p>
              </div>
            )
          })}
        </div>

        {/* X-axis line */}
        <div className="h-px bg-border -mt-[26px] mb-6" />
      </div>
    </div>
  )
}
