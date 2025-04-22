'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { StarIcon, PeopleIcon, CalendarIcon, TagIcon, LinkIcon } from '@primer/octicons-react';

interface GameDetails {
  id: string;
  name: string;
  description: string;
  headerImage: string;
  screenshots: string[];
  releaseDate: string;
  developers: string[];
  publishers: string[];
  categories: string[];
  genres: string[];
  price: {
    final: number;
    initial: number;
    discount_percent: number;
  } | null;
  currentPlayers: number;
  website: string;
  supportUrl: string;
  supportEmail: string;
  metacritic: {
    score: number;
    url: string;
  } | null;
  recommendations: number;
  achievements: number;
  platforms: {
    windows: boolean;
    mac: boolean;
    linux: boolean;
  };
}

export default function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState<GameDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(`/api/steam/games/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch game details');
        }
        const data = await response.json();
        setGame(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading game details...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>;
  }

  if (!game) {
    return <div className="text-center py-8">Game not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="relative h-96 rounded-lg overflow-hidden mb-8">
        <Image
          src={game.headerImage}
          alt={game.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <h1 className="text-4xl font-bold text-white mb-2">{game.name}</h1>
            <div className="flex items-center space-x-4 text-white">
              {game.metacritic && (
                <div className="flex items-center">
                  <StarIcon className="text-yellow-400 mr-1" size={20} />
                  <span>{game.metacritic.score}</span>
                </div>
              )}
              <div className="flex items-center">
                <PeopleIcon className="mr-1" size={20} />
                <span>{game.currentPlayers.toLocaleString()} current players</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="mr-1" size={20} />
                <span>Released {new Date(game.releaseDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Game Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">About This Game</h2>
            <p className="text-gray-600 dark:text-gray-400 whitespace-pre-line">{game.description}</p>
          </div>

          {/* Screenshots */}
          {game.screenshots.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Screenshots</h2>
              <div className="grid grid-cols-2 gap-4">
                {game.screenshots.map((screenshot, index) => (
                  <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={screenshot}
                      alt={`${game.name} screenshot ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Price Card */}
          {game.price && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${(game.price.final / 100).toFixed(2)}
                  </p>
                  {game.price.discount_percent > 0 && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 line-through">
                        ${(game.price.initial / 100).toFixed(2)}
                      </span>
                      <span className="text-sm text-green-500">
                        -{game.price.discount_percent}%
                      </span>
                    </div>
                  )}
                </div>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  Add to Cart
                </button>
              </div>
            </div>
          )}

          {/* Game Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Game Details</h2>
            <div className="space-y-4">
              {game.developers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Developer</h3>
                  <p className="text-gray-900 dark:text-white">{game.developers.join(', ')}</p>
                </div>
              )}
              {game.publishers.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Publisher</h3>
                  <p className="text-gray-900 dark:text-white">{game.publishers.join(', ')}</p>
                </div>
              )}
              {game.genres.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Genres</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {game.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-sm"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {game.categories.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Categories</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {game.categories.map((category) => (
                      <span
                        key={category}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Platforms</h3>
                <div className="flex space-x-4 mt-1">
                  {game.platforms.windows && (
                    <span className="text-gray-900 dark:text-white">Windows</span>
                  )}
                  {game.platforms.mac && (
                    <span className="text-gray-900 dark:text-white">Mac</span>
                  )}
                  {game.platforms.linux && (
                    <span className="text-gray-900 dark:text-white">Linux</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Links</h2>
            <div className="space-y-2">
              {game.website && (
                <a
                  href={game.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  <LinkIcon size={16} className="mr-2" />
                  Official Website
                </a>
              )}
              {game.supportUrl && (
                <a
                  href={game.supportUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  <LinkIcon size={16} className="mr-2" />
                  Support
                </a>
              )}
              {game.metacritic?.url && (
                <a
                  href={game.metacritic.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                >
                  <LinkIcon size={16} className="mr-2" />
                  Metacritic
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 