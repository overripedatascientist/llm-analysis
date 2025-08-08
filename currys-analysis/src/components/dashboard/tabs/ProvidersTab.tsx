import React from 'react';
import type { ProcessedData, BrandCount } from '../types/analysis';
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

export default function ProvidersTab({
  data,
  config
}: {
  data: ProcessedData;
  config: ClientConfig;
}) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Top Brands by Provider</h2>
        <p className="mb-4 text-gray-600">
          How different LLM providers represent {config.displayName} and competitors.
        </p>

        {Object.entries(data.brandsByProvider).map(([provider, brands]) => (
          <div key={provider} className="mb-8">
            <div className="rounded-xl border border-gray-200/80 shadow-sm bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
              <div className="px-4 pt-4">
                <h3 className="text-lg font-semibold">{provider}</h3>
              </div>
              <div className="h-80 px-2 md:px-4 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={brands as BrandCount[]} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="brand" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="count" name="Mentions" fill={config.secondaryColor}>
                      {(brands as BrandCount[]).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getBarColor(entry, config)} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
