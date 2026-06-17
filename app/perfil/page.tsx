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
      setLoading(false)
    })
    return () => {
      cancelled = true
      unsubscribe()
    }
  }, [router])

  const handleSignOut = async () => {
    const { auth } = require("@/lib/firebase")
    await signOut(auth)
    router.push("/")
  }

  const iniciales = nombre
    ? nombre.split(" ").slice(0, 2).map((p: string) => p[0]).join("").toUpperCase()
    : null

  return (
    <div className="min-h-screen bg-secondary/40">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-lg items-center gap-3 px-4">
          <Link href="/dashboard" className="rounded-full p-1.5 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-base font-semibold text-foreground">Perfil</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6 space-y-4">

        {/* Tarjeta de identidad */}
        <div className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center gap-3 text-center">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-full border-2 border-border bg-secondary">
            {fotoUrl ? (
              <Image src={fotoUrl} alt={nombre} fill className="object-cover" sizes="80px" />
            ) : (
              <div className="flex size-full items-center justify-center text-xl font-semibold text-muted-foreground">
                {loading ? <User className="size-8" /> : (iniciales ?? <User className="size-8" />)}
              </div>
            )}
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{loading ? "Cargando..." : (nombre || "Estudiante USM")}</p>
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

        {/* Sección principal */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <NavItem href="/mensajes" icon={<MessageSquare className="size-5 text-[#0070f3]" />} label="Mensajes" />
          <NavItem href="/dashboard" icon={<BookOpen className="size-5 text-[#0070f3]" />} label="Mis publicaciones" />
          <NavItem href="/dashboard" icon={<Heart className="size-5 text-[#0070f3]" />} label="Guardados" last />
        </div>

        {/* Sección secundaria */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <NavItem href="/perfil/editar" icon={<PenLine className="size-5 text-muted-foreground" />} label="Editar perfil" />
          <NavItem href="/perfil/configuracion" icon={<Settings className="size-5 text-muted-foreground" />} label="Configuración" last />
        </div>

        {/* Cerrar sesión */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
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

      </main>
    </div>
  )
}

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