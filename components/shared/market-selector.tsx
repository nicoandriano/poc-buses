"use client"

import { cn } from "@/lib/utils"
import type { Market } from "@/types"
import { ChevronDown, MapPin } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface MarketSelectorProps {
  markets: Market[]
  selected: string
  onChange: (marketId: string) => void
}

export function MarketSelector({ markets, selected, onChange }: MarketSelectorProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selectedMarket = markets.find((m) => m.id === selected)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors min-w-[240px]"
      >
        <MapPin className="h-4 w-4 text-muted-foreground" />
        <span className="flex-1 text-left text-sm font-medium text-foreground">
          {selectedMarket?.name || "Seleccionar mercado"}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-10 mt-1 w-full rounded-lg border border-border bg-card shadow-lg">
          <div className="py-1">
            {markets.map((market) => (
              <button
                key={market.id}
                onClick={() => {
                  onChange(market.id)
                  setOpen(false)
                }}
                className={cn(
                  "w-full px-4 py-2 text-left text-sm hover:bg-muted/50 transition-colors",
                  market.id === selected ? "bg-primary/10 text-primary font-medium" : "text-foreground",
                )}
              >
                {market.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
