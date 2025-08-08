import React from 'react';
import type { ProcessedData } from '../types/analysis';
import type { ClientConfig } from '../../../config/clients';
import CategoryPolar from '../charts/CategoryPolar';

export default function CategoryTab({
  data,
  config,
  categoryPolarOption
}: {
  data: ProcessedData;
  config: ClientConfig;
  categoryPolarOption: any;
}) {
  return (
    <div>
      <div className="mb-8">
        <div className="rounded-xl border border-gray-200/80 shadow-sm bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="px-4 pt-4">
            <h2 className="text-xl font-bold">Top Brands by Category</h2>
            <p className="mt-1 text-gray-600">
              Comparison of {config.displayName} versus competitors across different product categories.
            </p>
          </div>
          <div className="h-[34rem] md:h-[42rem] px-2 md:px-4">
            <CategoryPolar option={categoryPolarOption} />
          </div>
          <div className="px-4 pb-4">
            <p className="text-xs text-gray-500 mt-2">
              Bars represent companies (top 15). Colors represent prompt categories. Stack height equals the number of
              LLM responses mentioning that company within each category.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
