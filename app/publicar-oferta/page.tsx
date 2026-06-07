"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  GraduationCap,
  Check,
  ChevronsUpDown,
  Loader2,
  PartyPopper,
  BookOpen,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { RAMOS_USM } from "@/lib/usm-data"
import { DisponibilidadMatrix } from "@/components/publicar/disponibilidad-matrix"
import { cn } from "@/lib/utils"

type Modalidad = "presencial" | "online"

export default function PublicarOfertaPage() {
  const router = useRouter()

  const [openRamo, setOpenRamo] = useState(false)
  const [ramo, setRamo] = useState("")
  const [modalidad, setModalidad] = useState<Modalidad | "">("")
  const [precio, setPrecio] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [horarios, setHorarios] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const ramoSeleccionado = RAMOS_USM.find((r) => r.codigo === ramo)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!ramo) {
      setError("Selecciona la asignatura que deseas enseñar.")
      return
    }
    if (!modalidad) {
      setError("Selecciona una modalidad de clase.")
      return
    }
    if (!precio || Number(precio) <= 0) {
      setError("Ingresa un precio válido por hora.")
      return
    }
    if (horarios.length === 0) {
      setError("Selecciona al menos un bloque horario disponible.")
      return
    }

    setLoading(true)
    // Simulación de publicación
    setTimeout(() => {
      setLoading(false)
      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 1800)
    }, 1400)
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      {/* Header simple */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
            <GraduationCap className="size-7 text-[#0070f3]" strokeWidth={2} />
            <span className="text-lg font-bold text-[#0070f3]">Huddle USM</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          {/* Encabezado */}
          <div className="mb-8 space-y-2 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[#0070f3]/10">
              <BookOpen className="size-6 text-[#0070f3]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground text-balance">
              Publicar una nueva oferta de tutoría
            </h1>
            <p className="mx-auto max-w-md text-sm text-muted-foreground text-pretty">
              Completa los detalles de la asignatura que deseas enseñar para que otros estudiantes de la USM puedan
              encontrarte.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            {/* Asignatura */}
            <div className="space-y-2">
              <Label htmlFor="ramo-trigger">Asignatura</Label>
              <Popover open={openRamo} onOpenChange={setOpenRamo}>
                <PopoverTrigger asChild>
                  <Button
                    id="ramo-trigger"
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={openRamo}
                    className="h-11 w-full justify-between bg-background font-normal"
                  >
                    {ramoSeleccionado ? (
                      <span className="truncate">
                        <span className="font-semibold text-foreground">{ramoSeleccionado.codigo}</span>
                        <span className="text-muted-foreground"> — {ramoSeleccionado.nombre}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Busca o selecciona un ramo de la USM</span>
                    )}
                    <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Buscar por código o nombre..." />
                    <CommandList>
                      <CommandEmpty>No se encontró el ramo.</CommandEmpty>
                      <CommandGroup>
                        {RAMOS_USM.map((r) => (
                          <CommandItem
                            key={r.codigo}
                            value={`${r.codigo} ${r.nombre}`}
                            onSelect={() => {
                              setRamo(r.codigo)
                              setOpenRamo(false)
                            }}
                          >
                            <Check
                              className={cn(
                                "size-4 text-[#0070f3]",
                                ramo === r.codigo ? "opacity-100" : "opacity-0",
                              )}
                            />
                            <span className="font-semibold">{r.codigo}</span>
                            <span className="text-muted-foreground">{r.nombre}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Modalidad */}
            <div className="space-y-2">
              <Label>Modalidad de la clase</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["presencial", "online"] as const).map((opcion) => {
                  const activa = modalidad === opcion
                  return (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() => setModalidad(opcion)}
                      aria-pressed={activa}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-all",
                        activa
                          ? "border-[#0070f3] bg-[#0070f3]/5 text-[#0070f3]"
                          : "border-border bg-background text-muted-foreground hover:border-[#0070f3]/50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 items-center justify-center rounded-full border",
                          activa ? "border-[#0070f3]" : "border-muted-foreground/40",
                        )}
                      >
                        {activa && <span className="size-2 rounded-full bg-[#0070f3]" />}
                      </span>
                      {opcion}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Precio */}
            <div className="space-y-2">
              <Label htmlFor="precio">Precio de la sesión</Label>
              <div className="flex h-11 items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring/50">
                <span className="select-none px-3 text-sm font-medium text-muted-foreground">CLP $</span>
                <input
                  id="precio"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={500}
                  placeholder="10000"
                  value={precio}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === "" || Number(val) >= 0) setPrecio(val)
                  }}
                  className="h-full w-full min-w-0 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <span className="select-none whitespace-nowrap px-3 text-sm text-muted-foreground">por hora</span>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción de la tutoría</Label>
              <Textarea
                id="descripcion"
                rows={5}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ayuda con certámenes pasados, preparación de controles y resolución de guías de ejercicios..."
                className="resize-none bg-background"
              />
            </div>

            {/* Disponibilidad */}
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-base">Selecciona tus horarios disponibles para este ramo</Label>
                <p className="text-xs text-muted-foreground">
                  Marca los bloques oficiales de la USM en los que puedes dar clases.
                </p>
              </div>
              <DisponibilidadMatrix selected={horarios} onChange={setHorarios} />
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-center text-sm text-destructive">{error}</p>
            )}

            {/* Acciones */}
            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
              <Button
                asChild
                type="button"
                variant="ghost"
                className="text-muted-foreground hover:text-[#0070f3]"
                disabled={loading}
              >
                <Link href="/dashboard">Cancelar</Link>
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90 sm:w-auto sm:min-w-[200px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  "Crear Oferta"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Overlay de éxito */}
      {success && (
        <div
          role="alertdialog"
          aria-live="assertive"
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
            <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-[#0070f3]/10">
              <PartyPopper className="size-7 text-[#0070f3]" />
            </div>
            <h2 className="text-lg font-bold text-foreground text-balance">
              ¡Oferta publicada con éxito en Huddle USM!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Redirigiéndote al dashboard...</p>
            <Loader2 className="mx-auto mt-4 size-5 animate-spin text-[#0070f3]" />
          </div>
        </div>
      )}
    </div>
  )
}
