import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NavBar from './components/NavBar';
import Background from './components/Background';
import NewsCard from './components/NewsCard';
import ResearchTerminal from './components/ResearchTerminal';
import AuthScreen from './components/AuthScreen';
import { ViewState, NewsItem, User } from './types';
import { fetchAiNews, fetchTrendingNews } from './services/geminiService';
import { getCurrentUser, logoutUser } from './services/authService';
import { RefreshCw, Settings, LogOut, User as UserIcon, Flame } from 'lucide-react';

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'The Next Leap in LLMs: Reasoning Capabilities',
    category: 'RESEARCH',
    summary: 'New architectures are moving beyond pattern matching to true deductive reasoning, enabling models to solve complex math and logic problems with unprecedented accuracy.',
    timestamp: '10:42 AM',
    imageUrl: 'https://picsum.photos/seed/airobot/800/600',
    source: 'TechCrunch'
  },
  {
    id: '2',
    title: 'Ethical AI Regulation: Global Summit',
    category: 'POLICY',
    summary: 'World leaders gather in Geneva to establish a unified framework for autonomous weapon systems and data privacy in the age of generative AI.',
    timestamp: '09:15 AM',
    imageUrl: 'https://picsum.photos/seed/network/800/600',
    source: 'Reuters'
  },
  {
    id: '3',
    title: 'Robotics Autonomy Hits Level 4',
    category: 'HARDWARE',
    summary: 'Boston Dynamics reveals a new bipedal unit capable of navigating unstructured construction environments without human teleoperation.',
    timestamp: 'Yesterday',
    imageUrl: 'https://picsum.photos/seed/chip/800/600',
    source: 'Wired'
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [trendingNews, setTrendingNews] = useState<NewsItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasFetchedTrends, setHasFetchedTrends] = useState(false);
  const [researchTrigger, setResearchTrigger] = useState<string | null>(null);
  const [readArticleIds, setReadArticleIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    
    const storedReads = localStorage.getItem('ai_insights_read_items');
    if (storedReads) {
      try {
        setReadArticleIds(new Set(JSON.parse(storedReads)));
      } catch (e) {
        console.error("Failed to parse read items", e);
      }
    }
  }, []);

  const markAsRead = (id: string) => {
    setReadArticleIds(prev => {
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem('ai_insights_read_items', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Fetch Trends when switching to Trending view for the first time
  useEffect(() => {
    if (currentView === ViewState.TRENDING && !hasFetchedTrends) {
      loadTrends();
    }
  }, [currentView]);

  const loadTrends = async () => {
    setIsRefreshing(true);
    const trends = await fetchTrendingNews();
    if (trends && trends.length > 0) {
        setTrendingNews(trends);
        setHasFetchedTrends(true);
    }
    setIsRefreshing(false);
  }

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    
    if (currentView === ViewState.TRENDING) {
        await loadTrends();
    } else {
        const newItems = await fetchAiNews();
        if (newItems && newItems.length > 0) {
          setNews(newItems);
        }
    }
    
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setCurrentView(ViewState.HOME);
  };

  const handleAnalyze = (topic: string, id: string) => {
    markAsRead(id);
    setResearchTrigger(`Analyze and explain this topic in depth: "${topic}"`);
    setCurrentView(ViewState.RESEARCH);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.HOME:
        return (
          <div className="pb-24 pt-6">
            <div className="flex justify-between items-center px-4 mb-6">
               <h2 className="text-sm font-mono text-cyan-400 tracking-widest uppercase flex items-center gap-2">
                 <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                 Live_Feed
               </h2>
               <button 
                onClick={handleRefresh}
                className={`p-2 rounded-full hover:bg-cyan-900/30 text-cyan-500 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
               >
                 <RefreshCw className="w-4 h-4" />
               </button>
            </div>
            
            <div className="space-y-6">
              {news.map((item) => (
                <NewsCard 
                  key={item.id} 
                  item={item} 
                  isRead={readArticleIds.has(item.id)}
                  onAnalyze={(topic) => handleAnalyze(topic, item.id)} 
                />
              ))}
            </div>
          </div>
        );

      case ViewState.TRENDING:
        return (
           <div className="pb-24 pt-6">
             <div className="flex justify-between items-center px-4 mb-6">
               <h2 className="text-sm font-mono text-purple-400 tracking-widest uppercase flex items-center gap-2">
                 <Flame className="w-4 h-4 text-purple-500" />
                 Viral_Topics
               </h2>
               <button 
                onClick={handleRefresh}
                className={`p-2 rounded-full hover:bg-purple-900/30 text-purple-400 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
               >
                 <RefreshCw className="w-4 h-4" />
               </button>
             </div>

             {trendingNews.length === 0 && isRefreshing ? (
                 <div className="px-6 text-center mt-20 text-slate-500 font-mono animate-pulse">
                     ANALYZING GLOBAL DATA STREAMS...
                 </div>
             ) : (
                <div className="space-y-6">
                    {trendingNews.length === 0 && !isRefreshing ? (
                        <div className="text-center text-slate-500 mt-10">No trending data available.</div>
                    ) : (
                        trendingNews.map((item) => (
                            <NewsCard 
                              key={item.id} 
                              item={item} 
                              isRead={readArticleIds.has(item.id)}
                              onAnalyze={(topic) => handleAnalyze(topic, item.id)} 
                            />
                        ))
                    )}
                </div>
             )}
           </div>
        );

      case ViewState.RESEARCH:
        // Pass the trigger as initialQuery. 
        return <ResearchTerminal initialQuery={researchTrigger} />;

      case ViewState.SETTINGS:
        return (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-6">
             <div className="glass-panel p-8 rounded-2xl w-full max-w-sm border border-cyan-500/20">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-slate-900 border border-cyan-500/30 flex items-center justify-center mb-4">
                        <UserIcon className="w-10 h-10 text-cyan-400" />
                    </div>
                    <h2 className="text-xl text-white font-bold tracking-wide">{user?.name}</h2>
                    <p className="text-sm text-cyan-600 font-mono">{user?.email}</p>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded border border-slate-800">
                        <span className="text-xs text-slate-400 font-mono">APP_VERSION</span>
                        <span className="text-xs text-cyan-400 font-mono">v1.4.0</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded border border-slate-800">
                        <span className="text-xs text-slate-400 font-mono">STATUS</span>
                        <span className="text-xs text-green-400 font-mono flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> ONLINE
                        </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-slate-900/50 rounded border border-slate-800">
                        <span className="text-xs text-slate-400 font-mono">ARTICLES_READ</span>
                        <span className="text-xs text-cyan-400 font-mono">{readArticleIds.size}</span>
                    </div>
                </div>

                <button 
                    onClick={handleLogout}
                    className="w-full mt-8 bg-red-900/10 hover:bg-red-900/30 border border-red-900/30 text-red-400 py-3 rounded-lg font-mono text-sm flex items-center justify-center gap-2 transition-colors"
                >
                    <LogOut className="w-4 h-4" />
                    TERMINATE SESSION
                </button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (!user) {
    return (
        <div className="min-h-screen relative font-sans text-slate-200 selection:bg-cyan-500/30">
            <Background />
            <AuthScreen onAuthenticated={setUser} />
        </div>
    )
  }

  return (
    <div className="min-h-screen relative font-sans text-slate-200 selection:bg-cyan-500/30">
      <Background />
      <Header />
      <main className="max-w-md mx-auto relative z-10">
        {renderContent()}
      </main>
      <NavBar 
        currentView={currentView} 
        onNavigate={(view) => {
            if (view !== ViewState.RESEARCH) {
                setResearchTrigger(null);
            }
            setCurrentView(view);
        }} 
      />
    </div>
  );
};

export default App;