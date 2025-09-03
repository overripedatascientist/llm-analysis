import { useMemo } from 'react';
import type { ProcessedData, BrandCount } from '../types/analysis';
import { formatCategory } from '../shared/utils';
import { brand as themeBrand, hexToRgba } from '../../../config/theme';

export function useProcessedData(rawData: any[] | null, brandKeywords: string[]) {
  const data: ProcessedData | null = useMemo(() => {
    if (!rawData) return null;

    const allMentions: any[] = [];

    rawData.forEach((item) => {
      (item.companies_mentioned || []).forEach((company: any) => {
        const idx =
          (item.companies_mentioned || []).findIndex((c: any) => c.brand_name === company.brand_name) + 1;
        const total = (item.companies_mentioned || []).length;
        allMentions.push({
          brand_name: company.brand_name,
          query: item.query,
          category: item.query_parent_class,
          provider: item.result_provider,
          snippet: company.text_snippet,
          position: idx,
          total_companies: total,
          normalized_position: total > 0 ? idx / total : 0
        });
      });
    });

    const brandCounts: Record<string, number> = {};
    allMentions.forEach((mention) => {
      const name = mention.brand_name || 'Unknown';
      brandCounts[name] = (brandCounts[name] || 0) + 1;
    });

    const topBrands: BrandCount[] = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([brand, count]) => ({ brand, count }));

    const categories = Array.from(new Set(allMentions.map((m) => m.category))).filter(Boolean);
    const brandsByCategory: Record<string, BrandCount[]> = {};
    categories.forEach((category) => {
      const counts: Record<string, number> = {};
      allMentions
        .filter((m) => m.category === category)
        .forEach((mention) => {
          const name = mention.brand_name || 'Unknown';
          counts[name] = (counts[name] || 0) + 1;
        });
      brandsByCategory[category] = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([brand, count]) => ({ brand, count }));
    });

    const providers = Array.from(new Set(allMentions.map((m) => m.provider))).filter(Boolean);
    const brandsByProvider: Record<string, BrandCount[]> = {};
    providers.forEach((provider) => {
      const counts: Record<string, number> = {};
      allMentions
        .filter((m) => m.provider === provider)
        .forEach((mention) => {
          const name = mention.brand_name || 'Unknown';
          counts[name] = (counts[name] || 0) + 1;
        });
      brandsByProvider[provider] = Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([brand, count]) => ({ brand, count }));
    });

    const clientPositions = allMentions
      .filter((m) => (brandKeywords || []).some((k) => (m.brand_name || '').toLowerCase().includes(k.toLowerCase())))
      .map((m) => ({
        provider: m.provider,
        category: m.category,
        query: m.query,
        position: m.position,
        total_companies: m.total_companies,
        normalized_position: m.normalized_position
      }));

    const avgPosition =
      clientPositions.length > 0
        ? clientPositions.reduce((sum, pos) => sum + pos.position, 0) / clientPositions.length
        : 0;

    const avgNormalizedPosition =
      clientPositions.length > 0
        ? clientPositions.reduce((sum, pos) => sum + pos.normalized_position, 0) / clientPositions.length
        : 0;

    const positionByProvider: Record<string, number[]> = {};
    clientPositions.forEach((pos) => {
      if (!positionByProvider[pos.provider]) positionByProvider[pos.provider] = [];
      positionByProvider[pos.provider].push(pos.normalized_position);
    });

    const avgPositionByProvider = Object.entries(positionByProvider).map(([provider, positions]) => ({
      provider,
      avgPosition: positions.reduce((s, v) => s + v, 0) / positions.length
    }));

    const competitors: Record<string, number> = {};
    rawData.forEach((item) => {
      const hasClient = (item.companies_mentioned || []).some((comp: any) =>
        (brandKeywords || []).some((k) => (comp.brand_name || '').toLowerCase().includes(k.toLowerCase()))
      );
      if (hasClient) {
        (item.companies_mentioned || []).forEach((comp: any) => {
          const isClient = (brandKeywords || []).some((k) => (comp.brand_name || '').toLowerCase().includes(k.toLowerCase()));
          if (!isClient) {
            const name = comp.brand_name || 'Unknown';
            competitors[name] = (competitors[name] || 0) + 1;
          }
        });
      }
    });

    const topCompetitors = Object.entries(competitors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([brand, count]) => ({ brand, count }));

    // New: response-level presence metrics
    const totalResponses = rawData.length;
    const responsesWithClient = rawData.reduce((acc, item) => {
      const hasClient = (item.companies_mentioned || []).some((comp: any) =>
        (brandKeywords || []).some((k) => (comp.brand_name || '').toLowerCase().includes(k.toLowerCase()))
      );
      return acc + (hasClient ? 1 : 0);
    }, 0);

    return {
      topBrands,
      brandsByCategory,
      brandsByProvider,
      clientPositions,
      avgPosition,
      avgNormalizedPosition,
      avgPositionByProvider,
      topCompetitors,
      allMentions,
      totalResponses,
      responsesWithClient
    };
  }, [rawData, brandKeywords]);

  const { treemapOption, providerLegend } = useMemo(() => {
    if (!data) return { treemapOption: {}, providerLegend: [] as { name: string; color: string }[] };

    const MAX_PROVIDERS = 4;
    const MAX_BRANDS_PER_PROVIDER = 12;
    const keywordsLower = (brandKeywords || []).map((k) => k.toLowerCase());

    const isClientBrand = (name: string) => keywordsLower.some((k) => (name || '').toLowerCase().includes(k));

    const all = data.allMentions || [];
    const counts: Record<string, Record<string, number>> = {};
    all.forEach((m: any) => {
      const provider = (m.provider || 'Unknown') as string;
      const brand = (m.brand_name || 'Unknown') as string;
      if (!counts[provider]) counts[provider] = {};
      counts[provider][brand] = (counts[provider][brand] || 0) + 1;
    });

    const providerTotals = Object.entries(counts).map(([prov, brands]) => {
      const total = Object.values(brands).reduce((s, v) => s + v, 0);
      return [prov, total] as [string, number];
    });

    const topProviders = providerTotals.sort((a, b) => b[1] - a[1]).slice(0, MAX_PROVIDERS).map(([prov]) => prov);

    // Luminr brand palette for providers
    const defaultPalette = [
      themeBrand.purple,
      themeBrand.lightPurple,
      themeBrand.orange,
      themeBrand.red,
      themeBrand.darkPurple,
      themeBrand.lightPurple,
      themeBrand.orange,
      themeBrand.purple,
      themeBrand.red,
      themeBrand.darkPurple
    ];
    // Explicit color mapping (case-insensitive) to ensure distinct provider colors
    const explicitLower: Record<string, string> = {
      openai: themeBrand.lightPurple,
      'openai (gpt-4o)': themeBrand.lightPurple,
      anthropic: themeBrand.orange,
      google: themeBrand.purple,
      gemini: themeBrand.lightGrey, // make Gemini clearly distinct from OpenAI purple
      'google gemini': themeBrand.lightGrey,
      microsoft: themeBrand.red,
      perplexity: themeBrand.darkPurple,
      meta: themeBrand.red,
      cohere: themeBrand.lightPurple,
      mistral: themeBrand.orange,
      unknown: themeBrand.lightGrey
    };

    const colorMap: Record<string, string> = {};
    topProviders.forEach((name, idx) => {
      const key = (name || '').toLowerCase();
      colorMap[name] = explicitLower[key] || defaultPalette[idx % defaultPalette.length];
    });

    // Audience weights (MAU) by provider for treemap sizing (case-insensitive)
    const AUDIENCE_MAU: Record<string, number> = {
      openai: 1.4e9,
      'openai (gpt-4o)': 1.4e9,
      gpt4o: 1.4e9,
      'gpt-4o': 1.4e9,
      anthropic: 19e6,
      claude: 19e6,
      'claude 3': 19e6,
      gemini: 1.05e9,
      'google gemini': 1.05e9,
      'google ai overview': 5e8,
      'ai overview': 5e8,
      google: 5e8
    };

    const getProviderAudience = (name: string | undefined | null): number | undefined => {
      const n = (name || '').toString().trim().toLowerCase();
      if (!n) return undefined;
      if (AUDIENCE_MAU[n] != null) return AUDIENCE_MAU[n];
      // heuristic mappings
      if (n.includes('openai') || n.startsWith('gpt')) return AUDIENCE_MAU['openai'];
      if (n.includes('anthropic') || n.includes('claude')) return AUDIENCE_MAU['anthropic'];
      if (n.includes('gemini')) return AUDIENCE_MAU['gemini'];
      if (n.includes('ai overview')) return AUDIENCE_MAU['google ai overview'];
      if (n === 'google') return AUDIENCE_MAU['google'];
      return undefined;
    };

    const formatAudience = (n?: number) => {
      if (!n || n < 1) return '';
      if (n >= 1e9) return `${(n / 1e9).toFixed(2).replace(/\.0+$/, '')}B MAU`;
      if (n >= 1e6) return `${Math.round(n / 1e6)}M MAU`;
      return `${n.toLocaleString()} MAU`;
    };

    // Shorten long brand names to avoid squashed text in small tiles
    const condenseName = (name: string) => {
      const cleaned = (name || '').replace(/\s+/g, ' ').trim();
      return cleaned.length > 16 ? cleaned.slice(0, 16) + '…' : cleaned;
    };

    const dataNodes = topProviders.map((provider) => {
      const brandsMap = counts[provider] || {};
      const sorted = Object.entries(brandsMap).sort((a, b) => b[1] - a[1]);
      const limited = sorted.slice(0, MAX_BRANDS_PER_PROVIDER);

      const providerTotalFull = Object.values(brandsMap).reduce((s, v) => s + v, 0);

      const children = limited.map(([brandName, count]) => {
        const client = isClientBrand(brandName);
        const aud = getProviderAudience(provider);
        const audWeight = aud ? Math.log10(aud) ** 3 : 1;
        return {
          name: brandName,
          value: count * audWeight,
          rawCount: count,
          mau: aud,
          mauWeight: audWeight,
          mauLabel: formatAudience(aud),
          provider,
          isClient: client,
          providerTotal: providerTotalFull,
            itemStyle: {
              color: colorMap[provider],
              borderColor: client ? themeBrand.darkPurple : '#ffffff',
              borderWidth: client ? 2 : 1,
              shadowBlur: client ? 12 : 0,
              shadowColor: client ? 'rgba(0,0,0,0.35)' : 'transparent'
            },
            label: client
              ? {
                  backgroundColor: hexToRgba(themeBrand.darkPurple, 0.25),
                  fontWeight: 'bold',
                  padding: [2, 4],
                  borderRadius: 3,
                  color: ((provider || '').toLowerCase().includes('gemini')) ? '#000' : '#fff'
                }
              : { color: ((provider || '').toLowerCase().includes('gemini')) ? '#000' : '#fff' }
        };
      });

      const total = children.reduce((sum, c: any) => sum + (c.value as number), 0);
      const totalRaw = children.reduce((sum, c: any) => sum + (c.rawCount as number), 0);
      return {
        name: provider,
        value: total,
        totalRaw,
        children,
        itemStyle: { color: colorMap[provider], borderColor: '#ffffff', borderWidth: 1 },
        label: { color: ((provider || '').toLowerCase().includes('gemini')) ? '#000' : '#fff' }
      };
    });

    const option = {
      tooltip: {
        confine: true,
        formatter: (info: any) => {
          const node = info?.data || {};
          if (node.children) {
            const totalRaw = typeof node.totalRaw === 'number' ? node.totalRaw : node.value;
            return `${node.name}<br/>Total mentions (top ${MAX_BRANDS_PER_PROVIDER}): ${totalRaw}`;
          } else {
            const prov = node.provider || (info?.treePathInfo && info.treePathInfo[1] && info.treePathInfo[1].name) || '';
            const raw = typeof node.rawCount === 'number' ? node.rawCount : node.value;
            const share = node.providerTotal ? ((raw / node.providerTotal) * 100).toFixed(1) + '%' : '';
            const highlighted = node.isClient
              ? '<span style="padding:2px 6px;border-radius:4px;background:#281535;color:#fff;margin-right:6px;">Client</span>'
              : '';
            const mau = node.mauLabel ? ` | Audience: ${node.mauLabel}` : '';
            return `${highlighted}<b>${node.name}</b><br/>Provider: ${prov}<br/>Mentions: ${raw}${share ? ` (${share} of ${prov})` : ''}${mau}</span>`;
          }
        }
      },
      series: [
        {
          type: 'treemap',
          left: '3%',
          right: '3%',
          top: 0,
          bottom: 48,
          roam: true,
          sort: 'desc',
          nodeClick: 'zoomToNode',
          breadcrumb: {
            show: true,
            left: 'center',
            bottom: 8,
            height: 22,
            itemStyle: { color: '#4b5563', textStyle: { color: '#fff' } }
          },
          labelLayout: (params: any) => {
            const w = params.rect.width;
            const h = params.rect.height;
            const isClient = !!params?.data?.isClient;
            const isProvider = !!params?.data?.children;
            // Hide labels earlier on tiny tiles to avoid squashed text
            return { hide: (w < 110 || h < 46) && !isClient && !isProvider };
          },
          label: {
            show: true,
            formatter: (p: any) => {
              const d = p?.data || {};
              if (d && d.children) {
                const totalRaw = typeof d.totalRaw === 'number' ? d.totalRaw : p.value;
                return `${p.name}\n${totalRaw}`;
              }
              const mentions = typeof d.rawCount === 'number' ? d.rawCount : p.value;
              return `${condenseName(p.name)}\n${mentions}`;
            },
            color: '#fff',
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 18,
            backgroundColor: 'transparent',
            overflow: 'truncate'
          },
          upperLabel: { show: false },
          emphasis: {
            label: { show: true },
            itemStyle: { borderColor: themeBrand.darkPurple, borderWidth: 2, shadowBlur: 16, shadowColor: 'rgba(0,0,0,0.45)' }
          },
          itemStyle: { borderColor: '#ffffff', borderWidth: 1, gapWidth: 1 },
          levels: [
            { upperLabel: { show: false }, itemStyle: { borderColor: '#ffffff', borderWidth: 1, gapWidth: 1 } },
            { itemStyle: { borderColor: '#ffffff', borderWidth: 0.5, gapWidth: 0.5 } }
          ],
          visibleMin: 10,
          childrenVisibleMin: 10,
          data: dataNodes,
          animationDurationUpdate: 500
        }
      ]
    };

    const legend = topProviders.map((name) => ({ name, color: colorMap[name] }));

    return { treemapOption: option, providerLegend: legend };
  }, [data, brandKeywords]);

  const categoryPolarOption = useMemo(() => {
    if (!data) return {};

    const brandsTop = (data.topBrands || []).map((b) => b.brand);

    const categoryTotals: [string, number][] = Array.from(
      new Set((data.allMentions || []).map((m: any) => m.category))
    )
      .filter((c): c is string => !!c)
      .map((cat) => [cat, (data.allMentions || []).filter((m: any) => m.category === cat).length]);

    const categories = categoryTotals.sort((a, b) => b[1] - a[1]).map(([c]) => c);

    const countsByCatBrand: Record<string, Record<string, number>> = {};
    categories.forEach((cat) => {
      countsByCatBrand[cat] = {};
      brandsTop.forEach((brand) => {
        countsByCatBrand[cat][brand] = 0;
      });
    });

    (data.allMentions || []).forEach((m: any) => {
      const cat = m.category as string;
      const brand = m.brand_name as string;
      if (countsByCatBrand[cat] && brandsTop.includes(brand)) {
        countsByCatBrand[cat][brand] += 1;
      }
    });

    const series = categories.map((cat) => ({
      type: 'bar',
      coordinateSystem: 'polar',
      name: formatCategory(cat),
      stack: 'mentions',
      emphasis: { focus: 'series' as const },
      data: brandsTop.map((brand) => countsByCatBrand[cat][brand] || 0)
    }));

    const condenseLegend = (name: string) => {
      const m = name.match(/\(([^)]+)\)/);
      if (m && m[1] && m[1].length <= 12) return m[1];
      const cleaned = name.replace(/\s+/g, ' ').trim();
      return cleaned.length > 28 ? cleaned.slice(0, 28) + '…' : cleaned;
    };

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        confine: true,
        formatter: (params: any) => {
          if (!Array.isArray(params) || params.length === 0) return '';
          const company = params[0]?.axisValue || '';
          let total = 0;
          const lines = params
            .filter((p: any) => p && p.value > 0)
            .map((p: any) => {
              total += p.value;
              return `${p.marker}${p.seriesName}: ${p.value}`;
            })
            .join('<br/>');
          return `<b>${company}</b>${lines ? `<br/>${lines}<br/><span style="color:#666">Total: ${total}</span>` : ''}`;
        }
      },
      angleAxis: {
        type: 'category',
        data: brandsTop,
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      radiusAxis: {},
      polar: {
        center: ['36%', '52%'],
        radius: '70%'
      },
      series,
      legend: {
        type: 'scroll',
        orient: 'vertical',
        left: '68%',
        top: 'middle',
        bottom: 0,
        width: '30%',
        itemWidth: 12,
        itemHeight: 10,
        icon: 'circle',
        pageIconColor: '#4b5563',
        pageTextStyle: { color: '#4b5563' },
        formatter: (name: string) => condenseLegend(name),
        tooltip: { show: true }
      }
    };

    return option;
  }, [data]);

  return { data, treemapOption, providerLegend, categoryPolarOption };
}
