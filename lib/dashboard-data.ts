import { RAMOS_USM, CAMPUS_USM, BLOQUES_USM } from "@/lib/usm-data"

export interface Oferta {
  id: string
  titulo: string
  tutor: string
  avatar: string
  rating: number
  reviews: number
  modalidad: "Presencial" | "Online"
  ubicacion: string
  descripcion: string
  precio: number
  area: string
  id_ramo: string
  nombre_ramo: string
}
export const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
export const HORARIOS = ["Mañana (08:00 - 12:00)", "Tarde (12:00 - 18:00)", "Noche (18:00 - 22:00)"]

export const RAMOS_FILTRO = RAMOS_USM.map((r) => ({ id: r.codigo, nombre: r.nombre }))
export const CAMPUS_FILTRO = [...CAMPUS_USM]
export const BLOQUES_FILTRO = BLOQUES_USM.map((b) => ({
  id: b.id,
  label: `Bloque ${b.id}`,
  horario: b.horario,
}))

export const OFERTAS: Oferta[] = []