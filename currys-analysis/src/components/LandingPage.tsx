import React from 'react';
import { Link } from 'react-router-dom';
import { getAllClients } from '../config/clients';

const LandingPage: React.FC = () => {
    const clients = getAllClients();

    const getClientStats = (clientId: string) => {
        // You can replace these with real data from your JSON files if needed
        const stats: Record<string, string> = {
            'currys': '34 total responses analyzed',
            'boux-avenue': '28 responses analyzed'
        };
        return stats[clientId] || 'Analysis available';
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="text-white py-16" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">LLM Competitive Analysis Dashboard</h1>
                    <p className="text-xl opacity-90">Analyze how brands appear in Large Language Model responses</p>
                </div>
            </div>

            {/* Client Selection */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Select a Client Dashboard</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Choose from our available client analyses to explore how different brands
                        perform in LLM responses across various queries and providers.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Dynamic Client Cards */}
                    {clients.map((client) => (
                        <div key={client.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-xl">
                            <div
                                className="h-32 flex items-center justify-center"
                                style={{ backgroundColor: client.primaryColor }}
                            >
                                <h3 className="text-white text-2xl font-bold">{client.displayName}</h3>
                            </div>
                            <div className="p-6">
                                <h4 className="text-xl font-bold mb-2">{client.description}</h4>
                                <p className="text-gray-600 mb-4">
                                    Analysis of {client.displayName}'s presence in LLM responses for {client.category.toLowerCase()},
                                    and related queries in the {client.market.toLowerCase()} market.
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">{getClientStats(client.id)}</span>
                                    <Link
                                        to={`/dashboard/${client.id}`}
                                        className="px-4 py-2 rounded transition-colors text-white"
                                        style={{ backgroundColor: client.primaryColor }}
                                        onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                            e.currentTarget.style.backgroundColor = client.secondaryColor;
                                        }}
                                        onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                                            e.currentTarget.style.backgroundColor = client.primaryColor;
                                        }}
                                    >
                                        View Analysis
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Add New Client Card */}
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border-2 border-dashed border-gray-300 transition-all duration-200 hover:transform hover:-translate-y-1 hover:shadow-xl">
                        <div className="bg-gray-100 h-32 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-4xl text-gray-400 mb-2">+</div>
                                <h3 className="text-gray-500 text-lg font-semibold">Add New Client</h3>
                            </div>
                        </div>
                        <div className="p-6">
                            <h4 className="text-xl font-bold mb-2 text-gray-700">Your Brand Here</h4>
                            <p className="text-gray-600 mb-4">
                                Ready to analyze your brand's presence in LLM responses?
                                Contact us to set up your custom dashboard.
                            </p>
                            <div className="text-center">
                                <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">
                                    Get Started
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-white py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Dashboard Features</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="text-center">
                            <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Competitive Analysis</h3>
                            <p className="text-gray-600">Compare your brand's visibility against top competitors across different query types.</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Position Tracking</h3>
                            <p className="text-gray-600">Track where your brand appears in LLM responses and identify improvement opportunities.</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Strategic Insights</h3>
                            <p className="text-gray-600">Get actionable recommendations to improve your brand's AI visibility.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <p>&copy; 2025 Luminr. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;