import { NextResponse } from "next/server";
import { fetchGameData } from "@/app/utils/scraper";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

export async function POST(request) {
  try {
    const gamesRef = collection(db, "games");
    const q = query(gamesRef, where("addedBy", "==", "RAWG API (Popular)"));
    const querySnapshot = await getDocs(q);

    let updatedCount = 0;
    let errorCount = 0;

    for (const docSnapshot of querySnapshot.docs) {
      try {
        const gameData = docSnapshot.data();
        const updatedGameData = await fetchGameData(gameData.rawgId);

        await updateDoc(doc(db, "games", docSnapshot.id), {
          ...updatedGameData,
        });

        updatedCount++;
      } catch (error) {
        console.error(`Error updating game ${docSnapshot.id}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json(
      {
        message: `Updated ${updatedCount} games. Errors occurred for ${errorCount} games.`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating games:", error);
    return NextResponse.json(
      { error: "Error updating games: " + error.message },
      { status: 500 }
    );
  }
}
