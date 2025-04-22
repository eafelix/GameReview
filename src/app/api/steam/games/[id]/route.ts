import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const steamApiKey = process.env.STEAM_API_KEY;
  if (!steamApiKey) {
    console.error('STEAM_API_KEY is not configured');
    return NextResponse.json(
      { error: 'Steam API configuration is missing' },
      { status: 500 }
    );
  }

  try {
    // Fetch game details using the correct endpoint
    const response = await fetch(
      `https://store.steampowered.com/api/appdetails?appids=${params.id}`
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Steam API error:', errorData);
      throw new Error(`Steam API returned ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    const gameData = data[params.id].data;

    // Fetch current player count
    const playersResponse = await fetch(
      `https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?key=${steamApiKey}&appid=${params.id}&format=json`
    );

    let currentPlayers = 0;
    if (playersResponse.ok) {
      const playersData = await playersResponse.json();
      currentPlayers = playersData.response.player_count || 0;
    }

    return NextResponse.json({
      id: params.id,
      name: gameData.name,
      description: gameData.short_description,
      headerImage: gameData.header_image,
      screenshots: gameData.screenshots?.map((s: any) => s.path_full) || [],
      releaseDate: gameData.release_date?.date,
      developers: gameData.developers || [],
      publishers: gameData.publishers || [],
      categories: gameData.categories?.map((c: any) => c.description) || [],
      genres: gameData.genres?.map((g: any) => g.description) || [],
      price: gameData.price_overview || null,
      currentPlayers,
      website: gameData.website,
      supportUrl: gameData.support_info?.url,
      supportEmail: gameData.support_info?.email,
      metacritic: gameData.metacritic || null,
      recommendations: gameData.recommendations?.total || 0,
      achievements: gameData.achievements?.total || 0,
      platforms: {
        windows: gameData.platforms?.windows || false,
        mac: gameData.platforms?.mac || false,
        linux: gameData.platforms?.linux || false,
      },
    });
  } catch (error) {
    console.error('Error fetching game details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game details' },
      { status: 500 }
    );
  }
} 