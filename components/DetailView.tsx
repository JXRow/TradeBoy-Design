import React, { useState, useEffect } from 'react';
import { Coin } from '../types';
import { analyzeCoin } from '../services/geminiService';
import { LineChart, Line, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';

interface DetailViewProps {
  coin: Coin;
  activeActionIndex: number; // 0: BUY, 1: SELL, 2: ORACLE
}

export const DetailView: React.FC<DetailViewProps> = ({ coin, activeActionIndex }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);

  // Trigger reveal animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const addLine = (text: string) => {
    setTerminalLines(prev => [...prev.slice(-3), text]);
  };

  const data = Array.from({ length: 40 }, (_, i) => ({
    name: i,
    value: coin.price * (1 + (Math.random() * 0.08 - 0.04)),
  }));

  const triggerAnalysis = async () => {
    if (aiAnalysis || isAnalyzing) return;
    setIsAnalyzing(true);
    addLine("> ACCESSING NODE...");
    addLine("> ANALYZING FLUX...");
    
    const result = await analyzeCoin(coin);
    setAiAnalysis(result);
    setIsAnalyzing(false);
    addLine("> COMPLETE.");
  };

  useEffect(() => {
    const handleTrigger = () => {
       triggerAnalysis();
    };
    window.addEventListener('EXECUTE_ORACLE', handleTrigger);
    return () => window.removeEventListener('EXECUTE_ORACLE', handleTrigger);
  }, [aiAnalysis, isAnalyzing]);

  return (
    <div className={`flex-1 flex flex-col h-full bg-black p-4 font-mono relative overflow-hidden transition-opacity duration-500 ${revealed ? 'opacity-100' : 'opacity-0'}`}>
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6 border-b-2 border-matrix-text pb-2 z-10">
        <div className={`${revealed ? 'translate-x-0' : '-translate-x-10'} transition-transform duration-500`}>
           <h1 className="text-6xl font-bold text-matrix-text glow-text leading-none tracking-tighter">
             {coin.symbol}
           </h1>
           <span className="text-lg text-matrix-dim block mt-2 font-bold">>> STREAM: {coin.name.toUpperCase()}</span>
        </div>
        <div className={`text-right ${revealed ? 'translate-x-0' : 'translate-x-10'} transition-transform duration-500`}>
          <div className="text-5xl text-white font-bold tracking-widest bg-matrix-dark px-2">
            ${coin.price.toLocaleString()}
          </div>
          <div className={`text-2xl mt-2 font-bold ${coin.change24h >= 0 ? 'text-matrix-text' : 'text-matrix-alert'}`}>
            FLUX: {coin.change24h}%
          </div>
        </div>
      </div>

      <div className="flex flex-1 gap-6 z-10">
        
        {/* Wireframe Chart */}
        <div className="w-2/3 border-2 border-matrix-dim bg-black/50 p-2 flex flex-col relative overflow-hidden">
          <div className="absolute top-1 left-2 text-sm text-matrix-dim font-bold tracking-tighter">DATA_VIS_PRIMARY</div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#003B00" strokeDasharray="3 3" />
              <YAxis domain={['auto', 'auto']} hide />
              <Line 
                type="step" 
                dataKey="value" 
                stroke="#00FF41" 
                strokeWidth={3} 
                dot={false}
                isAnimationActive={true} 
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Command Stack */}
        <div className="w-1/3 flex flex-col gap-3">
          <div className="text-sm text-matrix-dim mb-1 text-center font-bold tracking-widest uppercase">Commands</div>
          
          {['EXEC_BUY', 'EXEC_SELL', 'ORACLE'].map((action, idx) => {
            const isActive = idx === activeActionIndex;
            return (
              <div 
                key={action}
                className={`
                  flex-1 flex items-center justify-center px-2 border-2 text-xl font-bold tracking-wider
                  ${isActive 
                    ? 'bg-matrix-text text-black glow-border border-matrix-text translate-x-1 shadow-[0_0_15px_rgba(0,255,65,0.5)]' 
                    : 'bg-black text-matrix-dim border-matrix-dim'
                  }
                  transition-all duration-100
                `}
              >
                <div className="flex items-center justify-center leading-none pt-1">
                  {isActive && <span className="animate-blink mr-2">></span>}
                  <span>{action}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Terminal Footer */}
      <div className="mt-4 h-28 border-2 border-matrix-dim bg-black p-3 text-lg font-mono overflow-hidden z-10 shadow-[inset_0_0_10px_rgba(0,255,65,0.2)]">
        <div className="text-matrix-dim border-b border-matrix-dark mb-2 pb-1 flex justify-between uppercase text-xs font-bold tracking-widest">
           <span>> Terminal_v4.0</span>
           <span>{isAnalyzing ? "Processing..." : "Ready"}</span>
        </div>
        <div className="flex flex-col gap-1 text-matrix-text leading-tight">
          {terminalLines.map((line, i) => (
             <div key={i} className="opacity-70 text-base">{line}</div>
          ))}
          {aiAnalysis && (
            <div className="text-white font-bold bg-matrix-dark/50 p-2 border-l-4 border-matrix-text text-xl animate-pulse">
              {aiAnalysis}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};