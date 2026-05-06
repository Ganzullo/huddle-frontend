"use client"

import { useState } from "react"

import Link from "next/link"
import { GraduationCap, Search, Calendar, Star, Eye, EyeOff, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left Sidebar - Branding */}
        <div 
          className="hidden lg:flex lg:w-1/2 bg-[#0070f3] flex-col justify-start p-10 text-white"
          style={{
            backgroundImage: "url('/images/collaboration-illustration.jpg')",
            backgroundPosition: "bottom center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "50%",
          }}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <GraduationCap className="size-8" />
            <span className="text-2xl font-bold">Huddle</span>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-balance">
                Conecta con expertos que te ayudan a aprender.
              </h1>
              <p className="text-lg text-white/80">
                Clases personalizadas, cuando y donde las necesites.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                  <Search className="size-5" />
                </div>
                <div>
                  <p className="font-medium">Encuentra expertos</p>
                  <p className="text-sm text-white/70">Tutores universitarios verificados en todas las materias</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                  <Calendar className="size-5" />
                </div>
                <div>
                  <p className="font-medium">Horarios flexibles</p>
                  <p className="text-sm text-white/70">Agenda clases cuando mejor te convenga</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                  <Star className="size-5" />
                </div>
                <div>
                  <p className="font-medium">Reputación y reseñas</p>
                  <p className="text-sm text-white/70">Opiniones reales de otros estudiantes</p>
                </div>
              </div>
            </div>
          </div>

          </div>

        {/* Right Section - Login Form */}
        <div className="flex w-full flex-col lg:w-1/2">
          {/* Top Navigation */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-6">
              <Link 
                href="#" 
                className="text-sm font-medium text-foreground hover:text-foreground/80"
              >
                Iniciar sesión
              </Link>
              <Link 
                href="#" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Crear cuenta
              </Link>
            </div>
            <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
              <Globe className="size-4" />
              <span>ES</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
            <div className="w-full max-w-sm space-y-6">
              {/* Form Header */}
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  ¡Bienvenido de nuevo!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Inicia sesión para continuar
                </p>
              </div>

              {/* Social Login */}
              <Button
                variant="outline"
                className="w-full gap-2"
                type="button"
              >
                <svg className="size-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continuar con Google
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">o</span>
                </div>
              </div>

              {/* Login Form */}
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="h-10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-10 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password */}
                <div className="text-right">
                  <Link
                    href="#"
                    className="text-sm text-[#0070f3] hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90"
                >
                  Iniciar sesión
                </Button>
              </form>

              {/* Create Account Link */}
              <p className="text-center text-sm text-muted-foreground">
                ¿No tienes cuenta?{" "}
                <Link href="#" className="font-medium text-[#0070f3] hover:underline">
                  Crear cuenta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 px-6 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Huddle. Todos los derechos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-foreground hover:underline">
              Términos
            </Link>
            <Link href="#" className="hover:text-foreground hover:underline">
              Privacidad
            </Link>
            <Link href="#" className="hover:text-foreground hover:underline">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
