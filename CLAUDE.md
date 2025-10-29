# Threat Intelligence Dashboard - threatintel.pro

## Project Overview

A cutting-edge cybersecurity threat intelligence dashboard with an Oblivion movie-inspired aesthetic. The application displays real-time RSS feeds from multiple cybersecurity sources including US-CERT, The Hacker News, Krebs on Security, Bleeping Computer, and SANS ISC.

**Current Status**: Tiles version is now the default landing page with auto-redirect from index.

### Key Features

- **Real-time RSS Feed Integration**: Automatically fetches and displays the latest cybersecurity news from 5 major sources
- **Default Dashboard**: Tiles version (auto-redirects from root)
- **Tiles Dashboard Features**:
  - Auto-play functionality with synchronized progress tracking
  - 3 progress bars in header (ARTICLE, SOURCE, FEED)
  - CRT scan line effects on images and sidebar
  - Typewriter effect for article content with real-time progress
  - Bottom info tiles (appear after 5-second countdown)
  - Red blinking "READ FULL ARTICLE" button
  - Floating particles effect
  - Cyberpunk-style date display (D/M/Y/W format)
- **Oblivion-Inspired UI**: Cyberpunk aesthetic with:
  - Animated grid backgrounds
  - CRT scan line effects (horizontal on images, vertical on sidebar)
  - Holographic effects
  - Neon cyan/blue color scheme
  - Compact header for maximum content space
- **Smart Article Rotation**: Articles only change after FEED progress completes (10 seconds)
- **Auto-refresh**: Feeds update every 5 minutes automatically

---

## Tech Stack

- **Framework**: Next.js 14 (React-based)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **RSS Parsing**: rss-parser
- **Deployment**: Vercel-optimized

---

## Project Structure

```
threatintel.pro/
├── pages/
│   ├── _app.js                          # Next.js app wrapper
│   ├── index.js                         # Landing page with version selector
│   ├── dashboard-markup.js              # Markup version dashboard page
│   ├── dashboard-tiles.js               # Tiles version dashboard page
│   └── api/
│       └── rss-feeds.js                 # API endpoint for fetching RSS feeds
├── components/
│   ├── OblivionThreatIntelMarkup.jsx    # Markup dashboard component
│   └── OblivionDashboardTiles.jsx       # Tiles dashboard component
├── lib/
│   └── useRSSFeeds.js                   # Custom React hook for RSS data
├── styles/
│   └── globals.css                      # Global styles & custom scrollbar
├── public/                              # Static assets
├── package.json                         # Dependencies
├── next.config.js                       # Next.js configuration
├── tailwind.config.js                   # Tailwind configuration
├── postcss.config.js                    # PostCSS configuration
├── jsconfig.json                        # Path aliases configuration
└── vercel.json                          # Vercel deployment config
```

---

## Setup & Installation

### Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager

### Local Development

1. **Clone/Navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Test production build locally**
   ```bash
   npm run start
   ```

---

## RSS Feed Sources

The application fetches real-time data from these cybersecurity sources:

1. **US-CERT (CISA)** - `https://www.cisa.gov/cybersecurity-advisories/all.xml`
2. **The Hacker News** - `https://feeds.feedburner.com/TheHackersNews`
3. **Krebs on Security** - `https://krebsonsecurity.com/feed/`
4. **Bleeping Computer** - `https://www.bleepingcomputer.com/feed/`
5. **SANS ISC** - `https://isc.sans.edu/rssfeed.xml`

### How RSS Integration Works

1. **API Route** (`pages/api/rss-feeds.js`):
   - Fetches RSS feeds from all sources in parallel
   - Parses XML/RSS content using `rss-parser`
   - Extracts metadata (CVE numbers, risk levels, etc.)
   - Returns JSON with structured data

2. **React Hook** (`lib/useRSSFeeds.js`):
   - Manages feed data state
   - Handles loading and error states
   - Auto-refreshes every 5 minutes
   - Provides fallback data if feeds fail

3. **Components**:
   - Use the `useRSSFeeds()` hook to get live data
   - Display articles with typewriter effects
   - Show threat metadata in structured format

---

## Key Components Explained

### Landing Page (`pages/index.js`)
- Entry point with animated background
- Two cards to select dashboard version
- Features corner brackets, grid animations, and hexagonal patterns

### Dashboard - Markup Version
**Features:**
- 3-column layout (Feed List | Article Reader | Metadata)
- Numbered article lists by source
- Real-time clock
- RSS source indicator with blinking effect
- Typewriter effect for article content
- Threat analysis sidebar with risk badges

### Dashboard - Tiles Version
**Features:**
- Grid-based tile layout
- Auto-play functionality with progress bars
- Play/pause controls
- Live threat map placeholder
- Additional metrics tiles (trending threats, alerts, active feeds)
- More compact article display

### RSS Feed Hook (`lib/useRSSFeeds.js`)
```javascript
const { feeds, loading, error, lastUpdated } = useRSSFeeds();
```
Returns:
- `feeds`: Array of feed objects with articles
- `loading`: Boolean loading state
- `error`: Error message if fetch fails
- `lastUpdated`: Timestamp of last successful fetch

---

## Customization Guide

### Changing RSS Feed Sources

Edit `pages/api/rss-feeds.js`:

```javascript
const RSS_FEEDS = [
  {
    id: 1,
    name: 'Your Feed Name',
    source: 'yoursite.com',
    url: 'https://yoursite.com/rss',
    color: 'cyan'
  }
  // Add more feeds...
];
```

### Adjusting Typewriter Speed

In component files, modify the interval:

```javascript
const interval = setInterval(() => {
  // Change 15 to adjust speed (lower = faster)
}, 15);
```

### Changing Color Scheme

Update Tailwind classes and inline styles:
- Primary: `cyan-400` → `your-color-400`
- Background: `black` → `your-bg-color`
- Glow effects: `rgba(0, 217, 255, ...)` → `rgba(R, G, B, ...)`

### Modifying Refresh Interval

In `lib/useRSSFeeds.js`:

```javascript
// Change 5 * 60 * 1000 (5 minutes) to your desired interval
const intervalId = setInterval(fetchFeeds, 5 * 60 * 1000);
```

---

## Deployment to Vercel

### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: GitHub Integration

1. Push code to GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel auto-detects Next.js and deploys

### Method 3: Direct Upload

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Drag and drop your project folder
4. Follow prompts

**Note**: Vercel automatically configures everything for Next.js projects. No additional configuration needed!

---

## Environment Variables

Currently, no environment variables are required. If you need to add API keys or custom configurations:

1. Create `.env.local`:
   ```env
   NEXT_PUBLIC_API_KEY=your_key_here
   ```

2. Add in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add your variables

---

## Troubleshooting

### Port 3000 already in use
```bash
npm run dev -- -p 3001
```

### Module not found errors
```bash
rm -rf node_modules .next
npm install
```

### Build errors
```bash
# Check Node version (should be 18+)
node --version

# Clear Next.js cache
rm -rf .next
npm run build
```

### RSS feeds not loading
- Check CORS settings in `pages/api/rss-feeds.js`
- Verify RSS URLs are accessible
- Check browser console for errors
- The app will use fallback data if feeds fail

### Vercel deployment fails
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard
- Verify Node.js version in Vercel settings (should be 18.x or 20.x)

---

## Performance Optimization

- **Dynamic Imports**: Components use dynamic imports to reduce initial load
- **Image CDN**: Images loaded from Unsplash CDN
- **CSS Transforms**: Animations use GPU-accelerated transforms
- **Feed Caching**: RSS data cached in React state with 5-minute refresh
- **Error Boundaries**: Fallback data ensures app works even if feeds fail

---

## Security Considerations

This is a demo dashboard with simulated/aggregated data. For production use:

1. **Authentication**: Implement user authentication (NextAuth.js recommended)
2. **Rate Limiting**: Add rate limiting to API routes
3. **Input Sanitization**: Sanitize RSS feed content (already strips HTML tags)
4. **Environment Variables**: Use env vars for sensitive data
5. **HTTPS Only**: Ensure deployment uses HTTPS (Vercel does this automatically)
6. **Content Security Policy**: Add CSP headers in `next.config.js`

---

## Future Enhancements

Potential features to add:

- [ ] Search and filter functionality
- [ ] Bookmarking/favorites system
- [ ] Export threats to PDF/CSV
- [ ] Real-time threat map with actual data
- [ ] User preferences (theme, refresh rate)
- [ ] Push notifications for critical threats
- [ ] Integration with threat intelligence APIs (VirusTotal, AlienVault, etc.)
- [ ] Historical data and trend analysis
- [ ] Multi-language support
- [ ] Dark/light theme toggle

---

## Browser Compatibility

Tested and working on:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (responsive design)

**Note**: Some animations may perform better on desktop browsers with hardware acceleration.

---

## License

MIT License - Free to use for personal or commercial purposes.

---

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **RSS Parser**: https://github.com/rbren/rss-parser

---

## Development Notes

### Component Architecture
- Each dashboard version is a self-contained component
- Shared logic extracted to custom hooks
- API routes handle server-side RSS fetching to avoid CORS issues
- Path aliases (@/) configured for cleaner imports

### State Management
- Local React state for UI interactions
- Custom hook for RSS data management
- No external state management library needed

### Styling Approach
- Tailwind utility classes for most styling
- Inline styles for dynamic animations
- Custom CSS for scrollbars and special effects
- JSX styles for keyframe animations

---

## Credits

- **Design Inspiration**: Oblivion (2013) movie UI
- **Icons**: Lucide React
- **Placeholder Images**: Unsplash
- **RSS Sources**: Various cybersecurity news outlets

---

**Built with love for the cybersecurity community**
