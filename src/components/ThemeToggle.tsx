'use client';

import { SunIcon, MoonIcon } from '@primer/octicons-react';
import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors duration-200"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? (
        <MoonIcon size={20} className="text-gray-600 dark:text-gray-400" />
      ) : (
        <SunIcon size={20} className="text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
} 