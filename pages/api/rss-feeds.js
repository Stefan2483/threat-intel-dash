import Parser from 'rss-parser';

const parser = new Parser({
  customFields: {
    item: [
      'description',
      'content',
      'content:encoded',
      'pubDate',
      'media:content',
      'media:thumbnail',
      'enclosure',
      'itunes:image'
    ]
  },
  timeout: 10000,
  maxRedirects: 3
});

// Whitelist of allowed RSS feed URLs (security measure)
const RSS_FEEDS = [
  {
    id: 1,
    name: 'US-CERT Alerts',
    source: 'cisa.gov/rss',
    url: 'https://www.cisa.gov/cybersecurity-advisories/all.xml',
    color: 'cyan'
  },
  {
    id: 2,
    name: 'The Hacker News',
    source: 'thehackernews.com',
    url: 'https://feeds.feedburner.com/TheHackersNews',
    color: 'blue'
  },
  {
    id: 3,
    name: 'Krebs on Security',
    source: 'krebsonsecurity.com',
    url: 'https://krebsonsecurity.com/feed/',
    color: 'green'
  },
  {
    id: 4,
    name: 'Bleeping Computer',
    source: 'bleepingcomputer.com',
    url: 'https://www.bleepingcomputer.com/feed/',
    color: 'purple'
  },
  {
    id: 5,
    name: 'SANS ISC',
    source: 'isc.sans.edu',
    url: 'https://isc.sans.edu/rssfeed.xml',
    color: 'orange'
  }
];

const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;
const MAX_MAP_SIZE = 10000;

function checkRateLimit(identifier) {
  const now = Date.now();
  const sanitizedId = String(identifier).slice(0, 100).replace(/[^\w\.:]/g, '');
  const userRequests = rateLimitMap.get(sanitizedId) || [];
  const recentRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  recentRequests.push(now);
  rateLimitMap.set(sanitizedId, recentRequests);

  if (rateLimitMap.size > MAX_MAP_SIZE) {
    const cutoff = now - RATE_LIMIT_WINDOW;
    const keysToDelete = [];
    for (const [key, timestamps] of rateLimitMap.entries()) {
      if (timestamps.every(t => t < cutoff)) {
        keysToDelete.push(key);
      }
    }
    if (keysToDelete.length < rateLimitMap.size - MAX_MAP_SIZE) {
      const entries = Array.from(rateLimitMap.entries());
      entries.sort((a, b) => Math.max(...b[1]) - Math.max(...a[1]));
      const toRemove = entries.slice(MAX_MAP_SIZE);
      toRemove.forEach(([key]) => keysToDelete.push(key));
    }
    keysToDelete.forEach(key => rateLimitMap.delete(key));
  }

  return true;
}

function sanitizeString(str) {
  if (typeof str !== 'string') return '';

  let sanitized = str.normalize('NFKC').replace(/\0/g, '');
  sanitized = sanitized.replace(/<[^>]*>/g, '');

  sanitized = sanitized
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/&lt;script/gi, '')
    .replace(/&lt;iframe/gi, '')
    .replace(/&#/g, '');

  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return sanitized.slice(0, 2000);
}

const CVE_PATTERN = /CVE-\d{4}-\d{4,7}/i;
const CRITICAL_PATTERN = /\b(critical|zero-day|exploit|breach|actively exploited)\b/i;
const HIGH_PATTERN = /\b(high severity|severe|ransomware|apt)\b/i;
const LOW_PATTERN = /\b(low|minor)\b/i;
const MALWARE_PATTERN = /\b(malware|trojan|ransomware)\b/i;

function extractMetadata(item, feedSource) {
  const content = sanitizeString(item.content || item['content:encoded'] || item.description || '');
  const title = sanitizeString(item.title || 'Untitled');

  const cveMatch = content.match(CVE_PATTERN);
  const cve = cveMatch ? cveMatch[0].toUpperCase() : 'N/A';

  let risk = 'MEDIUM';
  if (CRITICAL_PATTERN.test(title) || CRITICAL_PATTERN.test(content.slice(0, 500))) {
    risk = 'CRITICAL';
  } else if (HIGH_PATTERN.test(title) || HIGH_PATTERN.test(content.slice(0, 500))) {
    risk = 'HIGH';
  } else if (LOW_PATTERN.test(title)) {
    risk = 'LOW';
  }

  return {
    cve,
    country: 'Global',
    company: 'Multiple',
    malware: MALWARE_PATTERN.test(content.slice(0, 500)) ? 'Detected' : 'N/A',
    risk,
    affected: 'Various Systems',
    attackVector: 'Multiple Vectors'
  };
}

function isValidImageUrl(urlString) {
  try {
    const url = new URL(urlString);

    // Only allow HTTPS
    if (url.protocol !== 'https:') {
      return false;
    }

    const hostname = url.hostname.toLowerCase();

    // Block localhost and local domains
    if (hostname === 'localhost' || hostname.endsWith('.local')) {
      return false;
    }

    // Block private IP addresses
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(hostname)) {
      const parts = hostname.split('.');
      const first = parseInt(parts[0]);
      const second = parseInt(parts[1]);

      // Block private IP ranges: 10.x.x.x, 192.168.x.x, 172.16-31.x.x, 127.x.x.x
      if (first === 10 || first === 127 ||
          (first === 192 && second === 168) ||
          (first === 172 && second >= 16 && second <= 31)) {
        return false;
      }
    }

    // Check if URL ends with common image extensions
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|avif)(\?.*)?$/i;
    if (imageExtensions.test(url.pathname)) {
      return true;
    }

    // Allow known safe image hosting domains
    const trustedImageDomains = [
      'images.unsplash.com',
      'unsplash.com',
      'i.imgur.com',
      'media.cnn.com',
      'cdn.mos.cms.futurecdn.net',
      'krebsonsecurity.com',
      'www.bleepstatic.com',
      'thehackernews.com',
      'feeds.feedburner.com',
      'isc.sans.edu'
    ];

    const isTrustedDomain = trustedImageDomains.some(domain =>
      hostname === domain || hostname.endsWith('.' + domain)
    );

    if (isTrustedDomain) {
      return true;
    }

    // Allow images from the same domain as the RSS feeds
    const rssFeedDomains = [
      'cisa.gov',
      'thehackernews.com',
      'krebsonsecurity.com',
      'bleepingcomputer.com',
      'sans.edu'
    ];

    const isRssFeedDomain = rssFeedDomains.some(domain =>
      hostname === domain || hostname.endsWith('.' + domain)
    );

    return isRssFeedDomain;
  } catch {
    return false;
  }
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  const realIp = req.headers['x-real-ip'];
  const socketIp = req.socket.remoteAddress;

  if (forwarded) {
    const ips = forwarded.split(',').map(ip => ip.trim());
    return ips[0];
  }

  return realIp || socketIp || 'unknown';
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];

  if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const identifier = getClientIp(req);
  if (!checkRateLimit(identifier)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({
      error: 'Too many requests',
      retryAfter: 60
    });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');

  try {
    const feedPromises = RSS_FEEDS.map(async (feedConfig) => {
      try {
        const feed = await parser.parseURL(feedConfig.url);

        const placeholderImages = [
          'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop',
          'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop'
        ];

        const articles = feed.items.slice(0, 5).map((item, index) => {
          const imageIndex = (feedConfig.id * 5 + index) % placeholderImages.length;

          // Try to get image from RSS feed in order of preference
          let imageUrl = null;

          // 1. Check media:content or media:thumbnail (common in news feeds)
          if (item['media:content']?.$ && item['media:content'].$.url) {
            if (isValidImageUrl(item['media:content'].$.url)) {
              imageUrl = item['media:content'].$.url;
            }
          }

          // 2. Check enclosure (podcast/media attachments)
          if (!imageUrl && item.enclosure?.url) {
            if (isValidImageUrl(item.enclosure.url)) {
              imageUrl = item.enclosure.url;
            }
          }

          // 3. Check itunes:image (common in some feeds)
          if (!imageUrl && item.itunes?.image) {
            if (isValidImageUrl(item.itunes.image)) {
              imageUrl = item.itunes.image;
            }
          }

          // 4. Check content:encoded or description for img tags
          if (!imageUrl) {
            const contentHtml = item['content:encoded'] || item.content || item.description || '';
            const imgMatch = contentHtml.match(/<img[^>]+src=["']([^"']+)["']/i);
            if (imgMatch && imgMatch[1]) {
              if (isValidImageUrl(imgMatch[1])) {
                imageUrl = imgMatch[1];
              }
            }
          }

          // 5. Fallback to placeholder if no valid image found
          if (!imageUrl) {
            imageUrl = placeholderImages[imageIndex];
          }

          let link = '';
          if (item.link) {
            try {
              const url = new URL(item.link);
              if (url.protocol === 'http:' || url.protocol === 'https:') {
                const hostname = url.hostname.toLowerCase();
                const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
                const isPrivateOrLocal =
                  hostname === 'localhost' ||
                  hostname.endsWith('.local') ||
                  (ipPattern.test(hostname) && (
                    hostname.startsWith('127.') ||
                    hostname.startsWith('10.') ||
                    hostname.startsWith('192.168.') ||
                    hostname.match(/^172\.(1[6-9]|2[0-9]|3[01])\./)
                  ));

                if (!isPrivateOrLocal) {
                  link = item.link;
                }
              }
            } catch {
            }
          }

          const metadata = extractMetadata(item, feedConfig.source);

          return {
            id: feedConfig.id * 100 + index + 1,
            title: sanitizeString(item.title || 'Untitled').slice(0, 200),
            shortTitle: sanitizeString(item.title || 'Untitled').slice(0, 40),
            source: feedConfig.source,
            content: sanitizeString(item.content || item['content:encoded'] || item.description || '').slice(0, 1000),
            image: imageUrl,
            link: link,
            pubDate: item.pubDate || new Date().toISOString(),
            metadata: metadata
          };
        });

        return {
          id: feedConfig.id,
          name: feedConfig.name,
          source: feedConfig.source,
          color: feedConfig.color,
          count: articles.length,
          articles
        };
      } catch (error) {
        console.error(`Error fetching feed ${feedConfig.name}:`, error.message);

        return {
          id: feedConfig.id,
          name: feedConfig.name,
          source: feedConfig.source,
          color: feedConfig.color,
          count: 0,
          articles: [],
          error: 'Feed temporarily unavailable'
        };
      }
    });

    const feeds = await Promise.all(feedPromises);

    res.status(200).json({
      feeds,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in RSS feed handler:', error);
    res.status(500).json({
      error: 'Service temporarily unavailable'
    });
  }
}
