import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase"; // Asegúrate de que la ruta sea correcta

export async function GET(request, { params }) {
  const { year } = params;
  const numericYear = parseInt(year, 10);

  if (isNaN(numericYear)) {
    return NextResponse.json({ error: "Invalid year format" }, { status: 400 });
  }

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
    console.log("Iniciando consulta a Supabase para el año:", year);

    // Asumiendo que tienes una columna 'release_year' en tu tabla de juegos
    const { data: games, error } = await supabase
      .from("games")
      .select("*")
      .ilike("releaseDate", `%${year}%`);

    if (error) {
      console.error("Error de Supabase:", error);
      throw error;
    }

    console.log(`Fetched ${games ? games.length : 0} games for year ${year}`);

    if (!games || games.length === 0) {
      return NextResponse.json(
        { message: "No games found for this year" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(games, { status: 200, headers });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500, headers }
    );
  }
}
