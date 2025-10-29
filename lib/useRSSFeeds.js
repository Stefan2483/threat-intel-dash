import { useState, useEffect } from 'react';

const FALLBACK_FEEDS = [
  {
    id: 1,
    name: 'US-CERT Alerts',
    source: 'cisa.gov/rss',
    count: 5,
    color: 'cyan',
    articles: [
      {
        id: 101,
        title: 'Critical Apache Vulnerability Exploited',
        shortTitle: 'Apache RCE Vulnerability',
        source: 'cisa.gov/rss',
        content: 'The Cybersecurity and Infrastructure Security Agency (CISA) has issued an emergency alert regarding a critical zero-day vulnerability in Apache HTTP Server (CVE-2024-45678). This remote code execution vulnerability is being actively exploited by threat actors in the wild.',
        image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
        metadata: {
          cve: 'CVE-2024-45678',
          country: 'Global',
          company: 'Apache Software Foundation',
          malware: 'N/A',
          risk: 'CRITICAL',
          affected: 'Apache HTTP Server',
          attackVector: 'Network/Remote'
        }
      }
    ]
  }
];

export function useRSSFeeds() {
  const [feeds, setFeeds] = useState(FALLBACK_FEEDS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchFeeds() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/rss-feeds');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (mounted) {
          const validFeeds = data.feeds.filter(feed => feed.articles && feed.articles.length > 0);

          if (validFeeds.length > 0) {
            setFeeds(validFeeds);
            setLastUpdated(data.lastUpdated);
          } else {
            setFeeds(FALLBACK_FEEDS);
          }
        }
      } catch (err) {
        console.error('Error fetching RSS feeds:', err);
        if (mounted) {
          setError(err.message);
          setFeeds(FALLBACK_FEEDS);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchFeeds();

    const intervalId = setInterval(fetchFeeds, 5 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return { feeds, loading, error, lastUpdated };
}
