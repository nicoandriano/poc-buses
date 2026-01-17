"use client"

import type { Alert } from "@/types"
import { AlertCard } from "./alert-card"

interface AlertsListProps {
  alerts: Alert[]
  onAcknowledge?: (id: string) => void
}

export function AlertsList({ alerts, onAcknowledge }: AlertsListProps) {
  // Group alerts by date
  const groupedAlerts = alerts.reduce(
    (acc, alert) => {
      const date = new Date(alert.timestamp).toLocaleDateString("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date].push(alert)
      return acc
    },
    {} as Record<string, Alert[]>,
  )

  return (
    <div className="space-y-6">
      {Object.entries(groupedAlerts).map(([date, dateAlerts]) => (
        <div key={date}>
          <h3 className="text-sm font-medium text-muted-foreground capitalize mb-3">{date}</h3>
          <div className="space-y-3">
            {dateAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} onAcknowledge={onAcknowledge} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
