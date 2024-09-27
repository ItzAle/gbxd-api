import { NextResponse } from "next/server";
import { supabase } from "../../../../../lib/supabase";

const platformAliases = {
  PS5: "PlayStation 5",
  PS4: "PlayStation 4",
  PS3: "PlayStation 3",
  PS2: "PlayStation 2",
  PS1: "PlayStation",
  XBOX1: "Xbox One",
  XBXX: "Xbox Series X",
  XBXSS: "Xbox Series S",
  XBSXS: "Xbox Series X|S",
  XBOX360: "Xbox 360",
  XBOXONE: "Xbox One",
  SWITCH: "Nintendo Switch",
  NSW: "Nintendo Switch",
  WII: "Wii",
  WIIU: "Wii U",
  N64: "Nintendo 64",
  GC: "GameCube",
  NES: "Nintendo Entertainment System",
  SNES: "Super Nintendo Entertainment System",
  PC: "PC",
  MAC: "Mac",
  ANDROID: "Android",
  IOS: "iOS",
  VR: "Virtual Reality",
  AR: "Augmented Reality",
};

export async function GET(request, { params }) {
  const { name } = params;
  const decodedName = decodeURIComponent(name).toUpperCase();
  const platformName = platformAliases[decodedName] || decodedName;

  const headers = {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers":
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
  };

  if (request.method === "OPTIONS") {
    return new Response(null, { status: 200, headers });
  }

  try {
    console.log("Buscando juegos para la plataforma:", platformName);

    // Usamos la función jsonb_array_elements para buscar en el array JSON
    const { data: games, error } = await supabase
      .from("games")
      .select("*")
      .filter("platforms", "cs", `["${platformName}"]`);

    if (error) {
      console.error("Error de Supabase:", error);
      throw error;
    }

    console.log(
      `Encontrados ${
        games ? games.length : 0
      } juegos para la plataforma ${platformName}`
    );

    if (!games || games.length === 0) {
      return NextResponse.json(
        { message: "No se encontraron juegos para esta plataforma" },
        { status: 404, headers }
      );
    }

    return NextResponse.json(games, { status: 200, headers });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500, headers }
    );
  }
}
