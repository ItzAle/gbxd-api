import { NextResponse } from "next/server";
import { supabase } from "./lib/supabase";

const ALLOWED_DOMAINS = process.env.ALLOWED_DOMAINS
  ? process.env.ALLOWED_DOMAINS.split(",").map(domain => domain.trim())
  : [];
const PUBLIC_PATHS = process.env.PUBLIC_PATHS
  ? process.env.PUBLIC_PATHS.split(",").map(path => path.trim())
  : [];

export async function middleware(request) {
  const path = request.nextUrl.pathname;
  const host = request.headers.get("host");

  console.log("Middleware ejecutándose para la ruta:", path);
  console.log("Host:", host);

  // Verificar si el dominio está permitido
  if (!ALLOWED_DOMAINS.includes(host)) {
    console.log("Dominio no permitido:", host);
    return new NextResponse(JSON.stringify({ error: "Dominio no autorizado" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Verificar si la ruta es pública
  const isPublicPath = PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath));

  if (isPublicPath) {
    console.log("Ruta pública, permitiendo acceso sin API key");
    return NextResponse.next();
  }

  // Rutas específicas que no requieren API key
  if (
    path === "/" ||
    path.startsWith("/game/") ||
    path.startsWith("/docs") ||
    path.startsWith("/donate") ||
    path.startsWith("/home") ||
    path.startsWith("/profile") ||
    path.startsWith("/api/add-game") ||
    path.startsWith("/games")
  ) {
    console.log("Ruta específica permitida sin API key");
    return NextResponse.next();
  }

  // Para todas las demás rutas, verificar la API key
  console.log("Requiriendo API key");
  const apiKey = request.headers.get("x-api-key") || request.nextUrl.searchParams.get("apiKey");

  if (!apiKey) {
    console.log("No se proporcionó API key, devolviendo error 401");
    return new NextResponse(JSON.stringify({ error: "API key is required" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Aquí iría la lógica para verificar la validez de la API key
  console.log("API key proporcionada, procediendo con la verificación");

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
