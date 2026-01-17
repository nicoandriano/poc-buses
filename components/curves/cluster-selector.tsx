"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { Cluster } from "@/types"

interface ClusterSelectorProps {
  clusters: Cluster[]
  selected: string | null
  onChange: (clusterId: string | null) => void
}

export function ClusterSelector({ clusters, selected, onChange }: ClusterSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">Cluster</label>
      <Select value={selected || "base"} onValueChange={(value) => onChange(value === "base" ? null : value)}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Seleccionar cluster" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="base">
            <div className="flex items-center gap-2">
              <span>Curva Base</span>
              <Badge variant="secondary" className="text-xs">
                Default
              </Badge>
            </div>
          </SelectItem>
          {clusters.map((cluster) => (
            <SelectItem key={cluster.id} value={cluster.id}>
              <div className="flex flex-col gap-0.5">
                <span>{cluster.name}</span>
                {cluster.tags.length > 0 && (
                  <span className="text-xs text-muted-foreground">{cluster.tags.slice(0, 2).join(", ")}</span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
