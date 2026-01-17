"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, TrendingUp, LineChart, Bell, Settings } from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/performance", label: "Performance", icon: TrendingUp },
  { href: "/curves", label: "Curvas", icon: LineChart },
  { href: "/alerts", label: "Alertas", icon: Bell },
  { href: "/settings", label: "Configuración", icon: Settings },
]

export function Navigation() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">BR</span>
              </div>
              <span className="text-lg font-semibold text-foreground">BusRevenue</span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-foreground">Pullman Bus</p>
              <p className="text-xs text-muted-foreground">Revenue Manager</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center">
              <span className="text-sm font-medium text-muted-foreground">PB</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
