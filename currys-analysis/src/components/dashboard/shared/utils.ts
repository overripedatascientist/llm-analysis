import type { ClientConfig } from '../../../config/clients';

export const formatCategory = (category: string) => {
  if (!category) return '';
  return category
    .split(' ')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ''))
    .join(' ');
};

export const providerColor = (provider: string) => {
  // Case-insensitive mapping to Luminr brand palette (centralized in tailwind.config + theme.ts)
  const p = (provider || '').toLowerCase();
  const map: Record<string, string> = {
    openai: 'bg-brand-light-purple text-white ring-brand-light-purple',
    'openai (gpt-4o)': 'bg-brand-light-purple text-white ring-brand-light-purple',
    anthropic: 'bg-brand-orange text-white ring-brand-orange',
    google: 'bg-brand-purple text-white ring-brand-purple',
    'google ai overview': 'bg-brand-red text-white ring-brand-red',
    'ai overview': 'bg-brand-red text-white ring-brand-red',
    gemini: 'bg-brand-gray-light text-brand-dark-purple ring-brand-gray-light',
    'google gemini': 'bg-brand-gray-light text-brand-dark-purple ring-brand-gray-light',
    microsoft: 'bg-brand-red text-white ring-brand-red',
    perplexity: 'bg-brand-dark-purple text-white ring-brand-dark-purple',
    meta: 'bg-brand-red text-white ring-brand-red',
    cohere: 'bg-brand-light-purple text-white ring-brand-light-purple',
    mistral: 'bg-brand-orange text-white ring-brand-orange'
  };
  return map[p] || 'bg-brand-gray-light text-brand-dark-purple ring-brand-gray-light';
};

export const rankBadge = (position: number) => {
  // Unified ranks to brand colors
  if (position === 1) return 'bg-brand-orange text-white ring-brand-orange';
  if (position === 2) return 'bg-brand-purple text-white ring-brand-purple';
  if (position <= 5) return 'bg-brand-light-purple text-white ring-brand-light-purple';
  return 'bg-brand-gray-light text-brand-dark-purple ring-brand-gray-light';
};

export const getBarColor = (entry: { brand: string }, config: ClientConfig) => {
  const isClient = (config.brandKeywords || []).some((keyword) =>
    (entry.brand || '').toLowerCase().includes(keyword.toLowerCase())
  );
  return isClient ? config.primaryColor : config.secondaryColor;
};
