"use client"

import { RefreshCw, BookOpen, DollarSign, Users } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RamosSelector } from "./ramos-selector"
import { FileUpload } from "./file-upload"

export interface PerfilHibrido {
  ramosNecesita: string[]
  precio: string
  ramosDomina: string[]
  certificado: File | null
}

interface StepHibridoProps {
  value: PerfilHibrido
  onChange: (value: PerfilHibrido) => void
}

export function StepHibrido({ value, onChange }: StepHibridoProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#0070f3]/10">
          <RefreshCw className="size-6 text-[#0070f3]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Configura tu perfil doble
          </h2>
          <p className="text-sm text-muted-foreground">
            Aprende los ramos que te cuestan y enseña los que dominas.
          </p>
        </div>
      </div>

      {/* Sección Alumno */}
      <div className="rounded-xl border border-border p-4 space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="size-4 text-[#0070f3]" />
          <h3 className="text-sm font-semibold text-foreground">Como alumno</h3>
        </div>
        <p className="text-xs text-muted-foreground">Ramos en los que necesitas apoyo</p>
        <RamosSelector
          selected={value.ramosNecesita}
          onChange={(ramosNecesita) => onChange({ ...value, ramosNecesita })}
        />
      </div>

      {/* Sección Tutor */}
      <div className="rounded-xl border border-border p-4 space-y-4">
        <div className="flex items-center gap-2">
          <Users className="size-4 text-[#0070f3]" />
          <h3 className="text-sm font-semibold text-foreground">Como tutor</h3>
        </div>

        <div className="space-y-2">
          <Label htmlFor="precio-hibrido" className="text-xs">Precio por bloque (CLP)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="precio-hibrido"
              type="number"
              min={0}
              step={500}
              placeholder="5000"
              value={value.precio}
              onChange={(e) => onChange({ ...value, precio: e.target.value })}
              className="h-11 pl-9"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Ramos que dominas para enseñar</Label>
          <RamosSelector
            selected={value.ramosDomina}
            onChange={(ramosDomina) => onChange({ ...value, ramosDomina })}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs">Validación de competencias</Label>
          <FileUpload
            file={value.certificado}
            onChange={(certificado) => onChange({ ...value, certificado })}
          />
        </div>
      </div>
    </div>
  )
}
