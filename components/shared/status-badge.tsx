import { cn } from "@/lib/utils"
import type { ServiceStatus } from "@/types"
import { getStatusColor, getStatusBgColor, getStatusDot } from "@/lib/calculations"

interface StatusBadgeProps {
  status: ServiceStatus
  size?: "sm" | "md"
}

const statusLabels: Record<ServiceStatus, string> = {
  "ahead-3": "Muy Adelante",
  "ahead-2": "Adelante",
  "ahead-1": "Lev. Adelante",
  "on-curve": "En Curva",
  "behind-1": "Lev. Atrasado",
  "behind-2": "Atrasado",
  "behind-3": "Muy Atrasado",
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap",
        getStatusBgColor(status),
        getStatusColor(status),
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-sm",
      )}
    >
      <span className={cn("rounded-full shrink-0", size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2", getStatusDot(status))} />
      {statusLabels[status]}
    </span>
  )
}
