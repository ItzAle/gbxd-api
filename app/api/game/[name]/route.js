import { supabase } from "../../../../lib/supabase";
import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';

export async function GET(request, { params }) {
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

  const { name } = params;
  console.log("Buscando juego con slug:", name);

  try {
    let { data: game, error } = await supabase
      .from('games')
      .select('*')
      .eq('slug', decodeURIComponent(name))
      .single();

    if (error) throw error;

    if (!game) {
      console.log(`Juego no encontrado para el slug: ${name}`);
      return NextResponse.json(
        { error: "Juego no encontrado" },
        { status: 404, headers }
      );
    }

    console.log(`Juego encontrado:`, game);

    return NextResponse.json(game, { status: 200, headers });
  } catch (error) {
    console.error("Error al buscar el juego:", error);
    return NextResponse.json(
      { error: "Error interno del servidor", details: error.message },
      { status: 500, headers }
    );
  }
}

export async function PUT(request, { params }) {
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

  const { name } = params;
  const updatedGame = await request.json();

  try {
    const { data, error } = await supabase
      .from('games')
      .update(updatedGame)
      .eq('slug', name)
      .select();

    if (error) throw error;

    return NextResponse.json(
      {
        message: "Game updated successfully",
        updatedSlug: updatedGame.slug,
      },
      { status: 200, headers }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: " + error.message },
      { status: 500, headers }
    );
  }
}

export async function DELETE(request, { params }) {
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

  const { name } = params;

  try {
    console.log('Attempting to delete game with slug:', name);
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('slug', name);

    if (error) throw error;

    console.log('Game deleted successfully');

    // Trigger Vercel redeploy
    if (process.env.VERCEL_DEPLOY_HOOK_URL) {
      console.log('Triggering Vercel redeploy');
      await fetch(process.env.VERCEL_DEPLOY_HOOK_URL, {
        method: 'POST',
      });
      console.log('Vercel redeploy triggered');
    } else {
      console.log('VERCEL_DEPLOY_HOOK_URL not found in environment variables');
    }

    return NextResponse.json(
      {
        message: "Game deleted successfully",
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error deleting game:", error);
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      { error: `Error deleting game: ${error.message}` },
      { status: 500, headers }
    );
  }
}
