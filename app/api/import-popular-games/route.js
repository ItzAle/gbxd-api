import { NextResponse } from 'next/server';
import { fetchTopRatedGames, fetchGameData } from '@/app/utils/scraper';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import slugify from 'slugify';

export async function POST(request) {
  try {
    const { page = 1, pageSize = 40 } = await request.json();
    console.log(`Fetching top rated games: page ${page}, pageSize ${pageSize}`);
    const topRatedGames = await fetchTopRatedGames(page, pageSize);
    console.log(`Fetched ${topRatedGames.length} games`);
    
    let addedCount = 0;
    let updatedCount = 0;
    let errorCount = 0;

    const gamesRef = collection(db, "games");

    // Procesar juegos en lotes de 10
    for (let i = 0; i < topRatedGames.length; i += 10) {
      const batch = topRatedGames.slice(i, i + 10);
      
      await Promise.all(batch.map(async (game) => {
        try {
          const fullGameData = await fetchGameData(game.rawgId);
          const slug = slugify(fullGameData.name, { lower: true, strict: true });
          
          // Verificar si el juego ya existe
          const q = query(gamesRef, where("rawgId", "==", fullGameData.rawgId));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            // Añadir el juego si no existe
            await addDoc(gamesRef, {
              ...fullGameData,
              slug,
              addedBy: 'RAWG API (Top Rated)'
            });
            addedCount++;
          } else {
            // Actualizar el juego si ya existe
            const docRef = doc(db, "games", querySnapshot.docs[0].id);
            await updateDoc(docRef, {
              ...fullGameData,
              slug,
              addedBy: 'RAWG API (Top Rated)'
            });
            updatedCount++;
          }
        } catch (error) {
          console.error(`Error processing game ${game.name}:`, error);
          errorCount++;
        }
      }));
    }

    return NextResponse.json({ 
      message: `Imported ${addedCount} new games. Updated ${updatedCount} existing games. Errors occurred for ${errorCount} games.`
    }, { status: 200 });
  } catch (error) {
    console.error("Error importing top rated games:", error);
    return NextResponse.json({ error: "Error importing top rated games: " + error.message }, { status: 500 });
  }
}