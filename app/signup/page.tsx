"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { GraduationCap, Eye, EyeOff, Globe, BookOpen, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

type Role = "student" | "tutor"

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  password?: string
  confirmPassword?: string
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0
  
  if (password.length >= 8) score++
  if (password.length >= 12) score++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^a-zA-Z0-9]/.test(password)) score++

  if (score <= 1) return { score: 1, label: "Débil", color: "bg-red-500" }
  if (score <= 2) return { score: 2, label: "Regular", color: "bg-orange-500" }
  if (score <= 3) return { score: 3, label: "Buena", color: "bg-yellow-500" }
  if (score <= 4) return { score: 4, label: "Fuerte", color: "bg-green-500" }
  return { score: 5, label: "Muy fuerte", color: "bg-green-600" }
}

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role>("student")
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const errors = useMemo<FormErrors>(() => {
    const newErrors: FormErrors = {}

    if (touched.firstName && !formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido"
    }

    if (touched.lastName && !formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido"
    }

    if (touched.email) {
      if (!formData.email.trim()) {
        newErrors.email = "El correo es requerido"
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Correo inválido"
      }
    }

    if (touched.password && formData.password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres"
    }

    if (touched.confirmPassword && formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    return newErrors
  }, [formData, touched])

  const passwordStrength = useMemo(() => {
    return formData.password ? getPasswordStrength(formData.password) : null
  }, [formData.password])

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const getInputClassName = (field: keyof FormErrors, baseClass: string = "h-10") => {
    if (!touched[field]) return baseClass
    if (errors[field]) return `${baseClass} border-red-500 focus-visible:ring-red-500`
    if (formData[field]) return `${baseClass} border-green-500 focus-visible:ring-green-500`
    return baseClass
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        {/* Left Sidebar - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#0070f3] flex-col justify-between p-10 pb-0 text-white overflow-hidden">
          <div className="space-y-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <GraduationCap className="size-8" />
              <span className="text-2xl font-bold">Huddle</span>
            </div>

            {/* Main Content */}
            <div className="space-y-4">
              <h1 className="text-4xl font-bold leading-tight text-balance">
                Empieza tu camino al éxito hoy mismo.
              </h1>
              <p className="text-lg text-white/80">
                Únete a la comunidad de aprendizaje más grande y conecta con los mejores tutores.
              </p>
            </div>
          </div>

          {/* Illustration */}
          <div className="mt-auto flex justify-center">
            <Image
              src="/images/achievement-illustration.jpg"
              alt="Estudiante celebrando su éxito"
              width={400}
              height={300}
              className="rounded-t-2xl object-cover"
              priority
            />
          </div>
        </div>

        {/* Right Section - Registration Form */}
        <div className="flex w-full flex-col lg:w-1/2">
          {/* Top Navigation */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Iniciar sesión
              </Link>
              <Link 
                href="/signup" 
                className="text-sm font-medium text-foreground hover:text-foreground/80"
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
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-8">
            <div className="w-full max-w-md space-y-6">
              {/* Form Header */}
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold tracking-tight text-foreground">
                  Crea tu cuenta
                </h2>
                <p className="text-sm text-muted-foreground">
                  Completa tus datos para empezar
                </p>
              </div>

              {/* Role Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedRole("student")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    selectedRole === "student"
                      ? "border-[#0070f3] bg-[#0070f3]/5"
                      : "border-border hover:border-[#0070f3]/50"
                  }`}
                >
                  <BookOpen className={`size-6 ${selectedRole === "student" ? "text-[#0070f3]" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${selectedRole === "student" ? "text-[#0070f3]" : "text-foreground"}`}>
                    Quiero aprender
                  </span>
                  <span className="text-xs text-muted-foreground">Estudiante</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole("tutor")}
                  className={`flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-all ${
                    selectedRole === "tutor"
                      ? "border-[#0070f3] bg-[#0070f3]/5"
                      : "border-border hover:border-[#0070f3]/50"
                  }`}
                >
                  <Users className={`size-6 ${selectedRole === "tutor" ? "text-[#0070f3]" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-medium ${selectedRole === "tutor" ? "text-[#0070f3]" : "text-foreground"}`}>
                    Quiero enseñar
                  </span>
                  <span className="text-xs text-muted-foreground">Tutor</span>
                </button>
              </div>

              {/* Registration Form */}
              <form className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Juan"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      onBlur={() => handleBlur("firstName")}
                      className={getInputClassName("firstName")}
                    />
                    {errors.firstName && (
                      <p className="text-xs text-red-500">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="García"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      onBlur={() => handleBlur("lastName")}
                      className={getInputClassName("lastName")}
                    />
                    {errors.lastName && (
                      <p className="text-xs text-red-500">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onBlur={() => handleBlur("email")}
                    className={getInputClassName("email")}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      onBlur={() => handleBlur("password")}
                      className={`${getInputClassName("password")} pr-10`}
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
                  {/* Password Strength Indicator */}
                  {formData.password && passwordStrength && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength.score
                                ? passwordStrength.color
                                : "bg-muted"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Seguridad: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                  {errors.password && (
                    <p className="text-xs text-red-500">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      onBlur={() => handleBlur("confirmPassword")}
                      className={`${getInputClassName("confirmPassword")} pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    checked={acceptedTerms}
                    onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal leading-tight">
                    Acepto los{" "}
                    <Link href="#" className="text-[#0070f3] hover:underline">
                      Términos de Servicio
                    </Link>{" "}
                    y la{" "}
                    <Link href="#" className="text-[#0070f3] hover:underline">
                      Política de Privacidad
                    </Link>
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#0070f3] text-white hover:bg-[#0070f3]/90"
                  disabled={!acceptedTerms}
                >
                  Registrarse
                </Button>
              </form>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">o</span>
                </div>
              </div>

              {/* Social Signup */}
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
                Registrarse con Google
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{" "}
                <Link href="/" className="font-medium text-[#0070f3] hover:underline">
                  Iniciar sesión
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
