'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { StarIcon, FlameIcon, ArrowUpIcon, EyeIcon } from '@primer/octicons-react';

// Mock data for demonstration
const topGames = [
  {
    id: 1,
    title: "Elden Ring",
    rating: 9.5,
    reviews: 1250,
    platform: "PS5, Xbox Series X, PC",
    releaseDate: "2024-02-25",
    genre: "Action RPG"
  },
  {
    id: 2,
    title: "Baldur's Gate 3",
    rating: 9.8,
    reviews: 980,
    platform: "PC, PS5",
    releaseDate: "2023-08-03",
    genre: "RPG"
  },
  {
    id: 3,
    title: "Cyberpunk 2077: Phantom Liberty",
    rating: 9.2,
    reviews: 750,
    platform: "PS5, Xbox Series X, PC",
    releaseDate: "2023-09-26",
    genre: "Action RPG"
  }
];

const trendingTopics = [
  "Next-gen console sales",
  "Cloud gaming adoption",
  "VR gaming market",
  "Mobile gaming revenue",
  "Esports growth"
];

export default function Dashboard() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access the dashboard</h1>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gaming Industry Dashboard</h1>
        <div className="w-96">
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Rated Games</h2>
            <StarIcon className="text-yellow-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">9.8</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Reviews</h2>
            <EyeIcon className="text-blue-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">2,980</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">This Month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trending Games</h2>
            <FlameIcon className="text-orange-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">15</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Market Growth</h2>
            <ArrowUpIcon className="text-green-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">+12.5%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Year over Year</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Rated Games</h2>
          <div className="space-y-4">
            {topGames.map((game) => (
              <div key={game.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{game.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{game.genre}</p>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="text-yellow-400" size={16} />
                    <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">{game.rating}</span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <p>Platform: {game.platform}</p>
                  <p>Release Date: {game.releaseDate}</p>
                  <p>Reviews: {game.reviews}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Industry Trends</h2>
          <div className="space-y-4">
            {trendingTopics.map((topic, index) => (
              <div key={index} className="flex items-center space-x-3">
                <ArrowUpIcon className="text-green-500" size={16} />
                <span className="text-gray-700 dark:text-gray-300">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 