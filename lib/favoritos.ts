export type TipoFavorito = "oferta" | "solicitud"

interface FavoritoDoc {
  id: string
  tipo: TipoFavorito
  id_publicacion: string
}

function favoritoDocId(uid: string, tipo: TipoFavorito, idPublicacion: string) {
  return `${uid}_${tipo}_${idPublicacion}`
}

/**
 * Verifica si una publicación ya está guardada por el usuario.
 * Usa un ID de documento determinístico, así que es una lectura directa
 * (sin query, sin necesidad de índices compuestos).
 */
export async function esFavorito(
  uid: string,
  tipo: TipoFavorito,
  idPublicacion: string
): Promise<boolean> {
  if (!uid) return false
  const { db } = require("@/lib/firebase")
  const { doc, getDoc } = await import("firebase/firestore")
  const ref = doc(db, "Favoritos", favoritoDocId(uid, tipo, idPublicacion))
  const snap = await getDoc(ref)
  return snap.exists()
}

/**
 * Alterna el estado de favorito: si estaba guardado lo elimina, si no
 * estaba guardado lo crea. Devuelve el nuevo estado (true = quedó guardado).
 */
export async function toggleFavorito(
  uid: string,
  tipo: TipoFavorito,
  idPublicacion: string,
  estadoActual: boolean
): Promise<boolean> {
  if (!uid) throw new Error("Debes iniciar sesión para guardar publicaciones.")

  const { db } = require("@/lib/firebase")
  const { doc, setDoc, deleteDoc, serverTimestamp } = await import("firebase/firestore")
  const ref = doc(db, "Favoritos", favoritoDocId(uid, tipo, idPublicacion))

  if (estadoActual) {
    await deleteDoc(ref)
    return false
  }

  await setDoc(ref, {
    id_usuario: uid,
    tipo,
    id_publicacion: idPublicacion,
    fecha_creacion: serverTimestamp(),
  })
  return true
}

/**
 * Lista todos los favoritos de un usuario (sin distinguir tipo).
 * Es una sola query con un filtro de igualdad — no requiere índice compuesto.
 */
export async function listarFavoritos(uid: string): Promise<FavoritoDoc[]> {
  if (!uid) return []
  const { db } = require("@/lib/firebase")
  const { collection, query, where, getDocs } = await import("firebase/firestore")
  const snap = await getDocs(query(collection(db, "Favoritos"), where("id_usuario", "==", uid)))
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}