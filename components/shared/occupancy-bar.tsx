import { cn } from "@/lib/utils"

interface OccupancyBarProps {
  current: number
  target: number
  showLabels?: boolean
  height?: "sm" | "md" | "lg"
}

export function OccupancyBar({ current, target, showLabels = true, height = "md" }: OccupancyBarProps) {
  const gap = current - target
  const isAhead = gap >= 0

  const heightClasses = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  }

  return (
    <div className="w-full">
      <div className={cn("relative w-full bg-muted rounded-full overflow-hidden", heightClasses[height])}>
        {/* Current occupancy bar */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
            isAhead ? "bg-emerald-500" : "bg-amber-500",
          )}
          style={{ width: `${Math.min(current, 100)}%` }}
        />
        {/* Target marker */}
        <div
          className="absolute inset-y-0 w-0.5 bg-foreground/60"
          style={{ left: `${target}%` }}
          title={`Objetivo: ${target}%`}
        />
      </div>
      {showLabels && (
        <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Actual:{" "}
            <span className={cn("font-medium", isAhead ? "text-emerald-600" : "text-amber-600")}>{current}%</span>
          </span>
          <span>Objetivo: {target}%</span>
        </div>
      )}
    </div>
  )
}
