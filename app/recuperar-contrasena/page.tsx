"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { GraduationCap, Search, Calendar, Star, Globe, Mail, ArrowLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await sendPasswordResetEmail(auth, email)
      setSuccess(true)
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === "auth/user-not-found") {
        setError("No encontramos una cuenta con ese correo")
      } else if (code === "auth/invalid-email") {
        setError("El correo electrónico no es válido")
      } else if (code === "auth/too-many-requests") {
        setError("Demasiados intentos. Intenta de nuevo más tarde.")
      } else {
        setError("Error al enviar el correo. Intenta de nuevo.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#0070f3] flex-col justify-between p-10 pb-0 text-white overflow-hidden">
          <div className="space-y-8">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-8" />
              <span className="text-2xl font-bold">Huddle USM</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-balance">
                ¿Olvidaste tu contraseña? No te preocupes.
              </h1>
              <p className="text-lg text-white/80">
                Te ayudamos a recuperar el acceso a tu cuenta en unos sencillos pasos.
              </p>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                  <Mail className="size-5" />
                </div>
                <div>
                  <p className="font-medium">Revisa tu correo</p>
                  <p className="text-sm text-white/70">Te enviaremos un enlace seguro para restablecerla</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                  <Search className="size-5" />
                </div>
                <div>
                  <p className="font-medium">Vuelve a aprender</p>
                  <p className="text-sm text-white/70">Continúa con tus clases sin perder el ritmo</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                  <Star className="size-5" />
                </div>
                <div>
                  <p className="font-medium">Cuenta protegida</p>
                  <p className="text-sm text-white/70">Tu seguridad es nuestra prioridad</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-auto flex justify-center">
            <Image
              src="/images/collaboration-illustration.jpg"
              alt="Estudiantes colaborando"
              width={400}
              height={300}
              className="rounded-t-2xl object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex w-full flex-col lg:w-1/2">
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Iniciar sesión
              </Link>
              <Link href="/signup" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Crear cuenta
              </Link>
            </div>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <Globe className="size-4" />
              <span>ES</span>
            </button>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-sm space-y-6">
              {success ? (
                <div className="space-y-6 text-center">
                  <div className="flex justify-center">
                    <div className="flex size-16 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="size-8 text-green-600" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Revisa tu correo</h2>
                    <p className="text-sm text-muted-foreground text-pretty">
                      Hemos enviado un enlace para restablecer tu contraseña a{" "}
                      <span className="font-medium text-foreground">{email}</span>. Sigue las instrucciones del correo.
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ¿No recibiste el correo?{" "}
                    <button
                      type="button"
                      onClick={() => setSuccess(false)}
                      className="font-medium text-[#0070f3] hover:underline"
                    >
                      Reenviar
                    </button>
                  </p>
                  <Button asChild className="w-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90">
                    <Link href="/">Volver a iniciar sesión</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold tracking-tight text-foreground">Recuperar contraseña</h2>
                    <p className="text-sm text-muted-foreground text-pretty">
                      Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="h-10"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                    <Button
                      type="submit"
                      className="w-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90"
                      disabled={loading}
                    >
                      {loading ? "Enviando..." : "Enviar enlace de recuperación"}
                    </Button>
                  </form>

                  <Link
                    href="/"
                    className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="size-4" />
                    Volver a iniciar sesión
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="border-t border-border bg-muted/50 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Huddle USM. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground hover:underline">Términos</Link>
            <Link href="#" className="hover:text-foreground hover:underline">Privacidad</Link>
            <Link href="#" className="hover:text-foreground hover:underline">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
