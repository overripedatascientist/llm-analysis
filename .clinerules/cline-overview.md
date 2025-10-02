# LLM Competitive Analysis Dashboard Project

## Project Overview

This project is a multi-client competitive analysis platform that helps brands understand how they appear in Large Language Model (LLM) responses compared to their competitors. As AI assistants like ChatGPT, Claude, and Gemini become increasingly important for consumer research and decision-making, this tool provides crucial insights into brand visibility and positioning in the AI-powered search landscape.

## Why This Project Exists

### The Problem
- AI-First Consumer Behavior: Consumers increasingly rely on LLMs for product research and recommendations
- Invisible Competition: Traditional SEO and marketing analytics don't capture how brands perform in AI responses
- New Competitive Landscape: Brand visibility in LLM outputs creates a new competitive dimension that wasn't measurable before
- Strategic Blind Spot: Companies need to understand and optimize their presence in AI-generated recommendations

### The Solution
This dashboard transforms raw LLM response data into actionable competitive intelligence, helping brands:
- Understand their competitive positioning in AI assistant responses
- Identify optimization opportunities to improve AI visibility
- Track performance across different LLM providers (OpenAI, Anthropic, Google, etc.)
- Benchmark against competitors in specific product categories
- Make data-driven decisions about content and SEO strategy for the AI era

## What It Currently Achieves

### For Brands
- Competitive Intelligence: See exactly where your brand ranks against competitors in LLM responses
- Provider Analysis: Understand how different AI systems represent your brand
- Category Insights: Discover which product categories you dominate vs. where you're underrepresented
- Strategic Recommendations: Get actionable advice for improving AI visibility

### For Analysts
- Comprehensive Data Processing: Automatically processes complex LLM response datasets
- Multi-Dimensional Analysis: Analyzes brand mentions across queries, categories, providers, and positioning
- Scalable Framework: Easy to add new clients and datasets
- Professional Reporting: Client-ready dashboards with interactive visualizations

---

## Repository Layout (after refactor)

The working React application lives under `currys-analysis/` (Create React App + TypeScript).

```
/                       # repo root
├─ .clinerules/
│  └─ cline-overview.md # this file (project guidance for AI collaborators)
├─ currys-analysis/
│  ├─ public/
│  │  ├─ data/                          # JSON datasets per client
│  │  │  ├─ currys.json
│  │  │  ├─ boux-avenue.json
│  │  │  ├─ adnoc.json
│  │  │  └─ ... (see repo)
│  │  └─ index.html, manifest, icons, ...
│  ├─ src/
│  │  ├─ App.tsx                        # Router + client selection
│  │  ├─ components/
│  │  │  ├─ LandingPage.tsx
│  │  │  ├─ CompetitiveAnalysisDashboard.tsx   # container (slim orchestrator)
│  │  │  └─ dashboard/
│  │  │     ├─ hooks/
│  │  │     │  ├─ useClientData.ts            # fetch raw JSON (multi-path fallback)
│  │  │     │  └─ useProcessedData.ts         # compute ProcessedData + chart options
│  │  │     ├─ tabs/
│  │  │     │  ├─ OverviewTab.tsx
│  │  │     │  ├─ CategoryTab.tsx
│  │  │     │  ├─ ProvidersTab.tsx
│  │  │     │  ├─ PositioningTab.tsx
│  │  │     │  └─ ArchiveTab.tsx
│  │  │     ├─ charts/
│  │  │     │  ├─ Treemap.tsx                 # ReactECharts wrapper
│  │  │     │  └─ CategoryPolar.tsx           # ReactECharts wrapper
│  │  │     ├─ shared/
│  │  │     │  └─ utils.ts                    # formatCategory, providerColor, rankBadge, getBarColor
│  │  │     └─ types/
│  │  │        └─ analysis.ts                 # BrandCount, CurrysPosition, ProcessedData, etc.
│  │  └─ config/
│  │     └─ clients.ts                        # ClientConfig registry (id, colors, keywords, dataFile)
│  ├─ package.json                            # CRA scripts + gh-pages deploy
│  ├─ tailwind.config.js, postcss.config.js   # TailwindCSS (utility classes used in UI)
│  └─ README.md
└─ README.md (repo-level)
```

Important: The previous static folders like `currys/` and `boux-avenue/` pages are no longer the primary path. Multi-client routing is handled by React Router (`/dashboard/:clientId`). Data is read from `public/data/*.json`.

---

## Frontend Architecture (post-refactor)

Single-responsibility components and hooks improve maintainability, testability, and performance.

- Container
  - `src/components/CompetitiveAnalysisDashboard.tsx`
    - Owns `activeTab` state and renders tab components
    - Consumes hooks to load data and derived chart options
    - Renders breadcrumb, header, and tab nav

- Hooks
  - `useClientData(config: ClientConfig)`
    - Attempts to fetch JSON from multiple paths:  
      `config.dataFile`, `/data/{id}.json`, `./data/{id}.json`, `${PUBLIC_URL}/data/{id}.json`  
      Returns `{ rawData, loading, error }`
  - `useProcessedData(rawData, brandKeywords)`
    - Computes a normalized `ProcessedData` object from raw JSON
    - Also builds and memoizes chart options for ECharts (treemap and category polar)
    - Returns `{ data, treemapOption, providerLegend, categoryPolarOption }`

- Tabs (presentational only; no side effects)
  - `OverviewTab.tsx` (Treemap, key insights, top competitors bar chart)
  - `CategoryTab.tsx` (Polar stacked bar by category)
  - `ProvidersTab.tsx` (Top brands per provider with Recharts)
  - `PositioningTab.tsx` (Detailed table of positions with styled badges/progress)
  - `ArchiveTab.tsx` (Prompt archive cards with provider/category badges)

- Charts
  - `charts/Treemap.tsx`: memoized ReactECharts wrapper
  - `charts/CategoryPolar.tsx`: memoized ReactECharts wrapper

- Shared Utils
  - `shared/utils.ts`  
    - `formatCategory`, `providerColor`, `rankBadge`, `getBarColor(entry, config)`

- Types
  - `types/analysis.ts`  
    - `BrandCount`, `CurrysPosition`, `ProviderPosition`, `ProcessedData`

- Client Configuration
  - `src/config/clients.ts`
    - Source of truth for each client (id, displayName, colors, keywords, `dataFile`).  
    - Used by landing page, router, and dashboard loader.

---

## Data Flow

1) `App.tsx`:
   - Router uses dynamic route `/dashboard/:clientId`
   - `DashboardWrapper` resolves `ClientConfig` via `getClientConfig(clientId)` and renders the dashboard

2) `CompetitiveAnalysisDashboard.tsx`:
   - `useClientData(config)` loads raw JSON (`rawData`)
   - `useProcessedData(rawData, config.brandKeywords)` computes:
     - `ProcessedData` aggregates (top brands, by category, by provider, client positions, competitors)
     - ECharts options (`treemapOption`, `categoryPolarOption`)
     - `providerLegend` for the treemap
   - Renders tabs and passes only required props into each tab

3) Tabs and Charts:
   - Tabs are presentational; they receive `data` (and chart `option` as needed)
   - Charts are memoized wrappers for performance and clear separation

---

## JSON Data Schema (expected fields)

Each JSON record should contain:
- `query`: string
- `query_parent_class`: string (category)
- `result_provider`: string (e.g., "OpenAI", "Anthropic", "Google", ...)
- `timestamp`: ISO datetime string (optional but used by Archive)
- `response`: string (optional; used by Archive to preview LLM output)
- `companies_mentioned`: array of:
  - `{ brand_name: string, text_snippet?: string }`

Derived fields in processing:
- `position`: index among companies mentioned starting at 1 for each response
- `total_companies`: total companies mentioned per response
- `normalized_position`: `position / total_companies` (0..1)

---

## How to Add a New Client

1) Add the dataset file:
   - Place JSON at `currys-analysis/public/data/{clientId}.json`

2) Register client:
   - Append to `currys-analysis/src/config/clients.ts`
   - Example:
     ```ts
     {
       id: 'acme',
       name: 'acme',
       displayName: 'ACME Corp',
       description: '...',
       category: '...',
       market: '...',
       dataFile: '/data/acme.json',
       primaryColor: '#FF5722',
       secondaryColor: '#3498db',
       brandKeywords: ['acme'],
       icon: '...' // decorative string
     }
     ```

3) Navigate to `/dashboard/acme` in dev.

Notes:
- `brandKeywords` are used to detect the client brand in analyses and color bars accordingly.
- `dataFile` can be absolute (`/data/acme.json`) for production build consistency.

### Access Control (Landing Page Passwords)
- Update client access gate whenever you add a new client:
  - File: `currys-analysis/src/components/LandingPage.tsx`
  - Add an entry to the `clientPasswords` map using the client's `id` as the key and a unique password string.
  - Example:
    ```
    acme: 'acme-2025',
    ```
- Route id vs. dataset filename casing:
  - Keep the client `id` lowercase for routing (e.g., `manypets` → `/dashboard/manypets`).
  - If the dataset filename uses different casing (e.g., `ManyPets.json`), set `dataFile` explicitly to match the filename exactly (e.g., `'/data/ManyPets.json'`).
- Quick validation checklist:
  - Start dev server (`npm start`)
  - On the landing page, click the new client card
  - Enter the configured password and verify navigation to `/dashboard/{clientId}`
  - Confirm data loads without 404s in the network panel

---

## How to Add a New Tab

1) Create a tab component under `src/components/dashboard/tabs/YourTab.tsx`.
2) Keep it presentational. Accept only the data you need via props.
3) Update `CompetitiveAnalysisDashboard.tsx`:
   - Add the tab key to the nav list
   - Render your tab conditionally when `activeTab === 'yourtab'`

Optional:
- Heavy visualizations can be split into a chart component in `charts/` and memoized.
- For performance, you can lazy-load tabs with `React.lazy` and wrap in `<Suspense>`.

---

## How to Add a New Chart

1) Create a reusable chart wrapper in `charts/` (e.g., `MyChart.tsx`).
2) Build ECharts options in a hook or inside `useProcessedData` and memoize with stable deps.
3) Pass the options to your chart component as `option`.

Best practices:
- Use `React.memo` for chart components.
- Keep pure data transforms inside `useProcessedData`.
- Avoid rebuilding options on every render; prefer `useMemo`.

---

## Styling & UI

- TailwindCSS utility classes are used for layout and design.
- Badges for providers and ranks are centralized:
  - `providerColor(provider: string)` maps providers to color classes
  - `rankBadge(position: number)` maps rank to style
- `getBarColor(entry, config)` highlights the client brand vs. others in charts.

---

## Local Development

From the repo root, work inside `currys-analysis/`:

- Install dependencies:
  - `npm install` (in `currys-analysis/`)
- Start dev server:
  - `npm start` (in `currys-analysis/`)
- Open: http://localhost:3000

Routing base:
- `App.tsx` computes basename. In production it uses `PUBLIC_URL` so routes work on GitHub Pages.

---

## Deployment

The CRA project is configured for GitHub Pages:

- Build:
  - `npm run build` (in `currys-analysis/`)
- Deploy (script example in `package.json`):
  - `"deploy": "cross-env PUBLIC_URL=https://overripedatascientist.github.io/llm-analysis npm run build && gh-pages -d build"`

The `PUBLIC_URL` ensures asset and router base paths are correct on GitHub Pages.

---

## Performance Notes

- Heavy computations and ECharts options are memoized in `useProcessedData`.
- Chart components are memoized (`React.memo`) to reduce re-renders.
- Consider virtualizing the Positioning table if datasets become very large (e.g., `react-window`).
- Optional improvement: lazy-load tab components using `React.lazy`.

---

## Coding Conventions

- TypeScript everywhere; shared types in `types/analysis.ts`.
- Keep hooks pure and side-effect free beyond their responsibility.
- Prefer dependency injection via props; tabs remain presentational.
- Avoid fetching inside tab components; fetching is centralized in `useClientData`.

---

## Changelog (Aug 2025 Refactor)

- Extracted data fetching to `useClientData`
- Extracted data processing and chart options to `useProcessedData`
- Split monolithic `CompetitiveAnalysisDashboard.tsx` into:
  - Container + 5 tab components + 2 chart components
  - Shared utils and types
- Behavior preserved; architecture simplified for maintainability and extensibility.

---

## Quick Reference

- Entry point: `src/App.tsx` (Router)
- Client registry: `src/config/clients.ts`
- Data location: `public/data/*.json`
- Dashboard container: `src/components/CompetitiveAnalysisDashboard.tsx`
- Hooks: `dashboard/hooks/`
- Tabs: `dashboard/tabs/`
- Charts: `dashboard/charts/`
- Utils: `dashboard/shared/utils.ts`
- Types: `dashboard/types/analysis.ts`

---

## Troubleshooting

- Data not loading:
  - Check network panel for 404s on `/data/{id}.json`
  - Ensure `clients.ts` `dataFile` points to `/data/{id}.json` and file exists in `public/data/`
- Routing issues in production:
  - Confirm `PUBLIC_URL` is set in deploy script and matches the GitHub Pages URL
- Styling anomalies:
  - Ensure Tailwind is configured (config files present) and class names are intact
- Charts not rendering:
  - Verify ECharts options shape; check console for ECharts errors
  - Ensure `echarts-for-react` and `echarts` are installed and versions compatible

---

This project represents a first-of-its-kind solution for the emerging challenge of AI visibility optimization, providing brands with the insights they need to succeed in an AI-first world.
