import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebase"; // Asegúrate de que esta ruta apunte a tu configuración de Firebase.
import { collection, query, where, getDocs } from "firebase/firestore";

export async function GET(request, { params }) {
  // Configurar los encabezados CORS
  const headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*", // Cambia "*" por el dominio que deseas permitir en producción
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  };

  // Manejar la solicitud OPTIONS para CORS (preflight)
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  const { name } = params;
  // Ahora 'name' es el slug, no necesitamos decodificarlo

  try {
    // Crear una referencia a la colección de juegos en Firebase
    const gamesRef = collection(db, "games");

    // Buscar por slug
    const q = query(gamesRef, where("slug", "==", name));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404, headers }
      );
    }

    // Asumimos que el slug del juego es único, por lo tanto obtenemos el primer documento
    let gameData = null;
    querySnapshot.forEach((doc) => {
      gameData = doc.data();
    });

    return NextResponse.json(gameData, { status: 200, headers });
  } catch (error) {
    console.error("Error fetching game details:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers }
    );
  }
}
