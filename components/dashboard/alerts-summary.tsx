import { cn } from "@/lib/utils"
import type { Alert } from "@/types"
import { AlertTriangle, AlertCircle, Info, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface AlertsSummaryProps {
  alerts: Alert[]
}

export function AlertsSummary({ alerts }: AlertsSummaryProps) {
  const unacknowledged = alerts.filter((a) => !a.acknowledged)

  const severityIcon = {
    critical: AlertTriangle,
    warning: AlertCircle,
    info: Info,
  }

  const severityStyle = {
    critical: "text-red-600 bg-red-50",
    warning: "text-amber-600 bg-amber-50",
    info: "text-blue-600 bg-blue-50",
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Alertas Recientes</h3>
          <p className="text-sm text-muted-foreground">{unacknowledged.length} sin revisar</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/alerts">Ver todas</Link>
        </Button>
      </div>
      <div className="space-y-3">
        {alerts.slice(0, 4).map((alert) => {
          const Icon = severityIcon[alert.severity]

          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border",
                alert.acknowledged ? "bg-muted/50 border-border" : "bg-card border-border",
              )}
            >
              <div className={cn("rounded-full p-1.5", severityStyle[alert.severity])}>
                <Icon className="h-3.5 w-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{alert.serviceName}</p>
                <p className="text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(alert.timestamp).toLocaleTimeString("es-CL", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
