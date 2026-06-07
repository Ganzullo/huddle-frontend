// Datos institucionales de la USM para el flujo de onboarding

export const CAMPUS_USM = [
  "Casa Central (Valparaíso)",
  "Campus San Joaquín",
  "Campus Vitacura",
  "Sede Viña del Mar",
  "Sede Concepción",
] as const

export const CARRERAS_USM = [
  "Ingeniería Civil Informática",
  "Ingeniería Civil Industrial",
  "Ingeniería Civil Electrónica",
  "Ingeniería Civil Mecánica",
  "Ingeniería Civil Eléctrica",
  "Ingeniería Civil Química",
  "Ingeniería Civil de Minas",
  "Ingeniería Civil Telemática",
  "Ingeniería Civil Matemática",
  "Ingeniería Comercial",
  "Arquitectura",
  "Ingeniería en Construcción",
  "Técnico Universitario en Informática",
] as const

export const ANIOS_INGRESO = Array.from({ length: 11 }, (_, i) => String(new Date().getFullYear() - i))

// Ramos críticos / comunes de la USM
export const RAMOS_USM = [
  { codigo: "MAT021", nombre: "Matemática I" },
  { codigo: "MAT022", nombre: "Matemática II" },
  { codigo: "MAT023", nombre: "Matemática III" },
  { codigo: "FIS110", nombre: "Física I" },
  { codigo: "FIS120", nombre: "Física II" },
  { codigo: "IWI131", nombre: "Programación" },
  { codigo: "IWI191", nombre: "Estructuras de Datos" },
  { codigo: "QUI010", nombre: "Química" },
  { codigo: "MAT270", nombre: "Cálculo Avanzado" },
  { codigo: "ELO320", nombre: "Estructuras de Datos y Algoritmos" },
  { codigo: "INF239", nombre: "Bases de Datos" },
  { codigo: "MAT024", nombre: "Cálculo en Varias Variables" },
] as const

export const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] as const

export const BLOQUES_USM = [
  { id: "1-2", horario: "08:15 - 09:25" },
  { id: "3-4", horario: "09:35 - 10:45" },
  { id: "5-6", horario: "10:55 - 12:05" },
  { id: "7-8", horario: "12:15 - 13:25" },
  { id: "9-10", horario: "14:30 - 15:40" },
  { id: "11-12", horario: "15:50 - 17:00" },
] as const

export type RolOnboarding = "inexperto" | "experto" | "hibrido"
