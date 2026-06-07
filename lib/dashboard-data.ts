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

export const OFERTAS: Oferta[] = [
  {
    id: 1,
    titulo: "Cálculo I - Clases personalizadas",
    tutor: "Matías Fuentes",
    avatar: "/tutores/tutor-1.png",
    rating: 4.9,
    reviews: 128,
    modalidad: "Presencial",
    ubicacion: "Casa Central, Valparaíso",
    descripcion:
      "Ayudante destacado de MAT021. Refuerzo de límites, derivadas e integrales con guías resueltas y enfoque en certámenes.",
    precio: 15000,
    area: "Matemáticas",
  },
  {
    id: 2,
    titulo: "Física I - Mecánica clásica",
    tutor: "Valentina Rojas",
    avatar: "/tutores/tutor-2.png",
    rating: 4.8,
    reviews: 94,
    modalidad: "Online",
    ubicacion: "Online",
    descripcion:
      "Cinemática, dinámica y energía explicadas paso a paso. Material complementario y resolución de certámenes anteriores de FIS110.",
    precio: 13000,
    area: "Física",
  },
  {
    id: 3,
    titulo: "Programación en Python desde cero",
    tutor: "Sebastián Cáceres",
    avatar: "/tutores/tutor-3.png",
    rating: 5.0,
    reviews: 211,
    modalidad: "Online",
    ubicacion: "Online",
    descripcion:
      "Fundamentos de IWI131: estructuras de control, funciones y estructuras de datos. Proyectos prácticos y retroalimentación de código.",
    precio: 18000,
    area: "Programación",
  },
  {
    id: 4,
    titulo: "Química General - Estequiometría y equilibrio",
    tutor: "Camila Ortega",
    avatar: "/tutores/tutor-4.png",
    rating: 4.7,
    reviews: 67,
    modalidad: "Presencial",
    ubicacion: "Campus San Joaquín, Santiago",
    descripcion:
      "Refuerzo de QUI010 con foco en balances, soluciones y termoquímica. Ejercicios tipo certamen y laboratorio.",
    precio: 12000,
    area: "Química",
  },
  {
    id: 5,
    titulo: "Cálculo II - Integrales y series",
    tutor: "Diego Morales",
    avatar: "/tutores/tutor-5.png",
    rating: 4.9,
    reviews: 152,
    modalidad: "Online",
    ubicacion: "Online",
    descripcion:
      "Técnicas de integración, ecuaciones diferenciales básicas y series de potencias. Material MAT022 con clases grabadas.",
    precio: 16000,
    area: "Matemáticas",
  },
  {
    id: 6,
    titulo: "Economía y Teoría de Decisiones",
    tutor: "Antonia Herrera",
    avatar: "/tutores/tutor-2.png",
    rating: 4.6,
    reviews: 41,
    modalidad: "Presencial",
    ubicacion: "Casa Central, Valparaíso",
    descripcion:
      "Microeconomía aplicada, costos y optimización. Ideal para estudiantes de ingeniería comercial e industrial de la USM.",
    precio: 14000,
    area: "Economía",
  },
]
