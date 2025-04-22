'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { StarIcon, FlameIcon, ArrowUpIcon, EyeIcon } from '@primer/octicons-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import StatsChart from '@/components/StatsChart';

interface ItemData {
  id: string;
  name: string;
  [key: string]: unknown;
}

// Mock data for demonstration
const mockData = {
  games: {
    'elden-ring': {
      title: "Elden Ring",
      rating: 9.5,
      reviews: 1250,
      platform: "PS5, Xbox Series X, PC",
      releaseDate: "2024-02-25",
      genre: "Action RPG",
      developer: "FromSoftware",
      publisher: "Bandai Namco",
      description: "A new fantasy action-RPG and the largest FromSoftware game to date.",
      image: "https://example.com/elden-ring.jpg",
      screenshots: [
        "https://example.com/elden-ring-1.jpg",
        "https://example.com/elden-ring-2.jpg",
      ],
      videos: [
        "https://example.com/elden-ring-trailer.mp4",
      ],
      similarGames: [
        "Dark Souls III",
        "Bloodborne",
        "Sekiro: Shadows Die Twice",
      ],
    },
  },
  consoles: {
    'ps5': {
      name: "PlayStation 5",
      manufacturer: "Sony",
      releaseDate: "2020-11-12",
      price: "$499",
      specs: {
        cpu: "AMD Zen 2",
        gpu: "AMD RDNA 2",
        memory: "16GB GDDR6",
        storage: "825GB SSD",
      },
      games: [
        "Spider-Man 2",
        "God of War Ragnarök",
        "Horizon Forbidden West",
      ],
    },
  },
  publishers: {
    'sony': {
      name: "Sony Interactive Entertainment",
      founded: "1993",
      headquarters: "San Mateo, California",
      notableGames: [
        "God of War",
        "Spider-Man",
        "The Last of Us",
      ],
      revenue: "$24.9 billion",
    },
  },
  franchises: {
    'god-of-war': {
      name: "God of War",
      publisher: "Sony Interactive Entertainment",
      firstRelease: "2005",
      latestRelease: "2022",
      totalGames: 8,
      totalSales: "51 million",
      mainCharacters: [
        "Kratos",
        "Atreus",
      ],
    },
  },
  retailers: {
    'gamestop': {
      name: "GameStop",
      founded: "1984",
      headquarters: "Grapevine, Texas",
      locations: "4,413 stores",
      revenue: "$5.93 billion",
      services: [
        "Game Trade-In",
        "PowerUp Rewards",
        "Game Informer Magazine",
      ],
    },
  },
};

export default function ItemPage() {
  const { type, id } = useParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ItemData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/${type}/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch ${type}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session, type, id]);

  if (!session) {
    return (
      <div className="text-center py-4">
        Please sign in to view this content
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  const renderContent = () => {
    switch (type) {
      case 'games':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data?.title || 'Unknown'}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">{data?.genre || 'Unknown'}</p>
              </div>
              <div className="flex items-center">
                <StarIcon className="text-yellow-400" size={20} />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">{data?.rating || 'Unknown'}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Details</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Developer:</span> {data?.developer || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Publisher:</span> {data?.publisher || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Platform:</span> {data?.platform || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Release Date:</span> {data?.releaseDate || 'Unknown'}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Reviews:</span> {data?.reviews || 'Unknown'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Description</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400">{data?.description || 'Unknown'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Similar Games</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data?.similarGames?.map((game, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="font-medium text-gray-900 dark:text-white">{game || 'Unknown'}</h3>
                  </div>
                )) || 'Unknown'}
              </div>
            </div>
          </div>
        );

      case 'consoles':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data?.name || 'Unknown'}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">{data?.manufacturer || 'Unknown'}</p>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{data?.price || 'Unknown'}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Specifications</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    {Object.entries(data?.specs || {}).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium text-gray-900 dark:text-white capitalize">{key}:</span> {value || 'Unknown'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notable Games</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    {data?.games?.map((game, index) => (
                      <div key={index} className="text-gray-600 dark:text-gray-400">{game || 'Unknown'}</div>
                    )) || 'Unknown'}
                  </div>
                    {data.games.map((game, index) => (
                      <div key={index} className="text-gray-600 dark:text-gray-400">{game}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'publishers':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">Founded: {data.founded}</p>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{data.revenue}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Info</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Headquarters:</span> {data.headquarters}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Founded:</span> {data.founded}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Revenue:</span> {data.revenue}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Notable Games</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    {data.notableGames.map((game, index) => (
                      <div key={index} className="text-gray-600 dark:text-gray-400">{game}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'franchises':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">{data.publisher}</p>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{data.totalSales}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Franchise Info</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">First Release:</span> {data.firstRelease}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Latest Release:</span> {data.latestRelease}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Total Games:</span> {data.totalGames}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Total Sales:</span> {data.totalSales}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Main Characters</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    {data.mainCharacters.map((character, index) => (
                      <div key={index} className="text-gray-600 dark:text-gray-400">{character}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'retailers':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{data.name}</h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">Founded: {data.founded}</p>
              </div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{data.revenue}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Company Info</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Headquarters:</span> {data.headquarters}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Founded:</span> {data.founded}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Locations:</span> {data.locations}
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Revenue:</span> {data.revenue}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Services</h2>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
                  <div className="space-y-2">
                    {data.services.map((service, index) => (
                      <div key={index} className="text-gray-600 dark:text-gray-400">{service}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderCharts = () => {
    switch (type) {
      case 'games':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StatsChart
              type="bar"
              title="Rating Distribution"
              labels={['1-2', '3-4', '5-6', '7-8', '9-10']}
              datasets={[
                {
                  label: 'Number of Reviews',
                  data: [50, 100, 200, 400, 500],
                },
              ]}
            />
            <StatsChart
              type="line"
              title="Review Trends"
              labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
              datasets={[
                {
                  label: 'Reviews',
                  data: [100, 150, 200, 180, 250, 300],
                },
              ]}
            />
          </div>
        );

      case 'consoles':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StatsChart
              type="bar"
              title="Game Distribution by Genre"
              labels={['Action', 'RPG', 'Sports', 'Racing', 'Strategy']}
              datasets={[
                {
                  label: 'Number of Games',
                  data: [30, 25, 15, 10, 20],
                },
              ]}
            />
            <StatsChart
              type="line"
              title="Monthly Sales"
              labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']}
              datasets={[
                {
                  label: 'Units Sold',
                  data: [1000, 1200, 900, 1100, 1300, 1500],
                },
              ]}
            />
          </div>
        );

      case 'publishers':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StatsChart
              type="bar"
              title="Revenue by Year"
              labels={['2019', '2020', '2021', '2022', '2023']}
              datasets={[
                {
                  label: 'Revenue (Billions)',
                  data: [15, 18, 20, 22, 25],
                },
              ]}
            />
            <StatsChart
              type="line"
              title="Game Releases"
              labels={['2019', '2020', '2021', '2022', '2023']}
              datasets={[
                {
                  label: 'Number of Games',
                  data: [10, 12, 15, 18, 20],
                },
              ]}
            />
          </div>
        );

      case 'franchises':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StatsChart
              type="bar"
              title="Sales by Game"
              labels={['Game 1', 'Game 2', 'Game 3', 'Game 4', 'Game 5']}
              datasets={[
                {
                  label: 'Sales (Millions)',
                  data: [5, 8, 12, 15, 10],
                },
              ]}
            />
            <StatsChart
              type="line"
              title="Cumulative Sales"
              labels={['2019', '2020', '2021', '2022', '2023']}
              datasets={[
                {
                  label: 'Total Sales (Millions)',
                  data: [20, 35, 45, 55, 65],
                },
              ]}
            />
          </div>
        );

      case 'retailers':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <StatsChart
              type="bar"
              title="Revenue by Quarter"
              labels={['Q1', 'Q2', 'Q3', 'Q4']}
              datasets={[
                {
                  label: 'Revenue (Millions)',
                  data: [100, 120, 110, 130],
                },
              ]}
            />
            <StatsChart
              type="line"
              title="Store Growth"
              labels={['2019', '2020', '2021', '2022', '2023']}
              datasets={[
                {
                  label: 'Number of Stores',
                  data: [4000, 4100, 4200, 4300, 4400],
                },
              ]}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <Breadcrumbs />
      {renderContent()}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Statistics</h2>
        {renderCharts()}
      </div>
    </div>
  );
} 