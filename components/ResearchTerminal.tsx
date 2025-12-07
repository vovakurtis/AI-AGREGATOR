import React, { useState, useEffect, useCallback } from 'react';
import { Search, Send, Globe, AlertCircle, Terminal } from 'lucide-react';
import { performResearch } from '../services/geminiService';
import { SearchResult } from '../types';

interface ResearchTerminalProps {
  initialQuery?: string | null;
}

const ResearchTerminal: React.FC<ResearchTerminalProps> = ({ initialQuery }) => {
  const [query, setQuery] = useState(initialQuery || '');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  const executeResearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setResult(null);
    
    try {
      const data = await performResearch(searchQuery);
      setResult(data);
    } catch (err) {
        console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-execute if initialQuery is provided on mount
  useEffect(() => {
    if (initialQuery) {
        executeResearch(initialQuery);
    }
  }, [initialQuery, executeResearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeResearch(query);
  };

  return (
    <div className="px-4 py-6 min-h-[calc(100vh-140px)] flex flex-col">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <h2 className="text-lg font-mono text-white tracking-widest">RESEARCH_TERMINAL</h2>
        </div>
        <p className="text-xs text-slate-400">Query the global knowledge base. Powered by Gemini 2.5 Flash.</p>
      </div>

      <form onSubmit={handleSearch} className="relative mb-8">
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter search parameters (e.g., 'Latest humanoid robot specs')"
          className="w-full bg-slate-900/80 border border-cyan-900/50 rounded-lg py-4 pl-12 pr-12 text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 font-mono text-sm"
        />
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
        <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-cyan-900/30 hover:bg-cyan-500/20 rounded-md text-cyan-400 transition-colors disabled:opacity-50"
        >
            {isLoading ? <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div> : <Send className="w-5 h-5" />}
        </button>
      </form>

      <div className="flex-1 glass-panel rounded-lg p-6 overflow-y-auto relative min-h-[300px]">
        {!result && !isLoading && (
           <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 opacity-50">
              <Globe className="w-16 h-16 mb-4 stroke-1" />
              <p className="font-mono text-sm">AWAITING INPUT...</p>
           </div>
        )}

        {isLoading && (
            <div className="flex flex-col gap-4 animate-pulse">
                <div className="h-4 bg-cyan-900/20 rounded w-3/4"></div>
                <div className="h-4 bg-cyan-900/20 rounded w-full"></div>
                <div className="h-4 bg-cyan-900/20 rounded w-5/6"></div>
                <div className="h-32 bg-cyan-900/10 rounded w-full mt-4"></div>
            </div>
        )}

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="prose prose-invert prose-sm max-w-none">
              <div className="text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                {result.text}
              </div>
            </div>

            {result.sources.length > 0 && (
              <div className="mt-8 pt-4 border-t border-slate-800">
                <h4 className="text-xs font-mono text-cyan-500 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-3 h-3" />
                    GROUNDING SOURCES
                </h4>
                <div className="grid gap-2">
                  {result.sources.map((source, idx) => (
                    <a 
                      key={idx} 
                      href={source.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 rounded flex items-center justify-between group transition-all"
                    >
                      <span className="text-xs text-slate-400 group-hover:text-cyan-300 truncate pr-4">{source.title}</span>
                      <Globe className="w-3 h-3 text-slate-600 group-hover:text-cyan-400" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchTerminal;
