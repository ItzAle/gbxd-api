import { NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import slugify from "slugify";

export async function POST(req) {
  try {
    const games = await req.json();

    if (!Array.isArray(games)) {
      return NextResponse.json({ error: "Invalid input. Expected an array of games." }, { status: 400 });
    }

    let addedCount = 0;
    let errorCount = 0;
    const errors = [];

    for (const game of games) {
      try {
        const slug = slugify(game.name, { lower: true, strict: true });
        
        const { data, error } = await supabase
          .from('games')
          .insert({
            slug,
            ...game,
            addedBy: 'Batch Upload'
          });

        if (error) throw error;
        addedCount++;
      } catch (error) {
        errorCount++;
        errors.push({ game: game.name, error: error.message });
      }
    }

    return NextResponse.json({
      message: `Added ${addedCount} games. Errors: ${errorCount}.`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error("Error adding games in batch:", error);
    return NextResponse.json({ error: "Error adding games in batch" }, { status: 500 });
  }
}
