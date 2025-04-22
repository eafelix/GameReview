'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { StarIcon, FlameIcon, ArrowUpIcon, EyeIcon, PeopleIcon } from '@primer/octicons-react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface SteamStats {
  totalGames: number;
  totalPlaytime: number;
  averagePlaytime: number;
  mostPlayedGame: {
    name: string;
    playtime: number;
  };
}

interface StoreStats {
  totalPlayers: number;
  topGames: Array<{
    appid: number;
    name: string;
    count: number;
  }>;
}

export default function Dashboard() {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<SteamStats | null>(null);
  const [storeStats, setStoreStats] = useState<StoreStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch personal stats
        const gamesResponse = await fetch('/api/steam/games');
        if (!gamesResponse.ok) {
          throw new Error('Failed to fetch Steam games');
        }
        const gamesData = await gamesResponse.json();
        
        // Calculate personal statistics
        const games = gamesData.games || [];
        const totalPlaytime = games.reduce((acc: number, game: any) => acc + game.playtime_forever, 0);
        const mostPlayedGame = games.reduce((max: any, game: any) => 
          game.playtime_forever > max.playtime_forever ? game : max, 
          { playtime_forever: 0, name: '' }
        );

        setStats({
          totalGames: games.length,
          totalPlaytime: Math.round(totalPlaytime / 60),
          averagePlaytime: Math.round((totalPlaytime / games.length) / 60),
          mostPlayedGame: {
            name: mostPlayedGame.name,
            playtime: Math.round(mostPlayedGame.playtime_forever / 60)
          }
        });

        // Fetch store stats
        const storeResponse = await fetch('/api/steam/store');
        if (!storeResponse.ok) {
          throw new Error('Failed to fetch store statistics');
        }
        const storeData = await storeResponse.json();
        setStoreStats(storeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to access the dashboard</h1>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-4">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  // Prepare chart data
  const topGamesData = {
    labels: storeStats?.topGames.map(game => game.name) || [],
    datasets: [
      {
        label: 'Current Players',
        data: storeStats?.topGames.map(game => game.count) || [],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const playtimeData = {
    labels: ['Total Playtime', 'Average Playtime'],
    datasets: [
      {
        data: [stats?.totalPlaytime || 0, stats?.averagePlaytime || 0],
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gaming Dashboard</h1>
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
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Total Games</h2>
            <StarIcon className="text-yellow-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalGames || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">In your library</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Total Playtime</h2>
            <EyeIcon className="text-blue-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.totalPlaytime || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Hours played</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Average Playtime</h2>
            <FlameIcon className="text-orange-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats?.averagePlaytime || 0}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Hours per game</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Most Played</h2>
            <ArrowUpIcon className="text-green-500" size={20} />
          </div>
          <p className="text-xl font-bold text-gray-900 dark:text-white mt-2 truncate">
            {stats?.mostPlayedGame.name || 'No games'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {stats?.mostPlayedGame.playtime || 0} hours
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Steam Store Stats</h2>
            <PeopleIcon className="text-indigo-500" size={20} />
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {storeStats?.totalPlayers.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Current Players Online</p>
            </div>
            <div className="h-64">
              <Bar
                data={topGamesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    title: {
                      display: true,
                      text: 'Top Games by Player Count',
                      color: 'rgb(156, 163, 175)',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: {
                        color: 'rgb(156, 163, 175)',
                      },
                    },
                    x: {
                      ticks: {
                        color: 'rgb(156, 163, 175)',
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Your Gaming Stats</h2>
          <div className="h-64">
            <Doughnut
              data={playtimeData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      color: 'rgb(156, 163, 175)',
                    },
                  },
                  title: {
                    display: true,
                    text: 'Playtime Distribution',
                    color: 'rgb(156, 163, 175)',
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 