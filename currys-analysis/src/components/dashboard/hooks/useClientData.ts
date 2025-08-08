import { useEffect, useState } from 'react';
import type { ClientConfig } from '../../../config/clients';

export function useClientData(config: ClientConfig) {
  const [rawData, setRawData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const possiblePaths = [
          config.dataFile,
          `/data/${config.id}.json`,
          `./data/${config.id}.json`,
          `${process.env.PUBLIC_URL}/data/${config.id}.json`
        ];

        let jsonData: any[] | null = null;
        let lastError: any = null;

        for (const path of possiblePaths) {
          try {
            // eslint-disable-next-line no-console
            console.log('Trying to fetch data from:', path);
            const response = await fetch(path);
            if (response.ok) {
              const contentType = response.headers.get('content-type') || '';
              if (contentType.includes('application/json')) {
                jsonData = await response.json();
                // eslint-disable-next-line no-console
                console.log('Data loaded successfully from:', path, Array.isArray(jsonData) ? jsonData.length : 'n/a', 'entries');
                break;
              } else {
                // eslint-disable-next-line no-console
                console.warn('Response is not JSON:', contentType, 'from path:', path);
              }
            } else {
              // eslint-disable-next-line no-console
              console.warn('HTTP error:', response.status, 'for path:', path);
            }
          } catch (err) {
            lastError = err;
            // eslint-disable-next-line no-console
            console.warn('Failed to fetch from:', path, err);
          }
        }

        if (!mounted) return;

        if (!jsonData) {
          throw lastError || new Error('Could not load data from any path');
        }

        setRawData(jsonData);
        setLoading(false);
      } catch (e: any) {
        if (!mounted) return;
        // eslint-disable-next-line no-console
        console.error('Error fetching data:', e);
        setError(e?.message || 'Unknown error');
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [config.dataFile, config.id]);

  return { rawData, loading, error };
}
