'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Stats {
  total: number;
  byCategory: Record<string, number>;
  byHall: Record<string, number>;
  withWebsites: number;
  withEmail: number;
  withPhone: number;
  withSocial: number;
  totalIndividuals: number;
  individualsWithEmail: number;
  individualsWithPhone: number;
  individualsWithSocial: number;
  byCategoryIndividuals: Record<string, number>;
  byHallIndividuals: Record<string, number>;
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
    cybersecurity: '#EF4444',
    ai: '#A855F7',
    fintech: '#22C55E',
    cloud: '#3B82F6',
    infrastructure: '#F97316',
    consulting: '#EAB308',
    healthcare: '#EC4899',
    education: '#6366F1',
    retail: '#14B8A6',
    other: '#6B7280',
  };

  const pieChartData = Object.entries(stats.byCategory).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
    color: categoryColors[category] || '#6B7280',
  }));

  const barChartData = Object.entries(stats.byHall)
    .map(([hall, count]) => ({ hall, count }))
    .sort((a, b) => a.hall.localeCompare(b.hall));

  const pieChartDataIndividuals = Object.entries(stats.byCategoryIndividuals || {}).map(([category, count]) => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: count,
    color: categoryColors[category] || '#6B7280',
  }));

  const barChartDataIndividuals = Object.entries(stats.byHallIndividuals || {})
    .map(([hall, count]) => ({ hall, count }))
    .sort((a, b) => a.hall.localeCompare(b.hall));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Companies</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">With Websites</div>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.withWebsites}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {((stats.withWebsites / stats.total) * 100).toFixed(1)}%
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">With Contact Info</div>
        <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.withEmail + stats.withPhone}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Email: {stats.withEmail} | Phone: {stats.withPhone}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">With Social Media</div>
        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.withSocial}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {((stats.withSocial / stats.total) * 100).toFixed(1)}%
        </div>
      </div>

      {/* Individual Statistics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Total Individuals</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalIndividuals || 0}</div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Individuals with Email</div>
        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.individualsWithEmail || 0}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {stats.totalIndividuals ? ((stats.individualsWithEmail / stats.totalIndividuals) * 100).toFixed(1) : 0}%
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Individuals with Phone</div>
        <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.individualsWithPhone || 0}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {stats.totalIndividuals ? ((stats.individualsWithPhone / stats.totalIndividuals) * 100).toFixed(1) : 0}%
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Individuals with Social</div>
        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{stats.individualsWithSocial || 0}</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {stats.totalIndividuals ? ((stats.individualsWithSocial / stats.totalIndividuals) * 100).toFixed(1) : 0}%
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Companies by Category</div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="45%"
                labelLine={false}
                label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: '#1f2937'
                }}
                itemStyle={{ color: '#1f2937' }}
                formatter={(value: any, name: any) => [`${value} companies`, name]}
              />
              <Legend 
                wrapperStyle={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}
                iconType="circle"
                verticalAlign="bottom"
                height={50}
                formatter={(value: string) => {
                  const entry = pieChartData.find((item: any) => item.name === value);
                  if (entry) {
                    const percent = ((entry.value / stats.total) * 100).toFixed(1);
                    return `${value}: ${percent}%`;
                  }
                  return value;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2">
        <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Companies by Hall</div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="hall" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: '#1f2937'
                }}
                itemStyle={{ color: '#1f2937' }}
                formatter={(value: any) => [`${value} companies`, 'Count']}
              />
              <Bar dataKey="count" fill="#3B82F6" animationBegin={0} animationDuration={1000} animationEasing="ease-out" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Charts */}
      {pieChartDataIndividuals.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Individuals by Category</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartDataIndividuals}
                  cx="50%"
                  cy="45%"
                  labelLine={false}
                  label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                  animationEasing="ease-out"
                >
                  {pieChartDataIndividuals.map((entry, index) => (
                    <Cell key={`cell-ind-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#1f2937'
                  }}
                  itemStyle={{ color: '#1f2937' }}
                  formatter={(value: any, name: any) => [`${value} individuals`, name]}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '13px', color: '#4b5563', fontWeight: '500' }}
                  iconType="circle"
                  verticalAlign="bottom"
                  height={50}
                  formatter={(value: string) => {
                    const entry = pieChartDataIndividuals.find((item: any) => item.name === value);
                    if (entry) {
                      const percent = ((entry.value / (stats.totalIndividuals || 1)) * 100).toFixed(1);
                      return `${value}: ${percent}%`;
                    }
                    return value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {barChartDataIndividuals.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-lg hover:shadow-xl transition-all duration-300 md:col-span-2">
          <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">Individuals by Hall</div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartDataIndividuals}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="hall" 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    color: '#1f2937'
                  }}
                  itemStyle={{ color: '#1f2937' }}
                  formatter={(value: any) => [`${value} individuals`, 'Count']}
                />
                <Bar dataKey="count" fill="#10B981" animationBegin={0} animationDuration={1000} animationEasing="ease-out" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
