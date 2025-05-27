# Luminr - LLM Competitive Analysis Dashboard

A comprehensive React-based dashboard that analyzes how brands appear in Large Language Model (LLM) responses across different providers, categories, and queries. This tool provides competitive intelligence insights to help brands understand and improve their visibility in AI-powered search results.

![React](https://img.shields.io/badge/React-18.2.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-blue) ![GitHub Pages](https://img.shields.io/badge/Deployed%20on-GitHub%20Pages-green)

## 🔗 Live Demo

**Production:** [https://overripedatascientist.github.io/llm-analysis](https://overripedatascientist.github.io/llm-analysis)

## 📊 Overview

This dashboard transforms raw LLM response data into actionable competitive intelligence insights, helping brands understand:

- How often they're mentioned compared to competitors
- Their positioning within LLM responses
- Performance variations across different LLM providers
- Category-specific brand visibility
- Strategic opportunities for improvement

## ✨ Features

### 🏠 **Multi-Client Landing Page**
- Professional landing page with client selection
- Dynamic branding for each client
- Responsive design with hover effects
- Easy navigation between different brand analyses

### 📈 **Comprehensive Analytics Dashboard**
- **Overview Analysis**: Brand mention frequency and competitive positioning
- **Category Breakdown**: Performance across different product/service categories  
- **Provider Comparison**: How different LLMs represent each brand
- **Positioning Intelligence**: Detailed analysis of mention order and prominence
- **Prompt Archive**: Complete repository of queries and responses

### 🎨 **Interactive Visualizations**
- Dynamic bar charts with brand-specific color coding
- Responsive charts that adapt to different screen sizes
- Custom tooltips and legends
- Position percentile tracking across providers

### 🎯 **Strategic Insights**
- Automated competitor identification
- Performance benchmarking
- Actionable recommendations for improvement
- Category and provider-specific strategies

## 🛠️ Tech Stack

- **Frontend Framework**: React 18.2.0 with TypeScript
- **Routing**: React Router DOM 6.x
- **Charts & Visualization**: Recharts 2.12.2
- **Styling**: Tailwind CSS 3.4.1
- **Build Tool**: Create React App
- **Deployment**: GitHub Pages
- **Package Manager**: npm

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm (comes with Node.js)
- Git
- GitHub account (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/overripedatascientist/llm-analysis.git
   cd llm-analysis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Add your data files**
   ```bash
   # Place your JSON data files in the public/data/ directory
   # Example structure:
   # public/data/currys.json
   # public/data/boux-avenue.json
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
llm-analysis/
├── public/
│   ├── data/                    # JSON data files for each client
│   │   ├── currys.json
│   │   └── boux-avenue.json
│   ├── favicon.ico              # Custom favicon
│   ├── logo192.png              # App icons
│   ├── logo512.png
│   ├── index.html               # Main HTML template
│   ├── manifest.json            # PWA configuration
│   └── .nojekyll               # Prevents Jekyll processing
├── src/
│   ├── components/
│   │   ├── CompetitiveAnalysisDashboard.tsx  # Main dashboard component
│   │   └── LandingPage.tsx                   # Multi-client landing page
│   ├── config/
│   │   └── clients.ts                        # Client configuration
│   ├── App.tsx                               # Main app with routing
│   ├── index.tsx                             # App entry point
│   └── index.css                             # Global styles with Tailwind
├── package.json                              # Dependencies and scripts
├── tailwind.config.js                        # Tailwind configuration
├── tsconfig.json                             # TypeScript configuration
└── README.md                                 # This file
```

## 📊 Data Format

Your JSON data files should follow this structure:

```json
[
  {
    "query": "best UK electronics retailers",
    "query_parent_class": "consumer electronics",
    "result_provider": "OpenAI GPT-4",
    "timestamp": "2025-01-15T10:30:00Z",
    "response": "Full LLM response text...",
    "companies_mentioned": [
      {
        "brand_name": "Currys",
        "text_snippet": "Currys is one of the leading electronics retailers..."
      },
      {
        "brand_name": "Amazon",
        "text_snippet": "Amazon offers competitive prices..."
      }
    ]
  }
]
```

### Required Fields:
- `query`: The search query sent to the LLM
- `query_parent_class`: Category classification
- `result_provider`: Which LLM provided the response
- `timestamp`: When the query was made
- `response`: Complete LLM response
- `companies_mentioned`: Array of mentioned brands with snippets

## 🎨 Adding New Clients

To add a new client dashboard:

### 1. **Add Data File**
Place the new client's JSON data in `public/data/client-name.json`

### 2. **Update Client Configuration**
Edit `src/config/clients.ts`:

```typescript
export const clients: Record<string, ClientConfig> = {
  // ... existing clients
  'new-client': {
    id: 'new-client',
    name: 'new-client',
    displayName: 'New Client Name',
    description: 'Brief description of the client',
    category: 'Industry Category',
    market: 'Geographic Market',
    dataFile: '/data/new-client.json',
    primaryColor: '#FF6B35',      // Brand primary color
    secondaryColor: '#4ECDC4',    // Secondary color
    brandKeywords: ['brand', 'brand name', 'variations'],
    icon: 'industry-type'         // 'electronics', 'fashion', etc.
  }
};
```

### 3. **Deploy Changes**
```bash
npm run deploy:github
```

The new client will automatically appear on the landing page with its own dashboard!

## 🔧 Development Workflow

### Local Development
```bash
# Start development server
npm start

# Run in development mode
# - Hot reloading enabled
# - Opens to http://localhost:3000
# - Shows detailed error messages
```

### Building for Production
```bash
# Create production build
npm run build

# Test production build locally
npx serve -s build
```

### Code Quality
```bash
# Run TypeScript checks
npx tsc --noEmit

# Check for unused dependencies
npx depcheck
```

## 🚀 Deployment Guide

### Initial Setup (One-time)

1. **Enable GitHub Pages**
   - Go to your repository Settings → Pages
   - Set source to "Deploy from a branch"
   - Select `gh-pages` branch and `/ (root)` folder
   - Click "Save"

2. **Install deployment dependencies**
   ```bash
   npm install --save-dev cross-env gh-pages
   ```

### Deploying Changes

#### Quick Deploy
```bash
# One command to deploy all changes
npm run deploy
```

#### Step-by-Step Deploy
```bash
# 1. Save your changes
git add .
git commit -m "Description of your changes"
git push origin main

# 2. Deploy to GitHub Pages
npm run deploy
```

#### What the Deploy Script Does:
1. Sets the correct GitHub Pages URL as PUBLIC_URL
2. Builds the React app for production
3. Pushes the built files to the `gh-pages` branch
4. GitHub automatically serves the updated site

### Deploy Timeline
- **Build time**: 1-2 minutes
- **GitHub Pages update**: 2-5 minutes after push
- **CDN propagation**: Up to 10 minutes globally

### Verification
1. Check the Actions tab in your GitHub repository
2. Visit your live site: `https://overripedatascientist.github.io/llm-analysis`
3. Hard refresh (Ctrl+F5) to see changes immediately

## 🔄 Common Development Tasks

### Updating Data
```bash
# 1. Replace JSON files in public/data/
cp new-data.json public/data/client-name.json

# 2. Test locally
npm start

# 3. Deploy changes
npm run deploy
```

### Updating Styling
```bash
# Edit Tailwind classes in components
# Changes are hot-reloaded in development

# Deploy when ready
npm run deploy
```

### Adding New Features
```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop and test
npm start

# 3. Merge and deploy
git checkout main
git merge feature/new-feature
npm run deploy
```

## 🎯 Dashboard Features Explained

### Overview Tab
- **Top Brands Chart**: Compare mention frequency across competitors
- **Key Insights**: Summary statistics and competitive positioning
- **Co-occurrence Analysis**: Identify companies mentioned alongside your brand

### Category Analysis Tab
- **Category Breakdown**: Performance across different product/service areas
- **Visual Comparisons**: Side-by-side brand performance in each category
- **Category Insights**: Identify strongest and weakest performance areas

### Provider Analysis Tab
- **Provider Comparison**: How different LLMs represent your brand
- **Mention Frequency**: Which providers mention your brand most often
- **Provider Insights**: Identify optimization opportunities per provider

### Positioning Analysis Tab
- **Position Tracking**: Where your brand appears in result lists
- **Detailed Table**: Query-by-query positioning breakdown
- **Statistical Analysis**: Average position and percentile rankings
- **Provider Charts**: Visual comparison of positioning by LLM provider
- **Strategic Recommendations**: AI-generated improvement suggestions

### Prompt Archive Tab
- **Complete Query History**: All prompts and responses
- **Searchable Interface**: Find specific queries or responses
- **Context Preservation**: Full conversational context maintained
- **Brand Highlighting**: Your brand mentions highlighted in yellow

## 🎨 Customization Options

### Branding Colors
Update client colors in `src/config/clients.ts`:
```typescript
primaryColor: '#FF5722',    // Used for charts and buttons
secondaryColor: '#3498db',  // Used for secondary elements
```

### Chart Styling
Modify chart appearance in `CompetitiveAnalysisDashboard.tsx`:
- Color schemes
- Chart dimensions
- Tooltip content
- Legend positioning

### Layout Modifications
Update Tailwind classes throughout components:
- Spacing and margins
- Grid layouts
- Responsive breakpoints
- Typography

## 🐛 Troubleshooting

### Common Issues

**1. Blank page in development**
```bash
# Check if you're visiting the correct URL
# Should be: http://localhost:3000/
# Not: http://localhost:3000/llm-analysis
```

**2. Data not loading**
```bash
# Verify JSON files are in public/data/
ls -la public/data/

# Check browser console for fetch errors
# Verify JSON syntax is valid
```

**3. Build failures**
```bash
# Check TypeScript errors
npm run build

# Fix any type errors shown
# Common fixes: add proper type annotations
```

**4. GitHub Pages not updating**
```bash
# Check repository Actions tab for deployment status
# Wait 5-10 minutes for propagation
# Hard refresh browser (Ctrl+F5)
```

**5. Router issues on deployed site**
```bash
# Ensure .nojekyll file exists in public/ folder
touch public/.nojekyll
npm run deploy:github
```

### Performance Optimization

**Large Data Files**
- Keep JSON files under 1MB each
- Consider data pagination for large datasets
- Compress images and assets

**Chart Performance**
- Limit data points to <1000 per chart
- Use data sampling for large datasets
- Implement lazy loading for heavy tabs

## 📚 Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/en-US/api)

### Tools
- [Favicon Generator](https://favicon.io/)
- [JSON Validator](https://jsonlint.com/)
- [Color Picker](https://coolors.co/)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💬 Support

For support, issues, or feature requests:

1. **Check existing issues**: [GitHub Issues](https://github.com/overripedatascientist/llm-analysis/issues)
2. **Create new issue**: Provide detailed description and steps to reproduce
3. **Include environment details**: OS, browser, Node.js version

## 🚀 Future Enhancements

- [ ] **Export Functionality**: PDF/Excel export for reports
- [ ] **Data Filtering**: Advanced filtering and search capabilities
- [ ] **Historical Tracking**: Compare performance over time periods
- [ ] **Sentiment Analysis**: Analyze sentiment of brand mentions
- [ ] **Email Reports**: Automated reporting via email
- [ ] **API Integration**: Real-time data updates
- [ ] **User Authentication**: Multi-user access with permissions
- [ ] **Custom Dashboards**: User-configurable dashboard layouts

## 📊 Analytics & Insights

This dashboard helps answer critical business questions:

- "How visible is our brand in AI search results?"
- "Which competitors appear most frequently alongside us?"
- "Are there categories where we're underrepresented?"
- "Which LLM providers favor our brand?"
- "What content gaps can we address to improve AI visibility?"

---

**Built with ❤️ by Luminr** | Empowering brands with AI-driven competitive intelligence