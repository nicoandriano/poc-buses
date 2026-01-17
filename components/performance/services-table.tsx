"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Link from "next/link"
import type { Service, ServiceStatus, Currency } from "@/types"
import { StatusBadge } from "@/components/shared/status-badge"
import { OccupancyBar } from "@/components/shared/occupancy-bar"
import { formatCurrency, formatPercentage, getStatusColor, formatCompactNumber } from "@/lib/calculations"
import { ArrowUpDown, ChevronRight, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { markets } from "@/lib/mock-data"

interface ServicesTableProps {
  services: Service[]
}

type SortField = "departure" | "date" | "occupancy" | "gap" | "price" | "ap" | "revenue"
type SortDirection = "asc" | "desc"
type FilterStatus = "all" | ServiceStatus

export function ServicesTable({ services }: ServicesTableProps) {
  const [sortField, setSortField] = useState<SortField>("gap")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [filterMarket, setFilterMarket] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currency, setCurrency] = useState<Currency>("ARS")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      if (filterStatus !== "all" && s.status !== filterStatus) return false
      if (filterMarket !== "all" && s.marketId !== filterMarket) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          s.marketName.toLowerCase().includes(query) ||
          s.comments.toLowerCase().includes(query) ||
          s.tags.some((t) => t.toLowerCase().includes(query))
        )
      }
      return true
    })
  }, [services, filterStatus, filterMarket, searchQuery])

  const sortedServices = useMemo(() => {
    return [...filteredServices].sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "departure":
          comparison = a.departureTime.localeCompare(b.departureTime)
          break
        case "date":
          comparison = a.date.localeCompare(b.date)
          break
        case "occupancy":
          comparison = a.currentOccupancy - b.currentOccupancy
          break
        case "gap":
          comparison = a.gap - b.gap
          break
        case "price":
          comparison = a.currentPrice - b.currentPrice
          break
        case "ap":
          comparison = a.ap - b.ap
          break
        case "revenue":
          comparison = a.revenueTotal - b.revenueTotal
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [filteredServices, sortField, sortDirection])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: services.length }
    services.forEach((s) => {
      counts[s.status] = (counts[s.status] || 0) + 1
    })
    return counts
  }, [services])

  const allStatuses: FilterStatus[] = [
    "all",
    "ahead-3",
    "ahead-2",
    "ahead-1",
    "on-curve",
    "behind-1",
    "behind-2",
    "behind-3",
  ]

  const statusLabels: Record<FilterStatus, string> = {
    all: "Todos",
    "ahead-3": "Muy Adelante",
    "ahead-2": "Adelante",
    "ahead-1": "Lev. Adelante",
    "on-curve": "En Curva",
    "behind-1": "Lev. Atrasado",
    "behind-2": "Atrasado",
    "behind-3": "Muy Atrasado",
  }

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-foreground transition-colors"
    >
      {children}
      <ArrowUpDown className={cn("h-3 w-3", sortField === field && "text-primary")} />
    </button>
  )

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="p-4 border-b border-border space-y-3">
        {/* Búsqueda y filtros principales */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por mercado, comentario o tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterMarket} onValueChange={setFilterMarket}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Mercado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los mercados</SelectItem>
              {markets.map((market) => (
                <SelectItem key={market.id} value={market.id}>
                  {market.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={currency} onValueChange={(v) => setCurrency(v as Currency)}>
            <SelectTrigger className="w-full sm:w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ARS">ARS</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filtros de estado */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          {allStatuses.map((status) => {
            const count = statusCounts[status] || 0
            if (status !== "all" && count === 0) return null
            return (
              <Button
                key={status}
                variant={filterStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className="shrink-0 text-xs"
              >
                {statusLabels[status]}
                <span className="ml-1.5 opacity-70">({count})</span>
              </Button>
            )
          })}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Servicio
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <SortHeader field="date">Fecha</SortHeader>
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <SortHeader field="departure">Salida</SortHeader>
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <SortHeader field="ap">AP</SortHeader>
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <SortHeader field="occupancy">Ocupación</SortHeader>
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <SortHeader field="gap">Gap</SortHeader>
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <SortHeader field="price">Precio Actual</SortHeader>
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Precio Rec.
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <SortHeader field="revenue">Revenue</SortHeader>
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Estado
              </th>
              <th className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tags
              </th>
              <th className="px-3 py-2.5"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedServices.map((service) => (
              <tr key={service.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-3 py-2.5">
                  <div>
                    <p className="font-medium text-foreground truncate max-w-[180px]">{service.marketName}</p>
                    <p className="text-xs text-muted-foreground">
                      {service.soldSeats}/{service.totalSeats} asientos
                    </p>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{service.date}</td>
                <td className="px-3 py-2.5">
                  <span className="font-medium">{service.departureTime}</span>
                </td>
                <td className="px-3 py-2.5">
                  <span className="text-muted-foreground">{service.ap}d</span>
                </td>
                <td className="px-3 py-2.5 min-w-[140px]">
                  <OccupancyBar current={service.currentOccupancy} target={service.targetOccupancy} height="sm" />
                </td>
                <td className="px-3 py-2.5">
                  <span className={cn("font-semibold", getStatusColor(service.status))}>
                    {service.gap > 0 ? "+" : ""}
                    {formatPercentage(service.gap, false)}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-medium whitespace-nowrap">
                  {formatCurrency(service.currentPrice, currency)}
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  <div>
                    <span
                      className={cn(
                        "font-medium",
                        service.priceChange > 0 ? "text-emerald-600" : service.priceChange < 0 ? "text-red-600" : "",
                      )}
                    >
                      {formatCurrency(service.recommendedPrice, currency)}
                    </span>
                    {service.priceChange !== 0 && (
                      <span
                        className={cn("text-xs ml-1", service.priceChange > 0 ? "text-emerald-600" : "text-red-600")}
                      >
                        ({service.priceChange > 0 ? "+" : ""}
                        {service.priceChange.toFixed(1)}%)
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5 whitespace-nowrap">
                  {formatCompactNumber(currency === "USD" ? service.revenueTotalUSD : service.revenueTotal, currency)}
                </td>
                <td className="px-3 py-2.5">
                  <StatusBadge status={service.status} size="sm" />
                </td>
                <td className="px-3 py-2.5">
                  <div className="flex flex-wrap gap-1 max-w-[150px]">
                    {service.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {service.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{service.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <Link
                    href={`/performance/${service.id}`}
                    className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Resumen */}
      <div className="px-4 py-3 border-t border-border bg-muted/30 text-sm text-muted-foreground">
        Mostrando {sortedServices.length} de {services.length} servicios
      </div>
    </div>
  )
}
