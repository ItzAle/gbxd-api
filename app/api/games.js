import { db } from "../../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

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

export async function getGames() {
  const gamesRef = collection(db, "games");
  const querySnapshot = await getDocs(gamesRef);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getGame(slug) {
  const gamesRef = collection(db, "games");
  const q = query(gamesRef, where("slug", "==", slug));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
}
