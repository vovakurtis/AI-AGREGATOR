import React from 'react';
import { Cpu } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cyan-500/20 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500 blur-md opacity-40 animate-pulse-slow"></div>
          <Cpu className="w-8 h-8 text-cyan-400 relative z-10" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold font-sans tracking-wider text-white neon-text">
            AI INSIGHTS
          </h1>
          <span className="text-[10px] text-cyan-600 font-mono tracking-[0.2em] uppercase">
            Powered by Gemini
          </span>
        </div>
      </div>
      <div className="flex gap-2">
         <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
         <div className="h-2 w-2 rounded-full bg-cyan-500/50"></div>
         <div className="h-2 w-2 rounded-full bg-cyan-500/20"></div>
      </div>
    </header>
  );
};

export default Header;
