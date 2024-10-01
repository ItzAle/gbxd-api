import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";
import { checkAndIncrementApiUsage } from "../../../utils/apiKeyCheck";

export async function GET(request) {
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

    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get("q");

    if (!searchTerm) {
      return NextResponse.json(
        { error: "Search term is required" },
        { status: 400, headers }
      );
    }

    let { data: games, error } = await supabase
      .from("games")
      .select("*")
      .or(`name.ilike.%${searchTerm}%, slug.ilike.%${searchTerm}%`)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error searching games:", error);
      return NextResponse.json(
        { error: "Error searching games" },
        { status: 500, headers }
      );
    }

    return NextResponse.json(games, { status: 200, headers });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500, headers }
    );
  }
}
