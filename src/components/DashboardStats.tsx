'use client';

import { useEffect, useState } from 'react';

interface Stats {
  total: number;
  byCategory: Record<string, number>;
  withWebsites: number;
  withEmail: number;
  withPhone: number;
  withSocial: number;
}

export default function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const categoryColors: Record<string, string> = {
    cybersecurity: 'bg-red-500',
    ai: 'bg-purple-500',
    fintech: 'bg-green-500',
    cloud: 'bg-blue-500',
    infrastructure: 'bg-orange-500',
    consulting: 'bg-yellow-500',
    healthcare: 'bg-pink-500',
    education: 'bg-indigo-500',
    retail: 'bg-teal-500',
    other: 'bg-gray-500',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="text-sm font-medium text-gray-600 mb-1">Total Companies</div>
        <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="text-sm font-medium text-gray-600 mb-1">With Websites</div>
        <div className="text-3xl font-bold text-blue-600">{stats.withWebsites}</div>
        <div className="text-xs text-gray-500 mt-1">
          {((stats.withWebsites / stats.total) * 100).toFixed(1)}%
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="text-sm font-medium text-gray-600 mb-1">With Contact Info</div>
        <div className="text-3xl font-bold text-green-600">{stats.withEmail + stats.withPhone}</div>
        <div className="text-xs text-gray-500 mt-1">
          Email: {stats.withEmail} | Phone: {stats.withPhone}
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="text-sm font-medium text-gray-600 mb-1">With Social Media</div>
        <div className="text-3xl font-bold text-purple-600">{stats.withSocial}</div>
        <div className="text-xs text-gray-500 mt-1">
          {((stats.withSocial / stats.total) * 100).toFixed(1)}%
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm md:col-span-2 lg:col-span-4">
        <div className="text-sm font-medium text-gray-600 mb-4">Companies by Category</div>
        <div className="flex flex-wrap gap-3">
          {Object.entries(stats.byCategory).map(([category, count]) => (
            <div key={category} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${categoryColors[category] || 'bg-gray-500'}`}></div>
              <span className="text-sm text-gray-700 capitalize">{category}:</span>
              <span className="text-sm font-semibold text-gray-900">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
