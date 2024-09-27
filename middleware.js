import { NextResponse } from "next/server";
import { supabase } from "./lib/supabase";

// Rutas que requieren API key
const PROTECTED_API_ROUTES = [
  "/api/games",
  "/api/game",
  "/api/platforms",
  "/api/genres",
  // Añade aquí otras rutas relacionadas con API y games que quieras proteger
];

async function verifyApiKey(apiKey) {
  try {
    const { data, error } = await supabase
      .from("api_keys")
      .select("is_unlimited, monthly_limit, current_month_usage, last_reset_date")
      .eq("key", apiKey)
      .single();

    if (error || !data) {
      console.error("Error al verificar la API key:", error);
      return false;
    }

    const now = new Date();
    const lastResetDate = new Date(data.last_reset_date);

    // Verificar si es necesario reiniciar el contador mensual
    if (now.getMonth() !== lastResetDate.getMonth() || now.getFullYear() !== lastResetDate.getFullYear()) {
      // Reiniciar el contador mensual
      await supabase
        .from("api_keys")
        .update({ 
          current_month_usage: 0, 
          last_reset_date: now.toISOString() 
        })
        .eq("key", apiKey);
      data.current_month_usage = 0;
    }

    // Verificar si la key es válida basándose en los límites
    if (data.is_unlimited || data.current_month_usage < data.monthly_limit) {
      // Incrementar el uso
      await supabase
        .from("api_keys")
        .update({ 
          current_month_usage: data.current_month_usage + 1,
          last_used_at: now.toISOString()
        })
        .eq("key", apiKey);
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error inesperado al verificar la API key:", error);
    return false;
  }
}

export async function middleware(request) {
  const path = request.nextUrl.pathname;

  // Verificar si la ruta actual está en la lista de rutas protegidas
  if (PROTECTED_API_ROUTES.some(route => path.startsWith(route))) {
    console.log("Procesando solicitud para ruta API protegida:", path);

    const apiKey = request.headers.get("x-api-key") || request.nextUrl.searchParams.get("apiKey");

    if (!apiKey) {
      console.log("No se proporcionó API key, devolviendo error 401");
      return new NextResponse(JSON.stringify({ error: "API key is required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const isValidApiKey = await verifyApiKey(apiKey);

    if (!isValidApiKey) {
      console.log("API key inválida o límite excedido");
      return new NextResponse(JSON.stringify({ error: "Invalid API key or usage limit exceeded" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log("API key válida, permitiendo acceso");
  }

  // Para todas las demás rutas, permitir acceso sin restricciones
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Aplica el middleware solo a las rutas que comienzan con /api
    "/api/:path*",
  ],
};
