import React, { useState, useEffect } from 'react';
import { Rss, AlertCircle, Globe, Building, Bug, Shield, Activity, Zap, Radio } from 'lucide-react';
import { useRSSFeeds } from '@/lib/useRSSFeeds';

export default function OblivionThreatIntelDashboard() {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [blinkState, setBlinkState] = useState(true);

  const { feeds, loading, error, lastUpdated } = useRSSFeeds();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const blinker = setInterval(() => {
      setBlinkState(prev => !prev);
    }, 800);
    return () => clearInterval(blinker);
  }, []);


  useEffect(() => {
    if (!selectedArticle?.content) return;
    
    setDisplayedText('');
    setIsTyping(true);
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < selectedArticle.content.length) {
        setDisplayedText(selectedArticle.content.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [selectedArticle]);

  const selectArticle = (article) => {
    setSelectedArticle(article);
  };

  useEffect(() => {
    if (feeds && feeds.length > 0 && feeds[0].articles && feeds[0].articles.length > 0) {
      setSelectedArticle(feeds[0].articles[0]);
    }
  }, [feeds]);

  const getRiskColor = (risk) => {
    const colors = {
      'CRITICAL': 'text-red-400 bg-red-500/20 border-red-400 shadow-red-500/50',
      'HIGH': 'text-orange-400 bg-orange-500/20 border-orange-400 shadow-orange-500/50',
      'MEDIUM': 'text-yellow-400 bg-yellow-500/20 border-yellow-400 shadow-yellow-500/50',
      'LOW': 'text-green-400 bg-green-500/20 border-green-400 shadow-green-500/50'
    };
    return colors[risk] || 'text-cyan-400 bg-cyan-500/20 border-cyan-400 shadow-cyan-500/50';
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: false 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    });
  };

  return (
    <div className="h-screen bg-black text-white font-mono flex flex-col overflow-hidden relative">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 217, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 217, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'gridScroll 20s linear infinite'
        }} />
      </div>

      {/* Hexagonal pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l25.98 15v30L30 60 4.02 45V15z' fill='none' stroke='%2300d9ff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-cyan-400 opacity-50" />
      <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-cyan-400 opacity-50" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-cyan-400 opacity-50" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-cyan-400 opacity-50" />

      {/* Header with Clock */}
      <header className="relative bg-black/80 border-b-2 border-cyan-500/50 backdrop-blur-md z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left side - Title */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <Rss className="w-10 h-10 text-cyan-400" style={{
                  filter: 'drop-shadow(0 0 10px rgba(0, 217, 255, 0.8))',
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-wider" style={{
                  background: 'linear-gradient(90deg, #00d9ff, #0080ff)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(0, 217, 255, 0.5)'
                }}>
                  THREAT INTELLIGENCE DASHBOARD
                </h1>
                <div className="text-xs text-cyan-400/60 tracking-widest">REAL-TIME MONITORING SYSTEM</div>
              </div>
            </div>

            {/* Center - RSS Source Indicator */}
            {selectedArticle && (
              <div className="flex items-center gap-4 px-6 py-3 bg-cyan-500/10 border-2 border-cyan-500/40 rounded-lg shadow-lg shadow-cyan-500/20">
                <Radio className={`w-6 h-6 text-cyan-400 transition-opacity duration-300 ${blinkState ? 'opacity-100' : 'opacity-30'}`} 
                       style={{ filter: 'drop-shadow(0 0 8px rgba(0, 217, 255, 0.8))' }} />
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">Live Feed Source</div>
                  <div className="text-base text-cyan-400 font-bold tracking-wide">{selectedArticle.source}</div>
                </div>
                <div className={`w-3 h-3 rounded-full bg-cyan-400 transition-opacity duration-300 ${blinkState ? 'opacity-100' : 'opacity-0'}`} 
                     style={{ boxShadow: '0 0 15px rgba(0, 217, 255, 1)' }} />
              </div>
            )}

            {/* Right side - Clock */}
            <div className="text-right">
              <div className="text-3xl font-bold tracking-wider text-cyan-400 tabular-nums" style={{
                textShadow: '0 0 20px rgba(0, 217, 255, 0.8)'
              }}>
                {formatTime(currentTime)}
              </div>
              <div className="text-xs text-cyan-400/60 tracking-widest">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>

        {/* Animated progress bar */}
        <div className="h-1 bg-cyan-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" 
               style={{ animation: 'scan-horizontal 3s linear infinite' }} />
        </div>
      </header>

      {/* Main Content - 3 Columns */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* LEFT COLUMN - Feed List (Markup Style) */}
        <div className="w-80 bg-black/60 backdrop-blur-sm border-r border-cyan-500/30 overflow-y-auto relative">
          {/* Vertical scan line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-b from-cyan-400/50 to-transparent" 
               style={{ animation: 'scan-vertical 4s linear infinite' }} />
          
          <div className="p-4">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-sm text-cyan-400 uppercase font-bold tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4" />
                RSS FEEDS
              </h2>
              <div className="flex items-center gap-2 text-xs text-cyan-400/60">
                <Zap className="w-3 h-3" />
                <span>LIVE</span>
              </div>
            </div>
            
            {/* Feed List - Markup Style */}
            <div className="space-y-6">
              {feeds.map((feed, feedIndex) => (
                <div key={feed.id} className="relative">
                  {/* Feed Source Header */}
                  <div className="mb-3 pb-2 border-b border-cyan-500/30 relative">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-cyan-400 mb-1 tracking-wide">
                          {feed.name}
                        </h3>
                        <div className="text-xs text-cyan-400/50 font-mono">{feed.source}</div>
                      </div>
                      <div className="ml-3">
                        <div className="bg-cyan-400 text-black px-2.5 py-1 rounded text-xs font-bold"
                             style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }}>
                          {feed.count}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Numbered Article List */}
                  <div className="space-y-1.5">
                    {feed.articles.map((article, articleIndex) => (
                      <div
                        key={article.id}
                        onClick={() => selectArticle(article)}
                        className={`relative pl-8 pr-3 py-2 cursor-pointer transition-all rounded ${
                          selectedArticle?.id === article.id
                            ? 'bg-cyan-500/20 text-white'
                            : 'text-gray-400 hover:bg-cyan-500/5 hover:text-gray-200'
                        }`}
                      >
                        {/* Number Badge */}
                        <span className={`absolute left-2 top-2 text-xs font-bold tabular-nums ${
                          selectedArticle?.id === article.id 
                            ? 'text-cyan-400' 
                            : 'text-cyan-400/40'
                        }`}>
                          {String(articleIndex + 1).padStart(2, '0')}.
                        </span>
                        
                        {/* Article Title */}
                        <p className="text-xs leading-tight">
                          {article.shortTitle || article.title}
                        </p>

                        {/* Active Indicator */}
                        {selectedArticle?.id === article.id && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"
                                 style={{ boxShadow: '0 0 8px rgba(0, 217, 255, 0.8)' }} />
                          </div>
                        )}

                        {/* Selection Border */}
                        {selectedArticle?.id === article.id && (
                          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-cyan-400"
                               style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)' }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE COLUMN - Article Reader */}
        <div className="flex-1 bg-black/40 backdrop-blur-sm overflow-y-auto relative">
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

          {selectedArticle ? (
            <div className="p-8 relative z-10">
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

              {!isTyping && (
                <div className="mt-8 pt-6 border-t border-cyan-500/30 flex gap-4">
                  <button className="px-6 py-3 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all relative overflow-hidden group"
                          style={{ boxShadow: '0 0 20px rgba(0, 217, 255, 0.2)' }}>
                    <span className="relative z-10">READ FULL ARTICLE â†’</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Rss className="w-16 h-16 mx-auto mb-4 opacity-30 animate-pulse" />
                <p className="text-lg">Select an article to begin analysis</p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN - Image and Metadata */}
        <div className="w-96 bg-black/60 backdrop-blur-sm border-l border-cyan-500/30 flex flex-col relative">
          {selectedArticle ? (
            <>
              {/* Top Half - Image with overlay effects */}
              <div className="h-1/2 border-b border-cyan-500/30 relative overflow-hidden group">
                {selectedArticle.image ? (
                  <>
                    <img
                      src={selectedArticle.image}
                      alt={selectedArticle.title}
                      className="w-full h-full object-cover"
                    />

                    {/* CRT Scan Lines Effect - Very Visible */}
                    <div className="absolute inset-0 pointer-events-none z-20"
                         style={{
                           background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(0, 0, 0, 0.5) 2px, rgba(0, 0, 0, 0.5) 4px)',
                           backgroundSize: '100% 4px'
                         }} />

                    {/* Holographic overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/20 via-transparent to-black/60" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />

                    {/* Animated scanning line effect */}
                    <div className="absolute inset-0 opacity-30">
                      <div className="w-full h-px bg-cyan-400 shadow-lg shadow-cyan-400/50"
                           style={{ animation: 'scan-image 3s linear infinite' }} />
                    </div>

                    {/* Corner frames */}
                    <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
                    <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
                    <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
                    <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />
                  </>
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                    <AlertCircle className="w-16 h-16 text-cyan-400/30" />
                  </div>
                )}
              </div>

              {/* Bottom Half - Metadata */}
              <div className="h-1/2 overflow-y-auto p-6">
                <h3 className="text-sm text-cyan-400 uppercase font-bold mb-4 flex items-center gap-2 tracking-wider">
                  <Shield className="w-4 h-4" />
                  THREAT ANALYSIS
                </h3>

                {selectedArticle.metadata && (
                  <div className="space-y-3">
                    {/* Risk Level - Emphasized */}
                    <div className={`border-2 rounded-lg p-4 relative overflow-hidden ${getRiskColor(selectedArticle.metadata.risk)}`}
                         style={{ boxShadow: `0 0 30px ${selectedArticle.metadata.risk === 'CRITICAL' ? 'rgba(248, 113, 113, 0.3)' : 'rgba(0, 217, 255, 0.2)'}` }}>
                      <div className="text-xs uppercase mb-2 tracking-wider opacity-70">Risk Assessment</div>
                      <div className="text-2xl font-bold tracking-wider">
                        {selectedArticle.metadata.risk}
                      </div>
                      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
                        <AlertCircle className="w-full h-full" />
                      </div>
                    </div>

                    {/* CVE */}
                    {selectedArticle.metadata.cve !== 'N/A' && (
                      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 relative group hover:border-cyan-500/60 transition-all"
                           style={{ boxShadow: '0 0 15px rgba(0, 217, 255, 0.1)' }}>
                        <div className="text-xs text-cyan-400/70 uppercase mb-1 flex items-center gap-1 tracking-wider">
                          <Bug className="w-3 h-3" />
                          CVE Identifier
                        </div>
                        <div className="text-sm font-mono text-cyan-400 font-bold tracking-wider">
                          {selectedArticle.metadata.cve}
                        </div>
                      </div>
                    )}

                    {/* Country */}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 hover:border-cyan-500/60 transition-all"
                         style={{ boxShadow: '0 0 15px rgba(0, 217, 255, 0.1)' }}>
                      <div className="text-xs text-cyan-400/70 uppercase mb-1 flex items-center gap-1 tracking-wider">
                        <Globe className="w-3 h-3" />
                        Geographic Origin
                      </div>
                      <div className="text-sm text-gray-300">{selectedArticle.metadata.country}</div>
                    </div>

                    {/* Company */}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 hover:border-cyan-500/60 transition-all"
                         style={{ boxShadow: '0 0 15px rgba(0, 217, 255, 0.1)' }}>
                      <div className="text-xs text-cyan-400/70 uppercase mb-1 flex items-center gap-1 tracking-wider">
                        <Building className="w-3 h-3" />
                        Target Entity
                      </div>
                      <div className="text-sm text-gray-300">{selectedArticle.metadata.company}</div>
                    </div>

                    {/* Malware */}
                    {selectedArticle.metadata.malware !== 'N/A' && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 hover:border-red-500/60 transition-all"
                           style={{ boxShadow: '0 0 15px rgba(248, 113, 113, 0.2)' }}>
                        <div className="text-xs text-red-400/70 uppercase mb-1 tracking-wider">Malware Family</div>
                        <div className="text-sm text-red-400 font-semibold">{selectedArticle.metadata.malware}</div>
                      </div>
                    )}

                    {/* Attack Vector */}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 hover:border-cyan-500/60 transition-all"
                         style={{ boxShadow: '0 0 15px rgba(0, 217, 255, 0.1)' }}>
                      <div className="text-xs text-cyan-400/70 uppercase mb-1 tracking-wider">Attack Method</div>
                      <div className="text-sm text-gray-300">{selectedArticle.metadata.attackVector}</div>
                    </div>

                    {/* Affected Systems */}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3 hover:border-cyan-500/60 transition-all"
                         style={{ boxShadow: '0 0 15px rgba(0, 217, 255, 0.1)' }}>
                      <div className="text-xs text-cyan-400/70 uppercase mb-1 tracking-wider">Affected Systems</div>
                      <div className="text-sm text-gray-300">{selectedArticle.metadata.affected}</div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-600">
                <Shield className="w-16 h-16 mx-auto mb-4 opacity-20 animate-pulse" />
                <p>Awaiting data stream</p>
              </div>
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
        
        @keyframes scan-vertical {
          0% { transform: translateY(0); opacity: 0.5; }
          50% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0.5; }
        }
        
        @keyframes scan-image {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0.2; }
          50% { transform: translateY(-20px) translateX(10px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}