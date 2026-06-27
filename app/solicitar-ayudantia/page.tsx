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
  HelpingHand,
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
import { db, auth } from "@/lib/firebase"
import { addDoc, collection, serverTimestamp, query, where, getDocs } from "firebase/firestore"

type Modalidad = "presencial" | "online"

const SEDES_USM = [
  "Casa Central",
  "San Joaquín",
  "Vitacura",
  "Sede Viña del Mar",
  "Sede Concepción",
] as const

type Sede = (typeof SEDES_USM)[number]

export default function SolicitarAyudantiaPage() {
  const router = useRouter()

  const [openRamo, setOpenRamo] = useState(false)
  const [sede, setSede] = useState<Sede | "">("")
  const [ramo, setRamo] = useState("")
  const [modalidad, setModalidad] = useState<Modalidad | "">("")
  const [presupuesto, setPresupuesto] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [horarios, setHorarios] = useState<string[]>([])

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const ramoSeleccionado = RAMOS_USM.find((r) => r.codigo === ramo)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!sede) {
      setError("Selecciona tu sede de la USM.")
      return
    }
    if (!ramo) {
      setError("Selecciona la asignatura en la que necesitas ayuda.")
      return
    }
    if (!modalidad) {
      setError("Selecciona una modalidad de clase.")
      return
    }
    if (!presupuesto || Number(presupuesto) <= 0) {
      setError("Ingresa un presupuesto válido por hora.")
      return
    }
    if (horarios.length === 0) {
      setError("Selecciona al menos un bloque horario disponible.")
      return
    }

    setLoading(true)
    try {
      const uid = auth.currentUser?.uid ?? ""
      let nombre_alumno = ""
      if (uid) {
        const q = query(collection(db, "usuarios"), where("uid", "==", uid))
        const snap = await getDocs(q)
        nombre_alumno = snap.docs[0]?.data()?.nombre_completo ?? ""
      }

      await addDoc(collection(db, "Solicitudes_Ayudantia"), {
        id_ramo: ramo,
        id_alumno: uid,
        nombre_alumno,
        sede: sede,
        modalidad: modalidad,
        presupuesto: Number(presupuesto),
        descripcion: descripcion,
        horarios: horarios,
        fecha_creacion: serverTimestamp(),
      })
      setSuccess(true)
      setTimeout(() => {
        router.refresh()
        router.push("/dashboard")
      }, 1800)
    } catch (err) {
      setError("Hubo un error al publicar la solicitud. Intenta de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-secondary/40">
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
          <div className="mb-8 space-y-2 text-center">
            <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-[#0070f3]/10">
              <HelpingHand className="size-6 text-[#0070f3]" />
            </div>
            <h1 className="text-balance text-2xl font-bold tracking-tight text-foreground">
              Publicar Solicitud de Ayudantía
            </h1>
            <p className="mx-auto max-w-md text-pretty text-sm text-muted-foreground">
              Cuéntanos qué necesitas y los ayudantes de la USM que cumplan con tus requisitos te contactarán
              directamente.
            </p>
          </div>

          <form className="space-y-8" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label>Sede</Label>
              <div className="grid grid-cols-2 gap-3">
                {SEDES_USM.map((opcion) => {
                  const activa = sede === opcion
                  return (
                    <button
                      key={opcion}
                      type="button"
                      onClick={() => setSede(opcion)}
                      aria-pressed={activa}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                        activa
                          ? "border-[#0070f3] bg-[#0070f3]/5 text-[#0070f3]"
                          : "border-border bg-background text-muted-foreground hover:border-[#0070f3]/50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-4 shrink-0 items-center justify-center rounded-full border",
                          activa ? "border-[#0070f3]" : "border-muted-foreground/40",
                        )}
                      >
                        {activa && <span className="size-2 rounded-full bg-[#0070f3]" />}
                      </span>
                      <span className="text-center leading-tight">{opcion}</span>
                    </button>
                  )
                })}
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="presupuesto">Presupuesto dispuesto a pagar (CLP por hora)</Label>
              <div className="flex h-11 items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring/50">
                <span className="select-none px-3 text-sm font-medium text-muted-foreground">CLP $</span>
                <input
                  id="presupuesto"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  step={500}
                  placeholder="10000"
                  value={presupuesto}
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === "" || Number(val) >= 0) setPresupuesto(val)
                  }}
                  className="h-full w-full min-w-0 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <span className="select-none whitespace-nowrap px-3 text-sm text-muted-foreground">por hora</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Describe lo que necesitas</Label>
              <Textarea
                id="descripcion"
                rows={5}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Necesito ayuda para preparar el certamen 2, repasar guías de ejercicios y resolver dudas de la materia..."
                className="resize-none bg-background"
              />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-base">Selecciona los horarios en los que puedes recibir la ayudantía</Label>
                <p className="text-xs text-muted-foreground">
                  Marca los bloques oficiales de la USM en los que estás disponible.
                </p>
              </div>
              <DisponibilidadMatrix selected={horarios} onChange={setHorarios} />
            </div>

            {error && (
              <p className="rounded-lg bg-destructive/10 px-4 py-2.5 text-center text-sm text-destructive">{error}</p>
            )}

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
                  "Publicar Solicitud"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>

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
            <h2 className="text-balance text-lg font-bold text-foreground">
              ¡Solicitud publicada con éxito en Huddle USM!
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Redirigiéndote al dashboard...</p>
            <Loader2 className="mx-auto mt-4 size-5 animate-spin text-[#0070f3]" />
          </div>
        </div>
      )}
    </div>
  )
}