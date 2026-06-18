import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")

    if (!uid) {
      return NextResponse.json({ error: "uid requerido" }, { status: 400 })
    }

    const file = request.body
    const contentType = request.headers.get("content-type") ?? "image/jpeg"
    const ext = contentType.split("/")[1] ?? "jpg"

    if (!file) {
      return NextResponse.json({ error: "Archivo requerido" }, { status: 400 })
    }

    const blob = await put(`fotos-perfil/${uid}.${ext}`, file, {
      access: "public",
      contentType,
      allowOverwrite: true,
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error subiendo foto:", error)
    return NextResponse.json({ error: "Error al subir la foto" }, { status: 500 })
  }
}