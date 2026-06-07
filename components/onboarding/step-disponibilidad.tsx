"use client"

import { CalendarClock, Check } from "lucide-react"
import { DIAS_SEMANA, BLOQUES_USM } from "@/lib/usm-data"

interface StepDisponibilidadProps {
  // claves con formato "Dia-bloqueId", ej. "Lunes-1-2"
  selected: string[]
  onChange: (selected: string[]) => void
}

export function StepDisponibilidad({ selected, onChange }: StepDisponibilidadProps) {
  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key))
    } else {
      onChange([...selected, key])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#0070f3]/10">
          <CalendarClock className="size-6 text-[#0070f3]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Define tus horarios disponibles
          </h2>
          <p className="text-sm text-muted-foreground">
            Marca los bloques en los que puedes dar ayudantías.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          {/* Encabezado de días */}
          <div className="grid grid-cols-[80px_repeat(5,1fr)] gap-2">
            <div />
            {DIAS_SEMANA.map((dia) => (
              <div key={dia} className="text-center text-xs font-semibold text-foreground">
                {dia}
              </div>
            ))}
          </div>

          {/* Filas de bloques */}
          <div className="mt-2 space-y-2">
            {BLOQUES_USM.map((bloque) => (
              <div key={bloque.id} className="grid grid-cols-[80px_repeat(5,1fr)] gap-2">
                <div className="flex flex-col justify-center">
                  <span className="text-sm font-semibold text-foreground">{bloque.id}</span>
                  <span className="text-[10px] text-muted-foreground">{bloque.horario}</span>
                </div>
                {DIAS_SEMANA.map((dia) => {
                  const key = `${dia}-${bloque.id}`
                  const isSelected = selected.includes(key)
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => toggle(key)}
                      aria-pressed={isSelected}
                      aria-label={`${dia} bloque ${bloque.id}`}
                      className={`flex h-11 items-center justify-center rounded-lg border text-sm font-medium transition-all ${
                        isSelected
                          ? "border-[#0070f3] bg-[#0070f3] text-white"
                          : "border-border bg-background text-muted-foreground hover:border-[#0070f3]/50"
                      }`}
                    >
                      {isSelected && <Check className="size-4" />}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {selected.length > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          {selected.length} {selected.length === 1 ? "bloque seleccionado" : "bloques seleccionados"}
        </p>
      )}
    </div>
  )
}
