import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';
import ReactECharts from 'echarts-for-react';
import { ClientConfig } from '../config/clients';

interface BrandCount {
    brand: string;
    count: number;
}

interface CurrysPosition {
    provider: string;
    category: string;
    query: string;
    position: number;
    total_companies: number;
    normalized_position: number;
}

interface ProviderPosition {
    provider: string;
    avgPosition: number;
}

interface ProcessedData {
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

interface Props {
    config: ClientConfig;
}

const CompetitiveAnalysisDashboard: React.FC<Props> = ({ config }) => {
    const [data, setData] = useState<ProcessedData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [rawData, setRawData] = useState<any[] | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Try multiple possible paths for the data file
                const possiblePaths = [
                    config.dataFile,
                    `/data/${config.id}.json`,
                    `./data/${config.id}.json`,
                    `${process.env.PUBLIC_URL}/data/${config.id}.json`
                ];

                let jsonData = null;
                let lastError = null;

                for (const path of possiblePaths) {
                    try {
                        console.log('Trying to fetch data from:', path);
                        const response = await fetch(path);

                        if (response.ok) {
                            const contentType = response.headers.get('content-type');
                            if (contentType && contentType.includes('application/json')) {
                                jsonData = await response.json();
                                console.log('Data loaded successfully from:', path, jsonData.length, 'entries');
                                break;
                            } else {
                                console.warn('Response is not JSON:', contentType, 'from path:', path);
                            }
                        } else {
                            console.warn('HTTP error:', response.status, 'for path:', path);
                        }
                    } catch (err) {
                        lastError = err;
                        console.warn('Failed to fetch from:', path, err);
                    }
                }

                if (!jsonData) {
                    throw lastError || new Error('Could not load data from any path');
                }

                setRawData(jsonData);
                const processedData = processData(jsonData, config.brandKeywords);
                setData(processedData);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error instanceof Error ? error.message : 'Unknown error');
                setLoading(false);
            }
        };

        fetchData();
    }, [config.dataFile, config.brandKeywords, config.id]);

    const processData = (rawData: any[], keywords: string[]): ProcessedData => {
        const allMentions: any[] = [];

        rawData.forEach(item => {
            item.companies_mentioned.forEach((company: any) => {
                allMentions.push({
                    brand_name: company.brand_name,
                    query: item.query,
                    category: item.query_parent_class,
                    provider: item.result_provider,
                    snippet: company.text_snippet,
                    position: item.companies_mentioned.findIndex((c: any) => c.brand_name === company.brand_name) + 1,
                    total_companies: item.companies_mentioned.length,
                    normalized_position: (item.companies_mentioned.findIndex((c: any) => c.brand_name === company.brand_name) + 1) / item.companies_mentioned.length
                });
            });
        });

        const brandCounts: Record<string, number> = {};
        allMentions.forEach(mention => {
            brandCounts[mention.brand_name] = (brandCounts[mention.brand_name] || 0) + 1;
        });

        const topBrands: BrandCount[] = Object.entries(brandCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 20)
            .map(([brand, count]) => ({ brand, count }));

        const categories = Array.from(new Set(allMentions.map(m => m.category)));
        const brandsByCategory: Record<string, BrandCount[]> = {};

        categories.forEach(category => {
            const categoryMentions = allMentions.filter(m => m.category === category);
            const counts: Record<string, number> = {};

            categoryMentions.forEach(mention => {
                counts[mention.brand_name] = (counts[mention.brand_name] || 0) + 1;
            });

            brandsByCategory[category] = Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([brand, count]) => ({ brand, count }));
        });

        const providers = Array.from(new Set(allMentions.map(m => m.provider)));
        const brandsByProvider: Record<string, BrandCount[]> = {};

        providers.forEach(provider => {
            const providerMentions = allMentions.filter(m => m.provider === provider);
            const counts: Record<string, number> = {};

            providerMentions.forEach(mention => {
                counts[mention.brand_name] = (counts[mention.brand_name] || 0) + 1;
            });

            brandsByProvider[provider] = Object.entries(counts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([brand, count]) => ({ brand, count }));
        });

        const clientPositions = allMentions
            .filter(m => keywords.some(keyword => m.brand_name.toLowerCase().includes(keyword.toLowerCase())))
            .map(m => ({
                provider: m.provider,
                category: m.category,
                query: m.query,
                position: m.position,
                total_companies: m.total_companies,
                normalized_position: m.normalized_position
            }));

        const avgPosition = clientPositions.length > 0
            ? clientPositions.reduce((sum, pos) => sum + pos.position, 0) / clientPositions.length
            : 0;

        const avgNormalizedPosition = clientPositions.length > 0
            ? clientPositions.reduce((sum, pos) => sum + pos.normalized_position, 0) / clientPositions.length
            : 0;

        const positionByProvider: Record<string, number[]> = {};
        clientPositions.forEach(pos => {
            if (!positionByProvider[pos.provider]) {
                positionByProvider[pos.provider] = [];
            }
            positionByProvider[pos.provider].push(pos.normalized_position);
        });

        const avgPositionByProvider = Object.entries(positionByProvider).map(([provider, positions]) => ({
            provider,
            avgPosition: positions.reduce((sum, pos) => sum + pos, 0) / positions.length
        }));

        const competitors: Record<string, number> = {};
        rawData.forEach(item => {
            const hasClient = item.companies_mentioned.some((comp: any) =>
                keywords.some(keyword => comp.brand_name.toLowerCase().includes(keyword.toLowerCase()))
            );

            if (hasClient) {
                item.companies_mentioned.forEach((comp: any) => {
                    if (!keywords.some(keyword => comp.brand_name.toLowerCase().includes(keyword.toLowerCase()))) {
                        competitors[comp.brand_name] = (competitors[comp.brand_name] || 0) + 1;
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
    };

    const getBarColor = (entry: { brand: string }) => {
        return config.brandKeywords.some(keyword => entry.brand.toLowerCase().includes(keyword.toLowerCase()))
            ? config.primaryColor
            : config.secondaryColor;
    };

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

    const formatCategory = (category: string) => {
        return category
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    // Visual helpers for sleek table styling
    const providerColor = (provider: string) => {
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

    const rankBadge = (position: number) => {
        if (position === 1) return 'bg-emerald-100 text-emerald-700 ring-emerald-200';
        if (position === 2) return 'bg-lime-100 text-lime-700 ring-lime-200';
        if (position <= 5) return 'bg-yellow-100 text-yellow-800 ring-yellow-200';
        return 'bg-gray-100 text-gray-700 ring-gray-200';
    };

    // Build Treemap option grouped by provider; color denotes provider, size denotes mention count
    const { treemapOption, providerLegend } = useMemo(() => {
        const MAX_PROVIDERS = 4; // limit providers displayed for clarity
        const MAX_BRANDS_PER_PROVIDER = 12; // limit brands per provider
        const keywords = (config.brandKeywords || []).map(k => k.toLowerCase());

        const isClientBrand = (name: string) =>
            keywords.some(k => (name || '').toLowerCase().includes(k));

        const all = data?.allMentions || [];
        const counts: Record<string, Record<string, number>> = {};
        all.forEach((m: any) => {
            const provider = (m.provider || 'Unknown') as string;
            const brand = (m.brand_name || 'Unknown') as string;
            if (!counts[provider]) counts[provider] = {};
            counts[provider][brand] = (counts[provider][brand] || 0) + 1;
        });

        // Compute totals and keep top N providers
        const providerTotals = Object.entries(counts).map(([prov, brands]) => {
            const total = Object.values(brands).reduce((s, v) => s + v, 0);
            return [prov, total] as [string, number];
        });
        const topProviders = providerTotals
            .sort((a, b) => b[1] - a[1])
            .slice(0, MAX_PROVIDERS)
            .map(([prov]) => prov);

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
            const brandsMap = counts[provider];
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
                    // Give client tiles a subtle label background for emphasis
                    label: client
                        ? { backgroundColor: 'rgba(17,24,39,0.25)', fontWeight: 'bold', padding: [2, 4], borderRadius: 3 }
                        : undefined
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
                        const highlighted = node.isClient ? '<span style="padding:2px 6px;border-radius:4px;background:#111827;color:#fff;margin-right:6px;">Client</span>' : '';
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
                    bottom: 48, // leave space for breadcrumb
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
                        // Always show labels for client and providers; otherwise hide very small tiles
                        return { hide: (w < 80 || h < 38) && !isClient && !isProvider };
                    },
                    label: {
                        show: true,
                        // Use plain text to avoid curly-brace artifacts; show name and value on two lines
                        formatter: (p: any) => `${p.name}\n${p.value}`,
                        color: '#fff',
                        fontSize: 12,
                        lineHeight: 16,
                        backgroundColor: 'transparent',
                        overflow: 'break'
                    },
                    upperLabel: {
                        show: false
                    },
                    emphasis: {
                        label: { show: true },
                        itemStyle: { borderColor: '#111827', borderWidth: 2, shadowBlur: 16, shadowColor: 'rgba(0,0,0,0.45)' }
                    },
                    itemStyle: {
                        borderColor: '#ffffff',
                        borderWidth: 1,
                        gapWidth: 1
                    },
                    levels: [
                        {
                            upperLabel: { show: false },
                            itemStyle: { borderColor: '#ffffff', borderWidth: 1, gapWidth: 1 }
                        },
                        {
                            itemStyle: { borderColor: '#ffffff', borderWidth: 0.5, gapWidth: 0.5 }
                        }
                    ],
                    visibleMin: 10,
                    childrenVisibleMin: 10,
                    data: dataNodes,
                    animationDurationUpdate: 500
                }
            ]
        };

        const providerLegend = topProviders.map((name) => ({ name, color: colorMap[name] }));

        return { treemapOption: option, providerLegend };
    }, [data?.allMentions, config.brandKeywords]);

    // Build Stacked Bar Chart on Polar (Radial) for Category Analysis
    const categoryPolarOption = useMemo(() => {
        if (!data) return {};

        // Top brands (bars)
        const brandsTop = (data.topBrands || []).map((b) => b.brand);

        // Unique categories, sorted by total mentions descending for legend readability
        const categoryTotals: [string, number][] = Array.from(
            new Set((data.allMentions || []).map((m: any) => m.category))
        )
            .filter((c): c is string => !!c)
            .map((cat) => [
                cat,
                (data.allMentions || []).filter((m: any) => m.category === cat).length
            ]);

        const categories = categoryTotals.sort((a, b) => b[1] - a[1]).map(([c]) => c);

        // Initialize counts per category per brand
        const countsByCatBrand: Record<string, Record<string, number>> = {};
        categories.forEach((cat) => {
            countsByCatBrand[cat] = {};
            brandsTop.forEach((brand) => {
                countsByCatBrand[cat][brand] = 0;
            });
        });

        // Aggregate mention counts
        (data.allMentions || []).forEach((m: any) => {
            const cat = m.category as string;
            const brand = m.brand_name as string;
            if (countsByCatBrand[cat] && brandsTop.includes(brand)) {
                countsByCatBrand[cat][brand] += 1;
            }
        });

        // Series: one per category, stacked on polar
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

    if (loading) {
        return (
            <div className="p-4">
                <div className="bg-gray-100 px-4 py-2">
                    <nav className="text-sm text-left">
                        <Link to="/" className="text-blue-600 hover:text-blue-800">← Back to Dashboard Selection</Link>
                    </nav>
                </div>
                <div className="max-w-6xl mx-auto mt-8">
                    Loading analysis data for {config.displayName}...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <div className="bg-gray-100 px-4 py-2">
                    <nav className="text-sm text-left">
                        <Link to="/" className="text-blue-600 hover:text-blue-800">← Back to Dashboard Selection</Link>
                    </nav>
                </div>
                <div className="max-w-6xl mx-auto mt-8">
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <strong>Error loading data:</strong> {error}
                    </div>
                </div>
            </div>
        );
    }

    if (!data) {
        return <div className="p-4">Error loading data. Please check the console for details.</div>;
    }

    return (
        <div>
            {/* Navigation breadcrumb */}
            <div className="bg-gray-100 px-4 py-2">
                <nav className="text-sm text-left">
                    <Link to="/" className="text-blue-600 hover:text-blue-800">← Back to Dashboard Selection</Link>
                </nav>
            </div>

            <div className="p-4 max-w-6xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">{config.displayName} Competitive Analysis in LLM Responses</h1>
                <p className="mb-4">Analysis of how {config.displayName} appears in LLM responses to industry-related queries.</p>

                {/* Tab Navigation */}
                <div className="flex border-b mb-4">
                    {['overview', 'category', 'providers', 'positioning', 'archive'].map((tab) => (
                        <button
                            key={tab}
                            className={`px-4 py-2 capitalize ${activeTab === tab ? 'border-b-2 border-blue-500 font-bold' : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab === 'archive' ? 'Prompt Archive' : `${tab} Analysis`}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-2">Top 15 Most Mentioned Brands</h2>
                            <p className="mb-4 text-gray-600">Comparison of how often {config.displayName} is mentioned relative to competitors across all queries.</p>
                            <div className="h-[34rem] md:h-[42rem]">
                                <ReactECharts option={treemapOption as any} style={{ width: '100%', height: '100%' }} notMerge={true} />
                            </div>
                            <div className="mt-2 flex flex-wrap gap-4">
                                {providerLegend.map((p) => (
                                    <div key={p.name} className="flex items-center gap-2">
                                        <span className="inline-block w-3 h-3 rounded" style={{ backgroundColor: p.color }}></span>
                                        <span className="text-sm text-gray-700">{p.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-2">Key Insights</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-white p-4 rounded border shadow">
                                    <h3 className="font-bold mb-2">{config.displayName} Presence in Results</h3>
                                    <p>{config.displayName} appears in {data.clientPositions.length} out of {data.allMentions.length} ({((data.clientPositions.length / data.allMentions.length) * 100).toFixed(1)}%) total LLM responses.</p>
                                    {data.avgPosition > 0 && (
                                        <>
                                            <p>On average, {config.displayName} appears {data.avgPosition.toFixed(2)} in the list of mentioned companies.</p>
                                            <p>This positions {config.displayName} in the top {(data.avgNormalizedPosition * 100).toFixed(2)}% of mentioned brands.</p>
                                        </>
                                    )}
                                </div>
                                <div className="bg-white p-4 rounded border shadow">
                                    <h3 className="font-bold mb-2">Top Competitors</h3>
                                    <p>Based on co-occurrence with {config.displayName} in LLM responses:</p>
                                    <ol className="list-decimal pl-5">
                                        {data.topCompetitors.slice(0, 5).map((comp, idx) => (
                                            <li key={idx}>{comp.brand} ({comp.count} co-occurrences)</li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        </div>

                        {data.topCompetitors.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-2">Top 10 Competitors by Co-occurrence</h2>
                                <p className="mb-4 text-gray-600">Companies that appear most frequently in the same LLM responses as {config.displayName}</p>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={data.topCompetitors} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="brand" angle={-45} textAnchor="end" height={70} />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="count" name="Co-occurrences" fill="#9b59b6" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Category Analysis Tab */}
                {activeTab === 'category' && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-2">Top Brands by Category</h2>
                            <p className="mb-4 text-gray-600">Comparison of {config.displayName} versus competitors across different product categories.</p>

                            <div className="h-[34rem] md:h-[42rem]">
                                <ReactECharts option={categoryPolarOption as any} style={{ width: '100%', height: '100%' }} notMerge={true} />
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Bars represent companies (top 15). Colors represent prompt categories. Stack height equals the number of LLM responses mentioning that company within each category.
                            </p>
                        </div>
                    </div>
                )}

                {/* Provider Analysis Tab */}
                {activeTab === 'providers' && (
                    <div>
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-2">Top Brands by Provider</h2>
                            <p className="mb-4 text-gray-600">How different LLM providers represent {config.displayName} and competitors.</p>

                            {Object.entries(data.brandsByProvider).map(([provider, brands]) => (
                                <div key={provider} className="mb-8">
                                    <h3 className="text-lg font-bold mb-2">{provider}</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={brands} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="brand" angle={-45} textAnchor="end" height={70} />
                                                <YAxis />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                                <Bar dataKey="count" name="Mentions" fill="#e74c3c">
                                                    {brands.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Positioning Analysis Tab */}
                {activeTab === 'positioning' && (
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
                                                                <div className="text-gray-900 font-medium truncate" title={pos.query}>{pos.query}</div>
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
                )}

                {/* Prompt Archive Tab */}
                {activeTab === 'archive' && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-2">Prompt Archive</h2>
                        {rawData && rawData.map((entry, idx) => (
                            <div key={idx} className={`p-4 mb-2 border rounded ${entry.companies_mentioned.some((c: any) =>
                                config.brandKeywords.some(keyword => c.brand_name.toLowerCase().includes(keyword.toLowerCase()))
                            ) ? 'bg-yellow-100' : ''}`}>
                                <p className="text-left"><strong>Query:</strong> {entry.query}</p>
                                <p className="text-left"><strong>Timestamp:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                                <p className="text-left"><strong>Provider:</strong> {entry.result_provider}</p>
                                <details className="mt-2 text-left">
                                    <summary className="cursor-pointer text-blue-600">Response</summary>
                                    <pre className="whitespace-pre-wrap text-sm mt-1">{entry.response}</pre>
                                </details>
                            </div>
                        ))}
                        {!rawData && <p className="p-4">Loading prompts...</p>}
                    </div>
                )}

                <div className="mt-8 text-gray-600 text-sm">
                    <p>Analysis based on {data.allMentions.length} total brand mentions across {Array.from(new Set(data.allMentions.map(m => m.query))).length} unique queries.</p>
                    <p>Generated on {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default CompetitiveAnalysisDashboard;
