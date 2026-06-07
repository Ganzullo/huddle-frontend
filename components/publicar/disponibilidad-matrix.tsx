"use client"

import { Check } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export const DIAS_PUBLICAR = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
  "Domingo",
] as const

export const BLOQUES_PUBLICAR = [
  { id: "1-2", horario: "08:15 - 09:25" },
  { id: "3-4", horario: "09:40 - 10:50" },
  { id: "5-6", horario: "11:05 - 12:15" },
  { id: "7-8", horario: "12:30 - 13:40" },
  { id: "9-10", horario: "14:40 - 15:50" },
  { id: "11-12", horario: "16:05 - 17:15" },
  { id: "13-14", horario: "17:30 - 18:40" },
] as const

interface DisponibilidadMatrixProps {
  // claves con formato "Dia-bloqueId", ej. "Lunes-1-2"
  selected: string[]
  onChange: (selected: string[]) => void
}

export function DisponibilidadMatrix({ selected, onChange }: DisponibilidadMatrixProps) {
  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key))
    } else {
      onChange([...selected, key])
    }
  }

  const countForDia = (dia: string) =>
    selected.filter((k) => k.startsWith(`${dia}-`)).length

  const BloqueButton = ({ dia, bloque }: { dia: string; bloque: { id: string; horario: string } }) => {
    const key = `${dia}-${bloque.id}`
    const isSelected = selected.includes(key)
    return (
      <button
        type="button"
        onClick={() => toggle(key)}
        aria-pressed={isSelected}
        aria-label={`${dia}, bloque ${bloque.id}, ${bloque.horario}`}
        className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2.5 text-center text-xs font-medium transition-all ${
          isSelected
            ? "border-[#0070f3] bg-[#0070f3] text-white"
            : "border-border bg-background text-muted-foreground hover:border-[#0070f3]/50 hover:text-foreground"
        }`}
      >
        {isSelected && <Check className="size-3.5 shrink-0" />}
        <span className="flex flex-col leading-tight">
          <span className="font-semibold">{bloque.id}</span>
          <span className="text-[10px] opacity-80">{bloque.horario}</span>
        </span>
      </button>
    )
  }

  return (
    <div>
      {/* Desktop / tablet: grid de columnas por día */}
      <div className="hidden gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {DIAS_PUBLICAR.map((dia) => {
          const count = countForDia(dia)
          return (
            <div key={dia} className="rounded-xl border border-border bg-secondary/40 p-3">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{dia}</span>
                {count > 0 && (
                  <span className="rounded-full bg-[#0070f3]/10 px-2 py-0.5 text-[11px] font-medium text-[#0070f3]">
                    {count}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                {BLOQUES_PUBLICAR.map((bloque) => (
                  <BloqueButton key={bloque.id} dia={dia} bloque={bloque} />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Móvil: acordeón por día */}
      <div className="md:hidden">
        <Accordion type="multiple" className="w-full">
          {DIAS_PUBLICAR.map((dia) => {
            const count = countForDia(dia)
            return (
              <AccordionItem key={dia} value={dia}>
                <AccordionTrigger className="text-sm font-semibold text-foreground hover:no-underline">
                  <span className="flex items-center gap-2">
                    {dia}
                    {count > 0 && (
                      <span className="rounded-full bg-[#0070f3]/10 px-2 py-0.5 text-[11px] font-medium text-[#0070f3]">
                        {count} {count === 1 ? "bloque" : "bloques"}
                      </span>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-2 gap-2 pb-2">
                    {BLOQUES_PUBLICAR.map((bloque) => (
                      <BloqueButton key={bloque.id} dia={dia} bloque={bloque} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </div>

      {selected.length > 0 && (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          {selected.length} {selected.length === 1 ? "bloque seleccionado" : "bloques seleccionados"} en total
        </p>
      )}
    </div>
  )
}
