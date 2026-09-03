'use client';

import { useState, useEffect } from 'react';
import CompanyTable from '@/components/CompanyTable';
import SearchBar from '@/components/SearchBar';
import ExportButton from '@/components/ExportButton';

interface Company {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
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

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = companies.filter(
        (company) =>
          company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          company.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCompanies(filtered);
    } else {
      setFilteredCompanies(companies);
    }
  }, [searchQuery, companies]);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      const data = await response.json();
      setCompanies(data.companies);
      setFilteredCompanies(data.companies);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
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
          Showing {filteredCompanies.length} of {companies.length} companies
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
          <CompanyTable companies={filteredCompanies} />
        )}
      </div>
    </div>
  );
}
