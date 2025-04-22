import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId');

  if (!steamId) {
    return NextResponse.json(
      { error: 'Steam ID is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${process.env.STEAM_CLIENT_ID}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Steam games');
    }

    const data = await response.json();
    return NextResponse.json({ games: data.response.games || [] });
  } catch (error) {
    console.error('Error fetching Steam games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Steam games' },
      { status: 500 }
    );
  }
} 