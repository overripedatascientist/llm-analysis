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
        {/* Enhanced, minimal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Presence summary: ultra-clear KPI layout */}
          <div className="rounded-2xl border border-gray-200/80 shadow-sm bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-5">
            {(() => {
              const total = data.totalResponses || 0;
              const withBrand = data.responsesWithClient || 0;
              const missing = Math.max(0, total - withBrand);
              const rate = total ? withBrand / total : 0;
              const pctText = (rate * 100).toFixed(1);
              const pctWidth = `${(rate * 100).toFixed(1)}%`;
              const base = config.primaryColor || '#2563eb';
              const avgPos = data.avgPosition > 0 ? data.avgPosition.toFixed(2) : '—';
              const percentile = (data.avgNormalizedPosition * 100).toFixed(1);
              return (
                <div>
                  <div className="flex items-end justify-between gap-4">
                    <h3 className="font-semibold text-gray-900">{config.displayName} presence overview</h3>
                    <div className="text-xs text-gray-500">Based on {total} responses</div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left: headline % */}
                    <div className="md:col-span-4">
                      <div className="text-5xl font-semibold tabular-nums">{pctText}%</div>
                      <div className="text-sm text-gray-500">presence rate</div>
                    </div>

                    {/* Right: 3 concise KPI tiles */}
                    <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl border border-gray-100 bg-white/60 p-3">
                        <div className="text-xs uppercase tracking-wide text-gray-500">Coverage</div>
                        <div className="mt-1 text-lg font-semibold">
                          <span className="tabular-nums">{withBrand}</span>
                          <span className="text-gray-500"> / </span>
                          <span className="tabular-nums">{total}</span>
                        </div>
                        <div className="text-xs text-gray-500">responses include {config.displayName}</div>
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-white/60 p-3">
                        <div className="text-xs uppercase tracking-wide text-gray-500">Avg position</div>
                        <div className="mt-1">
                          <div className="text-2xl font-semibold tabular-nums">{avgPos}</div>
                          <div className="text-xs text-gray-500" title="1 = first brand mentioned">1 = best</div>
                        </div>
                      </div>
                      <div className="rounded-xl border border-gray-100 bg-white/60 p-3">
                        <div className="text-xs uppercase tracking-wide text-gray-500">Percentile</div>
                        <div className="mt-1">
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium"
                            style={{ backgroundColor: base, color: 'white', opacity: 0.9 }}
                          >
                            Top {percentile}%
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">relative to other mentioned brands</div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom: progress bar with explicit legend and formula */}
                  <div className="mt-5">
                    <div className="h-2 w-full rounded-full bg-gray-100 relative overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: pctWidth, backgroundColor: base, opacity: 0.3 }}
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-4">
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: base }} />
                          Appears {withBrand}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                          Missing {missing}
                        </span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Presence rate = responses including {config.displayName} / total responses
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Competitors card with subtle bars */}
          <div className="rounded-2xl border border-gray-200/80 shadow-sm bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Top competitors</h3>
            <p className="text-gray-700 mb-3">
              Most frequent co-occurrences with {config.displayName}:
            </p>

            <div className="space-y-2">
              {data.topCompetitors.slice(0, 5).map((comp, idx) => {
                const max = Math.max(...data.topCompetitors.slice(0, 5).map((c) => c.count)) || 1;
                const pct = Math.round((comp.count / max) * 100);
                const base = config.primaryColor || '#2563eb';
                return (
                  <div key={idx} className="relative rounded-lg border border-gray-100 bg-white/60 px-3 py-2.5">
                    <div
                      className="absolute inset-y-0 left-0 rounded-lg"
                      style={{ width: `${pct}%`, backgroundColor: `${base}14` }}
                    />
                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500 text-xs w-5">{idx + 1}.</span>
                        <span className="font-medium text-gray-900">{comp.brand}</span>
                      </div>
                      <span className="text-sm tabular-nums text-gray-800">
                        {comp.count} <span className="text-gray-500">co-occurrences</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
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
