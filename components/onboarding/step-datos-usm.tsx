"use client"

import { GraduationCap } from "lucide-react"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CAMPUS_USM, CARRERAS_USM, ANIOS_INGRESO } from "@/lib/usm-data"

interface DatosUsm {
  campus: string
  carrera: string
  anioIngreso: string
}

interface StepDatosProps {
  nombre: string
  value: DatosUsm
  onChange: (value: DatosUsm) => void
}

export function StepDatosUsm({ nombre, value, onChange }: StepDatosProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#0070f3]/10">
          <GraduationCap className="size-6 text-[#0070f3]" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground text-balance">
            {nombre ? `¡Bienvenido a Huddle, ${nombre}!` : "¡Bienvenido a Huddle!"} Cuéntanos sobre ti
          </h2>
          <p className="text-sm text-muted-foreground">
            Estos datos nos ayudan a conectarte con tu comunidad USM.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Campus USM</Label>
          <Select value={value.campus} onValueChange={(v) => onChange({ ...value, campus: v })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecciona tu campus" />
            </SelectTrigger>
            <SelectContent>
              {CAMPUS_USM.map((campus) => (
                <SelectItem key={campus} value={campus}>
                  {campus}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Carrera</Label>
          <Select value={value.carrera} onValueChange={(v) => onChange({ ...value, carrera: v })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecciona tu carrera" />
            </SelectTrigger>
            <SelectContent>
              {CARRERAS_USM.map((carrera) => (
                <SelectItem key={carrera} value={carrera}>
                  {carrera}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Año de ingreso</Label>
          <Select value={value.anioIngreso} onValueChange={(v) => onChange({ ...value, anioIngreso: v })}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecciona tu año de ingreso" />
            </SelectTrigger>
            <SelectContent>
              {ANIOS_INGRESO.map((anio) => (
                <SelectItem key={anio} value={anio}>
                  {anio}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
