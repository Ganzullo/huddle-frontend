"use client"

import { useState } from "react"

import Image from "next/image"
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
          className="hidden lg:flex lg:w-1/2 bg-[#0070f3] flex-col justify-between p-10 pb-0 text-white overflow-hidden"
        >
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <GraduationCap className="size-8" />
              <span className="text-2xl font-bold">Huddle</span>
            </div>

            {/* Main Content */}
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

          {/* Illustration */}
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

        {/* Right Section - Login Form */}
        <div className="flex w-full flex-col lg:w-1/2">
          {/* Top Navigation */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="text-sm font-medium text-foreground hover:text-foreground/80"
              >
                Iniciar sesión
              </Link>
              <Link 
                href="/signup" 
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
                <Link href="/signup" className="font-medium text-[#0070f3] hover:underline">
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
