'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Preferences() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState(true);
  const [theme, setTheme] = useState('light');

  if (!session) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Please sign in to access preferences</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Preferences</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <p className="mt-1 text-gray-600 dark:text-gray-400">{session.user?.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <p className="mt-1 text-gray-600 dark:text-gray-400">{session.user?.name}</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notification Settings</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Email Notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Theme Settings</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="radio"
                id="light"
                name="theme"
                value="light"
                checked={theme === 'light'}
                onChange={(e) => setTheme(e.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
              <label htmlFor="light" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Light
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="dark"
                name="theme"
                value="dark"
                checked={theme === 'dark'}
                onChange={(e) => setTheme(e.target.value)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
              <label htmlFor="dark" className="ml-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Dark
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 