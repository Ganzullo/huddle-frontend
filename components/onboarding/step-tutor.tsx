"use client"

import { Users, DollarSign } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RamosSelector } from "./ramos-selector"
import { FileUpload } from "./file-upload"

export interface PerfilTutor {
  precio: string
  ramosDomina: string[]
  bio: string
  certificado: File | null
}

interface StepTutorProps {
  value: PerfilTutor
  onChange: (value: PerfilTutor) => void
}

export function StepTutor({ value, onChange }: StepTutorProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#0070f3]/10">
          <Users className="size-6 text-[#0070f3]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            Configura tu perfil de experto
          </h2>
          <p className="text-sm text-muted-foreground">
            Muéstrales a los alumnos por qué eres el tutor ideal.
          </p>
        </div>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="precio">Precio por bloque de ayudantía (CLP)</Label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="precio"
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
          <Label>Asignaturas que dominas para enseñar</Label>
          <RamosSelector
            selected={value.ramosDomina}
            onChange={(ramosDomina) => onChange({ ...value, ramosDomina })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Breve biografía para los alumnos</Label>
          <Textarea
            id="bio"
            placeholder="Cuéntales sobre tu experiencia, metodología y por qué te apasiona enseñar..."
            value={value.bio}
            onChange={(e) => onChange({ ...value, bio: e.target.value })}
            rows={4}
            className="resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label>Validación de competencias</Label>
          <FileUpload
            file={value.certificado}
            onChange={(certificado) => onChange({ ...value, certificado })}
          />
        </div>
      </div>
    </div>
  )
}
