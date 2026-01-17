"use client"

import { cn } from "@/lib/utils"
import type { Market, Currency } from "@/types"
import { formatCompactNumber } from "@/lib/calculations"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface TopMarketsProps {
  markets: Market[]
  currency?: Currency
}

export function TopMarkets({ markets, currency = "ARS" }: TopMarketsProps) {
  const sortedMarkets = [...markets].sort((a, b) => {
    const revenueA = currency === "USD" ? a.revenueUSD : a.revenue
    const revenueB = currency === "USD" ? b.revenueUSD : b.revenue
    return revenueB - revenueA
  })

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Mercados Principales</h3>
        <p className="text-sm text-muted-foreground">Revenue y ocupación actual</p>
      </div>
      <div className="space-y-3">
        {sortedMarkets.map((market) => {
          const revenue = currency === "USD" ? market.revenueUSD : market.revenue
          const revenueTarget = currency === "USD" ? market.revenueTargetUSD : market.revenueTarget
          const revenuePerformance = ((revenue - revenueTarget) / revenueTarget) * 100
          const occupancyGap = market.currentOccupancy - market.targetOccupancy
          const isAhead = revenuePerformance >= 0

          return (
            <div key={market.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{market.name}</span>
                  <span
                    className={cn(
                      "inline-flex items-center text-xs font-medium",
                      isAhead ? "text-emerald-600" : "text-red-600",
                    )}
                  >
                    {isAhead ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(revenuePerformance).toFixed(1)}%
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">{formatCompactNumber(revenue, currency)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      occupancyGap >= 0 ? "bg-emerald-500" : "bg-amber-500",
                    )}
                    style={{ width: `${market.currentOccupancy}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-10 text-right">{market.currentOccupancy}%</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
