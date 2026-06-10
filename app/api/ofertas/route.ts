import { adminDb } from "@/lib/firebase-admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ramos = searchParams.get("ramos")?.split(",").filter(Boolean) ?? []
    const modalidad = searchParams.get("modalidad") ?? ""
    const categoria = searchParams.get("categoria") ?? ""
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

    // Join con datos del tutor
    const tutorIds = [...new Set(ofertas.map((o) => o.id_tutor).filter(Boolean))] as string[]

    const tutoresMap: Record<string, { nombre?: string; foto_url?: string; rating?: number; reviews?: number }> = {}

    if (tutorIds.length > 0) {
      // Firestore "in" acepta máx 30 ids por query
      const chunks: string[][] = []
      for (let i = 0; i < tutorIds.length; i += 30) chunks.push(tutorIds.slice(i, i + 30))

      await Promise.all(
        chunks.map(async (chunk) => {
          const snap = await adminDb
            .collection("Usuarios")
            .where("__name__", "in", chunk)
            .get()
          snap.docs.forEach((doc) => {
            const d = doc.data()
            tutoresMap[doc.id] = {
              nombre: d.nombre ?? d.displayName ?? null,
              foto_url: d.foto_url ?? d.photoURL ?? null,
              rating: d.rating ?? null,
              reviews: d.reviews ?? null,
            }
          })
        })
      )
    }

    ofertas = ofertas.map((o) => ({
      ...o,
      nombre_tutor: tutoresMap[o.id_tutor]?.nombre ?? null,
      foto_url: tutoresMap[o.id_tutor]?.foto_url ?? null,
      rating: tutoresMap[o.id_tutor]?.rating ?? null,
      reviews: tutoresMap[o.id_tutor]?.reviews ?? null,
    }))

    if (orden === "precio-asc") ofertas.sort((a, b) => a.precio_referencial - b.precio_referencial)
    if (orden === "precio-desc") ofertas.sort((a, b) => b.precio_referencial - a.precio_referencial)
    if (orden === "rating") ofertas.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))

    return NextResponse.json({ ofertas })
  } catch (error) {
    console.error("Error al obtener ofertas:", error)
    return NextResponse.json({ error: "Error al obtener ofertas" }, { status: 500 })
  }
}