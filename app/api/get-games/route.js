import { db } from "../../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, "games"));
    const games = [];

    querySnapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
    });

    return new Response(JSON.stringify(games), { status: 200 });
  } catch (error) {
    console.error("Error fetching games:", error);
    return new Response(JSON.stringify({ error: "Error fetching games" }), {
      status: 500,
    });
  }
}
