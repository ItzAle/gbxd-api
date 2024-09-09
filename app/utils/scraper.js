import axios from 'axios';

const RAWG_API_KEY = '0190b4a8b2a74e45bd00186016871995';

export async function fetchGameData(gameId) {
  try {
    const response = await axios.get(`https://api.rawg.io/api/games/${gameId}?key=${RAWG_API_KEY}`);
    const gameData = response.data;

    return {
      name: gameData.name,
      description: gameData.description_raw,
      releaseDate: gameData.released,
      publisher: gameData.publishers[0]?.name || 'Unknown',
      developer: gameData.developers[0]?.name || 'Unknown',
      genres: gameData.genres.map(genre => genre.name),
      platforms: gameData.platforms.map(platform => platform.platform.name),
      coverImageUrl: gameData.background_image
    };
  } catch (error) {
    console.error('Error fetching game data from RAWG:', error);
    throw error;
  }
}