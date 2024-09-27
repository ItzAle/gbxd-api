import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ isAuthorized: false, error: "Email no proporcionado" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('authorized_users')
      .select('email')
      .eq('email', email)
      .single();

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
