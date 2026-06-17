"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  HandHelping,
  Trash2,
  Pencil,
  Loader2,
  GraduationCap,
  Check,
  ChevronsUpDown,
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
import { DisponibilidadMatrix } from "@/components/publicar/disponibilidad-matrix"
import { RAMOS_USM } from "@/lib/usm-data"
import { cn } from "@/lib/utils"

type Modalidad = "presencial" | "online"
const SEDES_USM = ["Casa Central Valparaíso", "Campus San Joaquín", "Vitacura", "Concepción"] as const
type Sede = (typeof SEDES_USM)[number]

interface Oferta {
  id: string
  id_ramo: string
  nombre_ramo?: string
  sede: string
  modalidad: string
  precio_referencial: number
  descripcion?: string
  horarios?: string[]
}

interface Solicitud {
  id: string
  id_ramo: string
  sede: string
  modalidad: string
  presupuesto: number
  descripcion?: string
  horarios?: string[]
}

type Tab = "tutorias" | "solicitudes"
type EditTarget = { tipo: "oferta"; data: Oferta } | { tipo: "solicitud"; data: Solicitud } | null

export default function MisPublicacionesPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("tutorias")
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [cargando, setCargando] = useState(true)
  const [editTarget, setEditTarget] = useState<EditTarget>(null)
  const [guardando, setGuardando] = useState(false)
  const [eliminando, setEliminando] = useState<string | null>(null)
  const [uid, setUid] = useState("")

  // Form state
  const [sede, setSede] = useState<Sede | "">("")
  const [ramo, setRamo] = useState("")
  const [modalidad, setModalidad] = useState<Modalidad | "">("")
  const [precio, setPrecio] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [horarios, setHorarios] = useState<string[]>([])
  const [openRamo, setOpenRamo] = useState(false)

  useEffect(() => {
    let cancelled = false
    const { auth } = require("@/lib/firebase")
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
      if (!firebaseUser) { router.push("/"); return }
      setUid(firebaseUser.uid)
      await cargarDatos(firebaseUser.uid)
      if (!cancelled) setCargando(false)
    })
    return () => { cancelled = true; unsubscribe() }
  }, [])

  const cargarDatos = async (userId: string) => {
    const { db } = require("@/lib/firebase")
    const { collection, query, where, getDocs, orderBy } = await import("firebase/firestore")

    const [ofertasSnap, solicitudesSnap] = await Promise.all([
      getDocs(query(collection(db, "Ofertas_Tutoria"), where("id_tutor", "==", userId), orderBy("fecha_creacion", "desc"))),
      getDocs(query(collection(db, "Solicitudes_Ayudantia"), where("id_alumno", "==", userId), orderBy("fecha_creacion", "desc"))),
    ])

    setOfertas(ofertasSnap.docs.map(d => ({ id: d.id, ...d.data() } as Oferta)))
    setSolicitudes(solicitudesSnap.docs.map(d => ({ id: d.id, ...d.data() } as Solicitud)))
  }

  const abrirEditar = (target: EditTarget) => {
    if (!target) return
    setEditTarget(target)
    if (target.tipo === "oferta") {
      const o = target.data
      setSede((o.sede as Sede) || "")
      setRamo(o.id_ramo)
      setModalidad((o.modalidad as Modalidad) || "")
      setPrecio(String(o.precio_referencial))
      setDescripcion(o.descripcion ?? "")
      setHorarios(o.horarios ?? [])
    } else {
      const s = target.data
      setSede((s.sede as Sede) || "")
      setRamo(s.id_ramo)
      setModalidad((s.modalidad as Modalidad) || "")
      setPrecio(String(s.presupuesto))
      setDescripcion(s.descripcion ?? "")
      setHorarios(s.horarios ?? [])
    }
  }

  const guardarCambios = async () => {
    if (!editTarget) return
    setGuardando(true)
    try {
      const { db } = require("@/lib/firebase")
      const { doc, updateDoc } = await import("firebase/firestore")
      const ramoInfo = RAMOS_USM.find(r => r.codigo === ramo)

      if (editTarget.tipo === "oferta") {
        await updateDoc(doc(db, "Ofertas_Tutoria", editTarget.data.id), {
          sede, id_ramo: ramo, nombre_ramo: ramoInfo?.nombre ?? ramo,
          modalidad, precio_referencial: Number(precio), descripcion, horarios,
        })
      } else {
        await updateDoc(doc(db, "Solicitudes_Ayudantia", editTarget.data.id), {
          sede, id_ramo: ramo, modalidad, presupuesto: Number(precio), descripcion, horarios,
        })
      }
      await cargarDatos(uid)
      setEditTarget(null)
    } finally {
      setGuardando(false)
    }
  }

  const eliminar = async (tipo: "oferta" | "solicitud", id: string) => {
    if (!confirm("¿Eliminar esta publicación?")) return
    setEliminando(id)
    try {
      const { db } = require("@/lib/firebase")
      const { doc, deleteDoc } = await import("firebase/firestore")
      const coleccion = tipo === "oferta" ? "Ofertas_Tutoria" : "Solicitudes_Ayudantia"
      await deleteDoc(doc(db, coleccion, id))
      await cargarDatos(uid)
    } finally {
      setEliminando(null)
    }
  }

  const ramoSeleccionado = RAMOS_USM.find(r => r.codigo === ramo)

  if (editTarget) {
    return (
      <div className="min-h-screen bg-secondary/40">
        <header className="sticky top-0 z-40 border-b border-border bg-card">
          <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
            <button onClick={() => setEditTarget(null)} className="rounded-full p-1.5 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="size-5" />
            </button>
            <h1 className="text-base font-semibold text-foreground">
              Editar {editTarget.tipo === "oferta" ? "tutoría" : "solicitud"}
            </h1>
          </div>
        </header>

        <main className="mx-auto max-w-3xl px-4 py-8">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-8">

            <div className="space-y-2">
              <Label>Sede</Label>
              <div className="grid grid-cols-2 gap-3">
                {SEDES_USM.map((opcion) => {
                  const activa = sede === opcion
                  return (
                    <button key={opcion} type="button" onClick={() => setSede(opcion)}
                      className={cn("flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                        activa ? "border-[#0070f3] bg-[#0070f3]/5 text-[#0070f3]" : "border-border bg-background text-muted-foreground hover:border-[#0070f3]/50"
                      )}>
                      <span className={cn("flex size-4 shrink-0 items-center justify-center rounded-full border", activa ? "border-[#0070f3]" : "border-muted-foreground/40")}>
                        {activa && <span className="size-2 rounded-full bg-[#0070f3]" />}
                      </span>
                      <span className="text-center leading-tight">{opcion}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Asignatura</Label>
              <Popover open={openRamo} onOpenChange={setOpenRamo}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline" role="combobox" className="h-11 w-full justify-between bg-background font-normal">
                    {ramoSeleccionado ? (
                      <span className="truncate">
                        <span className="font-semibold text-foreground">{ramoSeleccionado.codigo}</span>
                        <span className="text-muted-foreground"> — {ramoSeleccionado.nombre}</span>
                      </span>
                    ) : <span className="text-muted-foreground">Selecciona un ramo</span>}
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
                          <CommandItem key={r.codigo} value={`${r.codigo} ${r.nombre}`} onSelect={() => { setRamo(r.codigo); setOpenRamo(false) }}>
                            <Check className={cn("size-4 text-[#0070f3]", ramo === r.codigo ? "opacity-100" : "opacity-0")} />
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
              <Label>Modalidad</Label>
              <div className="grid grid-cols-2 gap-3">
                {(["presencial", "online"] as const).map((opcion) => {
                  const activa = modalidad === opcion
                  return (
                    <button key={opcion} type="button" onClick={() => setModalidad(opcion)}
                      className={cn("flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium capitalize transition-all",
                        activa ? "border-[#0070f3] bg-[#0070f3]/5 text-[#0070f3]" : "border-border bg-background text-muted-foreground hover:border-[#0070f3]/50"
                      )}>
                      <span className={cn("flex size-4 items-center justify-center rounded-full border", activa ? "border-[#0070f3]" : "border-muted-foreground/40")}>
                        {activa && <span className="size-2 rounded-full bg-[#0070f3]" />}
                      </span>
                      {opcion}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>{editTarget.tipo === "oferta" ? "Precio por hora" : "Presupuesto por hora"}</Label>
              <div className="flex h-11 items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring/50">
                <span className="select-none px-3 text-sm font-medium text-muted-foreground">CLP $</span>
                <input type="number" inputMode="numeric" min={0} step={500} value={precio}
                  onChange={(e) => { const val = e.target.value; if (val === "" || Number(val) >= 0) setPrecio(val) }}
                  className="h-full w-full min-w-0 border-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
                <span className="select-none whitespace-nowrap px-3 text-sm text-muted-foreground">por hora</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Descripción</Label>
              <Textarea rows={5} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="resize-none bg-background" />
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-base">Horarios disponibles</Label>
                <p className="text-xs text-muted-foreground">Marca los bloques en los que estás disponible.</p>
              </div>
              <DisponibilidadMatrix selected={horarios} onChange={setHorarios} />
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between">
              <Button type="button" variant="ghost" onClick={() => setEditTarget(null)} className="text-muted-foreground">
                Cancelar
              </Button>
              <Button type="button" onClick={guardarCambios} disabled={guardando}
                className="w-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90 sm:w-auto sm:min-w-[180px]">
                {guardando ? <><Loader2 className="size-4 animate-spin" /> Guardando...</> : "Guardar cambios"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-3xl items-center gap-3 px-4">
          <Link href="/perfil" className="rounded-full p-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-base font-semibold text-foreground">Mis publicaciones</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="mb-6 flex border-b border-border">
          <button onClick={() => setTab("tutorias")}
            className={cn("flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === "tutorias" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"
            )}>
            <BookOpen className="w-4 h-4" />
            Tutorías
            <span className="text-xs bg-muted rounded-full px-2 py-0.5">{ofertas.length}</span>
          </button>
          <button onClick={() => setTab("solicitudes")}
            className={cn("flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              tab === "solicitudes" ? "border-blue-600 text-blue-600" : "border-transparent text-muted-foreground hover:text-foreground"
            )}>
            <HandHelping className="w-4 h-4" />
            Solicitudes
            <span className="text-xs bg-muted rounded-full px-2 py-0.5">{solicitudes.length}</span>
          </button>
        </div>

        {cargando ? (
          <div className="flex flex-col gap-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-28 w-full animate-pulse rounded-2xl bg-muted" />)}
          </div>
        ) : tab === "tutorias" ? (
          ofertas.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <BookOpen className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No tienes tutorías publicadas aún.</p>
              <Button asChild className="bg-[#0070f3] text-white hover:bg-[#0070f3]/90">
                <Link href="/publicar-oferta">Publicar tutoría</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ofertas.map((o) => (
                <div key={o.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-[#0070f3]">{o.id_ramo}</p>
                      <p className="text-sm font-semibold text-foreground">{o.nombre_ramo ?? o.id_ramo}</p>
                      <p className="mt-1 text-xs text-muted-foreground capitalize">{o.modalidad} · {o.sede}</p>
                      <p className="text-xs text-muted-foreground">${o.precio_referencial?.toLocaleString("es-CL")} / hr</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => abrirEditar({ tipo: "oferta", data: o })}
                        className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-[#0070f3] hover:border-[#0070f3] transition-colors">
                        <Pencil className="size-3.5" />
                      </button>
                      <button onClick={() => eliminar("oferta", o.id)} disabled={eliminando === o.id}
                        className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors">
                        {eliminando === o.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                      </button>
                    </div>
                  </div>
                  {o.descripcion && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground border-t border-border pt-2">{o.descripcion}</p>}
                </div>
              ))}
            </div>
          )
        ) : (
          solicitudes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <HandHelping className="size-10 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No tienes solicitudes publicadas aún.</p>
              <Button asChild className="bg-[#0070f3] text-white hover:bg-[#0070f3]/90">
                <Link href="/solicitar-ayudantia">Publicar solicitud</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {solicitudes.map((s) => {
                const ramoInfo = RAMOS_USM.find(r => r.codigo === s.id_ramo)
                return (
                  <div key={s.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[11px] font-medium uppercase tracking-wide text-[#0070f3]">{s.id_ramo}</p>
                        <p className="text-sm font-semibold text-foreground">{ramoInfo?.nombre ?? s.id_ramo}</p>
                        <p className="mt-1 text-xs text-muted-foreground capitalize">{s.modalidad} · {s.sede}</p>
                        <p className="text-xs text-muted-foreground">${s.presupuesto?.toLocaleString("es-CL")} / hr</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => abrirEditar({ tipo: "solicitud", data: s })}
                          className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-[#0070f3] hover:border-[#0070f3] transition-colors">
                          <Pencil className="size-3.5" />
                        </button>
                        <button onClick={() => eliminar("solicitud", s.id)} disabled={eliminando === s.id}
                          className="flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-red-500 hover:border-red-500 transition-colors">
                          {eliminando === s.id ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                    {s.descripcion && <p className="mt-2 line-clamp-2 text-xs text-muted-foreground border-t border-border pt-2">{s.descripcion}</p>}
                  </div>
                )
              })}
            </div>
          )
        )}
      </main>
    </div>
  )
}