"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowLeft,
  User,
  MessageSquare,
  BookOpen,
  Heart,
  Settings,
  LogOut,
  Star,
  ChevronRight,
  PenLine,
} from "lucide-react"
import { signOut } from "firebase/auth"
import { cn } from "@/lib/utils"

export default function PerfilPage() {
  const router = useRouter()
  const [nombre, setNombre] = useState("")
  const [fotoUrl, setFotoUrl] = useState("")
  const [calificacion, setCalificacion] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const { auth, db } = require("@/lib/firebase")
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
      if (!firebaseUser) {
        router.push("/")
        return
      }
      const { collection, query, where, getDocs } = await import("firebase/firestore")
      const q = query(collection(db, "usuarios"), where("uid", "==", firebaseUser.uid))
      const snap = await getDocs(q)
      const data = snap.docs[0]?.data()
      if (cancelled) return
      if (data?.nombre_completo) setNombre(data.nombre_completo)
      if (data?.url_foto_perfil) setFotoUrl(data.url_foto_perfil)
      if (data?.calificacion_promedio) setCalificacion(data.calificacion_promedio)
      loading && setLoading(false)
    })
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [router, loading])

  const handleSignOut = async () => {
    const { auth } = require("@/lib/firebase")
    await signOut(auth)
    router.push("/")
  }

  const iniciales = nombre
    ? nombre.split(" ").slice(0, 2).map((p: string) => p[0]).join("").toUpperCase()
    : null

  return (
    <div className="min-h-screen bg-secondary/40 pb-10">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4 md:h-16">
          <Link href="/dashboard" className="rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground md:hidden">
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-base font-semibold text-foreground md:text-xl">Perfil</h1>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 md:py-8">
        
        {/* Contenedor Flex: 1 columna en móvil, 2 columnas en PC */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start">
          
          {/* ========================================== */}
          {/* COLUMNA IZQUIERDA (Desktop) / TOP (Móvil)  */}
          {/* ========================================== */}
          <div className="flex w-full flex-col gap-4 md:w-1/3 md:sticky md:top-24">
            
            {/* Tarjeta de identidad */}
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center">
              <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-border bg-secondary">
                {fotoUrl ? (
                  <Image src={fotoUrl} alt={nombre} fill className="object-cover" sizes="80px" />
                ) : (
                  <div className="text-xl font-semibold text-muted-foreground">
                    {loading ? <User className="size-8" /> : (iniciales ?? <User className="size-8" />)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {loading ? "Cargando..." : (nombre || "Estudiante USM")}
                </p>
                {calificacion != null && calificacion > 0 ? (
                  <div className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium text-foreground">{calificacion.toFixed(1)}</span>
                    <span>promedio</span>
                  </div>
                ) : (
                  <p className="mt-1 text-xs text-muted-foreground">Sin calificaciones aún</p>
                )}
              </div>
            </div>

            {/* Menú Secundario y Logout (VISIBLE SOLO EN PC) */}
            <div className="hidden flex-col gap-4 md:flex">
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <NavItem href="/perfil/editar" icon={<PenLine className="size-5 text-muted-foreground" />} label="Editar perfil" />
                <NavItem href="/perfil/configuracion" icon={<Settings className="size-5 text-muted-foreground" />} label="Configuración" last />
              </div>
              <div className="overflow-hidden rounded-2xl border border-border bg-card">
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary/60"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50">
                    <LogOut className="size-5 text-red-500" />
                  </div>
                  <span className="text-sm font-medium text-red-500">Cerrar sesión</span>
                </button>
              </div>
            </div>

          </div>

          {/* ========================================== */}
          {/* COLUMNA DERECHA (Desktop) / BOTTOM (Móvil) */}
          {/* ========================================== */}
          <div className="flex w-full flex-col gap-4 md:w-2/3">
            
            {/* Sección principal (Lista en móvil, Grid en PC) */}
            <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card md:grid md:grid-cols-2 md:gap-px md:border-none md:bg-border md:rounded-none md:overflow-visible">
              
              <Link href="/mensajes" className="group flex items-center gap-3 border-b border-border px-4 py-4 transition-colors hover:bg-secondary/60 md:flex-col md:items-start md:justify-between md:gap-4 md:rounded-tl-2xl md:border-none md:bg-card md:p-6 md:hover:shadow-sm">
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary md:size-12 md:bg-[#0070f3]/10">
                    <MessageSquare className="size-5 text-[#0070f3] md:size-6" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground md:text-base md:font-semibold">Mensajes</span>
                    <p className="hidden text-xs text-muted-foreground md:mt-1 md:block">Revisa tus conversaciones activas</p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/50 md:hidden" />
              </Link>

              <Link href="/perfil/publicaciones" className="group flex items-center gap-3 border-b border-border px-4 py-4 transition-colors hover:bg-secondary/60 md:flex-col md:items-start md:justify-between md:gap-4 md:rounded-tr-2xl md:border-none md:bg-card md:p-6 md:hover:shadow-sm">
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary md:size-12 md:bg-[#0070f3]/10">
                    <BookOpen className="size-5 text-[#0070f3] md:size-6" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground md:text-base md:font-semibold">Mis publicaciones</span>
                    <p className="hidden text-xs text-muted-foreground md:mt-1 md:block">Gestiona tus ofertas de ayudantía</p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/50 md:hidden" />
              </Link>

              <Link href="/dashboard" className="group flex items-center gap-3 px-4 py-4 transition-colors hover:bg-secondary/60 md:col-span-2 md:flex-col md:items-start md:justify-between md:gap-4 md:rounded-b-2xl md:border-none md:bg-card md:p-6 md:hover:shadow-sm">
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary md:size-12 md:bg-[#0070f3]/10">
                    <Heart className="size-5 text-[#0070f3] md:size-6" />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-foreground md:text-base md:font-semibold">Guardados</span>
                    <p className="hidden text-xs text-muted-foreground md:mt-1 md:block">Ofertas y tutores que has guardado</p>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/50 md:hidden" />
              </Link>

            </div>

            {/* Menú Secundario y Logout (VISIBLE SOLO EN MÓVIL) */}
            <div className="overflow-hidden rounded-2xl border border-border bg-card md:hidden">
              <NavItem href="/perfil/editar" icon={<PenLine className="size-5 text-muted-foreground" />} label="Editar perfil" />
              <NavItem href="/perfil/configuracion" icon={<Settings className="size-5 text-muted-foreground" />} label="Configuración" last />
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card md:hidden">
              <button
                type="button"
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-secondary/60"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-red-50">
                  <LogOut className="size-5 text-red-500" />
                </div>
                <span className="text-sm font-medium text-red-500">Cerrar sesión</span>
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}

// Componente NavItem (se mantiene intacto para usarlo en las vistas secundarias)
function NavItem({
  href,
  icon,
  label,
  last = false,
}: {
  href: string
  icon: React.ReactNode
  label: string
  last?: boolean
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-4 transition-colors hover:bg-secondary/60",
        !last && "border-b border-border",
      )}
    >
      <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary">
        {icon}
      </div>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground/50" />
    </Link>
  )
}