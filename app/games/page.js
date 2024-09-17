import { Suspense } from "react";
import GamesList from "../components/GameList/GameList";

export const metadata = {
  title: "Games",
  description: "Games page",
};

export default function GamesPage() {
  return (
    <Suspense fallback={<div>Loading</div>}>
      <GamesList />
    </Suspense>
  );
}
