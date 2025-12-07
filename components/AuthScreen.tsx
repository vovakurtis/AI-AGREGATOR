import React, { useState } from 'react';
import { Lock, User, Mail, ArrowRight, Fingerprint, ShieldCheck } from 'lucide-react';
import { loginUser, registerUser } from '../services/authService';
import { User as UserType } from '../types';

interface AuthScreenProps {
  onAuthenticated: (user: UserType) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Artificial delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (isLogin) {
        const user = loginUser(email, password);
        onAuthenticated(user);
      } else {
        const user = registerUser(email, password);
        onAuthenticated(user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-20">
      <div className="w-full max-w-sm glass-panel p-8 rounded-2xl relative overflow-hidden">
        {/* Animated Background Gradient inside Card */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-scanline"></div>
        
        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-full bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center mb-4 relative">
                <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-pulse-slow"></div>
                {loading ? (
                    <Fingerprint className="w-8 h-8 text-cyan-400 animate-pulse" />
                ) : (
                    <ShieldCheck className="w-8 h-8 text-cyan-500" />
                )}
            </div>
            <h2 className="text-2xl font-bold text-white neon-text tracking-widest">
                {isLogin ? 'SYSTEM ACCESS' : 'NEW ID ENTRY'}
            </h2>
            <p className="text-xs text-cyan-600 font-mono tracking-[0.2em] mt-2">SECURE GATEWAY v3.1</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-700 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                        type="email" 
                        required
                        placeholder="USER_ID (EMAIL)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:bg-slate-900/80 font-mono text-sm transition-all"
                    />
                </div>
                <div className="relative group">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-700 group-focus-within:text-cyan-400 transition-colors" />
                    <input 
                        type="password" 
                        required
                        placeholder="ACCESS_CODE"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:bg-slate-900/80 font-mono text-sm transition-all"
                    />
                </div>
            </div>

            {error && (
                <div className="text-red-400 text-xs font-mono text-center bg-red-900/10 py-2 border border-red-900/30 rounded">
                    ERROR: {error.toUpperCase()}
                </div>
            )}

            <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-cyan-900/30 hover:bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-mono py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_15px_rgba(0,243,255,0.2)] group"
            >
                {loading ? 'VERIFYING...' : (isLogin ? 'AUTHENTICATE' : 'INITIATE REGISTRATION')}
                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
        </form>

        <div className="mt-6 text-center">
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-xs text-slate-500 hover:text-cyan-400 font-mono transition-colors"
            >
                {isLogin ? 'REQUEST NEW IDENTITY' : 'RETURN TO LOGIN'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
