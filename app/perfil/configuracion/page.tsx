"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, Mail, Lock, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { auth } from "@/lib/firebase"
import {
  updateEmail,
  updatePassword,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth"

export default function ConfiguracionPage() {
  const router = useRouter()

  const [nuevoCorreo, setNuevoCorreo] = useState("")
  const [nuevaPassword, setNuevaPassword] = useState("")
  const [passwordActual, setPasswordActual] = useState("")
  const [loading, setLoading] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null)
  const [confirmarEliminar, setConfirmarEliminar] = useState(false)

  const user = auth.currentUser

  async function reautenticar() {
    if (!user?.email || !passwordActual) throw new Error("Ingresa tu contraseña actual.")
    const cred = EmailAuthProvider.credential(user.email, passwordActual)
    await reauthenticateWithCredential(user, cred)
  }

  async function cambiarCorreo() {
    setMensaje(null)
    if (!nuevoCorreo) return setMensaje({ tipo: "error", texto: "Ingresa el nuevo correo." })
    setLoading("correo")
    try {
      await reautenticar()
      await updateEmail(user!, nuevoCorreo)
      setMensaje({ tipo: "ok", texto: "Correo actualizado correctamente." })
      setNuevoCorreo("")
      setPasswordActual("")
    } catch (e: any) {
      setMensaje({ tipo: "error", texto: e.message ?? "Error al cambiar el correo." })
    } finally {
      setLoading(null)
    }
  }

  async function cambiarPassword() {
    setMensaje(null)
    if (!nuevaPassword) return setMensaje({ tipo: "error", texto: "Ingresa la nueva contraseña." })
    if (nuevaPassword.length < 6) return setMensaje({ tipo: "error", texto: "La contraseña debe tener al menos 6 caracteres." })
    setLoading("password")
    try {
      await reautenticar()
      await updatePassword(user!, nuevaPassword)
      setMensaje({ tipo: "ok", texto: "Contraseña actualizada correctamente." })
      setNuevaPassword("")
      setPasswordActual("")
    } catch (e: any) {
      setMensaje({ tipo: "error", texto: e.message ?? "Error al cambiar la contraseña." })
    } finally {
      setLoading(null)
    }
  }

  async function eliminarCuenta() {
    setMensaje(null)
    setLoading("eliminar")
    try {
      await reautenticar()
      await deleteUser(user!)
      router.push("/")
    } catch (e: any) {
      setMensaje({ tipo: "error", texto: e.message ?? "Error al eliminar la cuenta." })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-40 border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
          <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
            <GraduationCap className="size-7 text-[#0070f3]" strokeWidth={2} />
            <span className="text-lg font-bold text-[#0070f3]">Huddle USM</span>
          </Link>
          <h1 className="text-base font-semibold text-foreground">Configuración</h1>
        </div>
      </header>

      <main className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <Link href="/perfil" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" />
          Volver al perfil
        </Link>

        <div className="space-y-4">

          {/* Cambiar correo */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="size-5 text-[#0070f3]" />
              <h2 className="text-sm font-semibold text-foreground">Cambiar correo</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nuevo-correo">Nuevo correo</Label>
              <Input id="nuevo-correo" type="email" value={nuevoCorreo} onChange={(e) => setNuevoCorreo(e.target.value)} placeholder="nuevo@usm.cl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-correo">Contraseña actual</Label>
              <Input id="password-correo" type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} placeholder="••••••••" />
            </div>
            <Button onClick={cambiarCorreo} disabled={loading === "correo"} className="w-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90">
              {loading === "correo" ? <Loader2 className="size-4 animate-spin" /> : "Actualizar correo"}
            </Button>
          </div>

          {/* Cambiar contraseña */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Lock className="size-5 text-[#0070f3]" />
              <h2 className="text-sm font-semibold text-foreground">Cambiar contraseña</h2>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nueva-password">Nueva contraseña</Label>
              <Input id="nueva-password" type="password" value={nuevaPassword} onChange={(e) => setNuevaPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-actual">Contraseña actual</Label>
              <Input id="password-actual" type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} placeholder="••••••••" />
            </div>
            <Button onClick={cambiarPassword} disabled={loading === "password"} className="w-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90">
              {loading === "password" ? <Loader2 className="size-4 animate-spin" /> : "Actualizar contraseña"}
            </Button>
          </div>

          {/* Eliminar cuenta */}
          <div className="rounded-2xl border border-destructive/30 bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Trash2 className="size-5 text-destructive" />
              <h2 className="text-sm font-semibold text-destructive">Eliminar cuenta</h2>
            </div>
            <p className="text-xs text-muted-foreground">Esta acción es permanente y no se puede deshacer.</p>
            {!confirmarEliminar ? (
              <Button onClick={() => setConfirmarEliminar(true)} variant="outline" className="w-full border-destructive/50 text-destructive hover:bg-destructive/10">
                Eliminar mi cuenta
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="password-eliminar">Confirma tu contraseña</Label>
                  <Input id="password-eliminar" type="password" value={passwordActual} onChange={(e) => setPasswordActual(e.target.value)} placeholder="••••••••" />
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => setConfirmarEliminar(false)} variant="outline" className="flex-1">Cancelar</Button>
                  <Button onClick={eliminarCuenta} disabled={loading === "eliminar"} className="flex-1 bg-destructive text-white hover:bg-destructive/90">
                    {loading === "eliminar" ? <Loader2 className="size-4 animate-spin" /> : "Confirmar"}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mensaje de feedback */}
          {mensaje && (
            <p className={`rounded-lg px-4 py-2.5 text-center text-sm ${mensaje.tipo === "ok" ? "bg-green-500/10 text-green-600" : "bg-destructive/10 text-destructive"}`}>
              {mensaje.texto}
            </p>
          )}
        </div>
      </main>
    </div>
  )
}