import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import slugify from "slugify";

export async function POST(request) {
  try {
    let games;

    // Determinar si los datos vienen como un archivo o como JSON directo
    const contentType = request.headers.get("content-type");
    if (contentType && contentType.includes("multipart/form-data")) {
      // Manejar subida de archivo
      const formData = await request.formData();
      const file = formData.get("file");
      const fileContent = await file.text();
      games = JSON.parse(fileContent);
    } else {
      // Manejar JSON directo
      games = await request.json();
    }

    if (!Array.isArray(games)) {
      throw new Error("El JSON debe ser un array de juegos");
    }

    let addedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;
    const errorDetails = [];

    for (const game of games) {
      const slug = slugify(game.name, { lower: true, strict: true });

      try {
        // Verificar si el juego ya existe
        let { data: existingGame, error: getError } = await supabase
          .from('games')
          .select('*')
          .eq('slug', slug)
          .single();

        if (getError && getError.code !== 'PGRST116') {
          throw getError;
        }

        if (existingGame) {
          // El juego existe, actualizarlo
          const { error: updateError } = await supabase
            .from('games')
            .update({
              ...existingGame,
              ...game,
              slug,
            })
            .eq('slug', slug);

          if (updateError) throw updateError;
          updatedCount++;
        } else {
          // El juego no existe, añadirlo
          const { error: insertError } = await supabase
            .from('games')
            .insert({
              ...game,
              slug,
              addedBy: "JSON Upload",
            });

          if (insertError) throw insertError;
          addedCount++;
        }
      } catch (error) {
        console.error(`Error processing game ${game.name}:`, error);
        errorCount++;
        errorDetails.push({
          name: game.name,
          error: error.message,
        });
      }
    }

    return NextResponse.json(
      {
        message: `Imported ${addedCount} new games. Updated ${updatedCount} existing games. Errors occurred for ${errorCount} games.`,
        errorDetails: errorDetails,
        previewGames: games,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing JSON upload:", error);
    return NextResponse.json(
      { error: "Error processing JSON upload", details: error.message },
      { status: 500 }
    );
  }
}
