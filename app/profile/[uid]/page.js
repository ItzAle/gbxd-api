"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function UserProfile() {
  const router = useRouter();
  const [uid, setUid] = useState(null);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      const { uid } = router.query;
      if (uid) {
        setUid(uid);
        console.log("User ID:", uid);
      }
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    const fetchGames = async () => {
      if (uid) {
        try {
          const gamesCollection = collection(db, "games");
          const q = query(gamesCollection, where("addedBy", "==", uid));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.log("No games found for this user");
            setGames([]);
          } else {
            const userGames = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));
            console.log("Fetched games:", userGames);
            setGames(userGames);
          }
        } catch (error) {
          console.error("Error fetching games: ", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchGames();
  }, [uid]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!uid) {
    return <div>No user ID provided.</div>;
  }

  return (
    <div>
      <h1>Users Games</h1>
      {games.length === 0 ? (
        <p>No games added by this user.</p>
      ) : (
        <ul>
          {games.map((game) => (
            <li key={game.id}>
              <h2>{game.title}</h2>
              <p>{game.description}</p>
              <p>
                Platforms: {game.platforms ? game.platforms.join(", ") : "N/A"}
              </p>
              <p>Genres: {game.genres ? game.genres.join(", ") : "N/A"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
