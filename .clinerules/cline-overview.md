# LLM Competitive Analysis Dashboard Project

## Project Overview

This project is a **multi-client competitive analysis platform** that helps brands understand how they appear in Large Language Model (LLM) responses compared to their competitors. As AI assistants like ChatGPT, Claude, and Gemini become increasingly important for consumer research and decision-making, this tool provides crucial insights into brand visibility and positioning in the AI-powered search landscape.

## Why This Project Exists

### The Problem

- **AI-First Consumer Behavior**: Consumers increasingly rely on LLMs for product research and recommendations
- **Invisible Competition**: Traditional SEO and marketing analytics don't capture how brands perform in AI responses
- **New Competitive Landscape**: Brand visibility in LLM outputs creates a new competitive dimension that wasn't measurable before
- **Strategic Blind Spot**: Companies need to understand and optimize their presence in AI-generated recommendations

### The Solution

This dashboard transforms raw LLM response data into actionable competitive intelligence, helping brands:

- **Understand their competitive positioning** in AI assistant responses
- **Identify optimization opportunities** to improve AI visibility
- **Track performance across different LLM providers** (ChatGPT, Claude, Gemini, etc.)
- **Benchmark against competitors** in specific product categories
- **Make data-driven decisions** about content and SEO strategy for the AI era

## What It Currently Achieves

### For Brands

- **Competitive Intelligence**: See exactly where your brand ranks against competitors in LLM responses
- **Provider Analysis**: Understand how different AI systems (OpenAI, Anthropic, Google) represent your brand
- **Category Insights**: Discover which product categories you dominate vs. where you're underrepresented
- **Strategic Recommendations**: Get actionable advice for improving AI visibility

### For Analysts

- **Comprehensive Data Processing**: Automatically processes complex LLM response datasets
- **Multi-Dimensional Analysis**: Analyzes brand mentions across queries, categories, providers, and positioning
- **Scalable Framework**: Easy to add new clients and datasets
- **Professional Reporting**: Client-ready dashboards with interactive visualizations

## Project Structure

```
currys-analysis/                 # (Should be llm-analysis in theory but it's where we started)
├── index.html                 # Landing page with client selector
├── currys/
│   ├── index.html            # Currys-specific dashboard
│   └── currys.json           # Currys LLM response data
├── boux-avenue/
│   ├── index.html            # Boux Avenue-specific dashboard
│   └── boux-avenue.json      # Boux Avenue LLM response data
├── multi_client_analysis.py  # Python script for data processing
├── clients.json              # Client configuration file
└── README.md                 # Project documentation
```

### Data Structure
Each JSON dataset contains LLM responses with:
- **Query metadata**: Original search queries, categories, timestamps
- **Provider information**: Which LLM generated the response (OpenAI, Anthropic, etc.)
- **Company mentions**: Brands mentioned in each response with positioning data
- **Context snippets**: Actual text snippets showing how brands are described

## Deployment & Infrastructure

### GitHub Pages Deployment
- **Static Hosting**: Deployed on GitHub Pages for reliable, free hosting
- **Multi-Client URLs**: 
  - Landing page: `yoursite.github.io/llm-analysis/`
  - Client dashboards: `yoursite.github.io/llm-analysis/currys/`
- **Automatic Updates**: Updates deploy automatically when code is pushed to main branch
- **Custom Domain Ready**: Can be configured with custom domains for white-label deployments

### Local Development
- **Python HTTP Server**: Local testing with `python -m http.server 8000`
- **Real-time Testing**: Test all functionality locally before deployment
- **Cross-browser Compatible**: Works across Chrome, Firefox, Safari, Edge

## Tech Stack

### Frontend
- **React 18**: Modern React with hooks for state management
- **Recharts**: Professional charting library for interactive visualizations
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Babel**: In-browser JSX compilation for GitHub Pages compatibility

### Data Processing
- **JSON**: Standardized data format for LLM response storage

### Development Tools
- **VS Code**: Primary development environment
- **Git/GitHub**: Version control and deployment
- **Browser DevTools**: Debugging and testing

## Key Dashboard Features

### 1. Overview Analysis
- **Top Brand Rankings**: Interactive bar charts showing most-mentioned brands
- **Competitive Positioning**: Visual comparison of client vs. competitors
- **Key Metrics Summary**: Quick insights into brand presence and performance
- **Co-occurrence Analysis**: Brands that appear together with your client

### 2. Category Analysis
- **Product Category Breakdown**: Performance across different product categories
- **Category-Specific Rankings**: Where your brand ranks in electronics, appliances, etc.
- **Gap Analysis**: Categories where competitors dominate
- **Market Share Visualization**: Relative brand presence by category

### 3. Provider Analysis
- **LLM Provider Comparison**: How different AI systems represent your brand
- **Provider Bias Detection**: Which LLMs favor certain brands
- **Positioning by Provider**: Detailed breakdown of brand positions across platforms
- **Provider-Specific Strategies**: Tailored recommendations for each LLM

### 4. Positioning Analysis
- **Detailed Position Tracking**: Exact position of brand mentions in responses
- **Query-Level Analysis**: Performance on specific search queries
- **Trend Analysis**: Position changes over time and across different contexts
- **Strategic Recommendations**: Actionable advice for improving positioning

### Interactive Features
- **Dynamic Filtering**: Filter by category, provider, or query type
- **Hover Tooltips**: Detailed information on chart elements
- **Responsive Design**: Works perfectly on desktop and mobile
- **Export Capabilities**: Screenshots and data export for presentations

## Multi-Client Architecture

### Scalable Design
- **Parameterized Components**: Single codebase serves multiple clients
- **Brand-Specific Styling**: Custom colors and branding for each client
- **Flexible Data Schema**: Accommodates different industry datasets
- **Easy Client Addition**: New clients can be added in minutes

### Configuration System
```json
{
  "clientName": "Currys",
  "dataFile": "currys.json",
  "primaryColor": "#FF5722",
  "secondaryColor": "#3498db",
  "brandKeywords": ["currys", "curry"]
}
```

### Benefits
- **Cost Effective**: One dashboard serves multiple clients
- **Consistent Experience**: Standardized analysis across all clients
- **Easy Maintenance**: Updates benefit all clients simultaneously
- **Professional Branding**: Each client gets their own branded experience

## Current Clients & Use Cases

### Currys (Consumer Electronics)
- **Industry**: UK electronics and appliance retailer
- **Focus**: Competition against Samsung, Apple, Dyson in electronics queries
- **Key Insights**: Performance in computer/laptop retail vs. brand manufacturer queries

### Boux Avenue (Fashion/Lingerie)
- **Industry**: UK fashion and lingerie retailer
- **Focus**: Performance in fashion and retail-related queries
- **Key Insights**: Brand positioning in fashion recommendation queries

This project represents a first-of-its-kind solution for the emerging challenge of AI visibility optimization, providing brands with the insights they need to succeed in an AI-first world.
