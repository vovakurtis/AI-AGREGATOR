import React from 'react';
import { NewsItem } from '../types';
import { Share2, Bookmark, Activity, CheckCircle } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
  isRead?: boolean;
  onAnalyze?: (topic: string) => void;
}

const NewsCard: React.FC<NewsCardProps> = ({ item, isRead = false, onAnalyze }) => {
  return (
    <div className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 group mb-6 mx-4 relative ${isRead ? 'opacity-70 grayscale-[0.3]' : 'glass-panel-hover'}`}>
        {/* Decorative corner markers */}
        <div className={`absolute top-0 left-0 w-4 h-4 border-t border-l rounded-tl-lg transition-colors ${isRead ? 'border-slate-600' : 'border-cyan-500/50'}`}></div>
        <div className={`absolute top-0 right-0 w-4 h-4 border-t border-r rounded-tr-lg transition-colors ${isRead ? 'border-slate-600' : 'border-cyan-500/50'}`}></div>
        <div className={`absolute bottom-0 left-0 w-4 h-4 border-b border-l rounded-bl-lg transition-colors ${isRead ? 'border-slate-600' : 'border-cyan-500/50'}`}></div>
        <div className={`absolute bottom-0 right-0 w-4 h-4 border-b border-r rounded-br-lg transition-colors ${isRead ? 'border-slate-600' : 'border-cyan-500/50'}`}></div>

        {/* Read Indicator */}
        {isRead && (
            <div className="absolute top-3 left-3 z-30 bg-slate-900/80 backdrop-blur-md px-2 py-1 rounded-full border border-slate-700 flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-mono text-slate-400">READ</span>
            </div>
        )}

      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent z-10"></div>
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
        />
        <div className="absolute top-3 right-3 z-20 bg-black/60 backdrop-blur-sm px-2 py-1 rounded border border-cyan-500/30">
            <span className="text-[10px] font-mono text-cyan-300 uppercase tracking-widest">{item.category}</span>
        </div>
      </div>
      
      <div className="p-5 relative z-20 -mt-10">
        <div className="flex items-center gap-2 mb-2">
            <Activity className={`w-3 h-3 ${isRead ? 'text-slate-500' : 'text-cyan-400'}`} />
            <span className="text-[10px] text-cyan-200 font-mono">{item.source} • {item.timestamp}</span>
        </div>
        
        <h3 className={`text-xl font-bold mb-2 leading-tight transition-colors ${isRead ? 'text-slate-400' : 'text-white group-hover:text-cyan-200'}`}>
          {item.title}
        </h3>
        
        <p className="text-sm text-slate-300 mb-4 line-clamp-3 font-light">
          {item.summary}
        </p>
        
        <div className="flex items-center justify-between border-t border-slate-700/50 pt-4">
          <button 
            onClick={() => onAnalyze?.(item.title)}
            className={`text-xs font-mono transition-colors flex items-center gap-1 group/btn ${isRead ? 'text-slate-500 hover:text-slate-300' : 'text-cyan-400 hover:text-white'}`}
          >
            {isRead ? 'RE-ANALYZE' : 'READ_FULL_ANALYSIS'} <span className="group-hover/btn:translate-x-1 transition-transform">&gt;</span>
          </button>
          <div className="flex gap-4">
            <button className="text-slate-400 hover:text-cyan-400 transition-colors">
              <Bookmark className="w-4 h-4" />
            </button>
            <button className="text-slate-400 hover:text-cyan-400 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;