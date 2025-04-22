'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
}

export default function SteamGames() {
  const { data: session } = useSession();
  const [games, setGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSteamGames = async () => {
      if (!session?.user?.id) return;

      try {
        const response = await fetch(`/api/steam/games?steamId=${session.user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Steam games');
        }
        const data = await response.json();
        setGames(data.games);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSteamGames();
  }, [session]);

  if (loading) {
    return <div className="text-center py-4">Loading Steam games...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (!games.length) {
    return <div className="text-center py-4">No games found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {games.map((game) => (
        <div
          key={game.appid}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center space-x-4">
            {game.img_icon_url && (
              <div className="relative w-16 h-16">
                <Image
                  src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                  alt={game.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-lg">{game.name}</h3>
              <p className="text-gray-600">
                Playtime: {Math.round(game.playtime_forever / 60)} hours
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 