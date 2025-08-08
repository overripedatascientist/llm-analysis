export interface BrandCount {
  brand: string;
  count: number;
}

export interface CurrysPosition {
  provider: string;
  category: string;
  query: string;
  position: number;
  total_companies: number;
  normalized_position: number;
}

export interface ProviderPosition {
  provider: string;
  avgPosition: number;
}

export interface ProcessedData {
  topBrands: BrandCount[];
  brandsByCategory: Record<string, BrandCount[]>;
  brandsByProvider: Record<string, BrandCount[]>;
  clientPositions: CurrysPosition[];
  avgPosition: number;
  avgNormalizedPosition: number;
  avgPositionByProvider: ProviderPosition[];
  topCompetitors: BrandCount[];
  allMentions: any[];
}
