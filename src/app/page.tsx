'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CompanyTable from '@/components/CompanyTable';
import SearchBar from '@/components/SearchBar';
import ExportButton from '@/components/ExportButton';
import DashboardStats from '@/components/DashboardStats';
import Toast from '@/components/Toast';
import ThemeToggle from '@/components/ThemeToggle';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  category?: string;
  website?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  twitter?: string;
  instagram?: string;
  booth?: string;
  hall?: string;
}

export default function Home() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [hallFilter, setHallFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const itemsPerPage = 20;

  const categories = ['all', 'cybersecurity', 'ai', 'fintech', 'cloud', 'infrastructure', 'consulting', 'healthcare', 'education', 'retail', 'other'];
  const halls = ['all', 'H1', 'H2', 'H3', 'H4', 'H5', 'H1A'];

  useEffect(() => {
    fetchCompanies();
  }, [currentPage, categoryFilter, hallFilter]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
      setCurrentPage(1);
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchQuery, companies]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const categoryParam = categoryFilter !== 'all' ? `&category=${categoryFilter}` : '';
      const hallParam = hallFilter !== 'all' ? `&hall=${hallFilter}` : '';
      const response = await fetch(`/api/companies?page=${currentPage}&limit=${itemsPerPage}${categoryParam}${hallParam}`);
      const data = await response.json();
      setCompanies(data.companies);
      setTotalPages(data.pagination.totalPages);
      setTotal(data.pagination.total);
    } catch (error) {
      console.error('Error fetching companies:', error);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + F to focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement;
        if (searchInput) searchInput.focus();
      }
      
      // Arrow keys for pagination
      if (e.key === 'ArrowLeft' && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
      if (e.key === 'ArrowRight' && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      }
      
      // Escape to clear filters
      if (e.key === 'Escape') {
        setSearchQuery('');
        setCategoryFilter('all');
        setHallFilter('all');
        setCurrentPage(1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, totalPages]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                LEAP 2026 Directory
              </h1>
              <p className="text-blue-100 text-lg">
                Browse all 1,475 companies from LEAP 2026 exhibition
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <Link
                href="/individuals"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-white font-medium transition-colors"
              >
                Individuals
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>

        <DashboardStats />

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between sticky top-0 z-10 bg-white dark:bg-gray-800 py-4 border-b border-gray-200 dark:border-gray-700 shadow-sm backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <div className="w-full sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Categories</option>
                <option value="cybersecurity">Cybersecurity</option>
                <option value="ai">AI</option>
                <option value="fintech">Fintech</option>
                <option value="cloud">Cloud</option>
                <option value="infrastructure">Infrastructure</option>
                <option value="consulting">Consulting</option>
                <option value="healthcare">Healthcare</option>
                <option value="education">Education</option>
                <option value="retail">Retail</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={hallFilter}
                onChange={(e) => {
                  setHallFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="all">All Halls</option>
                <option value="H1">H1</option>
                <option value="H2">H2</option>
                <option value="H3">H3</option>
                <option value="H4">H4</option>
                <option value="H5">H5</option>
                <option value="H1A">H1A</option>
              </select>
            </div>
            <div className="w-full sm:w-96">
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {selectedIds.size > 0 && (
              <button
                onClick={() => {
                  const ids = Array.from(selectedIds).join(',');
                  window.open(`/api/export/csv?ids=${ids}`, '_blank');
                  setToast({ message: `Exported ${selectedIds.size} companies`, type: 'success' });
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
              >
                Export Selected ({selectedIds.size})
              </button>
            )}
            <ExportButton format="csv" label="Export All CSV" onExport={() => setToast({ message: 'Exported all companies to CSV', type: 'success' })} />
            <ExportButton format="excel" label="Export All Excel" onExport={() => setToast({ message: 'Exported all companies to Excel', type: 'success' })} />
            <ExportButton format="json" label="Export All JSON" onExport={() => setToast({ message: 'Exported all companies to JSON', type: 'success' })} />
            {categoryFilter !== 'all' && (
              <button
                onClick={() => {
                  window.open(`/api/export/csv?category=${categoryFilter}`, '_blank');
                  setToast({ message: `Exported ${categoryFilter} companies`, type: 'success' });
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900 hover:bg-purple-200 dark:hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Export {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
              </button>
            )}
            {hallFilter !== 'all' && (
              <button
                onClick={() => {
                  window.open(`/api/export/csv?hall=${hallFilter}`, '_blank');
                  setToast({ message: `Exported ${hallFilter} companies`, type: 'success' });
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Export {hallFilter}
              </button>
            )}
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          {!searchQuery ? (
            <span>
              Showing {companies.length} of {total} companies (Page {currentPage} of {totalPages})
            </span>
          ) : (
            <span>
              Found {filteredCompanies.length} companies matching "{searchQuery}"
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-gray-500 dark:text-gray-400">Loading companies...</div>
          </div>
        ) : searchQuery && filteredCompanies.length === 0 ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="text-gray-500 dark:text-gray-400">No companies found</div>
          </div>
        ) : (
          <CompanyTable 
            companies={searchQuery ? filteredCompanies : companies} 
            loading={loading}
            selectedIds={selectedIds}
            onSelectionChange={setSelectedIds}
          />
        )}
        
        {!searchQuery && totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between animate-fade-in">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        )}
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
