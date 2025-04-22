'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface ItemData {
  id: string;
  name: string;
  [key: string]: unknown;
}

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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{data?.name || 'Unknown'}</h1>
      {/* Add more content based on the type and data */}
    </div>
  );
} 