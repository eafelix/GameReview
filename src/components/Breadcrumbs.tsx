'use client';

import Link from 'next/link';
import { ChevronRightIcon } from '@primer/octicons-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        <li>
          <div>
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-500"
            >
              Home
            </Link>
          </div>
        </li>
        {items.map((item) => (
          <li key={item.href}>
            <div className="flex items-center">
              <ChevronRightIcon className="h-5 w-5 text-gray-400" />
              <Link
                href={item.href}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
              >
                {item.label}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
} 