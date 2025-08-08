import React from 'react';
import type { ProcessedData } from '../types/analysis';
import type { ClientConfig } from '../../../config/clients';
import { providerColor, rankBadge, formatCategory } from '../shared/utils';

export default function PositioningTab({
  data,
  config
}: {
  data: ProcessedData;
  config: ClientConfig;
}) {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">{config.displayName} Positioning Analysis</h2>
        <p className="mb-4 text-gray-600">Detailed analysis of {config.displayName}'s position in LLM responses.</p>

        {data.clientPositions.length > 0 ? (
          <div className="rounded-xl border border-gray-200/80 shadow-sm bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <div className="px-4 pt-4">
              <h3 className="font-semibold text-gray-900">Positioning Details</h3>
            </div>
            <div className="overflow-x-auto mt-3">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-50 to-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                  <tr className="text-left text-xs font-semibold uppercase tracking-wider text-gray-600">
                    <th className="px-4 py-3">Query</th>
                    <th className="px-4 py-3">Provider</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Position</th>
                    <th className="px-4 py-3">Total Companies</th>
                    <th className="px-4 py-3">Position %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.clientPositions.map((pos, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-slate-50/50 hover:bg-gray-50/80 transition-colors">
                      <td className="px-4 py-3 max-w-[32rem]">
                        <div className="text-gray-900 font-medium truncate" title={pos.query}>
                          {pos.query}
                        </div>
                        <div className="text-gray-500 text-xs">LLM query</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ring-1 ring-inset ${providerColor(pos.provider)}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
                          {pos.provider}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-1 rounded-full ring-1 ring-inset bg-gray-100 text-gray-700 ring-gray-200">
                          {formatCategory(pos.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full ring-1 ring-inset tabular-nums font-semibold ${rankBadge(pos.position)}`}>
                          #{pos.position}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700 tabular-nums">{pos.total_companies}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-36 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                              style={{ width: `${Math.min(100, Math.max(0, pos.normalized_position * 100))}%` }}
                            />
                          </div>
                          <span className="text-gray-700 tabular-nums">{(pos.normalized_position * 100).toFixed(1)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p>No positioning data available for {config.displayName}.</p>
        )}
      </div>
    </div>
  );
}
