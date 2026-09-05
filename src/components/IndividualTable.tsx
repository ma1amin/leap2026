'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Mail, Phone } from 'lucide-react';

interface Individual {
  id: string;
  name: string;
  nameAr?: string;
  title?: string;
  company?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  bio?: string;
  bioAr?: string;
  category?: string;
  booth?: string;
  hall?: string;
}

interface IndividualTableProps {
  individuals: Individual[];
  loading?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (selectedIds: Set<string>) => void;
}

export default function IndividualTable({ individuals, loading = false, selectedIds = new Set(), onSelectionChange }: IndividualTableProps) {
  const getCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      cybersecurity: 'bg-red-100 text-red-800',
      ai: 'bg-purple-100 text-purple-800',
      fintech: 'bg-green-100 text-green-800',
      cloud: 'bg-blue-100 text-blue-800',
      infrastructure: 'bg-orange-100 text-orange-800',
      consulting: 'bg-yellow-100 text-yellow-800',
      healthcare: 'bg-pink-100 text-pink-800',
      education: 'bg-indigo-100 text-indigo-800',
      retail: 'bg-teal-100 text-teal-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[category || 'other'] || colors.other;
  };

  const handleSelectAll = (checked: boolean) => {
    const newSelectedIds = new Set<string>();
    if (checked) {
      individuals.forEach(individual => newSelectedIds.add(individual.id));
    }
    onSelectionChange?.(newSelectedIds);
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelectedIds = new Set(selectedIds);
    if (checked) {
      newSelectedIds.add(id);
    } else {
      newSelectedIds.delete(id);
    }
    onSelectionChange?.(newSelectedIds);
  };

  const allSelected = individuals.length > 0 && individuals.every(individual => selectedIds.has(individual.id));
  const someSelected = selectedIds.size > 0 && !allSelected;

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-48">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-32">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-40">
                  Contact
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-32">
                  Social
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i}>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-3/4 mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full mb-1 animate-pulse"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-2/3 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 bg-gray-200 dark:bg-gray-600 rounded w-16 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 mb-1 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/3 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-1/2 animate-pulse"></div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-12 animate-pulse"></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (individuals.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm p-12 text-center">
        <div className="text-gray-500 dark:text-gray-400">No individuals found</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
              />
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-48">
              Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Company
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-32">
              Category
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-20">
              Hall
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-40">
              Contact
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-32">
              Social
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider w-24">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {individuals.map((individual) => (
            <tr key={individual.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td className="px-4 py-4">
                <input
                  type="checkbox"
                  checked={selectedIds.has(individual.id)}
                  onChange={(e) => handleSelectOne(individual.id, e.target.checked)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {individual.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {individual.name}
                    </span>
                    {individual.nameAr && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{individual.nameAr}</span>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {individual.title || 'N/A'}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="text-sm text-gray-900 dark:text-gray-100">
                  {individual.company || 'N/A'}
                </div>
              </td>
              <td className="px-4 py-4">
                {individual.category && (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(individual.category)}`}>
                    {individual.category}
                  </span>
                )}
                {!individual.category && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    N/A
                  </span>
                )}
              </td>
              <td className="px-4 py-4">
                {individual.hall && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                    {individual.hall}
                  </span>
                )}
                {!individual.hall && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                    N/A
                  </span>
                )}
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col gap-1">
                  {individual.email && (
                    <a
                      href={`mailto:${individual.email}`}
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
                      title={individual.email}
                    >
                      <Mail className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{individual.email}</span>
                    </a>
                  )}
                  {individual.phone && (
                    <a
                      href={`tel:${individual.phone}`}
                      className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 flex items-center gap-1 transition-colors"
                      title={individual.phone}
                    >
                      <Phone className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{individual.phone}</span>
                    </a>
                  )}
                  {!individual.email && !individual.phone && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      No contact info
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex flex-col gap-1 text-xs">
                  {individual.linkedin && (
                    <a
                      href={individual.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      LinkedIn
                    </a>
                  )}
                  {individual.twitter && (
                    <a
                      href={individual.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Twitter
                    </a>
                  )}
                  {individual.instagram && (
                    <a
                      href={individual.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition-colors"
                    >
                      Instagram
                    </a>
                  )}
                  {!individual.linkedin && !individual.twitter && !individual.instagram && (
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                      No social
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <Link
                  href={`/individual/${individual.id}`}
                  className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
