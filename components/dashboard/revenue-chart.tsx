"use client"

import { useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import type { RevenueDataPoint } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { formatCompactNumber } from "@/lib/calculations"
import { markets } from "@/lib/mock-data"

interface RevenueChartProps {
  data: RevenueDataPoint[]
}

type MetricType = "revenue-ars" | "revenue-usd" | "occupancy" | "pax" | "seats" | "frequencies"

const metricLabels: Record<MetricType, string> = {
  "revenue-ars": "Revenue (ARS)",
  "revenue-usd": "Revenue (USD)",
  occupancy: "% Load Factor",
  pax: "Pasajeros",
  seats: "Asientos",
  frequencies: "Frecuencias",
}

export function RevenueChart({ data }: RevenueChartProps) {
  const [metric, setMetric] = useState<MetricType>("revenue-ars")
  const [dateRange, setDateRange] = useState<"7d" | "14d" | "30d">("7d")
  const [selectedMarket, setSelectedMarket] = useState<string>("all")

  const getDataKey = () => {
    switch (metric) {
      case "revenue-ars":
        return "revenue"
      case "revenue-usd":
        return "revenueUSD"
      case "occupancy":
        return "occupancy"
      case "pax":
        return "pax"
      case "seats":
        return "seats"
      case "frequencies":
        return "frequencies"
    }
  }

  const getTargetKey = () => {
    switch (metric) {
      case "revenue-ars":
        return "target"
      case "revenue-usd":
        return "targetUSD"
      default:
        return null
    }
  }

  const formatValue = (value: number) => {
    switch (metric) {
      case "revenue-ars":
        return formatCompactNumber(value, "ARS")
      case "revenue-usd":
        return formatCompactNumber(value, "USD")
      case "occupancy":
        return `${value}%`
      default:
        return value.toLocaleString("es-AR")
    }
  }

  const targetKey = getTargetKey()
  const isBarChart = metric === "pax" || metric === "seats" || metric === "frequencies"

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Métricas de Performance</h3>
          <p className="text-sm text-muted-foreground">Análisis por período y mercado</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Selector de métrica */}
          <Select value={metric} onValueChange={(v) => setMetric(v as MetricType)}>
            <SelectTrigger className="w-[160px] h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(metricLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Filtro de fecha */}
          <div className="flex rounded-lg border border-border overflow-hidden">
            {(["7d", "14d", "30d"] as const).map((range) => (
              <Button
                key={range}
                variant="ghost"
                size="sm"
                onClick={() => setDateRange(range)}
                className={`rounded-none h-9 px-3 ${dateRange === range ? "bg-muted" : ""}`}
              >
                {range === "7d" ? "7D" : range === "14d" ? "14D" : "30D"}
              </Button>
            ))}
          </div>

          {/* Filtro de mercado */}
          <Select value={selectedMarket} onValueChange={setSelectedMarket}>
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Todos los mercados" />
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
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {isBarChart ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatValue(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number) => [formatValue(value), metricLabels[metric]]}
              />
              <Bar dataKey={getDataKey()} name={metricLabels[metric]} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatValue(value)}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                formatter={(value: number, name: string) => [
                  formatValue(value),
                  name === "target" || name === "targetUSD" ? "Objetivo" : metricLabels[metric],
                ]}
              />
              <Legend />
              {targetKey && (
                <Area
                  type="monotone"
                  dataKey={targetKey}
                  name="Objetivo"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#colorTarget)"
                />
              )}
              <Area
                type="monotone"
                dataKey={getDataKey()}
                name={metricLabels[metric]}
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorMetric)"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
