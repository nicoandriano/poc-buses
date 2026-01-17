"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { Alert } from "@/types"
import { AlertTriangle, AlertCircle, Info, Clock, Check, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AlertCardProps {
  alert: Alert
  onAcknowledge?: (id: string) => void
}

export function AlertCard({ alert, onAcknowledge }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false)

  const severityConfig = {
    critical: {
      icon: AlertTriangle,
      bg: "bg-red-50 border-red-200",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      label: "Crítica",
      labelBg: "bg-red-100 text-red-700",
    },
    warning: {
      icon: AlertCircle,
      bg: "bg-amber-50 border-amber-200",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      label: "Advertencia",
      labelBg: "bg-amber-100 text-amber-700",
    },
    info: {
      icon: Info,
      bg: "bg-blue-50 border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      label: "Info",
      labelBg: "bg-blue-100 text-blue-700",
    },
  }

  const typeLabels = {
    occupation: "Ocupación",
    competition: "Competencia",
    demand: "Demanda",
    price: "Precio",
  }

  const config = severityConfig[alert.severity]
  const Icon = config.icon

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-all",
        alert.acknowledged ? "bg-muted/50 border-border opacity-70" : config.bg,
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("rounded-full p-2 shrink-0", alert.acknowledged ? "bg-muted" : config.iconBg)}>
          <Icon className={cn("h-4 w-4", alert.acknowledged ? "text-muted-foreground" : config.iconColor)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground">{alert.serviceName}</span>
              <span className={cn("px-2 py-0.5 rounded text-xs font-medium", config.labelBg)}>{config.label}</span>
              <span className="px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground">
                {typeLabels[alert.type]}
              </span>
            </div>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1 hover:bg-muted rounded transition-colors shrink-0"
            >
              {expanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </div>

          <p className="text-sm text-muted-foreground">{alert.message}</p>

          <div className="flex items-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(alert.timestamp).toLocaleString("es-CL", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            {alert.acknowledged && (
              <div className="flex items-center gap-1 text-xs text-emerald-600">
                <Check className="h-3 w-3" />
                Revisada
              </div>
            )}
          </div>

          {expanded && (
            <div className="mt-3 pt-3 border-t border-border">
              <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">ID Servicio</p>
                  <p className="font-mono text-foreground">{alert.serviceId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Tipo de Alerta</p>
                  <p className="text-foreground">{typeLabels[alert.type]}</p>
                </div>
              </div>
              {!alert.acknowledged && (
                <Button size="sm" onClick={() => onAcknowledge?.(alert.id)}>
                  <Check className="h-4 w-4 mr-1" />
                  Marcar como revisada
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
