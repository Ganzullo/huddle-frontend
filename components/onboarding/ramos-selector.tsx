"use client"

import { useState } from "react"
import { Check, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { RAMOS_USM } from "@/lib/usm-data"

interface RamosSelectorProps {
  selected: string[]
  onChange: (selected: string[]) => void
}

export function RamosSelector({ selected, onChange }: RamosSelectorProps) {
  const [query, setQuery] = useState("")

  const toggle = (codigo: string) => {
    if (selected.includes(codigo)) {
      onChange(selected.filter((c) => c !== codigo))
    } else {
      onChange([...selected, codigo])
    }
  }

  const filtered = RAMOS_USM.filter(
    (r) =>
      r.codigo.toLowerCase().includes(query.toLowerCase()) ||
      r.nombre.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar ramo (ej. MAT021, Física)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-10 pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {filtered.map((ramo) => {
          const isSelected = selected.includes(ramo.codigo)
          return (
            <button
              key={ramo.codigo}
              type="button"
              onClick={() => toggle(ramo.codigo)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-all ${
                isSelected
                  ? "border-[#0070f3] bg-[#0070f3] text-white"
                  : "border-border bg-background text-foreground hover:border-[#0070f3]/50"
              }`}
            >
              {isSelected && <Check className="size-3.5" />}
              <span className="font-semibold">{ramo.codigo}</span>
              <span className={isSelected ? "text-white/80" : "text-muted-foreground"}>
                {ramo.nombre}
              </span>
            </button>
          )
        })}
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No se encontraron ramos.</p>
        )}
      </div>

      {selected.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {selected.length} {selected.length === 1 ? "ramo seleccionado" : "ramos seleccionados"}
        </p>
      )}
    </div>
  )
}
