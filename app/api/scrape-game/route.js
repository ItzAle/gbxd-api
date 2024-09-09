import { NextResponse } from 'next/server';
import { fetchGameData } from '@/app/utils/scraper';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import slugify from 'slugify';

export async function POST(request) {
  try {
    const { gameId } = await request.json();
    const gameData = await fetchGameData(gameId);

    // Generar un slug para el juego
    const slug = slugify(gameData.name, { lower: true, strict: true });

    // Verificar si el juego ya existe en la base de datos
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, where("name", "==", gameData.name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json({ message: "Game already exists in the database" }, { status: 409 });
    }

    // Añadir el nuevo documento a la colección de juegos en Firestore
    await addDoc(collection(db, "games"), {
      ...gameData,
      slug,
      addedBy: 'RAWG API'
    });

    return NextResponse.json({ message: "Game fetched and added successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Error fetching and adding game" }, { status: 500 });
  }
}