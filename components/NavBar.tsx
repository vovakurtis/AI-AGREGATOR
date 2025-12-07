import React from 'react';
import { Home, TrendingUp, FlaskConical, Settings } from 'lucide-react';
import { ViewState } from '../types';

interface NavBarProps {
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
}

const NavBar: React.FC<NavBarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: ViewState.HOME, icon: Home, label: 'Feed' },
    { id: ViewState.TRENDING, icon: TrendingUp, label: 'Trends' },
    { id: ViewState.RESEARCH, icon: FlaskConical, label: 'Research' },
    { id: ViewState.SETTINGS, icon: Settings, label: 'Config' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-panel border-t border-cyan-500/20 pb-safe pt-2 px-6">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {navItems.map((item) => {
            const isActive = currentView === item.id;
            return (
                <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="relative group flex flex-col items-center justify-center w-16 h-full"
                >
                    {isActive && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-cyan-500 shadow-[0_0_10px_#00f3ff] rounded-b-full"></div>
                    )}
                    <item.icon 
                        className={`w-6 h-6 mb-1 transition-all duration-300 ${
                            isActive ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(0,243,255,0.8)]' : 'text-slate-500 group-hover:text-cyan-200'
                        }`} 
                    />
                    <span className={`text-[10px] font-mono tracking-wider transition-colors ${
                        isActive ? 'text-cyan-100' : 'text-slate-600'
                    }`}>
                        {item.label}
                    </span>
                </button>
            )
        })}
      </div>
    </nav>
  );
};

export default NavBar;
