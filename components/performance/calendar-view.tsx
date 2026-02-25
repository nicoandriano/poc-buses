"use client"

import { useMemo, useState } from "react"
import type { Service, ServiceStatus } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { markets } from "@/lib/mock-data"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface CalendarViewProps {
  services: Service[]
}

const statusOrder: ServiceStatus[] = [
  "ahead-3", "ahead-2", "ahead-1", "on-curve",
  "behind-1", "behind-2", "behind-3",
]

const statusBarColors: Record<ServiceStatus, string> = {
  "ahead-3": "bg-emerald-600",
  "ahead-2": "bg-emerald-400",
  "ahead-1": "bg-teal-300",
  "on-curve": "bg-blue-500",
  "behind-1": "bg-amber-400",
  "behind-2": "bg-orange-500",
  "behind-3": "bg-red-600",
}

const statusLabels: Record<ServiceStatus, string> = {
  "ahead-3": "Muy Adelante",
  "ahead-2": "Adelante",
  "ahead-1": "Lev. Adelante",
  "on-curve": "En Curva",
  "behind-1": "Lev. Atrasado",
  "behind-2": "Atrasado",
  "behind-3": "Muy Atrasado",
}

const dayNames = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab", "Dom"]

export function CalendarView({ services }: CalendarViewProps) {
  const [filterMarket, setFilterMarket] = useState("all")
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  // We'll show a fixed calendar around the service dates
  const allDates = useMemo(() => {
    const dates = services.map((s) => s.date)
    const sorted = [...new Set(dates)].sort()
    return sorted
  }, [services])

  const baseDate = useMemo(() => {
    if (allDates.length > 0) return new Date(allDates[0] + "T12:00:00")
    return new Date()
  }, [allDates])

  const [monthOffset, setMonthOffset] = useState(0)

  const currentMonth = useMemo(() => {
    const d = new Date(baseDate)
    d.setMonth(d.getMonth() + monthOffset)
    return d
  }, [baseDate, monthOffset])

  const filteredServices = useMemo(() => {
    if (filterMarket === "all") return services
    return services.filter((s) => s.marketId === filterMarket)
  }, [services, filterMarket])

  // Group by date
  const servicesByDate = useMemo(() => {
    const map: Record<string, Service[]> = {}
    filteredServices.forEach((s) => {
      if (!map[s.date]) map[s.date] = []
      map[s.date].push(s)
    })
    return map
  }, [filteredServices])

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Monday start: getDay() returns 0=Sun, we want 0=Mon
    let startDow = firstDay.getDay() - 1
    if (startDow < 0) startDow = 6

    const days: Array<{ date: string; dayNum: number; isCurrentMonth: boolean }> = []

    // Previous month padding
    for (let i = startDow - 1; i >= 0; i--) {
      const d = new Date(year, month, -i)
      days.push({
        date: d.toISOString().split("T")[0],
        dayNum: d.getDate(),
        isCurrentMonth: false,
      })
    }

    // Current month
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const dt = new Date(year, month, d)
      days.push({
        date: dt.toISOString().split("T")[0],
        dayNum: d,
        isCurrentMonth: true,
      })
    }

    // Next month padding to fill 6 rows
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i)
      days.push({
        date: d.toISOString().split("T")[0],
        dayNum: d.getDate(),
        isCurrentMonth: false,
      })
    }

    return days
  }, [currentMonth])

  function getDistribution(svcs: Service[]) {
    const counts: Record<ServiceStatus, number> = {} as Record<ServiceStatus, number>
    statusOrder.forEach((s) => (counts[s] = 0))
    svcs.forEach((s) => counts[s.status]++)
    const total = svcs.length
    return statusOrder.map((status) => ({
      status,
      count: counts[status],
      percentage: total > 0 ? (counts[status] / total) * 100 : 0,
    }))
  }

  function getDominantStatus(svcs: Service[]): ServiceStatus | null {
    if (svcs.length === 0) return null
    const counts: Record<string, number> = {}
    svcs.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1
    })
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as ServiceStatus
  }

  const monthName = currentMonth.toLocaleDateString("es-AR", { month: "long", year: "numeric" })

  const selectedDateServices = selectedDate ? servicesByDate[selectedDate] || [] : []

  return (
    <div className="rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonthOffset((p) => p - 1)}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h3 className="font-semibold text-foreground capitalize min-w-[160px] text-center">
            {monthName}
          </h3>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setMonthOffset((p) => p + 1)}>
            <ChevronRight className="h-4 w-4" />
          </Button>
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

      {/* Legend */}
      <div className="px-4 py-2 border-b border-border flex flex-wrap gap-x-4 gap-y-1">
        {statusOrder.map((status) => (
          <div key={status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("h-2.5 w-2.5 rounded-sm shrink-0", statusBarColors[status])} />
            <span>{statusLabels[status]}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Calendar grid */}
        <div className="flex-1 p-4">
          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {dayNames.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar cells */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(({ date, dayNum, isCurrentMonth }) => {
              const daySvcs = servicesByDate[date] || []
              const hasServices = daySvcs.length > 0
              const dist = hasServices ? getDistribution(daySvcs) : []
              const isSelected = selectedDate === date

              return (
                <button
                  key={date}
                  onClick={() => hasServices ? setSelectedDate(isSelected ? null : date) : undefined}
                  className={cn(
                    "relative flex flex-col items-stretch rounded-lg p-1.5 min-h-[72px] transition-all text-left",
                    isCurrentMonth ? "bg-background" : "bg-muted/30",
                    hasServices && "cursor-pointer hover:ring-2 hover:ring-primary/30",
                    !hasServices && "cursor-default",
                    isSelected && "ring-2 ring-primary bg-primary/5",
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-medium mb-1",
                      isCurrentMonth ? "text-foreground" : "text-muted-foreground/50",
                    )}
                  >
                    {dayNum}
                  </span>

                  {hasServices && (
                    <>
                      {/* Stacked bar */}
                      <div className="flex h-3 rounded-sm overflow-hidden w-full">
                        {dist.map(({ status, percentage, count }) =>
                          count > 0 ? (
                            <div
                              key={status}
                              className={cn("transition-all", statusBarColors[status])}
                              style={{ width: `${percentage}%` }}
                            />
                          ) : null,
                        )}
                      </div>

                      <span className="text-[10px] text-muted-foreground mt-1">
                        {daySvcs.length} srv
                      </span>
                    </>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Detail panel */}
        {selectedDate && selectedDateServices.length > 0 && (
          <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-border p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-foreground text-sm">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-AR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </h4>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Cerrar
              </button>
            </div>

            {/* Distribution for this date */}
            <div className="flex h-5 rounded-md overflow-hidden mb-3">
              {getDistribution(selectedDateServices).map(({ status, percentage, count }) =>
                count > 0 ? (
                  <div
                    key={status}
                    className={cn("transition-all", statusBarColors[status])}
                    style={{ width: `${percentage}%` }}
                    title={`${statusLabels[status]}: ${count}`}
                  />
                ) : null,
              )}
            </div>

            {/* Service list */}
            <div className="space-y-1.5 max-h-[400px] overflow-y-auto">
              {selectedDateServices.map((s) => (
                <div
                  key={s.id}
                  className={cn(
                    "flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs border",
                    s.status === "ahead-3" && "bg-emerald-50 border-emerald-200",
                    s.status === "ahead-2" && "bg-emerald-50/70 border-emerald-100",
                    s.status === "ahead-1" && "bg-teal-50/60 border-teal-100",
                    s.status === "on-curve" && "bg-blue-50 border-blue-100",
                    s.status === "behind-1" && "bg-amber-50 border-amber-200",
                    s.status === "behind-2" && "bg-orange-50 border-orange-200",
                    s.status === "behind-3" && "bg-red-50 border-red-200",
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full shrink-0", statusBarColors[s.status])} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {s.departureTime} {s.marketName.split(" - ")[1]}
                    </p>
                    <p className="text-muted-foreground">
                      Ocp: {s.currentOccupancy}% | Gap: {s.gap > 0 ? "+" : ""}{s.gap}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
