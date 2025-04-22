import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const steamId = searchParams.get('steamId') || process.env.STEAM_ID;

  // Log all environment variables (for debugging)
  console.log('Environment variables:', {
    STEAM_API_KEY: process.env.STEAM_API_KEY ? 'Present' : 'Missing',
    STEAM_ID: process.env.STEAM_ID ? 'Present' : 'Missing',
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!steamId) {
    return NextResponse.json(
      { error: 'Steam ID is required. Please provide it as a query parameter or set STEAM_ID in environment variables.' },
      { status: 400 }
    );
  }

  // Validate Steam ID format (should be a 17-digit number)
  if (!/^\d{17}$/.test(steamId)) {
    return NextResponse.json(
      { error: 'Invalid Steam ID format. Steam ID should be a 17-digit number.' },
      { status: 400 }
    );
  }

  const steamApiKey = process.env.STEAM_API_KEY;
  if (!steamApiKey) {
    console.error('STEAM_API_KEY is not configured');
    return NextResponse.json(
      { error: 'Steam API configuration is missing' },
      { status: 500 }
    );
  }

  // Log the API key (first 4 characters) for debugging
  console.log('Using Steam API key:', steamApiKey.substring(0, 4) + '...');

  try {
    // Using the official Steam Web API endpoint
    const apiUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${steamApiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true&format=json`;
    console.log('Making request to:', apiUrl);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Steam API error:', errorData);
      throw new Error(`Steam API returned ${response.status}: ${errorData}`);
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