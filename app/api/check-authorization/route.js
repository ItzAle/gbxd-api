import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  console.log("Email recibido:", email); // Log para depuración

  if (!email) {
    console.log("Email no proporcionado en la solicitud");
    return NextResponse.json({ isAuthorized: false, error: "Email no proporcionado" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('authorized_users')
      .select('email')
      .eq('email', email.toLowerCase())
      .single();

    console.log("Resultado de la consulta:", { data, error }); // Log para depuración

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    const isAuthorized = !!data;
    console.log(`Verificación de autorización para ${email}: ${isAuthorized}`);

    return NextResponse.json({ isAuthorized }, { status: 200 });
  } catch (error) {
    console.error("Error al verificar la autorización:", error);
    return NextResponse.json({ isAuthorized: false, error: error.message }, { status: 500 });
  }
}
