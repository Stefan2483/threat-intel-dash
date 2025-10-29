import React, { useState, useEffect } from 'react';
import { Rss, AlertCircle, Globe, Building, Bug, Shield, Activity, Zap, Radio, Play, Pause, TrendingUp, AlertTriangle, Users, Clock } from 'lucide-react';
import { useRSSFeeds } from '@/lib/useRSSFeeds';

export default function ThreatIntelDashboard() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [blinkState, setBlinkState] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [progress, setProgress] = useState(0);
  const [typingProgress, setTypingProgress] = useState(0);
  const [tileRevealProgress, setTileRevealProgress] = useState(0);
  const [showTileReveal, setShowTileReveal] = useState(false);
  const [activeFeedIndex, setActiveFeedIndex] = useState(0);
  const [articleIndexInFeed, setArticleIndexInFeed] = useState(0);
  const [totalArticlesInFeed, setTotalArticlesInFeed] = useState(0);
  const [tileDisplayProgress, setTileDisplayProgress] = useState(0);
  const [tilesVisible, setTilesVisible] = useState(false);

  const { feeds, loading, error, lastUpdated } = useRSSFeeds();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const blinker = setInterval(() => setBlinkState(prev => !prev), 800);
    return () => clearInterval(blinker);
  }, []);


  const getAllArticles = () => feeds.flatMap(feed => feed.articles);

  useEffect(() => {
    if (!selectedArticle?.content || feeds.length === 0) return;

    const initTimer = setTimeout(() => {
      setDisplayedText('');
      setIsTyping(true);
      setTypingProgress(0);
      setTileRevealProgress(0);
      setTilesVisible(false);

      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex < selectedArticle.content.length) {
          setDisplayedText(selectedArticle.content.slice(0, currentIndex + 1));
          const progress = ((currentIndex + 1) / selectedArticle.content.length) * 100;
          setTypingProgress(progress);
          currentIndex++;
        } else {
          setIsTyping(false);
          setTypingProgress(100);
          setShowTileReveal(true);
          clearInterval(interval);
        }
      }, 15);
    }, 100);

    return () => clearTimeout(initTimer);
  }, [selectedArticle, feeds]);

  useEffect(() => {
    if (!isTyping && selectedArticle && showTileReveal) {
      setTileRevealProgress(0);
      setTilesVisible(false);
      const duration = 5000;
      const interval = 50;
      let elapsed = 0;
      const timer = setInterval(() => {
        elapsed += interval;
        const progress = (elapsed / duration) * 100;
        setTileRevealProgress(progress);
        if (elapsed >= duration) {
          clearInterval(timer);
          setShowTileReveal(false);
          setTilesVisible(true);
          setTileDisplayProgress(0);
        }
      }, interval);
      return () => clearInterval(timer);
    }
  }, [isTyping, selectedArticle, showTileReveal]);

  useEffect(() => {
    if (tilesVisible && !isTyping && !showTileReveal && isAutoPlay) {
      setTileDisplayProgress(0);
      const duration = 10000;
      const interval = 50;
      let elapsed = 0;
      const timer = setInterval(() => {
        elapsed += interval;
        const progress = (elapsed / duration) * 100;
        setTileDisplayProgress(Math.min(progress, 100));

        if (progress >= 100) {
          clearInterval(timer);
          const allArticles = getAllArticles();
          const currentIndex = allArticles.findIndex(a => a.id === selectedArticle?.id);
          const nextIndex = (currentIndex + 1) % allArticles.length;
          setSelectedArticle(allArticles[nextIndex]);
        }
      }, interval);
      return () => clearInterval(timer);
    }
  }, [tilesVisible, isTyping, showTileReveal, isAutoPlay, selectedArticle, feeds]);

  useEffect(() => {
    const allArticles = getAllArticles();
    if (allArticles.length > 0 && !selectedArticle) {
      setSelectedArticle(allArticles[0]);
    }
  }, [feeds]);

  useEffect(() => {
    if (selectedArticle && feeds.length > 0) {
      const feedIndex = feeds.findIndex(feed => feed.source === selectedArticle.source);
      if (feedIndex !== -1) {
        const currentFeed = feeds[feedIndex];
        const articleIndex = currentFeed.articles.findIndex(a => a.id === selectedArticle.id);
        setArticleIndexInFeed(articleIndex + 1); // 1-indexed for display
        setTotalArticlesInFeed(currentFeed.articles.length);
      }
    }
  }, [selectedArticle, feeds]);

  const getRiskColor = (risk) => {
    const colors = {
      'CRITICAL': 'text-red-400 bg-red-500/20 border-red-400',
      'HIGH': 'text-orange-400 bg-orange-500/20 border-orange-400',
      'MEDIUM': 'text-yellow-400 bg-yellow-500/20 border-yellow-400',
      'LOW': 'text-green-400 bg-green-500/20 border-green-400'
    };
    return colors[risk] || 'text-cyan-400 bg-cyan-500/20 border-cyan-400';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
  };

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const formatCyberpunkDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const weekNum = String(getWeekNumber(date)).padStart(2, '0');
    return { day, month, year, weekNum };
  };

  return (
    <div className="h-screen bg-black text-white font-mono flex flex-col overflow-hidden relative">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'gridScroll 20s linear infinite'
        }} />
      </div>

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-400 opacity-50" />
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400 opacity-50" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400 opacity-50" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-400 opacity-50" />

      {/* Header */}
      <header className="relative bg-black/80 border-b-2 border-cyan-500/50 backdrop-blur-md z-10">
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rss className="w-8 h-8 text-cyan-400" style={{ filter: 'drop-shadow(0 0 10px rgba(0, 217, 255, 0.8))' }} />
              <div>
                <h1 className="text-xl font-bold tracking-wider" style={{
                  background: 'linear-gradient(90deg, #00d9ff, #0080ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  THREAT INTELLIGENCE DASHBOARD
                </h1>
                <div className="flex items-center gap-2 text-[10px] font-mono mt-0.5">
                  <a
                    href="mailto:Stefan4+ti@gmail.com"
                    className="text-cyan-400/30 hover:text-cyan-400/60 transition-colors"
                    style={{ textShadow: '0 0 3px rgba(0, 217, 255, 0.15)' }}>
                    by S4int
                  </a>
                  <span className="text-cyan-400/20">|</span>
                  <a
                    href="https://github.com/Stefan2483/threat-intel-dash"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400/20 hover:text-cyan-400/50 transition-colors"
                    style={{ textShadow: '0 0 3px rgba(0, 217, 255, 0.1)' }}>
                    github
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-2 bg-cyan-500/10 border-2 border-cyan-500/40 rounded-lg">
              {selectedArticle && (
                <>
                  <Radio className={`w-5 h-5 text-cyan-400 ${blinkState ? 'opacity-100' : 'opacity-30'}`} />
                  <div>
                    <div className="text-xs text-gray-400 uppercase">Live Feed Source</div>
                    <div className="text-sm text-cyan-400 font-bold">{selectedArticle.source}</div>
                  </div>
                  <button onClick={() => setIsAutoPlay(!isAutoPlay)} className="p-1.5 bg-cyan-500/20 border border-cyan-500/40 rounded hover:bg-cyan-500/30">
                    {isAutoPlay ? <Pause className="w-4 h-4 text-cyan-400" /> : <Play className="w-4 h-4 text-cyan-400" />}
                  </button>
                </>
              )}
            </div>

            {/* Progress Tracking Tile */}
            <div className="flex flex-col gap-1.5 px-3 py-1.5 bg-cyan-500/10 border-2 border-cyan-500/40 rounded-lg min-w-[260px]">
              {/* Article Writing Progress */}
              <div className="space-y-0.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">ARTICLE</span>
                  <span className="text-cyan-400 tabular-nums">{Math.round(typingProgress)}%</span>
                </div>
                <div className="w-full h-1 bg-cyan-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-600 transition-all duration-100"
                       style={{ width: `${typingProgress}%` }} />
                </div>
              </div>

              {/* Source Progress (Article position in feed) */}
              <div className="space-y-0.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">SOURCE</span>
                  <span className="text-cyan-400 tabular-nums">{articleIndexInFeed}/{totalArticlesInFeed}</span>
                </div>
                <div className="w-full h-1 bg-cyan-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-400 to-emerald-600 transition-all duration-300"
                       style={{ width: `${totalArticlesInFeed > 0 ? (articleIndexInFeed / totalArticlesInFeed) * 100 : 0}%` }} />
                </div>
              </div>

              {/* Feed Progress (Tile Display Time) - Always visible */}
              <div className="space-y-0.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-gray-400">FEED</span>
                  <span className="text-cyan-400 tabular-nums">{tilesVisible ? Math.round(tileDisplayProgress) : 0}%</span>
                </div>
                <div className="w-full h-1 bg-cyan-500/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-100"
                       style={{ width: `${tilesVisible ? tileDisplayProgress : 0}%` }} />
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-cyan-400 tabular-nums" style={{ textShadow: '0 0 20px rgba(0, 217, 255, 0.8)' }}>
                {formatTime(currentTime)}
              </div>
              {(() => {
                const { day, month, year, weekNum } = formatCyberpunkDate(currentTime);
                return (
                  <div className="text-xs text-cyan-400/60 font-mono mt-1 space-y-0.5">
                    <div className="flex justify-end gap-2">
                      <span className="text-cyan-400/40">D:</span>
                      <span className="text-cyan-400/80">{day}</span>
                      <span className="text-cyan-400/40">M:</span>
                      <span className="text-cyan-400/80">{month}</span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <span className="text-cyan-400/40">Y:</span>
                      <span className="text-cyan-400/80">{year}</span>
                      <span className="text-cyan-400/40">W:</span>
                      <span className="text-cyan-400/80">{weekNum}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* News Ticker / Crawler */}
        <div className="relative bg-black/60 border-t border-cyan-500/30 overflow-hidden" style={{ height: '32px' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-cyan-500/5" />
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black/80 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black/80 to-transparent z-10" />

          <div className="ticker-wrapper h-full flex items-center">
            <div className="ticker-content flex items-center gap-8 whitespace-nowrap">
              {/* Duplicate the feed list for seamless loop */}
              {[...feeds, ...feeds, ...feeds].map((feed, index) => (
                <div key={`ticker-${index}`} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
                       style={{ boxShadow: '0 0 8px rgba(0, 217, 255, 0.8)' }} />
                  <span className="text-cyan-400 font-bold text-sm uppercase tracking-wider"
                        style={{ textShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }}>
                    {feed.name}
                  </span>
                  <span className="text-cyan-400/40 text-xs">|</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-1 bg-cyan-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
               style={{ animation: 'scan-horizontal 3s linear infinite' }} />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* LEFT COLUMN - RSS Source Tiles */}
        <div className="w-80 bg-black/60 backdrop-blur-sm border-r border-cyan-500/30 overflow-y-auto relative">
          {/* Vertical scan line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-b from-cyan-400/50 to-transparent"
               style={{ animation: 'scan-vertical 4s linear infinite' }} />

          <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-2">
              <Activity className="w-3 h-3" /> RSS SOURCES
            </h2>
            <div className="text-xs text-cyan-400/60"><Zap className="w-3 h-3 inline" /> LIVE</div>
          </div>
          
          <div className="space-y-4">
            {feeds.map(feed => (
              <div key={feed.id} className="relative group">
                {/* Tile Container */}
                <div className="bg-black/60 border-2 border-cyan-500/30 rounded-lg overflow-hidden backdrop-blur-sm hover:border-cyan-500/60 transition-all"
                     style={{ boxShadow: '0 0 20px rgba(0, 217, 255, 0.1)' }}>
                  {/* Tile Header */}
                  <div className="bg-cyan-500/10 border-b border-cyan-500/30 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-cyan-400 tracking-wide">{feed.name}</h3>
                        <div className="text-xs text-cyan-400/50 font-mono">{feed.source}</div>
                      </div>
                      <div className="bg-cyan-400 text-black px-2 py-1 rounded text-xs font-bold"
                           style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }}>
                        {feed.count}
                      </div>
                    </div>
                  </div>

                  {/* Articles List */}
                  <div className="p-2 space-y-1">
                    {feed.articles.slice(0, 5).map((article, idx) => (
                      <div
                        key={article.id}
                        onClick={() => setSelectedArticle(article)}
                        className={`relative px-2 py-1.5 cursor-pointer transition-all rounded text-xs ${
                          selectedArticle?.id === article.id
                            ? 'bg-cyan-500/30 text-white border-l-2 border-cyan-400'
                            : 'text-gray-400 hover:bg-cyan-500/10 hover:text-gray-200'
                        }`}
                      >
                        <span className="text-cyan-400/40 mr-1">{String(idx + 1).padStart(2, '0')}.</span>
                        {article.shortTitle || article.title}
                      </div>
                    ))}
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400/50" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400/50" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400/50" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400/50" />
                </div>
              </div>
            ))}
          </div>
          </div>
        </div>

        {/* MIDDLE COLUMN - Article Reader */}
        <div className="flex-1 flex flex-col bg-black/40 backdrop-blur-sm relative overflow-hidden">
          {/* CRT Scan Lines Effect for Article Section */}
          <div className="absolute inset-0 pointer-events-none z-10 opacity-10"
               style={{
                 background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)',
                 backgroundSize: '100% 4px'
               }} />

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${5 + Math.random() * 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          {/* Article Content */}
          <div className="flex-1 overflow-y-auto p-8 relative z-10">
            {selectedArticle ? (
              <>
                {/* Title with holographic effect */}
                <div className="mb-8 relative">
                  <h1 className="text-4xl font-bold leading-tight relative inline-block">
                    <span className="relative z-10" style={{
                      background: 'linear-gradient(90deg, #ffffff, #00d9ff)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}>
                      {selectedArticle.title}
                    </span>
                    <div className="absolute inset-0 blur-xl opacity-50"
                         style={{
                           background: 'linear-gradient(90deg, #00d9ff, #0080ff)',
                           transform: 'scale(1.1)'
                         }} />
                  </h1>
                  <div className="h-px bg-gradient-to-r from-cyan-400/50 via-cyan-400 to-cyan-400/50 mt-4"
                       style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }} />
                </div>

                {/* Article content with typewriter */}
                <div className="prose prose-invert max-w-none relative">
                  <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-wrap" style={{
                    textShadow: '0 0 10px rgba(0, 217, 255, 0.1)'
                  }}>
                    {displayedText}
                    {isTyping && (
                      <span className="inline-block w-2 h-6 bg-cyan-400 ml-1 animate-pulse"
                            style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.8)' }} />
                    )}
                  </p>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Rss className="w-16 h-16 mx-auto mb-4 opacity-30 animate-pulse" />
                  <p className="text-lg">Select an article to begin analysis</p>
                </div>
              </div>
            )}
          </div>

          {/* BOTTOM - Info Tiles - Show after tile reveal countdown completes */}
          {tilesVisible && selectedArticle && (
            <div className="grid grid-cols-3 gap-3 p-4 border-t border-cyan-500/30">
              {/* Tile 1 - READ FULL ARTICLE */}
              <button
                onClick={() => selectedArticle?.link && window.open(selectedArticle.link, '_blank', 'noopener,noreferrer')}
                className={`bg-black/60 border-2 ${blinkState ? 'border-red-500/70' : 'border-red-500/30'} rounded-lg p-3 relative backdrop-blur-sm hover:bg-red-500/10 transition-all cursor-pointer group`}
                style={{ boxShadow: blinkState ? '0 0 25px rgba(239, 68, 68, 0.6)' : '0 0 15px rgba(239, 68, 68, 0.3)' }}>
                <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${blinkState ? 'border-red-400' : 'border-red-400/40'}`} />
                <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${blinkState ? 'border-red-400' : 'border-red-400/40'}`} />
                <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${blinkState ? 'border-red-400' : 'border-red-400/40'}`} />
                <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${blinkState ? 'border-red-400' : 'border-red-400/40'}`} />

                <div className={`text-xs ${blinkState ? 'text-red-400/90' : 'text-red-400/50'} uppercase mb-1 font-bold tracking-wider`}>Full Story</div>
                <div className={`text-sm font-bold ${blinkState ? 'text-red-400' : 'text-red-400/70'} flex items-center gap-1`}>
                  READ ARTICLE
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <Rss className={`absolute bottom-2 right-2 w-6 h-6 ${blinkState ? 'text-red-400/40' : 'text-red-400/20'}`} />
              </button>

            {/* Tile 2 - Active Threats */}
            <div className="bg-black/60 border-2 border-cyan-500/40 rounded-lg p-3 relative backdrop-blur-sm"
                 style={{ boxShadow: '0 0 20px rgba(0, 217, 255, 0.2)' }}>
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/50" />
              <div className="text-xs text-gray-500 uppercase mb-1">Active Threats</div>
              <div className="text-2xl font-bold text-cyan-400">247</div>
              <Activity className="absolute bottom-2 right-2 w-8 h-8 text-cyan-400/20" />
            </div>

            {/* Tile 3 - Critical CVEs */}
            <div className="bg-black/60 border-2 border-orange-500/40 rounded-lg p-3 relative backdrop-blur-sm"
                 style={{ boxShadow: '0 0 20px rgba(251, 146, 60, 0.2)' }}>
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-orange-400/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-orange-400/50" />
              <div className="text-xs text-gray-500 uppercase mb-1">Critical CVEs</div>
              <div className="text-2xl font-bold text-orange-400">18</div>
              <Bug className="absolute bottom-2 right-2 w-8 h-8 text-orange-400/20" />
            </div>

            {/* Tile 4 - Sources Online */}
            <div className="bg-black/60 border-2 border-green-500/40 rounded-lg p-3 relative backdrop-blur-sm"
                 style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.2)' }}>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-green-400/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-green-400/50" />
              <div className="text-xs text-gray-500 uppercase mb-1">Sources Online</div>
              <div className="text-2xl font-bold text-green-400">{feeds.length}</div>
              <Rss className="absolute bottom-2 right-2 w-8 h-8 text-green-400/20" />
            </div>

            {/* Tile 5 - Trending Tags */}
            <div className="bg-black/60 border-2 border-purple-500/40 rounded-lg p-3 relative backdrop-blur-sm"
                 style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)' }}>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-400/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-400/50" />
              <div className="text-xs text-gray-500 uppercase mb-1">Top Tag</div>
              <div className="text-sm font-bold text-purple-400">RANSOMWARE</div>
              <TrendingUp className="absolute bottom-2 right-2 w-8 h-8 text-purple-400/20" />
            </div>

            {/* Tile 6 - Uptime */}
            <div className="bg-black/60 border-2 border-cyan-500/40 rounded-lg p-3 relative backdrop-blur-sm"
                 style={{ boxShadow: '0 0 20px rgba(0, 217, 255, 0.2)' }}>
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/50" />
              <div className="text-xs text-gray-500 uppercase mb-1">Uptime</div>
              <div className="text-xl font-bold text-cyan-400">99.9%</div>
              <Clock className="absolute bottom-2 right-2 w-8 h-8 text-cyan-400/20" />
            </div>
          </div>
          )}
        </div>

        {/* RIGHT COLUMN - Image and Metadata */}
        <div className="w-96 bg-black/60 border-l border-cyan-500/30 flex flex-col">
          {selectedArticle ? (
            <>
              {/* Image */}
              <div className="h-1/2 border-b border-cyan-500/30 relative overflow-hidden bg-black">
                <>
                  <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />

                  {/* CRT Scan Lines Effect - Horizontal */}
                  <div className="absolute inset-0 pointer-events-none z-20"
                       style={{
                         background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)',
                         backgroundSize: '100% 4px'
                       }} />

                  {/* Signal Disturbance Effect - Glitch - ULTRA ENHANCED */}
                  <div className="absolute inset-0 pointer-events-none z-25 opacity-80"
                       style={{
                         background: 'repeating-linear-gradient(90deg, rgba(255, 255, 255, 0) 0px, rgba(255, 255, 255, 0.3) 1px, rgba(255, 255, 255, 0) 2px)',
                         animation: 'glitch-image 0.1s infinite, glitch 0.15s infinite'
                       }} />

                  {/* Vertical Scanning Line - Moving Up and Down - SUPER VISIBLE - SLOWER */}
                  <div className="absolute left-0 right-0 top-0 pointer-events-none z-50"
                       style={{
                         height: '8px',
                         background: 'linear-gradient(to bottom, rgba(0, 255, 255, 0), rgba(0, 255, 255, 1), rgba(255, 255, 255, 1), rgba(0, 255, 255, 1), rgba(0, 255, 255, 0))',
                         boxShadow: '0 0 40px rgba(0, 255, 255, 1), 0 0 80px rgba(0, 255, 255, 0.9), 0 0 120px rgba(0, 255, 255, 0.7)',
                         animation: 'scan-vertical-updown 6s linear infinite',
                         filter: 'blur(0.5px)'
                       }} />

                  {/* Color aberration/Chromatic effect */}
                  <div className="absolute inset-0 pointer-events-none z-20 mix-blend-screen opacity-20"
                       style={{
                         background: 'linear-gradient(90deg, rgba(255,0,0,0.1), rgba(0,255,0,0.1), rgba(0,0,255,0.1))',
                         animation: 'color-shift 3s infinite alternate'
                       }} />

                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-transparent to-black/60" />

                  {/* Animated horizontal scanning line */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-px bg-cyan-400" style={{ animation: 'scan-image 3s linear infinite' }} />
                  </div>

                  {/* Corner frames */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                  <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />
                </>
              </div>

              {/* Metadata */}
              <div className="h-1/2 overflow-y-auto p-6">
                <h3 className="text-xs text-cyan-400 uppercase font-bold mb-4 flex items-center gap-2">
                  <Shield className="w-3 h-3" /> THREAT ANALYSIS
                </h3>
                {selectedArticle.metadata ? (
                  <div className="space-y-3">
                    <div className={`border-2 rounded-lg p-3 ${getRiskColor(selectedArticle.metadata.risk)}`}>
                      <div className="text-xs uppercase mb-1 opacity-70">Risk Level</div>
                      <div className="text-xl font-bold">{selectedArticle.metadata.risk}</div>
                    </div>
                    {selectedArticle.metadata.cve !== 'N/A' && (
                      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                        <div className="text-xs text-cyan-400/70 uppercase mb-1 flex items-center gap-1">
                          <Bug className="w-3 h-3" /> CVE
                        </div>
                        <div className="text-sm font-mono text-cyan-400">{selectedArticle.metadata.cve}</div>
                      </div>
                    )}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                      <div className="text-xs text-cyan-400/70 uppercase mb-1 flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Country
                      </div>
                      <div className="text-sm text-gray-300">{selectedArticle.metadata.country}</div>
                    </div>
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
                      <div className="text-xs text-cyan-400/70 uppercase mb-1 flex items-center gap-1">
                        <Building className="w-3 h-3" /> Target
                      </div>
                      <div className="text-sm text-gray-300">{selectedArticle.metadata.company}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Shield className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="text-sm">No metadata available</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <Shield className="w-16 h-16 opacity-20" />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes gridScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(50px); }
        }
        @keyframes scan-horizontal {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .ticker-wrapper {
          overflow: hidden;
        }
        .ticker-content {
          animation: ticker-scroll 30s linear infinite;
        }
        @keyframes scan-vertical {
          0% { transform: translateY(0); opacity: 0.5; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0.5; }
        }
        @keyframes scan-vertical-updown {
          0% {
            top: 0%;
            opacity: 1;
          }
          25% {
            top: 100%;
            opacity: 1;
          }
          50% {
            top: 100%;
            opacity: 1;
          }
          75% {
            top: 0%;
            opacity: 1;
          }
          100% {
            top: 0%;
            opacity: 1;
          }
        }
        @keyframes scan-image {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
        }
        @keyframes glitch {
          0% { transform: translateX(0) skew(0deg); opacity: 1; }
          10% { transform: translateX(-3px) skew(-2deg); opacity: 0.8; }
          20% { transform: translateX(3px) skew(2deg); opacity: 1; }
          30% { transform: translateX(-2px) skew(-1deg); opacity: 0.9; }
          40% { transform: translateX(2px) skew(1deg); opacity: 1; }
          50% { transform: translateX(0) skew(0deg); opacity: 0.85; }
          60% { transform: translateX(-1px) skew(-0.5deg); opacity: 1; }
          70% { transform: translateX(1px) skew(0.5deg); opacity: 0.9; }
          80% { transform: translateX(-2px) skew(-1deg); opacity: 1; }
          90% { transform: translateX(2px) skew(1deg); opacity: 0.95; }
          100% { transform: translateX(0) skew(0deg); opacity: 1; }
        }
        @keyframes glitch-image {
          0%, 100% { transform: translate(0, 0) skew(0deg); opacity: 1; }
          10% { transform: translate(-5px, 2px) skew(0.5deg); opacity: 0.8; }
          20% { transform: translate(5px, -2px) skew(-0.5deg); opacity: 0.9; }
          30% { transform: translate(-3px, 4px) skew(1deg); opacity: 0.7; }
          40% { transform: translate(3px, -4px) skew(-1deg); opacity: 0.9; }
          50% { transform: translate(-5px, -2px) skew(0.8deg); opacity: 0.6; }
          60% { transform: translate(5px, 2px) skew(-0.8deg); opacity: 0.9; }
          70% { transform: translate(-3px, -4px) skew(1.2deg); opacity: 0.7; }
          80% { transform: translate(3px, 4px) skew(-1.2deg); opacity: 0.9; }
          90% { transform: translate(0, -2px) skew(0deg); opacity: 0.8; }
        }
        @keyframes color-shift {
          0% { opacity: 0.1; }
          50% { opacity: 0.3; }
          100% { opacity: 0.1; }
        }
      `}</style>
    </div>
  );
}