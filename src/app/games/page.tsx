'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  StarIcon,
  PeopleIcon,
  CalendarIcon,
  TagIcon,
  PlayIcon,
  InfoIcon,
  ChevronRightIcon,
  DeviceDesktopIcon,
  AppsIcon,
  MarkGithubIcon // using this as a Linux icon
} from '@primer/octicons-react';

interface GameDetails {
  appid: number;
  name: string;
  currentPlayers: number;
  details: {
    headerImage: string;
    backgroundImage: string;
    shortDescription: string;
    longDescription: string;
    genres: string[];
    categories: string[];
    price: {
      final: number;
      initial: number;
      discount_percent: number;
      final_formatted: string;
    } | null;
    releaseDate: {
      coming_soon: boolean;
      date: string;
    };
    developers: string[];
    publishers: string[];
    platforms: {
      windows: boolean;
      mac: boolean;
      linux: boolean;
    };
    metacritic: {
      score: number;
      url: string;
    } | null;
    screenshots: string[];
    movies: Array<{
      thumbnail: string;
      webm: string | null;
      mp4: string | null;
    }>;
    requirements: {
      minimum: string | null;
      recommended: string | null;
    };
    achievements: {
      total: number;
      highlighted: Array<{
        name: string;
        path: string;
      }>;
    };
    tags: Array<{ name: string }>;
    news: Array<{
      title: string;
      url: string;
      date: number;
      content: string;
    }>;
  };
}

interface ApiResponse {
  totalPlayers: number;
  topGames: GameDetails[];
}

export default function GamesPage() {
  const { data: session } = useSession();
  const [games, setGames] = useState<GameDetails[]>([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('/api/steam/store');
        if (!response.ok) {
          throw new Error('Failed to fetch games');
        }
        const data: ApiResponse = await response.json();
        setGames(data.topGames);
        setTotalPlayers(data.totalPlayers);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, []);

  if (!session) {
    return (
      <div className="text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access the games</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center py-8">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Top Steam Games</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Total Players Online: {totalPlayers.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {games.map((game) => (
          <div
            key={game.appid}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative">
              <div className="relative h-64 w-full">
                <Image
                  src={game.details.headerImage}
                  alt={game.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              {game.details.price && game.details.price.discount_percent > 0 && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full">
                  -{game.details.price.discount_percent}%
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{game.name}</h2>
                <div className="flex items-center space-x-2">
                  {game.details.platforms.windows && <DeviceDesktopIcon size={20} />}
                  {game.details.platforms.mac && <AppsIcon size={20} />}
                  {game.details.platforms.linux && <MarkGithubIcon size={20} />}
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">{game.details.shortDescription}</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <PeopleIcon size={20} />
                  <span>{game.currentPlayers.toLocaleString()} playing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CalendarIcon size={20} />
                  <span>{new Date(game.details.releaseDate.date).toLocaleDateString()}</span>
                </div>
                {game.details.metacritic && (
                  <div className="flex items-center space-x-2">
                    <StarIcon size={20} />
                    <span>Metacritic: {game.details.metacritic.score}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <TagIcon size={20} />
                  <span>{game.details.genres.slice(0, 2).join(', ')}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {game.details.tags.slice(0, 5).map((tag) => (
                  <span
                    key={tag.name}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>

              {game.details.price && (
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    {game.details.price.discount_percent > 0 ? (
                      <>
                        <span className="text-gray-500 line-through">
                          ${(game.details.price.initial / 100).toFixed(2)}
                        </span>
                        <span className="text-2xl font-bold text-green-500">
                          ${(game.details.price.final / 100).toFixed(2)}
                        </span>
                      </>
                    ) : (
                      <span className="text-2xl font-bold">
                        ${(game.details.price.final / 100).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {game.details.news.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Latest News</h3>
                  <div className="space-y-2">
                    {game.details.news.map((item) => (
                      <a
                        key={item.url}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                      >
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(item.date * 1000).toLocaleDateString()}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center">
                <Link
                  href={`/games/${game.appid}`}
                  className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500"
                >
                  <span>View Details</span>
                  <ChevronRightIcon size={20} />
                </Link>
                <a
                  href={`https://store.steampowered.com/app/${game.appid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors"
                >
                  <PlayIcon size={20} />
                  <span>View on Steam</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 