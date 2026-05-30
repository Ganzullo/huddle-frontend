import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const firebaseAdmin = getApps().length === 0
  ? initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    })
  : getApps()[0];

const db = getFirestore(firebaseAdmin);

export async function GET() {
  try {
    const snapshot = await db.collection("usuarios").get();
    const usuarios = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return Response.json(usuarios);
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const nuevoUsuario = {
      uid: body.uid,
      nombre_completo: body.nombre_completo,
      correo: body.correo,
      rol_actual: body.rol_actual || "Inexperto",
      semestre_actual: 1,
      descripcion_perfil: "",
      url_foto_perfil: "",
      calificacion_promedio: 0.00,
      fecha_registro: new Date().toISOString(),
    };
    const ref = await db.collection("usuarios").add(nuevoUsuario);
    return Response.json({ id: ref.id, ...nuevoUsuario }, { status: 201 });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}