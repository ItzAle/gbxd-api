import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";
import { checkAndIncrementApiUsage } from "../../../../utils/apiKeyCheck";

export async function GET(request, { params }) {
  const { name } = params;

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

    // Consulta Supabase en lugar de DynamoDB
    const { data: games, error } = await supabase
      .from('games')
      .select('*')
      .contains('genres', [decodeURIComponent(name)]);

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
