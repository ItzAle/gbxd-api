import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

export async function GET(request, { params }) {
  const { slug } = params;

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

  try {
    // Primero, obtenemos el juego por su slug
    let { data: game, error } = await supabase
      .from('games')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) throw error;

    if (!game) {
      return NextResponse.json(
        { message: "Game not found" },
        { status: 404, headers }
      );
    }

    console.log("Original game:", JSON.stringify(game, null, 2));

    // Ahora buscamos juegos similares
    let { data: similarGames, error: similarError } = await supabase
      .from('games')
      .select('*')
      .neq('slug', game.slug)
      .contains('genres', game.genres)
      .limit(10);

    if (similarError) throw similarError;

    return NextResponse.json(similarGames, { status: 200, headers });
  } catch (error) {
    console.error("Error fetching similar games:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500, headers }
    );
  }
}
