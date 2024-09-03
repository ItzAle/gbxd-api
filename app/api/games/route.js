import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(request) {
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

  try {
    const gamesRef = collection(db, "games");
    const querySnapshot = await getDocs(gamesRef);
    const games = querySnapshot.docs.map((doc) => doc.data());
    return NextResponse.json(games, { status: 200, headers });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers }
    );
  }
}
