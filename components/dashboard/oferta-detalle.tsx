"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { User, MapPin, Wifi, Building2, CalendarDays, MessageSquare } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { BLOQUES_FILTRO } from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

interface Oferta {
  id: string
  id_tutor?: string
  id_ramo?: string
  nombre_ramo?: string
  sede?: string
  modalidad?: string
  precio_referencial?: number
  descripcion?: string
  nombre_tutor?: string
  fecha_creacion?: any
  horarios?: string[]
}

const DIAS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
const DIAS_ABREV = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]

function formatPrecio(precio?: number) {
  if (!precio && precio !== 0) return "$0"
  return "$" + precio.toLocaleString("es-CL")
}

function formatFecha(fecha?: any) {
  if (!fecha) return "Reciente"
  try {
    // Soporta Firestore Timestamp ({ seconds }) o string/Date
    const date = fecha?.seconds
      ? new Date(fecha.seconds * 1000)
      : new Date(fecha)
    if (isNaN(date.getTime())) return "Reciente"
    return date.toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" })
  } catch {
    return "Reciente"
  }
}

interface OfertaDetalleProps {
  oferta: Oferta | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OfertaDetalle({ oferta, open, onOpenChange }: OfertaDetalleProps) {
  const router = useRouter()
  const [seleccion, setSeleccion] = useState<string | null>(null)
  const [error, setError] = useState("")

  // Set de bloques disponibles del ayudante: claves "Dia-bloqueId"
  const disponibles = useMemo(() => new Set(oferta?.horarios ?? []), [oferta])

  const esOnline = (oferta?.modalidad ?? "").toLowerCase() === "online"

  function handleSeleccion(key: string) {
    setError("")
    setSeleccion((prev) => (prev === key ? null : key))
  }

  async function handleAceptar() {
  if (!seleccion) {
    setError("Selecciona un bloque horario disponible para continuar.")
    return
  }

  try {
    const { auth, db } = await import("@/lib/firebase")
    const { collection, addDoc, serverTimestamp } = await import("firebase/firestore")
    
    const uid = auth.currentUser?.uid ?? ""
    
    await addDoc(collection(db, "Mensajeria"), {
      id_emisor: uid,
      id_receptor: oferta.id_tutor ?? "",
      id_oferta: oferta.id,
      id_ramo: oferta.id_ramo ?? "",
      bloque_seleccionado: seleccion,
      contenido_cifrado: `Hola, me interesa tu tutoría de ${oferta.nombre_ramo ?? oferta.id_ramo}. ¿Podemos coordinar en el bloque ${seleccion}?`,
      leido: false,
      timestamp: serverTimestamp(),
    })

    onOpenChange(false)
    router.push(`/mensajes?tutor=${encodeURIComponent(oferta?.nombre_tutor ?? "Tutor")}&ramo=${encodeURIComponent(oferta?.id_ramo ?? "")}&oferta=${oferta.id}`)
  } catch (err) {
    setError("Hubo un error al enviar el mensaje. Intenta de nuevo.")
  }
}

  if (!oferta) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        {/* Encabezado dinámico */}
        <DialogHeader className="space-y-0 border-b border-border p-6 text-left">
          <div className="flex items-start gap-4">
            <div
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary text-muted-foreground"
              aria-hidden="true"
            >
              <User className="size-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#0070f3]">
                {oferta.id_ramo}
              </p>
              <DialogTitle className="truncate text-lg font-bold text-foreground">
                {oferta.nombre_tutor ?? "Tutor"}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                {oferta.nombre_ramo ?? oferta.id_ramo}
              </DialogDescription>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <span className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] capitalize text-muted-foreground">
                  {esOnline ? <Wifi className="size-3" /> : <MapPin className="size-3" />}
                  {oferta.modalidad ?? "Presencial"}
                </span>
                {oferta.sede && (
                  <span className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                    <Building2 className="size-3" />
                    {oferta.sede}
                  </span>
                )}
                <span className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                  <CalendarDays className="size-3" />
                  {formatFecha(oferta.fecha_creacion)}
                </span>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-xl font-bold text-foreground">
                {formatPrecio(oferta.precio_referencial)}
              </p>
              <p className="text-[11px] text-muted-foreground">por hora</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 p-6">
          {/* Matriz de horarios */}
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-foreground">Disponibilidad del ayudante</h3>
              <p className="text-xs text-muted-foreground">
                Selecciona un bloque azul disponible para coordinar la sesión.
              </p>
            </div>

            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                {/* Cabecera de días */}
                <div className="grid grid-cols-[88px_repeat(7,1fr)] gap-1">
                  <div />
                  {DIAS_ABREV.map((d, i) => (
                    <div
                      key={d}
                      className="pb-1 text-center text-[11px] font-semibold text-muted-foreground"
                      title={DIAS[i]}
                    >
                      {d}
                    </div>
                  ))}
                </div>

                {/* Filas por bloque */}
                <div className="flex flex-col gap-1">
                  {BLOQUES_FILTRO.map((bloque) => (
                    <div key={bloque.id} className="grid grid-cols-[88px_repeat(7,1fr)] gap-1">
                      <div className="flex flex-col justify-center rounded-md bg-secondary/60 px-2 py-1.5 text-left">
                        <span className="text-[11px] font-semibold text-foreground">{bloque.label}</span>
                        <span className="text-[10px] leading-tight text-muted-foreground">{bloque.horario}</span>
                      </div>
                      {DIAS.map((dia) => {
                        const key = `${dia}-${bloque.id}`
                        const disponible = disponibles.has(key)
                        const activo = seleccion === key
                        return (
                          <button
                            key={key}
                            type="button"
                            disabled={!disponible}
                            onClick={() => handleSeleccion(key)}
                            aria-pressed={activo}
                            aria-label={`${dia} ${bloque.label} ${bloque.horario}${disponible ? "" : " no disponible"}`}
                            className={cn(
                              "h-11 rounded-md border text-[11px] font-medium transition-all",
                              !disponible &&
                                "cursor-not-allowed border-border/60 bg-muted text-muted-foreground/40",
                              disponible &&
                                !activo &&
                                "border-[#0070f3]/30 bg-[#0070f3]/5 text-[#0070f3] hover:bg-[#0070f3]/10",
                              activo && "border-[#0070f3] bg-[#0070f3] text-white",
                            )}
                          >
                            {activo ? "✓" : disponible ? "·" : ""}
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Descripción dinámica */}
          {oferta.descripcion && (
            <section className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Metodología</h3>
              <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {oferta.descripcion}
              </p>
            </section>
          )}

          {error && (
            <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          {/* Botón principal */}
          <Button
            onClick={handleAceptar}
            className="h-12 w-full rounded-xl bg-[#0070f3] text-base text-white hover:bg-[#0070f3]/90"
          >
            <MessageSquare className="size-5" />
            Aceptar Ayudantía y Enviar Mensaje
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
