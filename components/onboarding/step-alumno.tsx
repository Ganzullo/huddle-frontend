"use client"

import { BookOpen } from "lucide-react"
import { RamosSelector } from "./ramos-selector"

interface StepAlumnoProps {
  ramos: string[]
  onChange: (ramos: string[]) => void
}

export function StepAlumno({ ramos, onChange }: StepAlumnoProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#0070f3]/10">
          <BookOpen className="size-6 text-[#0070f3]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            ¿En qué asignaturas necesitas apoyo?
          </h2>
          <p className="text-sm text-muted-foreground">
            Selecciona los ramos que más te cuestan para encontrarte los mejores tutores.
          </p>
        </div>
      </div>

      <RamosSelector selected={ramos} onChange={onChange} />
    </div>
  )
}
