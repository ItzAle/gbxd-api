import axios from "axios";

const RAWG_API_KEY = process.env.RAWG_API_KEY;

export async function fetchGameData(gameId) {
  try {
    const response = await axios.get(
      `https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`
    );
    const gameData = response.data;

    return {
      rawgId: gameData.id,
      name: gameData.name,
      description: gameData.description_raw,
      releaseDate: gameData.released,
      publisher:
        gameData.publishers.map((pub) => pub.name).join(", ") || "Unknown",
      developer:
        gameData.developers.map((dev) => dev.name).join(", ") || "Unknown",
      genres: gameData.genres.map((genre) => genre.name),
      platforms: gameData.platforms.map((platform) => platform.platform.name),
      coverImageUrl: gameData.background_image,
      averageRating: gameData.rating,
    };
  } catch (error) {
    console.error("Error fetching game data from RAWG:", error);
    throw error;
  }
}

export async function fetchTopRatedGames(page = 1, pageSize = 40) {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games`, {
      params: {
        key: RAWG_API_KEY,
        ordering: "-rating",
        page: page,
        page_size: pageSize,
      },
    });
    return response.data.results.map((game) => ({
      rawgId: game.id,
      name: game.name,
      averageRating: game.rating,
      coverImageUrl: game.background_image,
    }));
  } catch (error) {
    console.error("Error fetching top rated games from RAWG:", error);
    throw error;
  }
}
