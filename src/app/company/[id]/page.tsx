'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, Mail, Phone } from 'lucide-react';

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
  createdAt: string;
  updatedAt: string;
}

export default function CompanyDetail() {
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchCompany(params.id as string);
    }
  }, [params.id]);

  const fetchCompany = async (id: string) => {
    try {
      const response = await fetch(`/api/companies/${id}`);
      if (response.ok) {
        const data = await response.json();
        setCompany(data);
      } else {
        console.error('Company not found');
      }
    } catch (error) {
      console.error('Error fetching company:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading company details...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Company not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Directory
        </button>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {company.name}
              </h1>
              {company.nameAr && (
                <p className="text-xl text-gray-600">{company.nameAr}</p>
              )}
            </div>

            {company.website && (
              <div className="mb-6">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-600 hover:text-blue-900"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  {company.website}
                </a>
              </div>
            )}

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Description
              </h2>
              <p className="text-gray-700 mb-3">{company.description}</p>
              {company.descriptionAr && (
                <p className="text-gray-600">{company.descriptionAr}</p>
              )}
            </div>

            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Information
              </h2>
              <div className="space-y-3">
                {company.email && (
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-gray-400 mr-3" />
                    <a
                      href={`mailto:${company.email}`}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      {company.email}
                    </a>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <a
                      href={`tel:${company.phone}`}
                      className="text-gray-700 hover:text-gray-900"
                    >
                      {company.phone}
                    </a>
                  </div>
                )}
                {!company.email && !company.phone && (
                  <p className="text-gray-500">No contact information available</p>
                )}
              </div>
            </div>

            {(company.linkedin || company.twitter || company.instagram) && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Social Media
                </h2>
                <div className="space-y-2">
                  {company.linkedin && (
                    <a
                      href={company.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-900"
                    >
                      LinkedIn
                    </a>
                  )}
                  {company.twitter && (
                    <a
                      href={company.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-400 hover:text-blue-600"
                    >
                      Twitter
                    </a>
                  )}
                  {company.instagram && (
                    <a
                      href={company.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-pink-600 hover:text-pink-800"
                    >
                      Instagram
                    </a>
                  )}
                </div>
              </div>
            )}

            {(company.booth || company.hall) && (
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Exhibition Information
                </h2>
                <div className="space-y-2 text-gray-700">
                  {company.hall && <p>Hall: {company.hall}</p>}
                  {company.booth && <p>Booth: {company.booth}</p>}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p>Last updated: {new Date(company.updatedAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
