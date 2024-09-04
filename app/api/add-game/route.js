import { db } from "../../../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// Handler para el POST request para añadir un juego
export async function POST(req) {
  try {
    // Parsear el cuerpo de la solicitud
    const {
      name,
      releaseDate,
      description,
      publisher,
      developer,
      platforms,
      genres,
      coverImageUrl,
    } = await req.json();

    // Validar que todos los campos necesarios estén presentes
    if (
      !name ||
      !releaseDate ||
      !description ||
      !publisher ||
      !developer ||
      !platforms ||
      !genres ||
      !coverImageUrl
    ) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Añadir el nuevo documento a la colección de juegos en Firestore
    await addDoc(collection(db, "games"), {
      name,
      releaseDate,
      description,
      publisher,
      developer,
      platforms,
      genres,
      coverImageUrl,
    });

    // Responder con un mensaje de éxito
    return new Response(
      JSON.stringify({ message: "Game added successfully" }),
      { status: 200 }
    );
  } catch (error) {
    // Registrar el error en la consola y responder con un error genérico
    console.error("Error:", error);
    return new Response(JSON.stringify({ error: "Error adding game" }), {
      status: 500,
    });
  }
}
