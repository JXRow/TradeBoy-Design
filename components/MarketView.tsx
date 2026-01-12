import React, { useEffect, useRef } from 'react';
import { Coin } from '../types';

interface MarketViewProps {
  coins: Coin[];
  selectedIndex: number;
  footerActionIndex: number; // 0: BUY, 1: SELL
}

export const MarketView: React.FC<MarketViewProps> = ({ coins, selectedIndex, footerActionIndex }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const selectedCoin = coins[selectedIndex];
  const holdingValue = (selectedCoin.holdings * selectedCoin.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  useEffect(() => {
    // Manual scroll calculation to prevent browser-level "screen jumping" 
    const container = listRef.current;
    const item = itemRefs.current[selectedIndex];
    
    if (container && item) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      if (itemRect.top < containerRect.top) {
        container.scrollTop -= (containerRect.top - itemRect.top) + 8;
      } else if (itemRect.bottom > containerRect.bottom) {
        container.scrollTop += (itemRect.bottom - containerRect.bottom) + 8;
      }
    }
  }, [selectedIndex]);

  return (
    <div className="flex-1 flex flex-col h-full bg-matrix-bg p-4 font-mono overflow-hidden relative crt-bulge">
      {/* Matrix Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0" 
           style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header Area */}
      <div className="border-b-4 border-matrix-dim mb-4 pb-3 flex justify-between items-center relative z-10">
        <h2 className="text-4xl font-black text-matrix-text glow-text tracking-tighter leading-none">> SPOT_TRADE</h2>
        <div className="flex items-center gap-4">
          <div className="text-sm font-bold text-matrix-dim uppercase tracking-widest whitespace-nowrap">
            PERP | ASSET | PROFILE
          </div>
          <div className="flex gap-1">
            <span className="bg-matrix-dim text-black text-[10px] font-black w-5 h-5 rounded-sm shadow-sm flex items-center justify-center leading-none">L1</span>
            <span className="bg-matrix-dim text-black text-[10px] font-black w-5 h-5 rounded-sm shadow-sm flex items-center justify-center leading-none">R1</span>
          </div>
        </div>
      </div>
      
      {/* Table Headers */}
      <div className="flex px-4 text-xl text-matrix-dim mb-2 uppercase font-black relative z-10 leading-none">
        <span className="w-32 pl-8">CODE</span>
        <span className="flex-1 text-center">HOLDINGS</span>
        <span className="w-32 text-right">PRICE</span>
        <span className="w-24 text-right">24H</span>
      </div>

      {/* Main List */}
      <div 
        ref={listRef}
        className="flex-1 overflow-y-auto space-y-2 pb-2 relative z-10 scroll-smooth scrollbar-hide overscroll-none"
        style={{ scrollBehavior: 'auto' }}
      >
        {coins.map((coin, index) => {
          const isSelected = index === selectedIndex;
          const isUp = coin.change24h >= 0;
          const hasHoldings = coin.holdings > 0;

          return (
            <div
              key={coin.id}
              ref={el => { itemRefs.current[index] = el; }}
              className={`
                flex items-center px-4 py-3 cursor-none border-l-8 transition-colors duration-75
                ${isSelected 
                  ? 'bg-matrix-text text-black font-bold border-matrix-text' 
                  : 'text-matrix-text hover:bg-matrix-dark border-transparent opacity-80'
                }
              `}
            >
              <div className="w-32 flex items-center font-black text-3xl leading-none">
                 {isSelected && <span className="animate-blink mr-1">█</span>}
                 {!isSelected && <span className="mr-1 w-[1ch]"> </span>}
                 {coin.symbol}
              </div>
              
              <div className="flex-1 text-center text-2xl font-bold font-mono leading-none">
                {hasHoldings ? coin.holdings.toFixed(2) : ""}
              </div>

              <div className="w-32 text-right font-mono text-2xl font-bold leading-none">
                {coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              
              <div className={`w-24 text-right text-xl font-bold leading-none ${!isSelected ? (isUp ? 'text-matrix-text' : 'text-matrix-alert') : 'text-black'}`}>
                {isUp ? '+' : ''}{coin.change24h}%
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Footer Actions */}
      <div className="mt-auto border-t-4 border-matrix-dim h-16 pt-2 pb-1 relative z-10 flex items-center justify-between px-1">
        <div className="text-xl font-bold text-matrix-text glow-text flex-1 truncate pr-4 leading-none self-center">
          {selectedCoin.holdings > 0 
            ? `Holding ${selectedCoin.holdings} ${selectedCoin.symbol} worth $${holdingValue}`
            : `No ${selectedCoin.symbol} in wallet`
          }
        </div>
        
        <div className="flex gap-4 items-center">
          {/* BUY BUTTON - Increased pt to push text down slightly more for monospace baseline alignment */}
          <div className={`
            w-24 h-11 flex items-center justify-center text-lg font-black tracking-wider border-2 transition-none
            ${footerActionIndex === 0 
              ? 'bg-matrix-text text-black border-matrix-text shadow-[0_0_10px_rgba(0,255,65,0.6)]' 
              : 'bg-black text-matrix-dim border-matrix-dim'
            }
          `}>
            <div className="flex items-center justify-center leading-none h-full w-full pt-[7px]">
              {footerActionIndex === 0 && <span className="mr-1 animate-blink text-xl pb-1">></span>}
              BUY
            </div>
          </div>

          {/* SELL BUTTON */}
          <div className={`
            w-24 h-11 flex items-center justify-center text-lg font-black tracking-wider border-2 transition-none
            ${selectedCoin.holdings > 0 
              ? (footerActionIndex === 1 
                  ? 'bg-matrix-text text-black border-matrix-text shadow-[0_0_10px_rgba(0,255,65,0.6)]' 
                  : 'bg-black text-matrix-dim border-matrix-dim')
              : 'bg-black text-matrix-dark border-matrix-dark opacity-30'
            }
          `}>
            <div className="flex items-center justify-center leading-none h-full w-full pt-[7px]">
              {footerActionIndex === 1 && selectedCoin.holdings > 0 && <span className="mr-1 animate-blink text-xl pb-1">></span>}
              SELL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};