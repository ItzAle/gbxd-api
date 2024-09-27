import { NextResponse } from "next/server";
import { supabase } from "./lib/supabase";

const ALLOWED_DOMAINS = process.env.ALLOWED_DOMAINS
  ? process.env.ALLOWED_DOMAINS.split(",")
  : [];
const PUBLIC_PATHS = process.env.PUBLIC_PATHS
  ? process.env.PUBLIC_PATHS.split(",")
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

  // Permitir acceso a la ruta raíz y a las páginas de detalles de juegos sin API key
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
    console.log(
      "Acceso a la ruta raíz o página de detalle de juego, permitiendo sin API key"
    );
    return NextResponse.next();
  }

  console.log("PUBLIC_PATHS:", process.env.PUBLIC_PATHS);

  // Obtener y procesar las rutas públicas
  const publicPaths = process.env.PUBLIC_PATHS
    ? process.env.PUBLIC_PATHS.split(",")
    : [];
  console.log("Rutas públicas procesadas:", publicPaths);

  // Verificar si la ruta actual está en la lista de rutas públicas
  const isPublicPath = publicPaths.some((publicPath) => {
    const trimmedPath = publicPath.trim();
    // Usamos startsWith para permitir subrutas
    const isMatch = path.startsWith(trimmedPath);
    console.log(`Comprobando ${path} contra ${trimmedPath}: ${isMatch}`);
    return isMatch;
  });

  console.log("¿Es ruta pública?", isPublicPath);

  if (isPublicPath) {
    console.log("Permitiendo acceso sin API key");
    return NextResponse.next();
  }

  console.log("Requiriendo API key");
  const apiKey =
    request.headers.get("x-api-key") ||
    request.nextUrl.searchParams.get("apiKey");

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
