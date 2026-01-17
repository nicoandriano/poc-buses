"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import type { CurvePoint, CurveZoneConfig } from "@/types"

interface CurveChartProps {
  points: CurvePoint[]
  zoneConfig?: CurveZoneConfig
  editMode?: boolean
  onPointClick?: (point: CurvePoint) => void
}

export function CurveChart({ points, zoneConfig, editMode = false, onPointClick }: CurveChartProps) {
  const chartData = [...points]
    .sort((a, b) => b.daysBeforeDeparture - a.daysBeforeDeparture)
    .map((point) => {
      const baseData = {
        ...point,
        label: point.daysBeforeDeparture === 0 ? "D-0" : `D-${point.daysBeforeDeparture}`,
      }

      // Add zone bands if config is provided
      if (zoneConfig) {
        const zones = zoneConfig.zones.sort((a, b) => b.level - a.level)
        zones.forEach((zone) => {
          const minOcc = point.expectedOccupancy + zone.minDeviation
          const maxOcc = point.expectedOccupancy + zone.maxDeviation
          ;(baseData as Record<string, number | string>)[`zone_${zone.id}_min`] = Math.max(0, Math.min(100, minOcc))
          ;(baseData as Record<string, number | string>)[`zone_${zone.id}_max`] = Math.max(0, Math.min(100, maxOcc))
        })
      }

      return baseData
    })

  const zones = zoneConfig?.zones.sort((a, b) => b.level - a.level) || []

  return (
    <div className="h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
          <defs>
            {zones.map((zone) => (
              <linearGradient key={zone.id} id={`gradient-${zone.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={zone.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={zone.color} stopOpacity={0.1} />
              </linearGradient>
            ))}
            <linearGradient id="toleranceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} reversed />
          <YAxis
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
            formatter={(value: number, name: string) => {
              const labels: Record<string, string> = {
                expectedOccupancy: "Objetivo",
                toleranceUpper: "Tolerancia +",
                toleranceLower: "Tolerancia -",
              }
              // Handle zone labels
              if (name.startsWith("zone_")) {
                const parts = name.split("_")
                const zoneId = parts[1] + "-" + parts[2]
                const zone = zones.find((z) => z.id === zoneId)
                if (zone) {
                  return [`${value.toFixed(1)}%`, zone.name]
                }
              }
              return [`${value.toFixed(1)}%`, labels[name] || name]
            }}
          />

          {/* Zone bands (render from outside to inside) */}
          {zoneConfig &&
            [...zones]
              .reverse()
              .map((zone, idx) => (
                <Area
                  key={zone.id}
                  type="monotone"
                  dataKey={`zone_${zone.id}_max`}
                  stroke={zone.color}
                  strokeWidth={0}
                  fill={zone.color}
                  fillOpacity={0.15}
                />
              ))}

          {/* Upper tolerance band */}
          <Area
            type="monotone"
            dataKey="toleranceUpper"
            stroke="#94a3b8"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="url(#toleranceGradient)"
          />
          {/* Lower tolerance band */}
          <Area
            type="monotone"
            dataKey="toleranceLower"
            stroke="#94a3b8"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="white"
          />
          {/* Expected curve */}
          <Area
            type="monotone"
            dataKey="expectedOccupancy"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fill="none"
            dot={
              editMode
                ? { r: 6, fill: "#3b82f6", stroke: "white", strokeWidth: 2, cursor: "pointer" }
                : { r: 3, fill: "#3b82f6" }
            }
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
