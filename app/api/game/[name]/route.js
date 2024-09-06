import { NextResponse } from "next/server";
import { db } from "../../../../lib/firebase"; // Asegúrate de que esta ruta apunte a tu configuración de Firebase.
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

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

export async function PUT(request, { params }) {
  const headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  const { name } = params; // Este es el slug antiguo
  const updatedGame = await request.json();
  const { oldSlug, ...gameData } = updatedGame; // Separamos el oldSlug del resto de los datos del juego

  console.log('Updating game:', { oldSlug, newSlug: gameData.slug, name: gameData.name });

  try {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, where("slug", "==", oldSlug));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('Game not found with slug:', oldSlug);
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404, headers }
      );
    }

    let gameDoc = null;
    querySnapshot.forEach((doc) => {
      gameDoc = doc;
    });

    console.log('Updating game document:', gameDoc.id);

    // Asegurarse de que el slug se actualice si el nombre ha cambiado
    if (gameData.name !== gameDoc.data().name) {
      gameData.slug = slugify(gameData.name, { lower: true, strict: true });
    }

    // Actualizamos el documento con los nuevos datos, incluyendo el nuevo slug si ha cambiado
    await updateDoc(doc(db, "games", gameDoc.id), gameData);

    console.log('Game updated successfully');

    return NextResponse.json({ 
      message: "Game updated successfully",
      updatedSlug: gameData.slug 
    }, { status: 200, headers });
  } catch (error) {
    console.error("Error updating game details:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500, headers }
    );
  }
}

export async function DELETE(request, { params }) {
  const headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  const { name } = params; // Este es el slug del juego a borrar

  try {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, where("slug", "==", name));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json(
        { error: "Game not found" },
        { status: 404, headers }
      );
    }

    let gameDoc = null;
    querySnapshot.forEach((doc) => {
      gameDoc = doc;
    });

    // Borramos el documento
    await deleteDoc(doc(db, "games", gameDoc.id));

    console.log('Game deleted successfully');

    return NextResponse.json({ 
      message: "Game deleted successfully"
    }, { status: 200, headers });
  } catch (error) {
    console.error("Error deleting game:", error);
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500, headers }
    );
  }
}
