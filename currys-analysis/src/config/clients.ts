export interface ClientConfig {
    id: string;
    name: string;
    displayName: string;
    description: string;
    category: string;
    market: string;
    dataFile: string;
    primaryColor: string;
    secondaryColor: string;
    brandKeywords: string[];
    icon: string;
}

export const clients: Record<string, ClientConfig> = {
    currys: {
        id: 'currys',
        name: 'currys',
        // displayName: 'Currys',
        displayName: 'Currys — UK Consumer Electronics Retailer',
        description: 'Consumer Electronics & Tech Retail',
        category: 'Electronics',
        market: 'UK Retail',
        dataFile: '/data/currys.json',
        primaryColor: '#FF5722',
        secondaryColor: '#3498db',
        brandKeywords: ['currys', 'currys pc world', 'curry'],
        icon: 'electronics'
    },
    'boux-avenue': {
        id: 'boux-avenue',
        name: 'boux-avenue',
        displayName: 'Boux Avenue — Lingerie & Intimates Retailer',
        description: 'Lingerie & Intimate Apparel',
        category: 'Fashion',
        market: 'UK Retail',
        dataFile: '/data/boux-avenue.json',
        primaryColor: '#E91E63',
        secondaryColor: '#673AB7',
        brandKeywords: ['boux', 'boux avenue', 'bouxavenue', 'boux-avenue'],
        icon: 'fashion'
    },
    'adnoc': {
        id: 'adnoc',
        name: 'adnoc',
        displayName: 'ADNOC — UAE National Energy Company',
        description: 'Diversified Energy and Sustainability',
        category: 'Energy',
        market: 'UAE Energy',
        dataFile: '/data/adnoc.json',
        primaryColor: '#FCCD00',
        secondaryColor: '#1F52A7',
        brandKeywords: ['adnoc', 'a.d.n.o.c.', 'Abu Dhabi National Oil Company', 'ADNOC Group'],
        icon: 'oil-can'
    },
    'callisto': {
        id: 'callisto',
        name: 'callisto',
        displayName: 'Callisto Media — Consumer Publishing',
        description: 'Consumer-focused Books and Audiobooks',
        category: 'Publishing',
        market: 'US Publishing',
        dataFile: '/data/callisto.json',
        primaryColor: '#E6543B',
        secondaryColor: '#E6543B',
        brandKeywords: ['callisto', 'calisto'],
        icon: 'book'
    },
    'sensodyne': {
        id: 'sensodyne',
        name: 'sensodyne',
        displayName: 'Sensodyne — Oral Care Brand',
        description: 'Oral Care & Dental Health Products',
        category: 'Healthcare',
        market: 'Global Healthcare',
        dataFile: '/data/sensodyne.json',
        primaryColor: '#2E86AB',
        secondaryColor: '#A23B72',
        brandKeywords: ['sensodyne', 'sensodyne toothpaste'],
        icon: 'heart'
    },
    'cvc-capital-partners': {
        id: 'cvc-capital-partners',
        name: 'cvc-capital-partners',
        displayName: 'CVC Capital Partners — Private Equity',
        description: 'Private Equity & Investment Management',
        category: 'Private Equity',
        market: 'Global Investment',
        dataFile: '/data/cvc-capital-partners.json',
        primaryColor: '#1B365D',
        secondaryColor: '#4A90A4',
        brandKeywords: ['cvc', 'cvc capital', 'cvc capital partners', 'cvc partners'],
        icon: 'chart-line'
    },
    'found': {
        id: 'found',
        name: 'found',
        displayName: 'Found — Digital Marketing Agency',
        description: 'Digital Marketing & Creative Services',
        category: 'Marketing',
        market: 'UK Marketing',
        dataFile: '/data/found.json',
        primaryColor: '#FF6B35',
        secondaryColor: '#004E89',
        brandKeywords: ['found', 'found agency', 'found digital'],
        icon: 'megaphone'
    },
    'telehouse': {
        id: 'telehouse',
        name: 'telehouse',
        displayName: 'Telehouse — Data Centers & Colocation',
        description: 'Data Centers & Colocation Services',
        category: 'Technology',
        market: 'Global Technology',
        dataFile: '/data/telehouse.json',
        primaryColor: '#0066CC',
        secondaryColor: '#00A651',
        brandKeywords: ['telehouse', 'tele house'],
        icon: 'server'
    },
    'digital-realty': {
        id: 'digital-realty',
        name: 'digital-realty',
        displayName: 'Digital Realty — Data Centers (US)',
        description: 'Data Centers & Colocation Services',
        category: 'Technology',
        market: 'US Data Centers',
        dataFile: '/data/digital-realty.json',
        primaryColor: '#0E6EB8',
        secondaryColor: '#00A1E0',
        brandKeywords: ['digital realty', 'digital realty trust', 'digital-realty', 'digitalrealty', 'dlr'],
        icon: 'server'
    },
    'toolstation': {
        id: 'toolstation',
        name: 'toolstation',
        displayName: 'Toolstation — Trade Tools & Hardware',
        description: 'Tools & Hardware Retail',
        category: 'Retail',
        market: 'UK Retail',
        dataFile: '/data/toolstation.json',
        primaryColor: '#E31E24',
        secondaryColor: '#FFA500',
        brandKeywords: ['toolstation', 'tool station'],
        icon: 'wrench'
    },
    'pwc': {
        id: 'pwc',
        name: 'pwc',
        displayName: 'PwC — Global Professional Services',
        description: 'Consulting & Professional Services',
        category: 'Professional Services',
        market: 'Global Professional Services',
        dataFile: '/data/pwc.json',
        primaryColor: '#FF7900',
        secondaryColor: '#4B4B4D',
        brandKeywords: ['pwc', 'pricewaterhousecoopers', 'price waterhouse coopers'],
        icon: 'briefcase'
    },
    'pwc_custom': {
        id: 'pwc_custom',
        name: 'pwc_custom',
        displayName: 'PwC — Custom Search (Global)',
        description: 'Consulting & Professional Services',
        category: 'Professional Services',
        market: 'Global Professional Services',
        dataFile: '/data/pwc_custom.json',
        primaryColor: '#FF7900',
        secondaryColor: '#4B4B4D',
        brandKeywords: ['pwc', 'pricewaterhousecoopers', 'price waterhouse coopers'],
        icon: 'briefcase'
    },
    'pwc_custom_us': {
        id: 'pwc_custom_us',
        name: 'pwc_custom_us',
        displayName: 'PwC — Custom Search (US)',
        description: 'Consulting & Professional Services',
        category: 'Professional Services',
        market: 'US Professional Services',
        dataFile: '/data/pwc_custom_us.json',
        primaryColor: '#FF7900',
        secondaryColor: '#4B4B4D',
        brandKeywords: ['pwc', 'pricewaterhousecoopers', 'price waterhouse coopers'],
        icon: 'briefcase'
    },
    'pwc_us': {
        id: 'pwc_us',
        name: 'pwc_us',
        displayName: 'PwC — US Professional Services',
        description: 'Consulting & Professional Services',
        category: 'Professional Services',
        market: 'US Professional Services',
        dataFile: '/data/pwc_us.json',
        primaryColor: '#FF7900',
        secondaryColor: '#4B4B4D',
        brandKeywords: ['pwc', 'pricewaterhousecoopers', 'price waterhouse coopers'],
        icon: 'briefcase'
    },
    'napier_uk': {
        id: 'napier_uk',
        name: 'napier_uk',
        displayName: 'Napier — FinCrime Compliance (UK)',
        description: 'Financial crime compliance and AML platform',
        category: 'FinTech',
        market: 'UK Market',
        dataFile: '/data/napier_uk.json',
        primaryColor: '#0E7C86',
        secondaryColor: '#F2B134',
        brandKeywords: ['napier', 'napier ai'],
        icon: 'shield'
    },
    'napier_us': {
        id: 'napier_us',
        name: 'napier_us',
        displayName: 'Napier — FinCrime Compliance (US)',
        description: 'Financial crime compliance and AML platform',
        category: 'FinTech',
        market: 'US Market',
        dataFile: '/data/napier_us.json',
        primaryColor: '#0E7C86',
        secondaryColor: '#F2B134',
        brandKeywords: ['napier', 'napier ai'],
        icon: 'shield'
    },
    'napier_custom': {
        id: 'napier_custom',
        name: 'napier_custom',
        displayName: 'Napier — FinCrime Compliance (Custom)',
        description: 'Financial crime compliance and AML platform',
        category: 'FinTech',
        market: 'Global Market',
        dataFile: '/data/napier_custom.json',
        primaryColor: '#0E7C86',
        secondaryColor: '#F2B134',
        brandKeywords: ['napier', 'napier ai'],
        icon: 'shield'
    },
    'taggstar': {
        id: 'taggstar',
        name: 'taggstar',
        displayName: 'Taggstar — Social Proof for E-commerce',
        description: 'Social proof and product recommendations for e-commerce',
        category: 'Technology',
        market: 'Global E-commerce',
        dataFile: '/data/taggstar.json',
        primaryColor: '#9C27B0',
        secondaryColor: '#FF9800',
        brandKeywords: ['taggstar', 'tagstarr'],
        icon: 'star'
    },
    'oag': {
        id: 'oag',
        name: 'oag',
        displayName: 'OAG — Global Flight Data & Analytics',
        description: 'Global flight data and analytics',
        category: 'Aviation',
        market: 'Global Aviation',
        dataFile: '/data/oag.json',
        primaryColor: '#1E88E5',
        secondaryColor: '#FFC107',
        brandKeywords: ['oag'],
        icon: 'plane'
    },
    'secret_sales': {
        id: 'secret_sales',
        name: 'secret_sales',
        displayName: 'Secret Sales — Designer Fashion Outlet',
        description: 'Designer and premium fashion outlet marketplace',
        category: 'Fashion',
        market: 'UK Retail',
        dataFile: '/data/secret_sales.json',
        primaryColor: '#111827',
        secondaryColor: '#F59E0B',
        brandKeywords: ['secret sales', 'secretsales', 'secret-sales'],
        icon: 'fashion'
    },
    'braidr': {
        id: 'braidr',
        name: 'braidr',
        displayName: 'Braidr — Data Science Consultancy',
        description: 'Data science consulting and analytics services',
        category: 'Consulting',
        market: 'Global Consulting',
        dataFile: '/data/braidr.json',
        primaryColor: '#0E6EB8',
        secondaryColor: '#00A1E0',
        brandKeywords: ['braidr'],
        icon: 'chart-line'
    },
    'disrupt': {
        id: 'disrupt',
        name: 'disrupt',
        displayName: 'Disrupt — Influencer Marketing Agency',
        description: 'Influencer marketing and creator campaigns',
        category: 'Marketing',
        market: 'UK Marketing',
        dataFile: '/data/disrupt.json',
        primaryColor: '#FF1E56',
        secondaryColor: '#2D3142',
        brandKeywords: ['disrupt', 'disrupt agency'],
        icon: 'megaphone'
    },
    'manypets': {
        id: 'manypets',
        name: 'manypets',
        displayName: 'ManyPets — Pet Insurance',
        description: 'Pet insurance and wellness plans',
        category: 'Insurance',
        market: 'UK Insurance',
        dataFile: '/data/manypets.json',
        primaryColor: '#16A34A',
        secondaryColor: '#F59E0B',
        brandKeywords: ['manypets', 'many pets'],
        icon: 'heart'
    },
    'seed': {
        id: 'seed',
        name: 'seed',
        displayName: 'Seed — AI Video Production Studio',
        description: 'AI-driven video production and content creation',
        category: 'Marketing',
        market: 'Global Marketing',
        dataFile: '/data/seed.json',
        primaryColor: '#10B981',
        secondaryColor: '#111827',
        brandKeywords: ['seed', 'seed ai'],
        icon: 'video'
    },
    'peacocks': {
        id: 'peacocks',
        name: 'peacocks',
        displayName: 'Peacocks — Value Fashion Retailer',
        description: 'Affordable UK fashion retailer',
        category: 'Fashion',
        market: 'UK Retail',
        dataFile: '/data/peacocks.json',
        primaryColor: '#1E40AF',
        secondaryColor: '#F59E0B',
        brandKeywords: ['peacocks'],
        icon: 'fashion'
    }
};

export const getClientConfig = (clientId: string): ClientConfig | undefined => {
    return clients[clientId];
};

export const getAllClients = (): ClientConfig[] => {
    return Object.values(clients);
  };
