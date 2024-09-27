import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { generateApiKey } from "../../utils/apiKeyGenerator";

export async function POST(req) {
  console.log("Received request to generate API key");
  try {
    const body = await req.json();
    console.log("Request body:", body);

    const { user_id, description, is_unlimited, monthly_limit } = body;

    console.log("Generating API key");
    const apiKey = generateApiKey();
    console.log("API key generated");

    console.log("Inserting API key into database");
    const { data, error } = await supabase
      .from("api_keys")
      .insert({
        key: apiKey,
        user_id: user_id.toString(),
        description,
        is_unlimited,
        monthly_limit: is_unlimited ? null : monthly_limit || 1000,
        current_month_usage: 0, // Inicializamos el uso del mes actual a 0
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    console.log("API key inserted successfully");
    return NextResponse.json({ apiKey: data.key }, { status: 201 });
  } catch (error) {
    console.error("Error in generate-api-key route:", error);
    return NextResponse.json(
      { error: error.message || "Error generating API key" },
      { status: 500 }
    );
  }
}
