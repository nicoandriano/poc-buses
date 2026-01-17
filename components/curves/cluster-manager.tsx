"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, Calendar, Clock, Sun, Sparkles, Trash2 } from "lucide-react"
import type { Cluster, ClusterType, Market } from "@/types"

interface ClusterManagerProps {
  clusters: Cluster[]
  markets: Market[]
  selectedCluster: string | null
  onSelectCluster: (clusterId: string | null) => void
  onUpdateClusters: (clusters: Cluster[]) => void
}

const clusterTypeIcons: Record<ClusterType, React.ReactNode> = {
  "day-of-week": <Calendar className="h-4 w-4" />,
  "time-of-day": <Clock className="h-4 w-4" />,
  season: <Sun className="h-4 w-4" />,
  special: <Sparkles className="h-4 w-4" />,
}

const clusterTypeLabels: Record<ClusterType, string> = {
  "day-of-week": "Día de semana",
  "time-of-day": "Horario",
  season: "Temporada",
  special: "Especial",
}

export function ClusterManager({
  clusters,
  markets,
  selectedCluster,
  onSelectCluster,
  onUpdateClusters,
}: ClusterManagerProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newCluster, setNewCluster] = useState<Partial<Cluster>>({
    name: "",
    type: "day-of-week",
    description: "",
    tags: [],
    marketId: "all",
    conditions: {},
    isActive: true,
  })
  const [tagInput, setTagInput] = useState("")

  const handleCreateCluster = () => {
    if (!newCluster.name) return

    const cluster: Cluster = {
      id: `cluster-${Date.now()}`,
      name: newCluster.name,
      type: newCluster.type as ClusterType,
      description: newCluster.description || "",
      tags: newCluster.tags || [],
      marketId: newCluster.marketId || "all",
      conditions: newCluster.conditions || {},
      isActive: true,
    }

    onUpdateClusters([...clusters, cluster])
    setNewCluster({
      name: "",
      type: "day-of-week",
      description: "",
      tags: [],
      marketId: "all",
      conditions: {},
      isActive: true,
    })
    setIsCreateOpen(false)
  }

  const handleToggleCluster = (clusterId: string) => {
    onUpdateClusters(clusters.map((c) => (c.id === clusterId ? { ...c, isActive: !c.isActive } : c)))
  }

  const handleDeleteCluster = (clusterId: string) => {
    onUpdateClusters(clusters.filter((c) => c.id !== clusterId))
    if (selectedCluster === clusterId) {
      onSelectCluster(null)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !newCluster.tags?.includes(tagInput.trim())) {
      setNewCluster((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }))
      setTagInput("")
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Clusters</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Nuevo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Crear Cluster</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input
                    value={newCluster.name}
                    onChange={(e) => setNewCluster((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Viernes Noche"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={newCluster.type}
                    onValueChange={(v) => setNewCluster((prev) => ({ ...prev, type: v as ClusterType }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="day-of-week">Día de semana</SelectItem>
                      <SelectItem value="time-of-day">Horario</SelectItem>
                      <SelectItem value="season">Temporada</SelectItem>
                      <SelectItem value="special">Especial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Mercado</Label>
                  <Select
                    value={newCluster.marketId}
                    onValueChange={(v) => setNewCluster((prev) => ({ ...prev, marketId: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los mercados</SelectItem>
                      {markets.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Input
                    value={newCluster.description}
                    onChange={(e) => setNewCluster((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Descripción del cluster"
                  />
                </div>

                {newCluster.type === "day-of-week" && (
                  <div className="space-y-2">
                    <Label>Días</Label>
                    <div className="flex flex-wrap gap-2">
                      {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day, idx) => (
                        <Button
                          key={day}
                          variant={newCluster.conditions?.daysOfWeek?.includes(idx) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const current = newCluster.conditions?.daysOfWeek || []
                            const updated = current.includes(idx) ? current.filter((d) => d !== idx) : [...current, idx]
                            setNewCluster((prev) => ({
                              ...prev,
                              conditions: { ...prev.conditions, daysOfWeek: updated },
                            }))
                          }}
                        >
                          {day}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {newCluster.type === "time-of-day" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Desde</Label>
                      <Input
                        type="time"
                        value={newCluster.conditions?.timeRange?.start || ""}
                        onChange={(e) =>
                          setNewCluster((prev) => ({
                            ...prev,
                            conditions: {
                              ...prev.conditions,
                              timeRange: {
                                start: e.target.value,
                                end: prev.conditions?.timeRange?.end || "23:59",
                              },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hasta</Label>
                      <Input
                        type="time"
                        value={newCluster.conditions?.timeRange?.end || ""}
                        onChange={(e) =>
                          setNewCluster((prev) => ({
                            ...prev,
                            conditions: {
                              ...prev.conditions,
                              timeRange: {
                                start: prev.conditions?.timeRange?.start || "00:00",
                                end: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                {newCluster.type === "season" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Desde (MM-DD)</Label>
                      <Input
                        placeholder="12-01"
                        value={newCluster.conditions?.dateRange?.start || ""}
                        onChange={(e) =>
                          setNewCluster((prev) => ({
                            ...prev,
                            conditions: {
                              ...prev.conditions,
                              dateRange: {
                                start: e.target.value,
                                end: prev.conditions?.dateRange?.end || "",
                              },
                            },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Hasta (MM-DD)</Label>
                      <Input
                        placeholder="02-28"
                        value={newCluster.conditions?.dateRange?.end || ""}
                        onChange={(e) =>
                          setNewCluster((prev) => ({
                            ...prev,
                            conditions: {
                              ...prev.conditions,
                              dateRange: {
                                start: prev.conditions?.dateRange?.start || "",
                                end: e.target.value,
                              },
                            },
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Agregar tag"
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" variant="outline" onClick={handleAddTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {newCluster.tags?.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() =>
                          setNewCluster((prev) => ({
                            ...prev,
                            tags: prev.tags?.filter((t) => t !== tag),
                          }))
                        }
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                <Button onClick={handleCreateCluster} className="w-full">
                  Crear Cluster
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* All option */}
        <button
          onClick={() => onSelectCluster(null)}
          className={`w-full text-left p-3 rounded-lg border transition-colors ${
            selectedCluster === null ? "border-blue-500 bg-blue-50" : "border-border hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Sin cluster</p>
              <p className="text-xs text-muted-foreground">Curva base del mercado</p>
            </div>
          </div>
        </button>

        {clusters.map((cluster) => (
          <button
            key={cluster.id}
            onClick={() => onSelectCluster(cluster.id)}
            className={`w-full text-left p-3 rounded-lg border transition-colors ${
              selectedCluster === cluster.id ? "border-blue-500 bg-blue-50" : "border-border hover:border-slate-300"
            } ${!cluster.isActive ? "opacity-50" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {clusterTypeIcons[cluster.type]}
                <div>
                  <p className="text-sm font-medium">{cluster.name}</p>
                  <p className="text-xs text-muted-foreground">{cluster.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={cluster.isActive}
                  onCheckedChange={() => handleToggleCluster(cluster.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteCluster(cluster.id)
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </div>
            </div>
            {cluster.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {cluster.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  )
}
