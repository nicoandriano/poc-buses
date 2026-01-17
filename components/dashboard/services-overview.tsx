import { cn } from "@/lib/utils"
import type { Service } from "@/types"
import { getStatusColor, getStatusDot, formatCurrency, formatPercentage } from "@/lib/calculations"
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ServicesOverviewProps {
  services: Service[]
}

export function ServicesOverview({ services }: ServicesOverviewProps) {
  const sortedServices = [...services].sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Servicios Destacados</h3>
          <p className="text-sm text-muted-foreground">Mayor desviación del objetivo</p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/performance">Ver todos</Link>
        </Button>
      </div>
      <div className="space-y-2">
        {sortedServices.slice(0, 5).map((service) => {
          const GapIcon = service.gap > 0 ? ArrowUpRight : service.gap < 0 ? ArrowDownRight : Minus

          return (
            <Link
              key={service.id}
              href={`/performance/${service.id}`}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className={cn("h-2.5 w-2.5 rounded-full", getStatusDot(service.status))} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {service.marketName} - {service.departureTime}
                </p>
                <p className="text-xs text-muted-foreground">
                  {service.soldSeats}/{service.totalSeats} asientos
                </p>
              </div>
              <div className="text-right">
                <div className={cn("flex items-center gap-1 text-sm font-medium", getStatusColor(service.status))}>
                  <GapIcon className="h-3.5 w-3.5" />
                  {formatPercentage(Math.abs(service.gap), false)}
                </div>
                <p className="text-xs text-muted-foreground">{formatCurrency(service.currentPrice)}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
