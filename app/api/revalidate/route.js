import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';

export async function GET(request) {
  const secret = request.nextUrl.searchParams.get('secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  revalidatePath('/api/games');
  revalidatePath('/games');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
