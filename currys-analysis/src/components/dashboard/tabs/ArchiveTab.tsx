import React from 'react';
import type { ClientConfig } from '../../../config/clients';
import { providerColor, formatCategory } from '../shared/utils';

export default function ArchiveTab({
  rawData,
  config
}: {
  rawData: any[] | null;
  config: ClientConfig;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold mb-2">Prompt Archive</h2>
      {rawData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rawData.map((entry, idx) => {
            const mentionsClient = (entry.companies_mentioned || []).some((c: any) =>
              (config.brandKeywords || []).some((keyword) =>
                (c.brand_name || '').toLowerCase().includes(keyword.toLowerCase())
              )
            );
            return (
              <div
                key={idx}
                className={`relative rounded-xl border ring-1 ring-inset ${
                  mentionsClient ? 'ring-amber-200' : 'ring-gray-200'
                } bg-white/70 backdrop-blur shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3
                      className="text-base font-semibold text-gray-900 leading-snug line-clamp-2"
                      title={entry.query}
                    >
                      {entry.query}
                    </h3>
                    {mentionsClient && (
                      <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200">
                        Mentions Client
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ring-1 ring-inset ${providerColor(
                        entry.result_provider
                      )}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70"></span>
                      {entry.result_provider}
                    </span>

                    {entry.query_parent_class && (
                      <span className="inline-flex px-2 py-1 rounded-full ring-1 ring-inset bg-gray-100 text-gray-700 ring-gray-200">
                        {formatCategory(entry.query_parent_class)}
                      </span>
                    )}

                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">
                      {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ''}
                    </span>
                  </div>

                  <details className="mt-1">
                    <summary className="cursor-pointer select-none text-sm font-medium text-blue-700 hover:text-blue-900">
                      View Response
                    </summary>
                    <pre className="mt-2 p-3 bg-slate-50 rounded-lg border text-xs text-gray-800 whitespace-pre-wrap max-h-64 overflow-auto">
                      {entry.response}
                    </pre>
                  </details>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border bg-white/70 p-4">Loading prompts...</div>
      )}
    </div>
  );
}
