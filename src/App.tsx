/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';
import { Zap, Activity, Radio, Cpu } from 'lucide-react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-magenta-500/5 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
      </div>

      {/* Top Navigation / Status Header */}
      <header className="h-16 flex items-center justify-between px-8 border-b border-white/10 glass-panel z-30">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-600 flex items-center justify-center">
            <div className="w-4 h-4 bg-black rounded-sm"></div>
          </div>
          <span className="text-xl font-bold tracking-widest neon-text-blue">SYNC_WAVE</span>
        </div>

        <div className="flex gap-12">
          <div className="flex flex-col items-end">
            <span className="text-[10px] uppercase opacity-50 tracking-tighter">Current Sync</span>
            <span className="text-2xl font-mono neon-text-pink leading-none">
              {currentScore.toString().padStart(6, '0')}
            </span>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] uppercase opacity-50 tracking-tighter">System Pulse</span>
            <span className="text-2xl font-mono text-white leading-none">STABLE</span>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-8 p-8 relative z-20 overflow-auto">
        
        {/* Sidebar Left: Up Next */}
        <aside className="hidden lg:flex lg:col-span-3 flex-col gap-6">
          <section className="glass-panel border-r border-white/5 p-6 rounded-2xl flex flex-col gap-6 h-full">
            <h2 className="text-xs uppercase tracking-widest opacity-40 font-bold mb-2">Live Metadata</h2>
            <div className="space-y-4">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] text-slate-500 uppercase mb-1">Protocol</div>
                <div className="text-sm font-medium text-cyan-400">SNAKE_GRID_OS</div>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="text-[10px] text-slate-500 uppercase mb-1">Frequency</div>
                <div className="text-sm font-medium text-white">44.1 kHz</div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-slate-500 uppercase mb-1">Buffer</div>
                  <div className="text-sm font-medium text-white">128ms</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[10px] text-slate-500 uppercase mb-1">Cores</div>
                  <div className="text-sm font-medium text-white">Neural</div>
                </div>
              </div>
            </div>

            <div className="mt-auto opacity-30">
               <div className="text-[10px] font-mono mb-2">NETWORK_LOAD</div>
               <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                 <div className="h-full bg-cyan-400 w-1/3" />
               </div>
            </div>
          </section>
        </aside>

        {/* Center: Snake Game */}
        <div className="col-span-12 lg:col-span-6 flex flex-col items-center justify-center">
          <SnakeGame onScoreUpdate={setCurrentScore} />
        </div>

        {/* Right: Music Player */}
        <aside className="col-span-12 lg:col-span-3 flex flex-col gap-6 items-center lg:items-end">
          <MusicPlayer />

          <div className="w-full max-w-md glass-panel rounded-3xl p-6">
             <div className="flex items-center justify-between mb-4">
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Efficiency</span>
               <Activity className="w-4 h-4 text-cyan-400" />
             </div>
             
             <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono uppercase opacity-50">
                  <span>Current Link Speed</span>
                  <span>{currentScore} Mbps</span>
                </div>
                <div className="progress-bar">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((currentScore / 1000) * 100, 100)}%` }}
                    className="progress-fill" 
                  />
                </div>
             </div>
          </div>
        </aside>
      </main>

      {/* Footer / Info Bar */}
      <footer className="h-10 border-t border-white/5 backdrop-blur-md z-30 px-8 flex items-center justify-between text-[10px] font-mono text-slate-600">
        <div className="flex gap-6">
          <span>LATENCY: 14MS</span>
          <span>FPS: 60</span>
          <span>REGION: ASIA-PACIFIC-NORTH</span>
        </div>
        <div className="flex gap-4">
          <span className="text-cyan-500/50">ENCRYPTION: AES-256</span>
          <span>© 2026 NEON_RIFT_LABS</span>
        </div>
      </footer>
    </div>
  );
}
