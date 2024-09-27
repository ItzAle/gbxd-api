import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializa el cliente de Supabase aquí para asegurarte de que se crea correctamente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req) {
  console.log("Iniciando solicitud de acceso");
  try {
    const body = await req.json();
    console.log("Cuerpo de la solicitud:", body);

    const { email, name, age, reason, birthDate } = body;

    // Verificar conexión con Supabase
    console.log("Verificando conexión con Supabase");
    const { data: testData, error: testError } = await supabase
      .from("access_requests")
      .select("count")
      .limit(1);

    if (testError) {
      console.error("Error al conectar con Supabase:", testError);
      return NextResponse.json(
        {
          error: "Error de conexión con la base de datos: " + testError.message,
        },
        { status: 500 }
      );
    }
    console.log("Conexión con Supabase exitosa");

    // Verificar solicitud existente
    console.log("Verificando solicitud existente para:", email);
    const { data: existingRequest, error: checkError } = await supabase
      .from("access_requests")
      .select("*")
      .eq("email", email)
      .eq("status", "pending")
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error al verificar solicitud existente:", checkError);
      return NextResponse.json(
        {
          error:
            "Error al verificar solicitud existente: " + checkError.message,
        },
        { status: 500 }
      );
    }

    if (existingRequest) {
      return NextResponse.json(
        { message: "You already have a pending request" },
        { status: 400 }
      );
    }

    // Insertar nueva solicitud
    console.log("Insertando nueva solicitud");
    const { data, error } = await supabase.from("access_requests").insert({
      email,
      name,
      age: parseInt(age),
      reason,
      birth_date: birthDate,
      status: "pending",
    });

    if (error) {
      console.error("Error inserting request:", error);
      return NextResponse.json(
        { error: "Error inserting request: " + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Request sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Error sending request: " + error.message },
      { status: 500 }
    );
  }
}
