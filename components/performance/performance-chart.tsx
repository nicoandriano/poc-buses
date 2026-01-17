"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"
import type { CurvePoint } from "@/types"

interface PerformanceChartProps {
  curvePoints: CurvePoint[]
  currentDays: number
  currentOccupancy: number
}

export function PerformanceChart({ curvePoints, currentDays, currentOccupancy }: PerformanceChartProps) {
  // Transform data for the chart (reverse so 30 days is on left)
  const chartData = [...curvePoints]
    .sort((a, b) => b.daysBeforeDeparture - a.daysBeforeDeparture)
    .map((point) => ({
      days: point.daysBeforeDeparture,
      label: `D-${point.daysBeforeDeparture}`,
      expected: point.expectedOccupancy,
      upper: point.toleranceUpper,
      lower: point.toleranceLower,
      current: point.daysBeforeDeparture === currentDays ? currentOccupancy : null,
    }))

  // Add current position if not exactly on a curve point
  const hasCurrentPoint = chartData.some((d) => d.days === currentDays)
  if (!hasCurrentPoint && currentDays >= 0 && currentDays <= 30) {
    chartData.push({
      days: currentDays,
      label: `D-${currentDays}`,
      expected: 0,
      upper: 0,
      lower: 0,
      current: currentOccupancy,
    })
    chartData.sort((a, b) => b.days - a.days)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Curva de Llenado vs Actual</h3>
        <p className="text-sm text-muted-foreground">Comparación con objetivo por días antes de salida</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTolerance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#94a3b8" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} reversed />
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
                  expected: "Objetivo",
                  upper: "Límite superior",
                  lower: "Límite inferior",
                  current: "Actual",
                }
                return [`${value?.toFixed(1)}%`, labels[name] || name]
              }}
            />
            {/* Tolerance band */}
            <Area type="monotone" dataKey="upper" stroke="transparent" fill="url(#colorTolerance)" fillOpacity={1} />
            <Area type="monotone" dataKey="lower" stroke="transparent" fill="white" fillOpacity={1} />
            {/* Expected line */}
            <Area
              type="monotone"
              dataKey="expected"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="none"
              strokeDasharray="5 5"
            />
            {/* Current position marker */}
            <ReferenceLine x={`D-${currentDays}`} stroke="#10b981" strokeWidth={2} />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#10b981"
              strokeWidth={3}
              fill="none"
              dot={{ r: 6, fill: "#10b981", stroke: "white", strokeWidth: 2 }}
              connectNulls={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-0.5 w-6 bg-blue-500" style={{ borderStyle: "dashed" }} />
          <span className="text-muted-foreground">Objetivo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-6 bg-slate-200 rounded" />
          <span className="text-muted-foreground">Tolerancia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Actual</span>
        </div>
      </div>
    </div>
  )
}
