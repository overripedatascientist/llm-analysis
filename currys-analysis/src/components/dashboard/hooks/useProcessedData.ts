import { useMemo } from 'react';
import type { ProcessedData, BrandCount } from '../types/analysis';
import { formatCategory } from '../shared/utils';

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

    return {
      topBrands,
      brandsByCategory,
      brandsByProvider,
      clientPositions,
      avgPosition,
      avgNormalizedPosition,
      avgPositionByProvider,
      topCompetitors,
      allMentions
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

    const defaultPalette = ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'];
    const explicitMap: Record<string, string> = {
      OpenAI: '#1f77b4',
      'OpenAI (GPT-4o)': '#1f77b4',
      Anthropic: '#ff7f0e',
      Google: '#2ca02c',
      Gemini: '#2ca02c',
      'Google Gemini': '#2ca02c',
      Microsoft: '#9467bd',
      Perplexity: '#17becf',
      Meta: '#d62728',
      Cohere: '#8c564b',
      Mistral: '#e377c2',
      Unknown: '#7f7f7f'
    };

    const colorMap: Record<string, string> = {};
    topProviders.forEach((name, idx) => {
      colorMap[name] = explicitMap[name] || defaultPalette[idx % defaultPalette.length];
    });

    const dataNodes = topProviders.map((provider) => {
      const brandsMap = counts[provider] || {};
      const sorted = Object.entries(brandsMap).sort((a, b) => b[1] - a[1]);
      const limited = sorted.slice(0, MAX_BRANDS_PER_PROVIDER);

      const providerTotalFull = Object.values(brandsMap).reduce((s, v) => s + v, 0);

      const children = limited.map(([brand, count]) => {
        const client = isClientBrand(brand);
        return {
          name: brand,
          value: count,
          provider,
          isClient: client,
          providerTotal: providerTotalFull,
          itemStyle: {
            color: colorMap[provider],
            borderColor: client ? '#111827' : '#ffffff',
            borderWidth: client ? 2 : 1,
            shadowBlur: client ? 12 : 0,
            shadowColor: client ? 'rgba(0,0,0,0.35)' : 'transparent'
          },
          label: client ? { backgroundColor: 'rgba(17,24,39,0.25)', fontWeight: 'bold', padding: [2, 4], borderRadius: 3 } : undefined
        };
      });

      const total = children.reduce((sum, c: any) => sum + (c.value as number), 0);
      return {
        name: provider,
        value: total,
        children,
        itemStyle: { color: colorMap[provider], borderColor: '#ffffff', borderWidth: 1 }
      };
    });

    const option = {
      tooltip: {
        confine: true,
        formatter: (info: any) => {
          const node = info?.data || {};
          if (node.children) {
            return `${node.name}<br/>Total mentions (top ${MAX_BRANDS_PER_PROVIDER}): ${node.value}`;
          } else {
            const prov = node.provider || (info?.treePathInfo && info.treePathInfo[1] && info.treePathInfo[1].name) || '';
            const share = node.providerTotal ? ((node.value / node.providerTotal) * 100).toFixed(1) + '%' : '';
            const highlighted = node.isClient
              ? '<span style="padding:2px 6px;border-radius:4px;background:#111827;color:#fff;margin-right:6px;">Client</span>'
              : '';
            return `${highlighted}<b>${node.name}</b><br/>Provider: ${prov}<br/>Mentions: ${node.value}${share ? ` (${share} of ${prov})` : ''}`;
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
            return { hide: (w < 80 || h < 38) && !isClient && !isProvider };
          },
          label: {
            show: true,
            formatter: (p: any) => `${p.name}\n${p.value}`,
            color: '#fff',
            fontSize: 12,
            lineHeight: 16,
            backgroundColor: 'transparent',
            overflow: 'break'
          },
          upperLabel: { show: false },
          emphasis: {
            label: { show: true },
            itemStyle: { borderColor: '#111827', borderWidth: 2, shadowBlur: 16, shadowColor: 'rgba(0,0,0,0.45)' }
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
      polar: {},
      series,
      legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 0,
        top: 'middle'
      }
    };

    return option;
  }, [data]);

  return { data, treemapOption, providerLegend, categoryPolarOption };
}
