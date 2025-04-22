'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import SteamGames from '@/components/SteamGames';

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="space-y-12">
      <section className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome to GameReview</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          A modern application with secure authentication and personalized features.
        </p>
        {!session && (
          <div className="mt-8">
            <Link
              href="/auth/signin"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Secure Authentication</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in securely using Okta OIDC integration with NextAuth.js.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Personal Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Access your personalized dashboard with search functionality and quick stats.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Custom Preferences</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Customize your experience with notification and theme settings.
          </p>
        </div>
      </section>

      {session && (
        <>
          <section className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to explore?</h2>
            <div className="space-x-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/preferences"
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900 transition-colors duration-200"
              >
                Manage Preferences
              </Link>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Steam Games</h2>
            <SteamGames />
          </section>
        </>
      )}
    </div>
  );
}
