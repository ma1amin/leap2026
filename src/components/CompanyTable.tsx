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
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Description
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Social
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {companies.map((company) => (
            <tr key={company.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                  <Link
                    href={`/company/${company.id}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-900"
                  >
                    {company.name}
                  </Link>
                  {company.nameAr && (
                    <span className="text-xs text-gray-500">{company.nameAr}</span>
                  )}
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {company.website}
                    </a>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-md truncate">
                  {company.description}
                </div>
                {company.descriptionAr && (
                  <div className="text-xs text-gray-500 max-w-md truncate">
                    {company.descriptionAr}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  {company.email && (
                    <a
                      href={`mailto:${company.email}`}
                      className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      {company.email}
                    </a>
                  )}
                  {company.phone && (
                    <a
                      href={`tel:${company.phone}`}
                      className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {company.phone}
                    </a>
                  )}
                  {!company.email && !company.phone && (
                    <span className="text-xs text-gray-400">No contact info</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col gap-1 text-xs">
                  {company.linkedin && (
                    <a
                      href={company.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      LinkedIn
                    </a>
                  )}
                  {company.twitter && (
                    <a
                      href={company.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-400"
                    >
                      Twitter
                    </a>
                  )}
                  {company.instagram && (
                    <a
                      href={company.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-pink-600"
                    >
                      Instagram
                    </a>
                  )}
                  {!company.linkedin && !company.twitter && !company.instagram && (
                    <span className="text-gray-400">No social</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  href={`/company/${company.id}`}
                  className="text-sm text-blue-600 hover:text-blue-900"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
