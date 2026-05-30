import { db } from "@/lib/firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

export async function GET() {
  try {
    const snapshot = await getDocs(collection(db, "usuarios"));
    const usuarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return Response.json(usuarios);
  } catch (error) {
    return Response.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const nuevoUsuario = {
      nombre_completo: body.nombre_completo,
      correo: body.correo,
      rol_actual: body.rol_actual || "Inexperto",
      semestre_actual: body.semestre_actual || 1,
      descripcion_perfil: "",
      url_foto_perfil: "",
      Calificacion_promedio: 0.00,
      fecha_registro: new Date().toISOString(),
    };
    const ref = await addDoc(collection(db, "usuarios"), nuevoUsuario);
    return Response.json({ id: ref.id, ...nuevoUsuario }, { status: 201 });
  } catch (error) {
    return Response.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}