import React, { useState, useEffect } from 'react';
import { Coin, TransactionType } from '../types';

interface TransactionViewProps {
  coin: Coin;
  type: TransactionType;
  onClose: () => void;
  onConfirm: (amount: string) => void;
}

const KEYPAD = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'DEL']
];

export const TransactionView: React.FC<TransactionViewProps> = ({ coin, type, onClose, onConfirm }) => {
  const [input, setInput] = useState('0');
  const [gridPos, setGridPos] = useState({ r: 0, c: 1 }); // Start on '2'
  const [footerIndex, setFooterIndex] = useState(-1); // -1 = Keypad, 0 = CONFIRM, 1 = CANCEL
  
  // Mock balance
  const userBalanceUSD = 10000; 
  const maxPossible = type === 'BUY' ? userBalanceUSD / coin.price : coin.holdings;
  
  const currentVal = parseFloat(input) || 0;
  const progress = Math.min(100, (currentVal / maxPossible) * 100);

  const handleInput = (val: string) => {
    if (val === 'DEL') {
      setInput(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
    } else {
      setInput(prev => {
        if (prev === '0' && val !== '.') return val;
        if (val === '.' && prev.includes('.')) return prev;
        if (prev.length > 10) return prev; // Limit length for screen size
        return prev + val;
      });
    }
  };

  const handleL1R1 = (dir: 'L1' | 'R1') => {
    const currentPercent = currentVal / maxPossible;
    let nextPercent = 0;

    if (dir === 'R1') {
      nextPercent = Math.min(1.0, (Math.floor((currentPercent + 0.001) / 0.05) + 1) * 0.05);
    } else {
      nextPercent = Math.max(0.0, (Math.ceil((currentPercent - 0.001) / 0.05) - 1) * 0.05);
    }
    
    const newAmt = (maxPossible * nextPercent).toFixed(4);
    setInput(parseFloat(newAmt).toString());
  };

  useEffect(() => {
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        if (footerIndex !== -1) setFooterIndex(-1);
        else setGridPos(p => ({ ...p, r: Math.max(0, p.r - 1) }));
      } else if (e.key === 'ArrowDown') {
        if (gridPos.r === 3) setFooterIndex(0);
        else setGridPos(p => ({ ...p, r: Math.min(3, p.r + 1) }));
      } else if (e.key === 'ArrowLeft') {
        if (footerIndex === 1) setFooterIndex(0);
        else if (footerIndex === 0) {} 
        else setGridPos(p => ({ ...p, c: Math.max(0, p.c - 1) }));
      } else if (e.key === 'ArrowRight') {
        if (footerIndex === 0) setFooterIndex(1);
        else if (footerIndex === 1) {} 
        else setGridPos(p => ({ ...p, c: Math.min(2, p.c + 1) }));
      } else if (e.key === 'Enter') {
        if (footerIndex === 0) onConfirm(input);
        else if (footerIndex === 1) onClose();
        else handleInput(KEYPAD[gridPos.r][gridPos.c]);
      } else if (e.key === 'q' || e.key === 'Q') {
        handleL1R1('L1');
      } else if (e.key === 'w' || e.key === 'W') {
        handleL1R1('R1');
      }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [gridPos, footerIndex, input]);

  return (
    <div className="flex-1 flex flex-col h-full bg-black p-4 font-mono overflow-hidden relative z-10 crt-bulge">
      {/* Matrix Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0" 
           style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header */}
      <div className="flex justify-between items-end border-b-4 border-matrix-dim pb-2 mb-4 relative z-10">
        <div>
          <h2 
            className={`text-4xl font-black ${type === 'BUY' ? 'text-matrix-text' : 'text-matrix-alert'} leading-none`}
            style={{ textShadow: type === 'BUY' ? '0 0 8px rgba(0, 255, 65, 0.6)' : '0 0 8px rgba(255, 0, 85, 0.6)' }}
          >
            {type}_ORDER: {coin.symbol}
          </h2>
          <div className="text-matrix-dim text-lg font-bold tracking-tighter">
            CURR_PRICE: ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        </div>
        <div className="text-right">
          <div className="text-matrix-dim text-sm font-bold uppercase tracking-widest">
            AVAILABLE_FUNDS
          </div>
          <div className="text-matrix-text text-xl font-black">
            {maxPossible.toFixed(4)} {type === 'BUY' ? 'USD' : coin.symbol}
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 relative z-10 overflow-hidden">
        {/* Left Side: Display & Keypad (Col Span 2) */}
        <div className="col-span-2 flex flex-col">
          {/* Main Input Display */}
          <div className="bg-matrix-dark/40 border-2 border-matrix-dim p-3 mb-4 flex flex-col justify-center items-end relative overflow-hidden h-32">
             <div className="absolute top-1 left-2 text-[10px] text-matrix-dim font-bold tracking-widest uppercase">INPUT_BUFFER</div>
             <div className="text-6xl font-black text-matrix-text glow-text truncate w-full text-right leading-none pt-2">
                {input}<span className="animate-blink text-matrix-dim">_</span>
             </div>
             <div className="text-matrix-dim text-lg font-bold mt-1">
                ≈ ${(currentVal * coin.price).toLocaleString(undefined, { maximumFractionDigits: 2 })} USD
             </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-3 gap-2 flex-1">
            {KEYPAD.map((row, rIdx) => 
              row.map((key, cIdx) => {
                const isSelected = footerIndex === -1 && gridPos.r === rIdx && gridPos.c === cIdx;
                return (
                  <div 
                    key={key}
                    className={`
                      flex items-center justify-center text-3xl font-black transition-all
                      border-2 ${isSelected 
                        ? 'bg-matrix-text text-black border-white shadow-[0_0_15px_rgba(0,255,65,0.8)]' 
                        : 'bg-black/80 text-matrix-text border-matrix-dim opacity-70'}
                    `}
                  >
                    <div className="pt-[6px] leading-none">{key}</div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right Side: Progress & Shortcuts (Col Span 1) */}
        <div className="col-span-1 flex flex-col gap-4">
          <div className="flex-1 border-2 border-matrix-dim bg-black/60 p-4 flex flex-col items-center justify-center">
             <div className="text-sm text-matrix-dim font-black mb-3 tracking-tighter uppercase">ALLOCATION_METER</div>
             
             {/* Vertical Progress Bar */}
             <div className="w-16 flex-1 bg-black border-2 border-matrix-dim relative overflow-hidden flex flex-col-reverse">
                <div 
                   className="bg-matrix-text transition-all duration-200 shadow-[0_0_20px_rgba(0,255,65,0.5)]" 
                   style={{ height: `${progress}%` }}
                ></div>
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                   <div className="border-t-2 border-matrix-text w-full h-0"></div>
                   <div className="border-t border-matrix-text w-full h-0"></div>
                   <div className="border-t-2 border-matrix-text w-full h-0"></div>
                   <div className="border-t border-matrix-text w-full h-0"></div>
                   <div className="border-t-2 border-matrix-text w-full h-0"></div>
                </div>
             </div>
             
             <div className="mt-3 text-3xl font-black text-matrix-text glow-text">{Math.round(progress)}%</div>
          </div>

          {/* L1/R1 Guide - Refined vertical centering for small labels */}
          <div className="bg-matrix-dark/60 border-2 border-matrix-dim p-2 flex flex-col gap-2 text-[11px] font-bold text-matrix-dim uppercase leading-tight">
             <div className="flex justify-between items-center">
               <span className="bg-matrix-dim text-black w-6 h-4 flex items-center justify-center rounded-sm mr-1 pt-[2px] leading-none text-[10px]">L1</span>
               <span className="text-matrix-text">DECREASE 5%</span>
             </div>
             <div className="flex justify-between items-center">
               <span className="bg-matrix-dim text-black w-6 h-4 flex items-center justify-center rounded-sm mr-1 pt-[2px] leading-none text-[10px]">R1</span>
               <span className="text-matrix-text">INCREASE 5%</span>
             </div>
          </div>
        </div>
      </div>

      {/* Footer Actions - Grid alignment matching the panels above */}
      <div className="mt-4 grid grid-cols-3 gap-6 h-14 relative z-10">
        <div className={`
          col-span-2 flex items-center justify-center text-xl font-black tracking-widest border-2 transition-all
          ${footerIndex === 0 
            ? 'bg-matrix-text text-black border-matrix-text shadow-[0_0_10px_rgba(0,255,65,0.6)]' 
            : 'bg-black text-matrix-text border-matrix-dim'}
        `}>
          <div className="flex items-center justify-center leading-none pt-[7px]">
            {footerIndex === 0 && <span className="mr-2 animate-blink">></span>}
            CONFIRM_EXEC
          </div>
        </div>
        <div className={`
          col-span-1 flex items-center justify-center text-xl font-black tracking-widest border-2 transition-all
          ${footerIndex === 1 
            ? 'bg-white text-black border-white' 
            : 'bg-black text-matrix-alert border-matrix-alert opacity-60'}
        `}>
          <div className="flex items-center justify-center leading-none pt-[7px]">
            {footerIndex === 1 && <span className="mr-2 animate-blink">></span>}
            ABORT
          </div>
        </div>
      </div>
    </div>
  );
};