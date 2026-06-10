import { adminDb } from "@/lib/firebase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ramos = searchParams.get("ramos")?.split(",").filter(Boolean) ?? []
    const modalidad = searchParams.get("modalidad") ?? ""
    const categoria = searchParams.get("categoria") ?? ""
    const campus = searchParams.get("campus")?.split(",").filter(Boolean) ?? []
    const bloques = searchParams.get("bloques")?.split(",").filter(Boolean) ?? []
    const precioMin = Number(searchParams.get("precioMin") ?? 0)
    const precioMax = Number(searchParams.get("precioMax") ?? 999999)
    const orden = searchParams.get("orden") ?? "relevancia"

    let query: FirebaseFirestore.Query = adminDb.collection("Ofertas_Tutoria")

    if (modalidad) query = query.where("modalidad", "==", modalidad)
    if (categoria) query = query.where("categoria_ramo", "==", categoria)
    if (ramos.length > 0) query = query.where("id_ramo", "in", ramos)

    const snapshot = await query.get()

    let ofertas = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any[]

    ofertas = ofertas.filter(
      (o) => o.precio_referencial >= precioMin && o.precio_referencial <= precioMax
    )

    // Filtro por campus / sede (coincidencia parcial e insensible a mayúsculas)
    if (campus.length > 0) {
      ofertas = ofertas.filter((o) => {
        const sede = String(o.sede ?? "").toLowerCase()
        return campus.some((c) => sede.includes(c.toLowerCase()))
      })
    }

    // Filtro por bloques horarios USM (las claves vienen como "Dia-bloqueId")
    if (bloques.length > 0) {
      ofertas = ofertas.filter((o) => {
        const horarios: string[] = Array.isArray(o.horarios) ? o.horarios : []
        return horarios.some((h) =>
          bloques.some((b) => h.endsWith(`-${b}`) || h === b)
        )
      })
    }

    // nombre_tutor ya viene guardado en la oferta directamente

    if (orden === "precio-asc") ofertas.sort((a, b) => a.precio_referencial - b.precio_referencial)
    if (orden === "precio-desc") ofertas.sort((a, b) => b.precio_referencial - a.precio_referencial)
    if (orden === "rating") ofertas.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

    return NextResponse.json({ ofertas })
  } catch (error) {
    console.error("Error al obtener ofertas:", error)
    return NextResponse.json({ error: "Error al obtener ofertas" }, { status: 500 })
  }
}
