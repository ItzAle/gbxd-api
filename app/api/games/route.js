import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { checkAndIncrementApiUsage } from "../../utils/apiKeyCheck";

export async function GET(req) {
  const headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  };

  try {
    const apiKey =
      req.headers.get("x-api-key") || req.nextUrl.searchParams.get("apiKey");

    const apiCheckResult = await checkAndIncrementApiUsage(apiKey);
    if (apiCheckResult.error) {
      return NextResponse.json(
        { error: apiCheckResult.error },
        { status: apiCheckResult.status, headers }
      );
    }

    // Realizar la consulta de juegos
    let { data: games, error } = await supabase.from("games").select("*");

    if (error) {
      console.error("Error de Supabase:", error);
      throw error;
    }

    console.log(`Fetched ${games ? games.length : 0} games from Supabase`);
    console.log(
      "Primer juego:",
      games && games.length > 0 ? JSON.stringify(games[0]) : "No hay juegos"
    );

    return NextResponse.json(games || [], {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error fetching games:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500, headers }
    );
  }
}
