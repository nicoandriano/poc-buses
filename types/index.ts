// Types for the BusRevenue platform

export type ServiceStatus = "ahead-3" | "ahead-2" | "ahead-1" | "on-curve" | "behind-1" | "behind-2" | "behind-3"
export type AlertSeverity = "critical" | "warning" | "info"
export type AlertType = "occupation" | "competition" | "demand" | "price"
export type DayPattern = "weekday" | "friday" | "saturday" | "sunday" | "holiday"
export type Currency = "ARS" | "USD"
export type ClusterType = "day-of-week" | "time-of-day" | "season" | "special"

export interface Market {
  id: string
  name: string
  origin: string
  destination: string
  distance: number
  avgDuration: string
  dailyServices: number
  currentOccupancy: number
  targetOccupancy: number
  revenue: number
  revenueTarget: number
  revenueUSD: number
  revenueTargetUSD: number
}

export interface Service {
  id: string
  marketId: string
  marketName: string
  departureTime: string
  arrivalTime: string
  date: string
  daysUntilDeparture: number
  ap: number
  totalSeats: number
  soldSeats: number
  currentOccupancy: number
  targetOccupancy: number
  currentPrice: number
  basePrice: number
  recommendedPrice: number
  priceChange: number
  status: ServiceStatus
  gap: number
  bookingVelocity: number
  expectedVelocity: number
  revenueTotal: number
  revenueTotalUSD: number
  comments: string
  tags: string[]
}

export interface CurvePoint {
  daysBeforeDeparture: number
  expectedOccupancy: number
  toleranceLower: number
  toleranceUpper: number
}

export interface FillingCurve {
  id: string
  marketId: string
  pattern: DayPattern
  clusterId?: string // optional cluster assignment
  points: CurvePoint[]
  zoneConfig: CurveZoneConfig
}

export interface Alert {
  id: string
  serviceId: string
  serviceName: string
  type: AlertType
  severity: AlertSeverity
  message: string
  timestamp: string
  acknowledged: boolean
  actionTaken?: string
}

export interface AlertRule {
  id: string
  name: string
  type: AlertType
  condition: string
  threshold: number
  severity: AlertSeverity
  enabled: boolean
}

export interface AggressivenessConfig {
  global: number
  marketOverrides: Record<string, number>
  safetyLimits: {
    maxPriceIncrease: number
    maxPriceDecrease: number
    minPrice: number
    maxPrice: number
  }
}

export interface DashboardKPIs {
  totalRevenue: number
  totalRevenueUSD: number
  revenueTarget: number
  revenueTargetUSD: number
  revenueGrowth: number
  avgOccupancy: number
  occupancyTarget: number
  totalServices: number
  servicesOnTarget: number
  servicesBehind: number
  servicesAhead: number
  activeAlerts: number
  criticalAlerts: number
  totalPax: number
  totalSeats: number
  totalFrequencies: number
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  revenueUSD: number
  target: number
  targetUSD: number
  occupancy: number
  pax: number
  seats: number
  frequencies: number
}

export interface Cluster {
  id: string
  name: string
  type: ClusterType
  description: string
  tags: string[]
  marketId: string
  conditions: {
    daysOfWeek?: number[] // 0-6 (domingo-sábado)
    timeRange?: { start: string; end: string } // "18:00" - "23:59"
    dateRange?: { start: string; end: string } // "12-01" - "02-28"
    holidays?: boolean
  }
  isActive: boolean
}

export interface CurveZone {
  id: string
  name: string
  level: number // -3 to +3, 0 = on-curve
  minDeviation: number // percentage
  maxDeviation: number // percentage
  color: string
  action: string
}

export interface CurveZoneConfig {
  tolerance: number // percentage for "on-curve" zone
  zones: CurveZone[]
}
