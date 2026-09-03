'use client';

import { useState, useEffect } from 'react';
import CompanyTable from '@/components/CompanyTable';
import SearchBar from '@/components/SearchBar';
import ExportButton from '@/components/ExportButton';
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
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchCompanies();
  }, [currentPage]);

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
      const response = await fetch(`/api/companies?page=${currentPage}&limit=${itemsPerPage}`);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            LEAP 2026 Cybersecurity Directory
          </h1>
          <p className="text-gray-600">
            Browse cybersecurity companies from LEAP 2026 exhibition
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-96">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="flex gap-2">
            <ExportButton format="csv" label="Export CSV" />
            <ExportButton format="excel" label="Export Excel" />
            <ExportButton format="json" label="Export JSON" />
          </div>
        </div>

        <div className="mb-4 text-sm text-gray-600">
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
          <div className="text-center py-12">
            <div className="text-gray-500">Loading companies...</div>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">No companies found</div>
          </div>
        ) : (
          <>
            <CompanyTable companies={searchQuery ? filteredCompanies : companies} />
            
            {!searchQuery && totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
