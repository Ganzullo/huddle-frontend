export interface Oferta {
  id: number
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
}

export const FILTROS_RAPIDOS = [
  "Todos",
  "Matemáticas",
  "Física",
  "Química",
  "Programación",
  "Economía",
]

export const FILTROS_RAPIDOS_EXTRA = [
  "Estadística",
  "Electrónica",
  "Termodinámica",
  "Cálculo",
  "Álgebra",
]

export const RAMOS_FILTRO = [
  "Cálculo I",
  "Cálculo II",
  "Física I",
  "Física II",
  "Programación",
]

export const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

export const HORARIOS = ["Mañana (08:00 - 12:00)", "Tarde (12:00 - 18:00)", "Noche (18:00 - 22:00)"]

// Sin ofertas por ahora. Cuando la base de datos contenga ofertas reales,
// se llenará este arreglo y las tarjetas se renderizarán automáticamente.
export const OFERTAS: Oferta[] = []
