import { db } from "../../lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const gamesRef = collection(db, "games");
    const querySnapshot = await getDocs(gamesRef);
    const games = querySnapshot.docs.map((doc) => doc.data());
    res.status(200).json(games);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
