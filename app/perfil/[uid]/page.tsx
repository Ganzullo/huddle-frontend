"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  User,
  Star,
  GraduationCap,
  BookOpen,
  HandHelping,
  MapPin,
  MessageSquare,
  Clock,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface UsuarioPublico {
  uid: string
  nombre_completo: string
  url_foto_perfil?: string
  calificacion_promedio?: number
  campus?: string
  carrera?: string
}

interface Oferta {
  id: string
  nombre_ramo: string
  modalidad: string
  precio_referencial: number
  sede?: string
  descripcion?: string
  horarios?: string[]
  fecha_creacion: any
}

interface Solicitud {
  id: string
  nombre_ramo?: string
  id_ramo: string
  modalidad: string
  presupuesto: number
  sede: string
  descripcion: string
  horarios?: string[]
  fecha_creacion: any
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "size-4",
            i <= Math.round(value)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-[#0070f3]/10 px-2.5 py-0.5 text-xs font-medium capitalize text-[#0070f3]">
      {children}
    </span>
  )
}

function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-lg bg-muted", className)} />
}

function TutoriaCard({ oferta }: { oferta: Oferta }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0070f3]/10">
            <BookOpen className="size-4 text-[#0070f3]" />
          </div>
          <span className="font-semibold text-foreground text-sm leading-tight">
            {oferta.nombre_ramo}
          </span>
        </div>
        <span className="shrink-0 text-sm font-bold text-[#0070f3]">
          ${oferta.precio_referencial.toLocaleString("es-CL")}
          <span className="text-xs font-normal text-muted-foreground">/hr</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Badge>{oferta.modalidad}</Badge>
        {oferta.sede && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {oferta.sede}
          </span>
        )}
      </div>

      {oferta.descripcion && (
        <p className="line-clamp-2 text-xs text-muted-foreground">{oferta.descripcion}</p>
      )}

      {oferta.horarios && oferta.horarios.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3 shrink-0" />
          <span>
            {oferta.horarios.length} bloque{oferta.horarios.length !== 1 ? "s" : ""} disponible
            {oferta.horarios.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  )
}

function SolicitudCard({ solicitud }: { solicitud: Solicitud }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4 transition-shadow hover:shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-500/10">
            <HandHelping className="size-4 text-purple-500" />
          </div>
          <span className="font-semibold text-foreground text-sm leading-tight">
            {solicitud.nombre_ramo ?? solicitud.id_ramo}
          </span>
        </div>
        <span className="shrink-0 text-sm font-bold text-purple-500">
          ${solicitud.presupuesto.toLocaleString("es-CL")}
          <span className="text-xs font-normal text-muted-foreground">/hr</span>
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs font-medium capitalize text-purple-500">
          {solicitud.modalidad}
        </span>
        {solicitud.sede && (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {solicitud.sede}
          </span>
        )}
      </div>

      {solicitud.descripcion && (
        <p className="line-clamp-2 text-xs text-muted-foreground">{solicitud.descripcion}</p>
      )}

      {solicitud.horarios && solicitud.horarios.length > 0 && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3 shrink-0" />
          <span>
            {solicitud.horarios.length} bloque{solicitud.horarios.length !== 1 ? "s" : ""} disponible
            {solicitud.horarios.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  )
}

export default function PerfilPublicoPage() {
  const params = useParams()
  const router = useRouter()
  const uid = params?.uid as string

  const [usuario, setUsuario] = useState<UsuarioPublico | null>(null)
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
  const [tab, setTab] = useState<"tutorias" | "solicitudes">("tutorias")
  const [loading, setLoading] = useState(true)
  const [esPropietario, setEsPropietario] = useState(false)

  useEffect(() => {
    if (!uid) return

    const cargarDatos = async () => {
      const { auth, db } = require("@/lib/firebase")
      const { collection, query, where, getDocs, orderBy } = await import("firebase/firestore")
      const { RAMOS_USM } = await import("@/lib/usm-data")

      const currentUser = auth.currentUser
      setEsPropietario(currentUser?.uid === uid)

      const usuarioQ = query(collection(db, "usuarios"), where("uid", "==", uid))
      const usuarioSnap = await getDocs(usuarioQ)
      const data = usuarioSnap.docs[0]?.data()
      if (!data) { setLoading(false); return }

      setUsuario({
        uid,
        nombre_completo: data.nombre_completo ?? "Estudiante USM",
        url_foto_perfil: data.url_foto_perfil,
        calificacion_promedio: data.calificacion_promedio,
        campus: data.campus,
        carrera: data.carrera,
      })

      const ofertasQ = query(
        collection(db, "Ofertas_Tutoria"),
        where("id_tutor", "==", uid),
        orderBy("fecha_creacion", "desc"),
      )
      const ofertasSnap = await getDocs(ofertasQ)
      setOfertas(ofertasSnap.docs.map((d) => ({ id: d.id, ...d.data() } as Oferta)))

      const solicitudesQ = query(
        collection(db, "Solicitudes_Ayudantia"),
        where("id_alumno", "==", uid),
        orderBy("fecha_creacion", "desc"),
      )
      const solicitudesSnap = await getDocs(solicitudesQ)
      const enriquecidas = solicitudesSnap.docs
        .map((d) => ({ id: d.id, ...d.data() } as Solicitud))
        .map((s) => ({
          ...s,
          nombre_ramo: RAMOS_USM.find((r: any) => r.codigo === s.id_ramo)?.nombre ?? s.id_ramo,
        }))
      setSolicitudes(enriquecidas)

      setLoading(false)
    }

    cargarDatos()
  }, [uid])

  const iniciales = usuario?.nombre_completo
    ? usuario.nombre_completo.split(" ").slice(0, 2).map((p) => p[0]).join("").toUpperCase()
    : null

  return (
    <div className="min-h-screen bg-secondary/40 pb-12">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 md:h-16">
          <button
            onClick={() => router.back()}
            className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft className="size-5" />
          </button>
          <Link href="/dashboard" className="hidden shrink-0 items-center gap-2 md:flex transition-opacity hover:opacity-80">
            <GraduationCap className="size-6 text-[#0070f3]" strokeWidth={2.5} />
            <span className="text-lg font-bold text-[#0070f3]">Huddle USM</span>
          </Link>
          <h1 className="text-base font-semibold text-foreground md:text-lg md:ml-1">Perfil público</h1>
          {esPropietario && (
            <Link href="/perfil/editar" className="ml-auto text-sm font-medium text-[#0070f3] hover:underline">
              Editar perfil
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">

          {/* Columna izquierda */}
          <div className="w-full md:w-[280px] md:shrink-0 md:sticky md:top-24 flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center">
              {loading ? (
                <>
                  <Skeleton className="size-20 rounded-full" />
                  <Skeleton className="h-5 w-36" />
                  <Skeleton className="h-4 w-24" />
                </>
              ) : (
                <>
                  <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-secondary">
                    {usuario?.url_foto_perfil ? (
                      <Image src={usuario.url_foto_perfil} alt={usuario.nombre_completo} fill className="object-cover" sizes="80px" />
                    ) : (
                      <div className="text-xl font-semibold text-muted-foreground">
                         {iniciales ? (
                          <span>{iniciales}</span>
                         ) : (
                         <User className="size-8" />
                          )}
                          </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-foreground">{usuario?.nombre_completo ?? "Estudiante USM"}</p>
                    {usuario?.carrera && <p className="text-xs text-muted-foreground">{usuario.carrera}</p>}
                    {usuario?.campus && (
                      <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="size-3" />
                        {usuario.campus}
                      </div>
                    )}
                  </div>
                  {usuario?.calificacion_promedio != null && usuario.calificacion_promedio > 0 ? (
                    <div className="flex flex-col items-center gap-1">
                      <StarRating value={usuario.calificacion_promedio} />
                      <span className="text-sm font-semibold text-foreground">
                        {usuario.calificacion_promedio.toFixed(1)}
                        <span className="ml-1 text-xs font-normal text-muted-foreground">promedio</span>
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">Sin calificaciones aún</p>
                  )}
                </>
              )}
            </div>

            {!loading && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-border bg-card p-4 text-center">
                  <span className="text-xl font-bold text-[#0070f3]">{ofertas.length}</span>
                  <span className="text-xs text-muted-foreground">{ofertas.length === 1 ? "Tutoría" : "Tutorías"}</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 rounded-2xl border border-border bg-card p-4 text-center">
                  <span className="text-xl font-bold text-purple-500">{solicitudes.length}</span>
                  <span className="text-xs text-muted-foreground">{solicitudes.length === 1 ? "Solicitud" : "Solicitudes"}</span>
                </div>
              </div>
            )}

            {!loading && !esPropietario && (
              <Link
                href={`/mensajes?uid=${uid}`}
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#0070f3] bg-[#0070f3] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0070f3]/90"
              >
                <MessageSquare className="size-4" />
                Enviar mensaje
              </Link>
            )}
          </div>

          {/* Columna derecha */}
          <div className="flex w-full flex-1 flex-col gap-4">
            <div className="flex border-b border-border">
              <button
                onClick={() => setTab("tutorias")}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                  tab === "tutorias"
                    ? "border-[#0070f3] text-[#0070f3]"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <BookOpen className="size-4" />
                Tutorías
                {!loading && <span className="text-xs bg-muted rounded-full px-2 py-0.5">{ofertas.length}</span>}
              </button>

              <button
                onClick={() => setTab("solicitudes")}
                className={cn(
                  "flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                  tab === "solicitudes"
                    ? "border-purple-500 text-purple-500"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <HandHelping className="size-4" />
                Solicitudes
                {!loading && <span className="text-xs bg-muted rounded-full px-2 py-0.5">{solicitudes.length}</span>}
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col gap-4">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
              </div>
            ) : tab === "tutorias" ? (
              ofertas.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {ofertas.map((o) => <TutoriaCard key={o.id} oferta={o} />)}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
                  <BookOpen className="size-8 text-muted-foreground/40" />
                  <p className="text-sm font-medium text-muted-foreground">
                    {esPropietario ? "Aún no tienes tutorías publicadas" : "Este usuario no tiene tutorías activas"}
                  </p>
                  {esPropietario && (
                    <Link href="/publicar/oferta" className="mt-1 text-xs font-medium text-[#0070f3] hover:underline">
                      Publicar una tutoría →
                    </Link>
                  )}
                </div>
              )
            ) : solicitudes.length > 0 ? (
              <div className="flex flex-col gap-4">
                {solicitudes.map((s) => <SolicitudCard key={s.id} solicitud={s} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-border py-16 text-center">
                <HandHelping className="size-8 text-muted-foreground/40" />
                <p className="text-sm font-medium text-muted-foreground">
                  {esPropietario ? "Aún no tienes solicitudes publicadas" : "Este usuario no tiene solicitudes activas"}
                </p>
                {esPropietario && (
                  <Link href="/publicar/solicitud" className="mt-1 text-xs font-medium text-[#0070f3] hover:underline">
                    Publicar una solicitud →
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}