'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { StarIcon, FilterIcon, ArrowDownIcon } from '@primer/octicons-react';

// Mock data for demonstration
const games = [
  {
    id: 1,
    title: "Elden Ring",
    rating: 9.5,
    reviews: 1250,
    platform: "PS5, Xbox Series X, PC",
    releaseDate: "2024-02-25",
    genre: "Action RPG",
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    description: "A new fantasy action-RPG and the largest FromSoftware game to date."
  },
  {
    id: 2,
    title: "Baldur's Gate 3",
    rating: 9.8,
    reviews: 980,
    platform: "PC, PS5",
    releaseDate: "2023-08-03",
    genre: "RPG",
    developer: "Larian Studios",
    publisher: "Larian Studios",
    description: "An epic role-playing game set in the world of Dungeons & Dragons."
  },
  {
    id: 3,
    title: "Cyberpunk 2077: Phantom Liberty",
    rating: 9.2,
    reviews: 750,
    platform: "PS5, Xbox Series X, PC",
    releaseDate: "2023-09-26",
    genre: "Action RPG",
    developer: "CD Projekt Red",
    publisher: "CD Projekt",
    description: "An expansion to the open-world action RPG Cyberpunk 2077."
  },
  {
    id: 4,
    title: "The Legend of Zelda: Tears of the Kingdom",
    rating: 9.7,
    reviews: 1100,
    platform: "Nintendo Switch",
    releaseDate: "2023-05-12",
    genre: "Action Adventure",
    developer: "Nintendo EPD",
    publisher: "Nintendo",
    description: "The sequel to The Legend of Zelda: Breath of the Wild."
  },
  {
    id: 5,
    title: "Starfield",
    rating: 8.9,
    reviews: 850,
    platform: "Xbox Series X, PC",
    releaseDate: "2023-09-06",
    genre: "RPG",
    developer: "Bethesda Game Studios",
    publisher: "Xbox Game Studios",
    description: "A next-generation role-playing game set in space."
  }
];

export default function Games() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [sortBy, setSortBy] = useState('rating');

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access the games</h1>
      </div>
    );
  }

  const genres = ['all', ...new Set(games.map(game => game.genre))];

  const filteredGames = games
    .filter(game => 
      (selectedGenre === 'all' || game.genre === selectedGenre) &&
      (searchQuery === '' || 
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'reviews') return b.reviews - a.reviews;
      return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
    });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Games Library</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FilterIcon size={16} className="text-gray-500 dark:text-gray-400" />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white"
            >
              {genres.map(genre => (
                <option key={genre} value={genre}>
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <ArrowDownIcon size={16} className="text-gray-500 dark:text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-gray-900 dark:text-white"
            >
              <option value="rating">Rating</option>
              <option value="reviews">Reviews</option>
              <option value="releaseDate">Release Date</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {filteredGames.map((game) => (
          <div key={game.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{game.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{game.genre}</p>
              </div>
              <div className="flex items-center">
                <StarIcon className="text-yellow-400" size={16} />
                <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">{game.rating}</span>
              </div>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{game.description}</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Developer:</span> {game.developer}
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Publisher:</span> {game.publisher}
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Platform:</span> {game.platform}
              </div>
              <div>
                <span className="font-medium text-gray-900 dark:text-white">Release Date:</span> {game.releaseDate}
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">{game.reviews} reviews</span>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 