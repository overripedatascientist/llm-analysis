import React from 'react';
import Treemap from '../charts/Treemap';
import type { ProcessedData } from '../types/analysis';
import type { ClientConfig } from '../../../config/clients';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { getBarColor } from '../shared/utils';

type ProviderLegendItem = { name: string; color: string };

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow">
        <p className="font-bold">{payload[0].payload.brand}</p>
        <p>Mentions: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export default function OverviewTab({
  data,
  config,
  treemapOption,
  providerLegend
}: {
  data: ProcessedData;
  config: ClientConfig;
  treemapOption: any;
  providerLegend: ProviderLegendItem[];
}) {
  return (
    <div>
      <div className="mb-8">
        <div className="rounded-xl border border-gray-200/80 shadow-sm bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="px-4 pt-4">
            <h2 className="text-xl font-bold">Top 15 Most Mentioned Brands</h2>
            <p className="mt-1 text-gray-600">
              Comparison of how often {config.displayName} is mentioned relative to competitors across all queries.
            </p>
          </div>
          <div className="h-[34rem] md:h-[42rem] px-2 md:px-4">
            <Treemap option={treemapOption} />
          </div>
          <div className="px-4 pb-4 mt-2 flex flex-wrap gap-4">
            {providerLegend.map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: p.color }}></span>
                <span className="text-sm text-gray-700">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="rounded-xl border border-gray-200/80 shadow-sm bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4">
            <h3 className="font-bold mb-2">{config.displayName} Presence in Results</h3>
            <p>
              {config.displayName} appears in {data.responsesWithClient} of {data.totalResponses} LLM responses (
              {data.totalResponses > 0 ? ((data.responsesWithClient / data.totalResponses) * 100).toFixed(1) : '0.0'}%).
            </p>
            {data.avgPosition > 0 && (
              <>
                <p>
                  On average, {config.displayName} appears {data.avgPosition.toFixed(2)} in the list of mentioned
                  companies.
                </p>
                <p>
                  This positions {config.displayName} in the top {(data.avgNormalizedPosition * 100).toFixed(2)}% of
                  mentioned brands.
                </p>
              </>
            )}
          </div>
          <div className="rounded-xl border border-gray-200/80 shadow-sm bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-4">
            <h3 className="font-bold mb-2">Top Competitors</h3>
            <p>Based on co-occurrence with {config.displayName} in LLM responses:</p>
            <ol className="list-decimal pl-5">
              {data.topCompetitors.slice(0, 5).map((comp, idx) => (
                <li key={idx}>
                  {comp.brand} ({comp.count} co-occurrences)
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {data.topCompetitors.length > 0 && (
        <div className="mb-8">
          <div className="rounded-xl border border-gray-200/80 shadow-sm bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="px-4 pt-4">
              <h2 className="text-xl font-bold">Top 10 Competitors by Co-occurrence</h2>
              <p className="mt-1 text-gray-600">
                Companies that appear most frequently in the same LLM responses as {config.displayName}
              </p>
            </div>
            <div className="h-80 px-2 md:px-4 pb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topCompetitors} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="brand" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" name="Co-occurrences" fill={config.secondaryColor}>
                    {data.topCompetitors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry, config)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
