'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ExternalLink, Mail, Phone } from 'lucide-react';

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

interface CompanyTableProps {
  companies: Company[];
}

export default function CompanyTable({ companies }: CompanyTableProps) {
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

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-48">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                Social
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-4">
                  <div className="flex flex-col">
                    <Link
                      href={`/company/${company.id}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-900 transition-colors"
                    >
                      {company.name}
                    </Link>
                    {company.nameAr && (
                      <span className="text-xs text-gray-500 mt-0.5">{company.nameAr}</span>
                    )}
                    {company.website && (
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 mt-1 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{company.website}</span>
                      </a>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900 line-clamp-2" title={company.description}>
                    {company.description}
                  </div>
                  {company.descriptionAr && (
                    <div className="text-xs text-gray-500 line-clamp-1 mt-1" title={company.descriptionAr}>
                      {company.descriptionAr}
                    </div>
                  )}
                </td>
                <td className="px-4 py-4">
                  {company.category && (
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(company.category)}`}>
                      {company.category}
                    </span>
                  )}
                  {!company.category && (
                    <span className="text-xs text-gray-400 italic">N/A</span>
                  )}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {company.email && (
                      <a
                        href={`mailto:${company.email}`}
                        className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
                        title={company.email}
                      >
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{company.email}</span>
                      </a>
                    )}
                    {company.phone && (
                      <a
                        href={`tel:${company.phone}`}
                        className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1 transition-colors"
                        title={company.phone}
                      >
                        <Phone className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{company.phone}</span>
                      </a>
                    )}
                    {!company.email && !company.phone && (
                      <span className="text-xs text-gray-400 italic">No contact info</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1 text-xs">
                    {company.linkedin && (
                      <a
                        href={company.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        LinkedIn
                      </a>
                    )}
                    {company.twitter && (
                      <a
                        href={company.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-blue-400 transition-colors"
                      >
                        Twitter
                      </a>
                    )}
                    {company.instagram && (
                      <a
                        href={company.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-pink-600 transition-colors"
                      >
                        Instagram
                      </a>
                    )}
                    {!company.linkedin && !company.twitter && !company.instagram && (
                      <span className="text-gray-400 italic">No social</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/company/${company.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-900 transition-colors"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
