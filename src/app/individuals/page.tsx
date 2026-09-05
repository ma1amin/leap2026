'use client';

import { useState, useEffect } from 'react';
import IndividualTable from '@/components/IndividualTable';
import SearchBar from '@/components/SearchBar';
import ExportButton from '@/components/ExportButton';
import ThemeToggle from '@/components/ThemeToggle';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import Link from 'next/link';

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

export default function IndividualsPage() {
  const [individuals, setIndividuals] = useState<Individual[]>([]);
  const [filteredIndividuals, setFilteredIndividuals] = useState<Individual[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [hallFilter, setHallFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const itemsPerPage = 20;

  const categories = ['all', 'cybersecurity', 'ai', 'fintech', 'cloud', 'infrastructure', 'consulting', 'healthcare', 'education', 'retail', 'other'];
  const halls = ['all', 'H1', 'H2', 'H3', 'H4', 'H5', 'H1A'];

  useEffect(() => {
    fetchIndividuals();
  }, [currentPage, categoryFilter, hallFilter]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = individuals.filter(
        (individual) =>
          individual.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (individual.title && individual.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (individual.company && individual.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (individual.bio && individual.bio.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredIndividuals(filtered);
      setCurrentPage(1);
    } else {
      setFilteredIndividuals(individuals);
    }
  }, [searchQuery, individuals]);

  const fetchIndividuals = async () => {
    setLoading(true);
    try {
      const categoryParam = categoryFilter !== 'all' ? `&category=${categoryFilter}` : '';
      const hallParam = hallFilter !== 'all' ? `&hall=${hallFilter}` : '';
      const response = await fetch(`/api/individuals?page=${currentPage}&limit=${itemsPerPage}${categoryParam}${hallParam}`);
      const data = await response.json();
      setIndividuals(data.individuals);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Error fetching individuals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setHallFilter('all');
    setCurrentPage(1);
  };

  const exportSelected = () => {
    if (selectedIds.size === 0) return;
    const ids = Array.from(selectedIds).join(',');
    window.open(`/api/export/individuals/csv?ids=${ids}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white sticky top-0 z-50 shadow-lg backdrop-blur-sm bg-opacity-95">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-white hover:text-gray-200 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Individuals
                </h1>
                <p className="text-sm text-gray-200">LEAP 2026 Attendees</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Categories</option>
                {categories.filter(cat => cat !== 'all').map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={hallFilter}
                onChange={(e) => setHallFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Halls</option>
                {halls.filter(hall => hall !== 'all').map(hall => (
                  <option key={hall} value={hall}>{hall}</option>
                ))}
              </select>
            </div>
          </div>
          {(searchQuery || categoryFilter !== 'all' || hallFilter !== 'all') && (
            <button
              onClick={handleClearFilters}
              className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Export Buttons */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {selectedIds.size > 0 && (
              <button
                onClick={exportSelected}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Export Selected ({selectedIds.size})
              </button>
            )}
            <a
              href="/api/export/individuals/csv"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Export All CSV
            </a>
            <a
              href="/api/export/individuals/excel"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Export All Excel
            </a>
            <a
              href="/api/export/individuals/json"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Export All JSON
            </a>
            {categoryFilter !== 'all' && (
              <a
                href={`/api/export/individuals/csv?category=${categoryFilter}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Export {categoryFilter} CSV
              </a>
            )}
            {hallFilter !== 'all' && (
              <a
                href={`/api/export/individuals/csv?hall=${hallFilter}`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Export {hallFilter} CSV
              </a>
            )}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredIndividuals.length} of {total} individuals
        </div>

        {/* Table */}
        <IndividualTable
          individuals={filteredIndividuals}
          loading={loading}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
