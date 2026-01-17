import type { ServiceStatus, Service, CurvePoint, AggressivenessConfig } from "@/types"

export function getStatusFromGap(gap: number): ServiceStatus {
  if (gap >= 15) return "ahead-3"
  if (gap >= 10) return "ahead-2"
  if (gap >= 5) return "ahead-1"
  if (gap > -5) return "on-curve"
  if (gap > -10) return "behind-1"
  if (gap > -15) return "behind-2"
  return "behind-3"
}

export function getStatusColor(status: ServiceStatus): string {
  switch (status) {
    case "ahead-3":
      return "text-emerald-700"
    case "ahead-2":
      return "text-emerald-600"
    case "ahead-1":
      return "text-emerald-500"
    case "on-curve":
      return "text-blue-600"
    case "behind-1":
      return "text-amber-500"
    case "behind-2":
      return "text-orange-600"
    case "behind-3":
      return "text-red-600"
  }
}

export function getStatusBgColor(status: ServiceStatus): string {
  switch (status) {
    case "ahead-3":
      return "bg-emerald-100 border-emerald-300"
    case "ahead-2":
      return "bg-emerald-50 border-emerald-200"
    case "ahead-1":
      return "bg-emerald-50/50 border-emerald-100"
    case "on-curve":
      return "bg-blue-50 border-blue-200"
    case "behind-1":
      return "bg-amber-50 border-amber-200"
    case "behind-2":
      return "bg-orange-50 border-orange-200"
    case "behind-3":
      return "bg-red-50 border-red-200"
  }
}

export function getStatusDot(status: ServiceStatus): string {
  switch (status) {
    case "ahead-3":
      return "bg-emerald-700"
    case "ahead-2":
      return "bg-emerald-600"
    case "ahead-1":
      return "bg-emerald-500"
    case "on-curve":
      return "bg-blue-500"
    case "behind-1":
      return "bg-amber-500"
    case "behind-2":
      return "bg-orange-500"
    case "behind-3":
      return "bg-red-500"
  }
}

export function formatCurrency(value: number, currency: "ARS" | "USD" = "ARS"): string {
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercentage(value: number, showSign = false): string {
  const sign = showSign && value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

export function formatCompactNumber(value: number, currency: "ARS" | "USD" = "ARS"): string {
  const symbol = currency === "USD" ? "US$" : "$"
  if (value >= 1000000000) {
    return `${symbol}${(value / 1000000000).toFixed(1)}B`
  }
  if (value >= 1000000) {
    return `${symbol}${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `${symbol}${(value / 1000).toFixed(0)}K`
  }
  return `${symbol}${value}`
}

export function calculateRecommendedPrice(
  service: Service,
  aggressiveness: number,
  safetyLimits: AggressivenessConfig["safetyLimits"],
): number {
  const gap = service.currentOccupancy - service.targetOccupancy
  const baseMultiplier = aggressiveness / 10

  let priceChange = 0

  if (gap > 0) {
    // Ahead of target - increase price
    priceChange = gap * 0.5 * baseMultiplier
  } else {
    // Behind target - decrease price
    priceChange = gap * 0.8 * baseMultiplier
  }

  // Apply safety limits
  priceChange = Math.max(priceChange, -safetyLimits.maxPriceDecrease)
  priceChange = Math.min(priceChange, safetyLimits.maxPriceIncrease)

  const newPrice = service.currentPrice * (1 + priceChange / 100)

  // Apply absolute limits
  return Math.max(safetyLimits.minPrice, Math.min(safetyLimits.maxPrice, Math.round(newPrice)))
}

export function getExpectedOccupancy(daysUntilDeparture: number, curvePoints: CurvePoint[]): CurvePoint | null {
  // Find the two points that bracket the current days
  const sortedPoints = [...curvePoints].sort((a, b) => b.daysBeforeDeparture - a.daysBeforeDeparture)

  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const upper = sortedPoints[i]
    const lower = sortedPoints[i + 1]

    if (daysUntilDeparture <= upper.daysBeforeDeparture && daysUntilDeparture >= lower.daysBeforeDeparture) {
      // Interpolate
      const range = upper.daysBeforeDeparture - lower.daysBeforeDeparture
      const position = (upper.daysBeforeDeparture - daysUntilDeparture) / range

      return {
        daysBeforeDeparture: daysUntilDeparture,
        expectedOccupancy: upper.expectedOccupancy + (lower.expectedOccupancy - upper.expectedOccupancy) * position,
        toleranceLower: upper.toleranceLower + (lower.toleranceLower - upper.toleranceLower) * position,
        toleranceUpper: upper.toleranceUpper + (lower.toleranceUpper - upper.toleranceUpper) * position,
      }
    }
  }

  return sortedPoints[0] || null
}
