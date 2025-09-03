import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllClients, type ClientConfig } from '../config/clients';
import { useClientData } from './dashboard/hooks/useClientData';

const Badge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
    {children}
  </span>
);

const StatItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="inline-flex items-center gap-1.5 text-sm text-gray-500">
    <span className="text-gray-400">{icon}</span>
    <span>{text}</span>
  </div>
);

const ClientCard: React.FC<{ client: ClientConfig; onView: (id: string) => void }> = ({ client, onView }) => {
  const { rawData, loading, error } = useClientData(client);

  const stats = React.useMemo(() => {
    if (loading) return { long: 'Loading...', short: 'Loading...' };
    if (error || !Array.isArray(rawData) || rawData.length === 0) return { long: 'Analysis available', short: 'Analysis available' };

    const uniqueQueries = new Set<string>();
    const uniqueProviders = new Set<string>();

    for (const row of rawData) {
      const q = row?.query;
      const p = row?.result_provider;
      if (typeof q === 'string' && q.length > 0) uniqueQueries.add(q);
      if (typeof p === 'string' && p.length > 0) uniqueProviders.add(p);
    }

    const prompts = uniqueQueries.size;
    const platforms = uniqueProviders.size;

    if (prompts === 0) return { long: 'Analysis available', short: 'Analysis available' };

    const long = `${prompts} prompt${prompts === 1 ? '' : 's'} analysed across ${platforms} platform${platforms === 1 ? '' : 's'}`;
    const short = `${prompts} prompt${prompts === 1 ? '' : 's'} • ${platforms} platform${platforms === 1 ? '' : 's'}`;
    return { long, short };
  }, [rawData, loading, error]);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {/* Slim brand accent */}
      <div className="h-1.5 w-full" style={{ backgroundColor: client.primaryColor }} />

      {/* Content */}
      <div className="p-5">
        <div className="mb-2 flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{client.displayName}</h3>
        </div>

        {/* Badges */}
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge>{client.category}</Badge>
          <Badge>{client.market}</Badge>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm leading-6 text-gray-600">
          {client.description}
        </p>

        {/* Stats */}
        <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <StatItem
            icon={
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            text={stats.short}
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">{stats.long}</span>
          <button
            onClick={() => onView(client.id)}
            className="cursor-pointer rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors"
            style={{ backgroundColor: client.primaryColor }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = client.secondaryColor;
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.backgroundColor = client.primaryColor;
            }}
          >
            View Analysis
          </button>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const clients = getAllClients();
  const navigate = useNavigate();

  // Client passwords - in a real app, these would be stored securely
  const clientPasswords: Record<string, string> = {
    currys: 'luminr-consumer-lecky-2025',
    'boux-avenue': 'affordable-luxury-2025',
    adnoc: 'oil-and-gas-2025',
    callisto: 'publishing-2025',
    sensodyne: 'oral-care-2025',
    'cvc-capital-partners': 'private-equity-2025',
    found: 'digital-marketing-2025',
    telehouse: 'data-centers-2025',
    'digital-realty': 'data-centers-us-2025',
    toolstation: 'tools-hardware-2025',
    pwc: 'professional-services-2025',
    pwc_custom: 'professional-services-2025',
    pwc_custom_us: 'professional-services-2025',
    pwc_us: 'professional-services-2025',
    napier_uk: 'fintech-uk-2025',
    napier_us: 'fintech-us-2025',
    taggstar: 'social-proof-2025',
    oag: 'aviation-data-2025',
    secret_sales: 'fashion-outlet-2025'
  };

  const handleViewAnalysis = (clientId: string) => {
    const password = prompt(`Enter password for ${clients.find((c) => c.id === clientId)?.displayName}:`);

    if (password === clientPasswords[clientId]) {
      navigate(`/dashboard/${clientId}`);
    } else if (password !== null) {
      // User didn't cancel
      alert('Incorrect password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="py-16 text-white"
        style={{ background: 'linear-gradient(135deg, #281535 0%, #731B4F 45%, #841E5A 70%, #F5784B 100%)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-3 text-4xl font-bold">LLM Competitive Analysis Dashboard</h1>
          <p className="text-lg opacity-90">Analyze how brands appear in Large Language Model responses</p>
        </div>
      </div>

      {/* Client Selection */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="mb-3 text-3xl font-bold text-gray-800">Select a Client Dashboard</h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Choose from our available client analyses to explore how different brands perform in LLM responses across
            various queries and providers.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Dynamic Client Cards */}
          {clients.map((client) => (
            <ClientCard key={client.id} client={client} onView={handleViewAnalysis} />
          ))}

          {/* Add New Client Card */}
          <div className="relative overflow-hidden rounded-xl border border-dashed border-gray-300 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
            <div className="h-1.5 w-full bg-gray-200" />
            <div className="p-6">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-700">Add New Client</h3>
              </div>

              <div className="mb-3 flex flex-wrap gap-2">
                <Badge>Custom Setup</Badge>
                <Badge>Fast Onboarding</Badge>
              </div>

              <p className="mb-5 text-sm leading-6 text-gray-600">
                Ready to analyze your brand's presence in LLM responses? Contact us to set up your custom dashboard.
              </p>

              <div className="text-center">
                <button className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-700">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Dashboard Features</h2>
          </div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-light-purple">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Competitive Analysis</h3>
              <p className="text-gray-600">Compare your brand's visibility against top competitors across different query types.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Position Tracking</h3>
              <p className="text-gray-600">Track where your brand appears in LLM responses and identify improvement opportunities.</p>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-purple">
                <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold">Strategic Insights</h3>
              <p className="text-gray-600">Get actionable recommendations to improve your brand's AI visibility.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Luminr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
