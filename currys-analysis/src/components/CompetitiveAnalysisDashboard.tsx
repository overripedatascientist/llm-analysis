import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { ClientConfig } from '../config/clients';
import { useClientData } from './dashboard/hooks/useClientData';
import { useProcessedData } from './dashboard/hooks/useProcessedData';
import OverviewTab from './dashboard/tabs/OverviewTab';
import CategoryTab from './dashboard/tabs/CategoryTab';
import ProvidersTab from './dashboard/tabs/ProvidersTab';
import PositioningTab from './dashboard/tabs/PositioningTab';
import ArchiveTab from './dashboard/tabs/ArchiveTab';

interface Props {
  config: ClientConfig;
}

const CompetitiveAnalysisDashboard: React.FC<Props> = ({ config }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const { rawData, loading, error } = useClientData(config);
  const { data, treemapOption, providerLegend, categoryPolarOption } = useProcessedData(
    rawData,
    config.brandKeywords
  );

  if (loading) {
    return (
      <div className="p-4">
        <div className="bg-white/60 backdrop-blur ring-1 ring-inset ring-gray-200 px-4 py-2">
          <nav className="text-sm text-left">
            <Link to="/" className="text-blue-700 hover:text-blue-900">
              ← Back to Dashboard Selection
            </Link>
          </nav>
        </div>
        <div className="max-w-6xl mx-auto mt-8">Loading analysis data for {config.displayName}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-white/60 backdrop-blur ring-1 ring-inset ring-gray-200 px-4 py-2">
          <nav className="text-sm text-left">
            <Link to="/" className="text-blue-700 hover:text-blue-900">
              ← Back to Dashboard Selection
            </Link>
          </nav>
        </div>
        <div className="max-w-6xl mx-auto mt-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error loading data:</strong> {error}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-4">Error loading data. Please check the console for details.</div>;
  }

  return (
    <div>
      {/* Navigation breadcrumb */}
      <div className="bg-white/60 backdrop-blur ring-1 ring-inset ring-gray-200 px-4 py-2">
        <nav className="text-sm text-left">
          <Link to="/" className="text-blue-700 hover:text-blue-900">
            ← Back to Dashboard Selection
          </Link>
        </nav>
      </div>

      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">{config.displayName} Competitive Analysis in LLM Responses</h1>
        <p className="mb-4">
          Analysis of how {config.displayName} appears in LLM responses to industry-related queries.
        </p>

        {/* Tab Navigation */}
        <div className="mb-4">
          <div className="inline-flex flex-wrap gap-2 rounded-full p-1 bg-white/60 backdrop-blur ring-1 ring-inset ring-gray-200">
            {['overview', 'category', 'providers', 'positioning', 'archive'].map((tab) => (
              <button
                key={tab}
                className={`px-3 py-1.5 rounded-full text-sm capitalize transition-colors ${
                  activeTab === tab ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'archive' ? 'Prompt Archive' : `${tab} Analysis`}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        {activeTab === 'overview' && (
          <OverviewTab data={data} config={config} treemapOption={treemapOption} providerLegend={providerLegend} />
        )}

        {activeTab === 'category' && (
          <CategoryTab data={data} config={config} categoryPolarOption={categoryPolarOption} />
        )}

        {activeTab === 'providers' && <ProvidersTab data={data} config={config} />}

        {activeTab === 'positioning' && <PositioningTab data={data} config={config} />}

        {activeTab === 'archive' && <ArchiveTab rawData={rawData} config={config} />}

        <div className="mt-8 text-gray-600 text-sm">
          <p>
            Analysis based on {data.allMentions.length} total brand mentions across{' '}
            {Array.from(new Set(data.allMentions.map((m) => m.query))).length} unique queries.
          </p>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CompetitiveAnalysisDashboard;
