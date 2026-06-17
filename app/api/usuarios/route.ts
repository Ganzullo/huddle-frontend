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
      rol_actual: body.rol_actual || "Híbrido",
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

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      uid,
      campus,
      carrera,
      anioIngreso,
      url_foto_perfil,
      nombre_completo,
      descripcion_perfil,
    } = body;

    if (!uid) return Response.json({ error: "uid requerido" }, { status: 400 });

    const snapshot = await db
      .collection("usuarios")
      .where("uid", "==", uid)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return Response.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    const docRef = snapshot.docs[0].ref;
    const updateData: Record<string, string> = {};

    if (campus) updateData.campus = campus;
    if (carrera) updateData.carrera = carrera;
    if (anioIngreso) updateData.anio_ingreso = anioIngreso;
    if (url_foto_perfil) updateData.url_foto_perfil = url_foto_perfil;
    if (nombre_completo) updateData.nombre_completo = nombre_completo;
    if (descripcion_perfil !== undefined) updateData.descripcion_perfil = descripcion_perfil;

    await docRef.update(updateData);

    return Response.json({ success: true, updated: updateData });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}