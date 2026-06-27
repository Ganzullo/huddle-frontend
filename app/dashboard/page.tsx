"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { SlidersHorizontal, GraduationCap, BookOpen, HandHelping } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SidebarNav } from "@/components/dashboard/sidebar-nav"
import { FiltersPanel } from "@/components/dashboard/filters-panel"
import { OfertaCard } from "@/components/dashboard/oferta-card"
import { OfertaDetalle } from "@/components/dashboard/oferta-detalle"
import { EmptyState } from "@/components/dashboard/empty-state"
import { BannerCta } from "@/components/dashboard/banner-cta"
import { RAMOS_USM } from "@/lib/usm-data"

interface Oferta {
  id: string
  id_tutor: string
  id_ramo: string
  nombre_ramo: string
  modalidad: string
  precio_referencial: number
  lugar_especifico: string
  descripcion?: string
  nombre_tutor?: string
  foto_url?: string
  sede?: string
  horarios?: string[]
  rating?: number
  reviews?: number
  fecha_creacion: any
}

interface Solicitud {
  id: string
  id_alumno: string
  id_ramo: string
  nombre_alumno: string
  foto_url?: string
  sede: string
  modalidad: string
  presupuesto: number
  descripcion: string
  horarios: string[]
  fecha_creacion: any
}

interface Filtros {
  ramos: string[]
  modalidad: string[]
  campus: string[]
  bloques: string[]
  dias: string[]
  precioMin: number
  precioMax: number
}

export default function DashboardPage() {
  const [nombre, setNombre] = useState("Estudiante USM")
  const [fotoUrl, setFotoUrl] = useState<string>("")
  const [campusUsuario, setCampusUsuario] = useState<string>("")
  const [tab, setTab] = useState<"tutorias" | "solicitudes">("tutorias")
  const [orden, setOrden] = useState("relevancia")
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [cargando, setCargando] = useState(true)
  const [cargandoSolicitudes, setCargandoSolicitudes] = useState(true)
  const [ofertaSeleccionada, setOfertaSeleccionada] = useState<Oferta | null>(null)
  const [detalleAbierto, setDetalleAbierto] = useState(false)
  const [filtros, setFiltros] = useState<Filtros>({
    ramos: [],
    modalidad: [],
    campus: [],
    bloques: [],
    dias: [],
    precioMin: 0,
    precioMax: 999999,
  })

  useEffect(() => {
    let cancelled = false

    const { auth, db } = require("@/lib/firebase")
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
      if (!firebaseUser || cancelled) return

      const { collection, query, where, getDocs } = await import("firebase/firestore")
      const q = query(collection(db, "usuarios"), where("uid", "==", firebaseUser.uid))
      const snap = await getDocs(q)
      const data = snap.docs[0]?.data()

      if (cancelled) return
      if (data?.nombre_completo) setNombre(data.nombre_completo)
      if (data?.url_foto_perfil) setFotoUrl(data.url_foto_perfil)
      if (data?.campus) {
        setCampusUsuario(data.campus)
        setFiltros((prev) => ({ ...prev, campus: [data.campus] }))
      }
    })

    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [])

  const cargarOfertas = useCallback(async () => {
    setCargando(true)
    try {
      const params = new URLSearchParams()
      if (filtros.ramos.length > 0) params.set("ramos", filtros.ramos.join(","))
      if (filtros.modalidad.length === 1) params.set("modalidad", filtros.modalidad[0])
      if (filtros.campus.length > 0) params.set("campus", filtros.campus.join(","))
      if (filtros.bloques.length > 0) params.set("bloques", filtros.bloques.join(","))
      if (filtros.dias.length > 0) params.set("dias", filtros.dias.join(","))
      if (filtros.precioMin > 0) params.set("precioMin", String(filtros.precioMin))
      if (filtros.precioMax < 999999) params.set("precioMax", String(filtros.precioMax))
      params.set("orden", orden)

      const res = await fetch(`/api/ofertas?${params.toString()}`)
      const data = await res.json()
      setOfertas(data.ofertas ?? [])
    } catch (error) {
      console.error("Error al cargar ofertas:", error)
    } finally {
      setCargando(false)
    }
  }, [filtros, orden])

  const cargarSolicitudes = useCallback(async () => {
    setCargandoSolicitudes(true)
    try {
      const { db } = await import("@/lib/firebase")
      const { collection, getDocs, orderBy, query, where } = await import("firebase/firestore")
      const q = query(
        collection(db, "Solicitudes_Ayudantia"),
        orderBy("fecha_creacion", "desc")
      )
      const snap = await getDocs(q)
      let data = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Solicitud))

      const uidsAlumnos = [...new Set(data.map((s) => s.id_alumno).filter(Boolean))]
      if (uidsAlumnos.length > 0) {
        const usuariosQ = query(collection(db, "usuarios"), where("uid", "in", uidsAlumnos))
        const usuariosSnap = await getDocs(usuariosQ)
        const fotosPorUid: Record<string, string> = {}
        usuariosSnap.docs.forEach((doc) => {
          const d = doc.data()
          if (d.uid && d.url_foto_perfil) {
            fotosPorUid[d.uid] = d.url_foto_perfil
          }
        })
        data = data.map((s) => ({ ...s, foto_url: fotosPorUid[s.id_alumno] }))
      }

      setSolicitudes(data)
    } catch (error) {
      console.error("Error al cargar solicitudes:", error)
    } finally {
      setCargandoSolicitudes(false)
    }
  }, [])

  useEffect(() => {
    cargarOfertas()
  }, [cargarOfertas])

  useEffect(() => {
    if (tab === "solicitudes") cargarSolicitudes()
  }, [tab, cargarSolicitudes])

  const solicitudComoOferta = (s: Solicitud): Oferta => {
    const ramoInfo = RAMOS_USM.find((r) => r.codigo === s.id_ramo)
    return {
      id: s.id,
      id_tutor: s.id_alumno,
      id_ramo: s.id_ramo,
      nombre_ramo: ramoInfo?.nombre ?? s.id_ramo,
      modalidad: s.modalidad,
      precio_referencial: s.presupuesto,
      lugar_especifico: s.sede,
      descripcion: s.descripcion,
      nombre_tutor: s.nombre_alumno,
      foto_url: s.foto_url,
      sede: s.sede,
      horarios: s.horarios,
      fecha_creacion: s.fecha_creacion,
    }
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-40 border-b border-border bg-card lg:hidden">
        <div className="flex items-center gap-3 px-4 py-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 rounded-full bg-transparent">
                <SlidersHorizontal className="size-4" />
                <span className="sr-only">Abrir navegación y filtros</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Navegación</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <SidebarNav nombre={nombre} fotoUrl={fotoUrl} />
                <FiltersPanel
                 filtros={filtros}
                  onFiltrosChange={setFiltros}
                  campusInicial={campusUsuario}
                />
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
            <GraduationCap className="size-6 text-[#0070f3]" strokeWidth={2} />
            <span className="text-base font-bold text-[#0070f3]">Huddle USM</span>
          </Link>

          
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex border-b border-border">
          <button
            onClick={() => setTab("tutorias")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === "tutorias"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Tutorías
            <span className="text-xs bg-muted rounded-full px-2 py-0.5">
              {ofertas.length}
            </span>
          </button>

          <button
            onClick={() => setTab("solicitudes")}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === "solicitudes"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <HandHelping className="w-4 h-4" />
            Solicitudes de ayudantía
            <span className="text-xs bg-muted rounded-full px-2 py-0.5">
              {solicitudes.length}
            </span>
          </button>
        </div>

        <div className="flex gap-6">
          <aside className="hidden w-72 shrink-0 lg:block">
            {/* sticky top para que el aside quede fijo al hacer scroll */}
            <div className="sticky top-6 space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <SidebarNav nombre={nombre} fotoUrl={fotoUrl} />
              </div>
              {/* overflow-hidden para que FiltersPanel maneje su propio scroll interno */}
              <div className="rounded-2xl border border-border bg-card p-5 overflow-hidden">
                <FiltersPanel
                  filtros={filtros}
                  onFiltrosChange={setFiltros}
                  campusInicial={campusUsuario}
                />
              </div>
            </div>
          </aside>

          <section className="min-w-0 flex-1 overflow-y-auto max-h-[calc(100vh-180px)]">
            {tab === "tutorias" && (
              <>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h1 className="text-lg font-semibold text-foreground">
                    {cargando ? "Buscando ofertas..." : `${ofertas.length} ofertas encontradas`}
                  </h1>
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm text-muted-foreground">Ordenar por:</span>
                    <Select value={orden} onValueChange={setOrden}>
                      <SelectTrigger className="h-9 w-[160px]" aria-label="Ordenar por">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="relevancia">Relevancia</SelectItem>
                        <SelectItem value="precio-asc">Precio: menor a mayor</SelectItem>
                        <SelectItem value="precio-desc">Precio: mayor a menor</SelectItem>
                        <SelectItem value="rating">Mejor calificación</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {cargando ? (
                  <div className="flex flex-col gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
                    ))}
                  </div>
                ) : ofertas.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {ofertas.map((oferta) => (
                      <OfertaCard
                        key={oferta.id}
                        oferta={oferta}
                        onVerDisponibilidad={(o) => {
                          setOfertaSeleccionada(o as Oferta)
                          setDetalleAbierto(true)
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </>
            )}

            {tab === "solicitudes" && (
              <>
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h1 className="text-lg font-semibold text-foreground">
                    {cargandoSolicitudes
                      ? "Buscando solicitudes..."
                      : `${solicitudes.length} solicitudes encontradas`}
                  </h1>
                </div>

                {cargandoSolicitudes ? (
                  <div className="flex flex-col gap-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
                    ))}
                  </div>
                ) : solicitudes.length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {solicitudes.map((sol) => (
                      <OfertaCard
                        key={sol.id}
                        oferta={solicitudComoOferta(sol)}
                        esSolicitud
                        onVerDisponibilidad={(o) => {
                          setOfertaSeleccionada(o as Oferta)
                          setDetalleAbierto(true)
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </>
            )}

            <div className="mt-8">
              <BannerCta />
            </div>
          </section>
        </div>
      </main>

      <OfertaDetalle
        oferta={ofertaSeleccionada}
        open={detalleAbierto}
        onOpenChange={setDetalleAbierto}
      />
    </div>
  )
}