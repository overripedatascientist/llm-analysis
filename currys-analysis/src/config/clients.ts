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
        displayName: 'Test Co.',
        description: 'Consumer Electronics & Tech Retail Analysis',
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
        displayName: 'Boux Avenue',
        description: 'Lingerie & Intimate Apparel Analysis',
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
        displayName: 'ADNOC',
        description: 'Maximum Energy Emissions',
        category: 'Energy',
        market: 'UAE Energy',
        dataFile: '/data/adnoc.json',
        primaryColor: '#FCCD00',
        secondaryColor: '#1F52A7',
        brandKeywords: ['adnoc', 'a.d.n.o.c.', 'Abu Dhabi National Oil Company', 'ADNOC Group'],
        icon: 'oil-can'
    }
};

export const getClientConfig = (clientId: string): ClientConfig | undefined => {
    return clients[clientId];
};

export const getAllClients = (): ClientConfig[] => {
    return Object.values(clients);
  };