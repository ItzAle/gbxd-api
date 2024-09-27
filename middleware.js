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
  console.log("URL completa:", request.nextUrl.href);
  console.log("Parámetros de la query:", Object.fromEntries(request.nextUrl.searchParams));

  // Función para manejar CORS
  const handleCORS = (response) => {
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-api-key");
    return response;
  };

  // Manejar solicitudes OPTIONS (preflight)
  if (request.method === "OPTIONS") {
    return handleCORS(new NextResponse(null, { status: 200 }));
  }

  // Manejar solicitudes a api.gameboxd.me o rutas /api
  if (host === "api.gameboxd.me" || path.startsWith("/api")) {
    console.log("Procesando solicitud para API");

    // Verificar si la ruta es pública
    if (PUBLIC_PATHS.some(publicPath => path.startsWith(publicPath))) {
      console.log("Ruta pública de API, permitiendo acceso sin API key");
      return handleCORS(NextResponse.next());
    }

    // Para rutas no públicas, requerir API key
    const apiKeyHeader = request.headers.get("x-api-key");
    const apiKeyQuery = request.nextUrl.searchParams.get("apiKey") || request.nextUrl.searchParams.get("apikey") || request.nextUrl.searchParams.get("api_key");
    const apiKey = apiKeyHeader || apiKeyQuery;

    console.log("API Key del header:", apiKeyHeader);
    console.log("API Key de la query:", apiKeyQuery);
    console.log("API Key final:", apiKey);

    if (!apiKey) {
      console.log("No se proporcionó API key, devolviendo error 401");
      return handleCORS(new NextResponse(JSON.stringify({ error: "API key is required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }));
    }

    // Aquí iría la lógica para verificar la validez de la API key
    console.log("API key proporcionada, procediendo con la verificación");
    
    // Verificación simulada de la API key (reemplaza esto con tu lógica real)
    if (apiKey !== "f30ff0a723637801ce39526ae5b37f1f48fcf8fc979ea2071192db2e04727faf") {
      console.log("API key inválida");
      return handleCORS(new NextResponse(JSON.stringify({ error: "Invalid API key" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }));
    }

    console.log("API key válida, permitiendo acceso");
    return handleCORS(NextResponse.next());
  }

  // Para otros dominios, verificar si están permitidos
  if (!ALLOWED_DOMAINS.some(domain => host.endsWith(domain))) {
    console.log("Dominio no permitido:", host);
    return new NextResponse(JSON.stringify({ error: "Dominio no autorizado" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Permitir acceso a rutas no-API en dominios permitidos
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
