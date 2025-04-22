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
      try {
        const response = await fetch('/api/steam/games');
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
  }, []);

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
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div className="p-3 flex items-center space-x-3">
            {game.img_icon_url && (
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src={`https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`}
                  alt={game.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-grow min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-white truncate">{game.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(game.playtime_forever / 60)} hours played
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 