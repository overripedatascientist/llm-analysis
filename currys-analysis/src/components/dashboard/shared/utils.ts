import type { ClientConfig } from '../../../config/clients';

export const formatCategory = (category: string) => {
  if (!category) return '';
  return category
    .split(' ')
    .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ''))
    .join(' ');
};

export const providerColor = (provider: string) => {
  const map: Record<string, string> = {
    OpenAI: 'bg-blue-100 text-blue-700 ring-blue-200',
    'OpenAI (GPT-4o)': 'bg-blue-100 text-blue-700 ring-blue-200',
    Anthropic: 'bg-amber-100 text-amber-700 ring-amber-200',
    Google: 'bg-green-100 text-green-700 ring-green-200',
    Gemini: 'bg-green-100 text-green-700 ring-green-200',
    'Google Gemini': 'bg-green-100 text-green-700 ring-green-200',
    Microsoft: 'bg-violet-100 text-violet-700 ring-violet-200',
    Perplexity: 'bg-cyan-100 text-cyan-700 ring-cyan-200',
    Meta: 'bg-rose-100 text-rose-700 ring-rose-200',
    Cohere: 'bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200',
    Mistral: 'bg-pink-100 text-pink-700 ring-pink-200'
  };
  return map[provider] || 'bg-gray-100 text-gray-700 ring-gray-200';
};

export const rankBadge = (position: number) => {
  if (position === 1) return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
  if (position === 2) return 'bg-lime-100 text-lime-700 ring-lime-200';
  if (position <= 5) return 'bg-yellow-100 text-yellow-800 ring-yellow-200';
  return 'bg-gray-100 text-gray-700 ring-gray-200';
};

export const getBarColor = (entry: { brand: string }, config: ClientConfig) => {
  const isClient = (config.brandKeywords || []).some((keyword) =>
    (entry.brand || '').toLowerCase().includes(keyword.toLowerCase())
  );
  return isClient ? config.primaryColor : config.secondaryColor;
};
