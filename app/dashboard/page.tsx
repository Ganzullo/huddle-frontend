"use client"

import Link from "next/link"
import { GraduationCap, Search, Calendar, Star, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-6 text-[#0070f3]" />
          <span className="text-lg font-bold text-foreground">Huddle</span>
        </div>
        <Link href="/">
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Cerrar sesión
          </Button>
        </Link>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground text-balance">
            ¡Tu perfil está listo!
          </h1>
          <p className="text-muted-foreground">
            Bienvenido a tu panel de Huddle. Desde aquí puedes empezar a conectar con la comunidad USM.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Search, title: "Buscar tutores", desc: "Encuentra expertos en tus ramos críticos." },
            { icon: Calendar, title: "Mis ayudantías", desc: "Gestiona tus próximas sesiones agendadas." },
            { icon: Star, title: "Mi reputación", desc: "Revisa tus reseñas y calificaciones." },
            { icon: BookOpen, title: "Mis ramos", desc: "Administra las asignaturas de tu perfil." },
          ].map((item) => (
            <Card key={item.title} className="p-5 transition-shadow hover:shadow-md">
              <div className="flex size-10 items-center justify-center rounded-lg bg-[#0070f3]/10">
                <item.icon className="size-5 text-[#0070f3]" />
              </div>
              <h2 className="mt-4 font-semibold text-foreground">{item.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
