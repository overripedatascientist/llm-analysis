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
        displayName: 'Consumer Electronics Company',
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
        displayName: 'Fashion Company',
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
        displayName: 'Energy Company',
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
        displayName: 'Publishing Company',
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
        displayName: 'Healthcare Company',
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
        displayName: 'Investment Company',
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
        displayName: 'Marketing Agency',
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
        displayName: 'Technology Company',
        description: 'Data Centers & Colocation Services',
        category: 'Technology',
        market: 'Global Technology',
        dataFile: '/data/telehouse.json',
        primaryColor: '#0066CC',
        secondaryColor: '#00A651',
        brandKeywords: ['telehouse', 'tele house'],
        icon: 'server'
    },
    'toolstation': {
        id: 'toolstation',
        name: 'toolstation',
        displayName: 'Retail Company',
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
        displayName: 'Professional Services Company',
        description: 'Consulting & Professional Services',
        category: 'Professional Services',
        market: 'Global Professional Services',
        dataFile: '/data/pwc.json',
        primaryColor: '#FF7900',
        secondaryColor: '#4B4B4D',
        brandKeywords: ['pwc', 'pricewaterhousecoopers', 'price waterhouse coopers'],
        icon: 'briefcase'
    }
};

export const getClientConfig = (clientId: string): ClientConfig | undefined => {
    return clients[clientId];
};

export const getAllClients = (): ClientConfig[] => {
    return Object.values(clients);
  };
