import type { Service } from "@/types"
import { formatCurrency } from "@/lib/calculations"
import { Users, Clock, Zap, DollarSign } from "lucide-react"

interface ServiceMetricsProps {
  service: Service
}

export function ServiceMetrics({ service }: ServiceMetricsProps) {
  const metrics = [
    {
      label: "Asientos Vendidos",
      value: `${service.soldSeats}/${service.totalSeats}`,
      subtext: `${service.currentOccupancy}% ocupación`,
      icon: Users,
    },
    {
      label: "Días para Salida",
      value: service.daysUntilDeparture.toString(),
      subtext: service.date,
      icon: Clock,
    },
    {
      label: "Velocidad de Venta",
      value: `${service.bookingVelocity.toFixed(1)}/día`,
      subtext: `Esperado: ${service.expectedVelocity.toFixed(1)}/día`,
      icon: Zap,
    },
    {
      label: "Precio Base",
      value: formatCurrency(service.basePrice),
      subtext: `Actual: ${formatCurrency(service.currentPrice)}`,
      icon: DollarSign,
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <metric.icon className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{metric.label}</span>
          </div>
          <p className="text-xl font-semibold text-foreground">{metric.value}</p>
          <p className="text-xs text-muted-foreground">{metric.subtext}</p>
        </div>
      ))}
    </div>
  )
}
