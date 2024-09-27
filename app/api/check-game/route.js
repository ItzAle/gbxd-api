import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { checkAndIncrementApiUsage } from "../../utils/apiKeyCheck";

export const dynamic = "force-dynamic";

export async function GET(request) {
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
    const name = searchParams.get("name");

    if (!name) {
      return NextResponse.json(
        { error: "Name parameter is required" },
        { status: 400 }
      );
    }

    try {
      const { data, error, count } = await supabase
        .from("games")
        .select("slug", { count: "exact" })
        .eq("slug", name.toLowerCase())
        .limit(1);

      if (error) throw error;

      const exists = count > 0;

      return NextResponse.json({ exists });
    } catch (error) {
      console.error("Error checking game existence:", error);
      return NextResponse.json(
        {
          error: "Error checking game existence",
          details: error.message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500, headers }
    );
  }
}
