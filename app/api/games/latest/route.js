import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { checkAndIncrementApiUsage } from "../../../utils/apiKeyCheck";

export async function GET(req) {
  const headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
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

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Consulta Supabase en lugar de DynamoDB
    const { data: games, error } = await supabase
      .from("games")
      .select("id, name, releaseDate, coverImageUrl, slug")
      .order("releaseDate", { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json(games, { status: 200, headers });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500, headers }
    );
  }
}
