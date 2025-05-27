import React, { useState, useEffect } from 'react';
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
            .slice(0, 15)
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
                            <div className="h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.topBrands} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="brand" angle={-45} textAnchor="end" height={70} />
                                        <YAxis />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar dataKey="count" name="Mentions" fill={config.secondaryColor}>
                                            {data.topBrands.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-2">Key Insights</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="bg-white p-4 rounded border shadow">
                                    <h3 className="font-bold mb-2">{config.displayName} Presence in Results</h3>
                                    <p>{config.displayName} appears in {data.clientPositions.length} out of {Math.max(...data.allMentions.map(m => m.total_companies), 0)} total company mentions.</p>
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

                            {Object.entries(data.brandsByCategory).map(([category, brands]) => (
                                <div key={category} className="mb-8">
                                    <h3 className="text-lg font-bold mb-2">{formatCategory(category)}</h3>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={brands} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="brand" angle={-45} textAnchor="end" height={70} />
                                                <YAxis />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Legend />
                                                <Bar dataKey="count" name="Mentions" fill="#2ecc71">
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
                                <div className="bg-white p-4 rounded border shadow mb-4">
                                    <h3 className="font-bold mb-2">Positioning Details</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="border p-2 text-left">Query</th>
                                                    <th className="border p-2 text-left">Provider</th>
                                                    <th className="border p-2 text-left">Category</th>
                                                    <th className="border p-2 text-left">Position</th>
                                                    <th className="border p-2 text-left">Total Companies</th>
                                                    <th className="border p-2 text-left">Position %</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.clientPositions.map((pos, idx) => (
                                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                                                        <td className="border p-2">{pos.query}</td>
                                                        <td className="border p-2">{pos.provider}</td>
                                                        <td className="border p-2">{formatCategory(pos.category)}</td>
                                                        <td className="border p-2">{pos.position}</td>
                                                        <td className="border p-2">{pos.total_companies}</td>
                                                        <td className="border p-2">{(pos.normalized_position * 100).toFixed(2)}%</td>
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