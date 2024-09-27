import { supabase } from "../../../lib/supabase";
import slugify from "slugify";
import { NextResponse } from "next/server";
import { LRUCache } from "lru-cache";
import { revalidatePath } from 'next/cache';

// Configuración del rate limiting
const rateLimit = new LRUCache({
  max: 500,
  ttl: 60 * 1000, // 1 minuto
});

const RATE_LIMIT = 5; // Número máximo de solicitudes por minuto

function rateLimiter(ip) {
  const tokenCount = rateLimit.get(ip) || 0;
  if (tokenCount > RATE_LIMIT) {
    return false;
  }
  rateLimit.set(ip, tokenCount + 1);
  return true;
}

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for") || req.ip;

  if (!rateLimiter(ip)) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    const {
      name,
      releaseDate,
      description,
      publisher,
      developer,
      platforms,
      genres,
      coverImageUrl,
      userId,
      isNSFW,
      storeLinks,
      aliases,
      franchises,
      hashtags,
      images,
      videos,
    } = await req.json();

    if (
      !name ||
      !releaseDate ||
      !description ||
      !publisher ||
      !developer ||
      !platforms ||
      !genres ||
      !coverImageUrl
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const slug = slugify(name, { lower: true, strict: true });

    const { data, error } = await supabase
      .from('games')
      .insert({
        slug,
        name,
        releaseDate,
        description,
        publisher,
        developer,
        platforms,
        genres,
        coverImageUrl,
        addedBy: userId,
        isNSFW,
        storeLinks,
        aliases,
        franchises,
        hashtags,
        images,
        videos,
      })

    if (error) throw error;

    revalidatePath('/api/games')

    return NextResponse.json(
      { message: "Game added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding game:", error);
    return NextResponse.json({ error: "Error adding game" }, { status: 500 });
  }
}
