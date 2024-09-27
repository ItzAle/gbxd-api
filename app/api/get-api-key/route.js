import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  console.log("Fetching API key for user:", userId);

  if (!userId) {
    console.log("No userId provided");
    return NextResponse.json(
      { error: "UserId no proporcionado" },
      { status: 400 }
    );
  }

  try {
    console.log("Attempting to query Supabase...");

    const { data, error } = await supabase
      .from("api_keys")
      .select("key, current_month_usage")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: `Error al consultar la base de datos: ${error.message}` },
        { status: 500 }
      );
    }

    if (data) {
      console.log("API key found:", data.key);
      return NextResponse.json({
        apiKey: data.key,
        currentMonthUsage: data.current_month_usage,
      });
    } else {
      console.log("No API key found for user:", userId);
      return NextResponse.json({ apiKey: null, currentMonthUsage: null });
    }
  } catch (error) {
    console.error();
  }
}

// Justo antes de la consulta principal
const { data: testData, error: testError } = await supabase
  .from("api_keys")
  .select("count")
  .limit(1);

console.log("Test query result:", testData, testError);
