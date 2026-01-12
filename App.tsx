import React, { useState, useEffect, useCallback } from 'react';
import { MOCK_COINS } from './constants';
import { Coin, ViewState, KeyAction, TransactionType } from './types';
import { MarketView } from './components/MarketView';
import { TransactionView } from './components/TransactionView';

const App: React.FC = () => {
  const SCREEN_WIDTH = 720;
  const SCREEN_HEIGHT = 480;

  const [view, setView] = useState<ViewState>(ViewState.MARKET_LIST);
  const [coins] = useState<Coin[]>(MOCK_COINS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [txType, setTxType] = useState<TransactionType>('BUY');
  
  const [footerActionIndex, setFooterActionIndex] = useState(0); 
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2500);
  };

  const handleKey = useCallback((key: KeyAction) => {
    if (key === 'BACK') {
      if (view === ViewState.TRANSACTION) {
        setView(ViewState.MARKET_LIST);
        return;
      }
    }

    if (view === ViewState.MARKET_LIST) {
      if (key === 'UP') {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : coins.length - 1));
      } else if (key === 'DOWN') {
        setSelectedIndex(prev => (prev < coins.length - 1 ? prev + 1 : 0));
      } else if (key === 'LEFT') {
        setFooterActionIndex(0);
      } else if (key === 'RIGHT') {
        setFooterActionIndex(1);
      } else if (key === 'ENTER') {
        const coin = coins[selectedIndex];
        if (footerActionIndex === 1 && coin.holdings <= 0) {
          showNotification("ERROR: NO ASSETS");
          return;
        }
        setSelectedCoin(coin);
        setTxType(footerActionIndex === 0 ? 'BUY' : 'SELL');
        setView(ViewState.TRANSACTION);
      }
    }
  }, [view, coins, selectedIndex, footerActionIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.startsWith('F')) return;
      
      e.preventDefault();
      switch(e.key) {
        case 'ArrowUp': handleKey('UP'); break;
        case 'ArrowDown': handleKey('DOWN'); break;
        case 'ArrowLeft': handleKey('LEFT'); break;
        case 'ArrowRight': handleKey('RIGHT'); break;
        case 'Enter': handleKey('ENTER'); break;
        case 'Escape': 
        case 'Backspace': handleKey('BACK'); break;
        case 'q': case 'Q': handleKey('L1'); break;
        case 'w': case 'W': handleKey('R1'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKey]);

  return (
    <div className="w-screen h-screen bg-neutral-900 flex items-center justify-center font-mono overflow-hidden">
      <div className="relative bg-zinc-900 rounded-lg p-6 shadow-[0_0_50px_rgba(0,255,65,0.1)] flex flex-row items-center gap-6 border border-zinc-700">
        
        {/* Hardware Frame - Left Controls */}
        <div className="flex flex-col items-center gap-2">
           <div className="w-10 h-10 bg-zinc-800 rounded-t border-t border-zinc-600"></div>
           <div className="flex gap-10">
             <div className="w-10 h-10 bg-zinc-800 rounded-l border-l border-zinc-600"></div>
             <div className="w-10 h-10 bg-black rounded-full border border-zinc-700 flex items-center justify-center">
                <div className="w-1 h-1 bg-matrix-text rounded-full animate-pulse"></div>
             </div>
             <div className="w-10 h-10 bg-zinc-800 rounded-r border-r border-zinc-600"></div>
           </div>
           <div className="w-10 h-10 bg-zinc-800 rounded-b border-b border-zinc-600"></div>
           <span className="text-zinc-600 font-bold mt-2 text-[10px] tracking-widest uppercase">D-PAD</span>
        </div>

        {/* Screen Container */}
        <div className="relative p-1 bg-zinc-800 rounded shadow-inner border-2 border-zinc-700">
           <div 
             style={{ width: `${SCREEN_WIDTH}px`, height: `${SCREEN_HEIGHT}px` }} 
             className="crt-screen relative overflow-hidden bg-black"
           >
             <div className="crt-vignette"></div>

             {view === ViewState.MARKET_LIST && (
               <MarketView 
                 coins={coins} 
                 selectedIndex={selectedIndex} 
                 footerActionIndex={footerActionIndex} 
               />
             )}

             {view === ViewState.TRANSACTION && selectedCoin && (
               <TransactionView 
                  coin={selectedCoin} 
                  type={txType}
                  onClose={() => setView(ViewState.MARKET_LIST)}
                  onConfirm={(amt) => {
                    showNotification(`EXECUTED: ${txType} ${amt} ${selectedCoin.symbol}`);
                    setView(ViewState.MARKET_LIST);
                  }}
               />
             )}

             {notification && (
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-matrix-text text-black font-bold px-8 py-4 border-4 border-white z-[200] shadow-[0_0_40px_rgba(0,255,65,1)] text-2xl text-center">
                 <span className="animate-pulse block text-4xl mb-2">⚠</span>
                 {notification}
               </div>
             )}
           </div>
        </div>

        {/* Hardware Frame - Right Controls */}
        <div className="flex flex-col gap-6">
           <div className="flex flex-col gap-2">
              <div className="flex gap-4">
                 <div className="w-10 h-6 bg-zinc-700 rounded-sm border-t-2 border-zinc-500 text-[10px] flex items-center justify-center text-zinc-400">L1</div>
                 <div className="w-10 h-6 bg-zinc-700 rounded-sm border-t-2 border-zinc-500 text-[10px] flex items-center justify-center text-zinc-400">R1</div>
              </div>
              <div className="flex gap-4">
                 <div className="w-14 h-14 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center text-zinc-500 font-bold active:border-zinc-500 active:text-white transition-all shadow-md">B</div>
                 <div className="w-14 h-14 rounded-full bg-zinc-800 border-4 border-zinc-700 flex items-center justify-center text-zinc-500 font-bold active:border-zinc-500 active:text-white transition-all shadow-md">A</div>
              </div>
           </div>
           <div className="h-px bg-zinc-700 w-full"></div>
           <span className="text-zinc-600 font-bold text-[10px] text-center tracking-widest uppercase">System</span>
        </div>
      </div>
      
      <div className="absolute bottom-4 text-zinc-600 font-mono text-xs uppercase flex gap-8">
        <span><span className="text-matrix-text">Hardware</span>: Handheld_v4</span>
        <span><span className="text-matrix-text">L1/R1</span>: Shortcuts (Q/W)</span>
        <span><span className="text-matrix-text">A</span>: Enter | <span className="text-matrix-text">B</span>: Back</span>
      </div>
    </div>
  );
};

export default App;