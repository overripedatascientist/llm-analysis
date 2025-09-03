import type { ClientConfig } from '../../../config/clients';

export const formatCategory = (category: string) => {
  if (!category) return '';
  return category
    .split(' ')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ''))
    .join(' ');
};

export const providerColor = (provider: string) => {
  // Map providers to Luminr brand palette (centralized in tailwind.config + theme.ts)
  const map: Record<string, string> = {
    OpenAI: 'bg-brand-light-purple text-white ring-brand-light-purple',
    'OpenAI (GPT-4o)': 'bg-brand-light-purple text-white ring-brand-light-purple',
    Anthropic: 'bg-brand-orange text-white ring-brand-orange',
    Google: 'bg-brand-purple text-white ring-brand-purple',
    Gemini: 'bg-brand-purple text-white ring-brand-purple',
    'Google Gemini': 'bg-brand-purple text-white ring-brand-purple',
    Microsoft: 'bg-brand-red text-white ring-brand-red',
    Perplexity: 'bg-brand-dark-purple text-white ring-brand-dark-purple',
    Meta: 'bg-brand-red text-white ring-brand-red',
    Cohere: 'bg-brand-light-purple text-white ring-brand-light-purple',
    Mistral: 'bg-brand-orange text-white ring-brand-orange'
  };
  return map[provider] || 'bg-brand-gray-light text-brand-dark-purple ring-brand-gray-light';
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
