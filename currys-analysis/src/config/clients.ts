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
    }
};

export const getClientConfig = (clientId: string): ClientConfig | undefined => {
    return clients[clientId];
};

export const getAllClients = (): ClientConfig[] => {
    return Object.values(clients);
  };
