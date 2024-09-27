import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabase";

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const updatedGame = await request.json();

    const { data, error } = await supabase
      .from("games")
      .update({
        name: updatedGame.name,
        releaseDate: updatedGame.isTBA ? "TBA" : updatedGame.releaseDate,
        description: updatedGame.description,
        publisher: updatedGame.publisher,
        developer: updatedGame.developer,
        platforms: updatedGame.platforms,
        genres: updatedGame.genres,
        coverImageUrl: updatedGame.coverImageUrl,
        storeLinks: updatedGame.storeLinks,
        aliases: updatedGame.aliases,
        franchises: updatedGame.franchises,
        isTBA: updatedGame.isTBA,
        hashtags: updatedGame.hashtags,
        images: updatedGame.images,
        videos: updatedGame.videos,
      })
      .eq("slug", id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error updating game:", error);
    return NextResponse.json({ error: "Error updating game" }, { status: 500 });
  }
}
