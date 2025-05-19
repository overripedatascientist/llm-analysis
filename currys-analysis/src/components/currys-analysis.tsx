import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Define TypeScript interfaces for your data structure
interface ProcessedData {
  topBrands: { brand: string; count: number }[];
  brandsByCategory: Record<string, { brand: string; count: number }[]>;
  brandsByProvider: Record<string, { brand: string; count: number }[]>;
  currysPositions: {
    provider: string;
    category: string;
    query: string;
    position: number;
    total_companies: number;
    normalized_position: number;
  }[];
  avgPosition: number;
  avgNormalizedPosition: number;
  avgPositionByProvider: { provider: string; avgPosition: number }[];
  topCompetitors: { brand: string; count: number }[];
  allMentions: any[]; // You can define a more specific type if needed
}

const CurrysAnalysis = () => {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use fetch API instead of window.fs
        const response = await fetch('./currys.json');
        const jsonData = await response.json();

        // Process the data for visualization
        const processedData = processData(jsonData);
        setData(processedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Process the raw JSON data into visualization-friendly format
  const processData = (rawData: any[]): ProcessedData => {
    // Create a dataset of all mentions
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

    // Count brand mentions
    const brandCounts: Record<string, number> = {};
    allMentions.forEach(mention => {
      brandCounts[mention.brand_name] = (brandCounts[mention.brand_name] || 0) + 1;
    });

    // Get top 15 brands
    const topBrands = Object.entries(brandCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([brand, count]) => ({ brand, count }));

    // Get counts by category
    const categories = [...new Set(allMentions.map(m => m.category))];
    const brandsByCategory: Record<string, { brand: string; count: number }[]> = {};

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

    // Get counts by provider
    const providers = [...new Set(allMentions.map(m => m.provider))];
    const brandsByProvider: Record<string, { brand: string; count: number }[]> = {};

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

    // Get Currys positioning data
    const currysPositions = allMentions
      .filter(m =>
        m.brand_name.toLowerCase() === 'currys' ||
        m.brand_name.toLowerCase() === 'currys pc world'
      )
      .map(m => ({
        provider: m.provider,
        category: m.category,
        query: m.query,
        position: m.position,
        total_companies: m.total_companies,
        normalized_position: m.normalized_position
      }));

    // Calculate average positioning
    const avgPosition = currysPositions.length > 0
      ? currysPositions.reduce((sum, pos) => sum + pos.position, 0) / currysPositions.length
      : 0;

    const avgNormalizedPosition = currysPositions.length > 0
      ? currysPositions.reduce((sum, pos) => sum + pos.normalized_position, 0) / currysPositions.length
      : 0;

    // Provider positioning
    const positionByProvider: Record<string, number[]> = {};

    currysPositions.forEach(pos => {
      if (!positionByProvider[pos.provider]) {
        positionByProvider[pos.provider] = [];
      }
      positionByProvider[pos.provider].push(pos.normalized_position);
    });

    const avgPositionByProvider = Object.entries(positionByProvider).map(([provider, positions]) => ({
      provider,
      avgPosition: positions.reduce((sum, pos) => sum + pos, 0) / positions.length
    }));

    // Identify key competitors
    // Companies that appear in the same responses as Currys
    const competitors: Record<string, number> = {};

    rawData.forEach(item => {
      const hasCurrys = item.companies_mentioned.some((comp: any) =>
        comp.brand_name.toLowerCase().includes('curry')
      );

      if (hasCurrys) {
        item.companies_mentioned.forEach((comp: any) => {
          if (!comp.brand_name.toLowerCase().includes('curry')) {
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
      currysPositions,
      avgPosition,
      avgNormalizedPosition,
      avgPositionByProvider,
      topCompetitors,
      allMentions
    };
  };

  if (loading) {
    return <div className="p-4">Loading analysis data...</div>;
  }

  if (!data) {
    return <div className="p-4">Error loading data. Please check the console for details.</div>;
  }

  // Highlight Currys in charts
  const getBarColor = (entry: { brand: string }) => {
    return entry.brand.toLowerCase().includes('curry') ? '#FF5722' : '#3498db';
  };

  // Custom tooltip for bar charts
  const CustomTooltip = ({ active, payload, label }: any) => {
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

  // Format categories for better display
  const formatCategory = (category: string) => {
    return category
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Currys Competitive Analysis in LLM Responses</h1>
      <p className="mb-4">Analysis of how Currys appears in LLM responses to queries about UK consumer electronics, home appliances, and computers.</p>

      {/* Tab Navigation */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'category' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('category')}
        >
          Category Analysis
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'providers' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('providers')}
        >
          Provider Analysis
        </button>
        <button
          className={`px-4 py-2 ${activeTab === 'positioning' ? 'border-b-2 border-blue-500 font-bold' : ''}`}
          onClick={() => setActiveTab('positioning')}
        >
          Positioning Analysis
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Top 15 Most Mentioned Brands</h2>
            <p className="mb-4 text-gray-600">Comparison of how often Currys is mentioned relative to competitors across all queries.</p>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.topBrands}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="brand"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" name="Mentions" fill="#3498db">
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
                <h3 className="font-bold mb-2">Currys Presence in Results</h3>
                <p>Currys appears in {data.currysPositions.length} out of {Math.max(...data.allMentions.map(m => m.total_companies))} total company mentions.</p>
                <p>On average, Currys appears {data.avgPosition.toFixed(2)} in the list of mentioned companies.</p>
                <p>This positions Currys in the top {(data.avgNormalizedPosition * 100).toFixed(2)}% of mentioned brands.</p>
              </div>
              <div className="bg-white p-4 rounded border shadow">
                <h3 className="font-bold mb-2">Top Competitors</h3>
                <p>Based on co-occurrence with Currys in LLM responses:</p>
                <ol className="list-decimal pl-5">
                  {data.topCompetitors.slice(0, 5).map((comp, idx) => (
                    <li key={idx}>{comp.brand} ({comp.count} co-occurrences)</li>
                  ))}
                </ol>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Top 10 Competitors by Co-occurrence</h2>
            <p className="mb-4 text-gray-600">Companies that appear most frequently in the same LLM responses as Currys</p>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.topCompetitors}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="brand"
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="count" name="Co-occurrences" fill="#9b59b6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Category Analysis Tab */}
      {activeTab === 'category' && (
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Top Brands by Category</h2>
            <p className="mb-4 text-gray-600">Comparison of Currys versus competitors across different product categories.</p>

            {Object.entries(data.brandsByCategory).map(([category, brands]) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-bold mb-2">{formatCategory(category)}</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={brands}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="brand"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
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

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Category Insights</h2>
            <div className="bg-white p-4 rounded border shadow">
              <h3 className="font-bold mb-2">Currys Category Presence</h3>
              {data.currysPositions.length > 0 ? (
                <>
                  <p>Categories where Currys is mentioned:</p>
                  <ul className="list-disc pl-5">
                    {[...new Set(data.currysPositions.map(p => p.category))].map((category, idx) => (
                      <li key={idx}>{formatCategory(category)}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>Currys is not explicitly mentioned in category breakdowns.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Provider Analysis Tab */}
      {activeTab === 'providers' && (
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Top Brands by Provider</h2>
            <p className="mb-4 text-gray-600">How different LLM providers represent Currys and competitors.</p>

            {Object.entries(data.brandsByProvider).map(([provider, brands]) => (
              <div key={provider} className="mb-8">
                <h3 className="text-lg font-bold mb-2">{provider}</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={brands}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="brand"
                        angle={-45}
                        textAnchor="end"
                        height={70}
                      />
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

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Provider Insights</h2>
            <div className="bg-white p-4 rounded border shadow">
              <h3 className="font-bold mb-2">Currys by Provider</h3>
              {data.avgPositionByProvider.length > 0 ? (
                <>
                  <p>Average position of Currys in results by provider:</p>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.avgPositionByProvider.map(item => ({
                          provider: item.provider,
                          position: +(item.avgPosition * 100).toFixed(2)
                        }))}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="provider" />
                        <YAxis label={{ value: 'Position Percentile (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="position" name="Position (lower is better)" fill="#FF5722" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-2 text-gray-600">Lower values indicate Currys is mentioned earlier in results (better positioning).</p>
                </>
              ) : (
                <p>No positioning data available for Currys across providers.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Positioning Analysis Tab */}
      {activeTab === 'positioning' && (
        <div>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Currys Positioning Analysis</h2>
            <p className="mb-4 text-gray-600">Detailed analysis of Currys' position in LLM responses.</p>

            {data.currysPositions.length > 0 ? (
              <div className="bg-white p-4 rounded border shadow mb-4">
                <h3 className="font-bold mb-2">Positioning Details</h3>
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
                    {data.currysPositions.map((pos, idx) => (
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
            ) : (
              <p>No positioning data available for Currys.</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="bg-white p-4 rounded border shadow">
              <h3 className="font-bold mb-2">Key Positioning Stats</h3>
              {data.currysPositions.length > 0 ? (
                <>
                  <p><strong>Average Position:</strong> {data.avgPosition.toFixed(2)} out of an average of {(data.allMentions.reduce((sum, m) => sum + m.total_companies, 0) / data.allMentions.length).toFixed(2)} companies</p>
                  <p><strong>Average Percentile:</strong> {(data.avgNormalizedPosition * 100).toFixed(2)}%</p>
                  <p className="mt-2 text-gray-600">Lower percentile indicates earlier mention (better positioning)</p>
                </>
              ) : (
                <p>No positioning data available for Currys.</p>
              )}
            </div>

            <div className="bg-white p-4 rounded border shadow">
              <h3 className="font-bold mb-2">Provider Positioning</h3>
              {data.avgPositionByProvider.length > 0 ? (
                <ul className="list-disc pl-5">
                  {data.avgPositionByProvider.map((item, idx) => (
                    <li key={idx}>
                      <strong>{item.provider}:</strong> {(item.avgPosition * 100).toFixed(2)}% position
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No provider positioning data available for Currys.</p>
              )}
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2">Recommendations</h2>
            <div className="bg-white p-4 rounded border shadow">
              <h3 className="font-bold mb-2">Strategic Recommendations</h3>
              <ul className="list-disc pl-5">
                <li>Focus on enhancing visibility in the {data.currysPositions.length > 0 ?
                  [...new Set(data.currysPositions.map(p => p.category))].map(formatCategory).join(', ') :
                  'consumer electronics'} categories where Currys is already mentioned.</li>
                <li>Target content optimization for queries like "{data.currysPositions.length > 0 ?
                  data.currysPositions[0].query :
                  'top UK companies selling laptops and PCs'}" where Currys is already appearing.</li>
                <li>Consider developing content focusing on competitor differentiation against {data.topCompetitors.length > 0 ?
                  data.topCompetitors.slice(0, 3).map(c => c.brand).join(', ') :
                  'major competitors'} who frequently co-occur with Currys in results.</li>
                <li>Develop strategies to improve positioning in responses from {data.avgPositionByProvider.length > 0 ?
                  data.avgPositionByProvider.sort((a, b) => b.avgPosition - a.avgPosition)[0].provider :
                  'all providers'} where Currys currently has lower visibility.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-gray-600 text-sm">
        <p>Analysis based on {data.allMentions.length} total brand mentions across {[...new Set(data.allMentions.map(m => m.query))].length} unique queries.</p>
        <p>Generated on May 19, 2025</p>
      </div>
    </div>
  );
};

export default CurrysAnalysis;