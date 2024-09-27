import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { checkAndIncrementApiUsage } from "../../../utils/apiKeyCheck";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit")) || 10;

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
    const apiKey =
      request.headers.get("x-api-key") ||
      request.nextUrl.searchParams.get("apiKey");

    const apiCheckResult = await checkAndIncrementApiUsage(apiKey);
    if (apiCheckResult.error) {
      return NextResponse.json(
        { error: apiCheckResult.error },
        { status: apiCheckResult.status, headers }
      );
    }

    const today = new Date().toISOString().split("T")[0];

    let { data: upcomingGames, error } = await supabase
      .from("games")
      .select("*")
      .gt("releaseDate", today)
      .order("releaseDate", { ascending: true })
      .limit(limit);

    if (error) throw error;

    console.log(`Found ${upcomingGames.length} upcoming games`);

    if (upcomingGames.length === 0) {
      return NextResponse.json(
        { message: "No upcoming games found" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(upcomingGames, { status: 200, headers });
  } catch (error) {
    console.error("Error fetching upcoming games:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500, headers }
    );
  }
}
