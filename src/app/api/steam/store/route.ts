import { NextResponse } from 'next/server';

interface SteamMostPlayedGame {
  appid: number;
  rank: number;
  concurrent_in_game: number;
}

interface SteamNewsItem {
  gid: string;
  title: string;
  url: string;
  date: number;
  contents: string;
}

interface SteamGameDetails {
  name: string;
  header_image: string;
  background?: string;
  short_description: string;
  detailed_description: string;
  genres?: Array<{ description: string }>;
  categories?: Array<{ description: string }>;
  price_overview?: {
    final: number;
    initial: number;
    discount_percent: number;
    final_formatted: string;
  };
  release_date: {
    coming_soon: boolean;
    date: string;
  };
  developers?: string[];
  publishers?: string[];
  platforms?: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
  metacritic?: {
    score: number;
    url: string;
  };
  screenshots?: Array<{ path_full: string }>;
  movies?: Array<{
    thumbnail: string;
    webm: { max: string };
    mp4: { max: string };
  }>;
  pc_requirements?: {
    minimum: string;
    recommended: string;
  };
  achievements?: {
    total: number;
    highlighted: Array<{
      name: string;
      path: string;
    }>;
  };
  tags?: Array<{ name: string }>;
}

export async function GET() {
  const steamApiKey = process.env.STEAM_API_KEY;
  if (!steamApiKey) {
    console.error('STEAM_API_KEY is not configured');
    return NextResponse.json(
      { error: 'Steam API configuration is missing' },
      { status: 500 }
    );
  }

  try {
    // Fetch the list of most played games from Steam
    const mostPlayedResponse = await fetch(
      `https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/?key=${steamApiKey}`
    );

    if (!mostPlayedResponse.ok) {
      throw new Error('Failed to fetch most played games');
    }

    const mostPlayedData = await mostPlayedResponse.json();
    const topGames = (mostPlayedData.response.ranks as SteamMostPlayedGame[]).slice(0, 20);

    // Fetch detailed information for each game
    const gameDetails = await Promise.all(
      topGames.map(async (game: SteamMostPlayedGame) => {
        // Fetch game details
        const detailsResponse = await fetch(
          `https://store.steampowered.com/api/appdetails?appids=${game.appid}&cc=us&l=english`
        );

        if (!detailsResponse.ok) {
          return null;
        }

        const detailsData = await detailsResponse.json();
        const gameData = detailsData[game.appid]?.data;

        if (!gameData) {
          return null;
        }

        // Fetch current player count
        const playersResponse = await fetch(
          `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=${steamApiKey}&appid=${game.appid}`
        );

        let currentPlayers = 0;
        if (playersResponse.ok) {
          const playersData = await playersResponse.json();
          currentPlayers = playersData.response.player_count || 0;
        }

        // Fetch news for the game
        const newsResponse = await fetch(
          `https://api.steampowered.com/ISteamNews/GetNewsForApp/v2/?appid=${game.appid}&count=3&maxlength=300&format=json`
        );

        let newsItems = [];
        if (newsResponse.ok) {
          const newsData = await newsResponse.json();
          newsItems = newsData.appnews?.newsitems || [];
        }

        return {
          appid: game.appid,
          name: gameData.name,
          currentPlayers,
          details: {
            headerImage: gameData.header_image,
            backgroundImage: gameData.background,
            shortDescription: gameData.short_description,
            longDescription: gameData.detailed_description,
            genres: gameData.genres?.map((g: any) => g.description) || [],
            categories: gameData.categories?.map((c: any) => c.description) || [],
            price: gameData.price_overview || null,
            releaseDate: gameData.release_date,
            developers: gameData.developers || [],
            publishers: gameData.publishers || [],
            platforms: gameData.platforms || {},
            metacritic: gameData.metacritic || null,
            screenshots: gameData.screenshots?.slice(0, 5).map((s: any) => s.path_full) || [],
            movies: gameData.movies?.slice(0, 3).map((m: any) => ({
              thumbnail: m.thumbnail,
              webm: m.webm?.max || null,
              mp4: m.mp4?.max || null
            })) || [],
            requirements: {
              minimum: gameData.pc_requirements?.minimum || null,
              recommended: gameData.pc_requirements?.recommended || null
            },
            achievements: {
              total: gameData.achievements?.total || 0,
              highlighted: gameData.achievements?.highlighted || []
            },
            tags: gameData.tags?.slice(0, 10) || [],
            news: newsItems.map((item: any) => ({
              title: item.title,
              url: item.url,
              date: item.date,
              content: item.contents
            }))
          }
        };
      })
    );

    // Filter out any null results and calculate total players
    const validGames = gameDetails.filter(game => game !== null);
    const totalPlayers = validGames.reduce((sum, game) => sum + game.currentPlayers, 0);

    return NextResponse.json({
      totalPlayers,
      topGames: validGames
    });
  } catch (error) {
    console.error('Error fetching Steam store stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Steam store statistics' },
      { status: 500 }
    );
  }
} 