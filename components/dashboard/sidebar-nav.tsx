"use client"

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"
import { GraduationCap, MessageSquare, Bell, Plus, User, HandHelping } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { auth, db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore"
import { useRouter } from "next/navigation"

interface SidebarNavProps {
  nombre: string
  fotoUrl?: string
}

// Estructura unificada de notificación (mensajes hoy, sistema en el futuro)
interface Notificacion {
  id: string
  tipo: "mensaje" | "sistema"
  titulo: string       // nombre del emisor o título del sistema
  detalle: string      // preview del mensaje o descripción
  tiempo: string       // hora formateada
  leida: boolean
  foto_url?: string    // avatar del emisor (solo mensajes)
  // datos extra para navegar al hacer click
  meta?: {
    id_oferta?: string
    id_receptor?: string   // uid del emisor (para abrir el chat correcto)
    tutor?: string
    ramo?: string
    tutorUid?: string
  }
}

export function SidebarNav({ nombre, fotoUrl }: SidebarNavProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [uid, setUid] = useState<string>("")
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([])

  // Obtener uid del usuario autenticado
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setUid(user?.uid ?? "")
    })
    return () => unsub()
  }, [])

  // Escuchar mensajes no leídos en tiempo real
  useEffect(() => {
    if (!uid) return

    const q = query(
      collection(db, "Mensajeria"),
      where("id_receptor", "==", uid),
      where("leido", "==", false)
    )

    const unsub = onSnapshot(q, async (snap) => {
      if (snap.empty) {
        setNotificaciones([])
        return
      }

      // Agrupar por emisor+oferta para no repetir el mismo chat
      const porClave = new Map<string, typeof snap.docs[0]>()
      snap.docs.forEach((doc) => {
        const d = doc.data()
        const clave = `${d.id_oferta}::${d.id_emisor}`
        // Quedarse con el más reciente (los docs ya vienen sin orden garantizado,
        // pero como sólo mostramos preview no importa cuál sea)
        if (!porClave.has(clave)) porClave.set(clave, doc)
      })

      // Enriquecer con foto y nombre del emisor desde /usuarios
      const uidsEmisores = [...new Set(
        [...porClave.values()].map((d) => d.data().id_emisor).filter(Boolean)
      )]

      let perfiles: Record<string, { nombre: string; foto_url?: string }> = {}
      if (uidsEmisores.length > 0) {
        const usuariosQ = query(
          collection(db, "usuarios"),
          where("uid", "in", uidsEmisores)
        )
        const usuariosSnap = await getDocs(usuariosQ)
        usuariosSnap.docs.forEach((doc) => {
          const d = doc.data()
          if (d.uid) {
            perfiles[d.uid] = {
              nombre: d.nombre_completo ?? "Usuario",
              foto_url: d.url_foto_perfil,
            }
          }
        })
      }

      const nuevas: Notificacion[] = [...porClave.entries()].map(([, docSnap]) => {
        const d = docSnap.data()
        const perfil = perfiles[d.id_emisor] ?? { nombre: d.nombre_emisor ?? "Usuario" }
        const ts = d.timestamp?.toDate?.()
        const tiempo = ts
          ? ts.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })
          : ""

        // Contar cuántos mensajes sin leer hay de este chat
        const sinLeerEnChat = snap.docs.filter(
          (sd) => sd.data().id_emisor === d.id_emisor && sd.data().id_oferta === d.id_oferta
        ).length

        return {
          id: docSnap.id,
          tipo: "mensaje",
          titulo: perfil.nombre,
          detalle: sinLeerEnChat > 1
            ? `${sinLeerEnChat} mensajes sin leer · ${d.contenido_cifrado ?? ""}`
            : d.contenido_cifrado ?? "",
          tiempo,
          leida: false,
          foto_url: perfil.foto_url,
          meta: {
            id_oferta: d.id_oferta,
            tutorUid: d.id_emisor,
            tutor: perfil.nombre,
            ramo: d.id_ramo,
          },
        }
      })

      setNotificaciones(nuevas)
    })

    return () => unsub()
  }, [uid])

  const sinLeer = notificaciones.filter((n) => !n.leida).length

  function handleClickNotificacion(n: Notificacion) {
    if (n.tipo === "mensaje" && n.meta) {
      const params = new URLSearchParams({
        oferta: n.meta.id_oferta ?? "",
        tutorUid: n.meta.tutorUid ?? "",
        tutor: n.meta.tutor ?? "",
        ramo: n.meta.ramo ?? "",
      })
      router.push(`/mensajes?${params.toString()}`)
    }
    // En el futuro: manejar tipo "sistema" aquí
  }

  return (
    <div className="space-y-4">
      {/* Marca + acciones de header */}
      <div className="flex items-center justify-between gap-2">
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
          <GraduationCap className="size-7 text-[#0070f3]" strokeWidth={2} />
          <span className="text-lg font-bold text-[#0070f3]">Huddle USM</span>
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-muted-foreground"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Cambiar tema"
        >
          {theme === "dark" ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </Button>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full text-muted-foreground"
              aria-label="Notificaciones"
            >
              <Bell className="size-5" />
              {sinLeer > 0 && (
                <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-[#0070f3] text-[9px] font-bold text-white ring-2 ring-card">
                  {sinLeer > 9 ? "9+" : sinLeer}
                </span>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="text-sm font-semibold text-foreground">Notificaciones</h3>
              {sinLeer > 0 && (
                <span className="rounded-full bg-[#0070f3]/10 px-2 py-0.5 text-[11px] font-medium text-[#0070f3]">
                  {sinLeer} nuevas
                </span>
              )}
            </div>

            {notificaciones.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
                  <Bell className="size-5" />
                </div>
                <p className="text-sm font-medium text-foreground">Sin notificaciones</p>
                <p className="text-xs text-muted-foreground">Te avisaremos cuando haya novedades.</p>
              </div>
            ) : (
              <ul className="max-h-80 overflow-y-auto py-1">
                {notificaciones.map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => handleClickNotificacion(n)}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-secondary/60"
                    >
                      {/* Avatar del emisor o ícono genérico */}
                      <div className="relative mt-0.5 flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-secondary text-muted-foreground">
                        {n.foto_url ? (
                          <Image src={n.foto_url} alt={n.titulo} fill className="object-cover" sizes="36px" />
                        ) : (
                          <MessageSquare className="size-4" />
                        )}
                        {/* Punto azul de no leída */}
                        {!n.leida && (
                          <span className="absolute right-0 top-0 size-2.5 rounded-full bg-[#0070f3] ring-2 ring-card" />
                        )}
                      </div>

                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-1">
                          <span className={cn(
                            "block truncate text-sm",
                            !n.leida ? "font-semibold text-foreground" : "font-medium text-foreground"
                          )}>
                            {n.titulo}
                          </span>
                          <span className="shrink-0 text-[10px] text-muted-foreground">{n.tiempo}</span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{n.detalle}</span>
                        {/* Etiqueta del tipo — útil cuando haya notificaciones de sistema */}
                        <span className={cn(
                          "mt-1 inline-block rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                          n.tipo === "mensaje"
                            ? "bg-[#0070f3]/10 text-[#0070f3]"
                            : "bg-secondary text-muted-foreground"
                        )}>
                          {n.tipo === "mensaje" ? "Mensaje" : "Sistema"}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </PopoverContent>
        </Popover>
      </div>

      {/* Accesos rápidos */}
      <div className="flex flex-col gap-2">
        <Button
          asChild
          className="w-full justify-start rounded-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90"
        >
          <Link href="/publicar-oferta">
            <Plus className="size-4" />
            Publicar oferta
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full justify-start rounded-full bg-transparent"
        >
          <Link href="/solicitar-ayudantia">
            <HandHelping className="size-4" />
            Solicitar ayudantía
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full justify-start rounded-full bg-transparent"
        >
          <Link href="/mensajes">
            <MessageSquare className="size-4" />
            Mensajes
          </Link>
        </Button>
      </div>

      {/* Perfil del usuario */}
      <Link
        href="/perfil"
        className="flex items-center gap-3 rounded-2xl bg-secondary/60 p-3 transition-colors hover:bg-secondary"
      >
        <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-muted-foreground">
          {fotoUrl ? (
            <Image src={fotoUrl} alt={nombre} fill className="object-cover" sizes="40px" />
          ) : (
            <User className="size-5" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{nombre}</p>
          <p className="text-xs text-muted-foreground">Ver perfil</p>
        </div>
      </Link>
    </div>
  )
}