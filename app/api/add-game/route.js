import { docClient } from "../../../lib/aws-config";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import slugify from 'slugify';

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
      userId, 
      isNSFW,
      storeLinks,
      aliases,
      franchises,
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

    // Generar un slug para el juego
    const slug = slugify(name, { lower: true, strict: true });

    // Añadir el nuevo documento a la colección de juegos en DynamoDB
    const command = new PutCommand({
      TableName: "games",
      Item: {
        slug,
        name,
        releaseDate,
        description,
        publisher,
        developer,
        platforms,
        genres,
        coverImageUrl,
        addedBy: userId, // Añade esto
        isNSFW,
        storeLinks,
        aliases,
        franchises,
      },
    });

    await docClient.send(command);

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
