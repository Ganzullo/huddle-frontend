"use client"

import { ChevronDown } from "lucide-react"
import { FILTROS_RAPIDOS, FILTROS_RAPIDOS_EXTRA } from "@/lib/dashboard-data"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface QuickFiltersProps {
  activo: string
  onChange: (filtro: string) => void
}

export function QuickFilters({ activo, onChange }: QuickFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {FILTROS_RAPIDOS.map((filtro) => {
        const seleccionado = activo === filtro
        return (
          <button
            key={filtro}
            type="button"
            onClick={() => onChange(filtro)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              seleccionado
                ? "border-[#0a2540] bg-[#0a2540] text-white"
                : "border-border bg-card text-foreground hover:border-[#0a2540]/40"
            }`}
          >
            {filtro}
          </button>
        )
      })}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium text-foreground hover:border-[#0a2540]/40"
          >
            Ver más
            <ChevronDown className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {FILTROS_RAPIDOS_EXTRA.map((filtro) => (
            <DropdownMenuItem key={filtro} onClick={() => onChange(filtro)}>
              {filtro}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
