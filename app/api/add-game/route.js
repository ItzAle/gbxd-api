import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function POST(req) {
  try {
    console.log("Iniciando proceso de añadir juego");
    const gameData = await req.json();
    console.log("Datos del juego recibidos:", JSON.stringify(gameData, null, 2));

    const { data, error } = await supabase
      .from('games')
      .insert([gameData]);

    if (error) {
      console.error("Error al insertar en Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Juego añadido con éxito", data }, { status: 201 });
  } catch (error) {
    console.error("Error detallado en el servidor:", error);
    console.error("Stack trace:", error.stack);
    return NextResponse.json({ error: "Error interno del servidor", details: error.message }, { status: 500 });
  }
}
