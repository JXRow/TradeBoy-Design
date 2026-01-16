
import React from 'react';

export const PerpView: React.FC = () => {
  const perps = [
    { symbol: 'BTC-PERP', price: '64,210.5', funding: '0.0100%', leverage: '50x' },
    { symbol: 'ETH-PERP', price: '3,452.1', funding: '0.0085%', leverage: '20x' },
    { symbol: 'SOL-PERP', price: '145.2', funding: '0.0120%', leverage: '10x' },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-matrix-bg p-4 font-mono overflow-hidden relative crt-bulge">
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0" 
           style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="border-b-4 border-matrix-dim mb-4 pb-3 flex justify-between items-center relative z-10">
        <h2 className="text-4xl font-black text-matrix-text glow-text tracking-tighter leading-none pt-1">> PERP_ENGINE</h2>
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-matrix-dim uppercase tracking-widest whitespace-nowrap pt-1">
             SPOT | <span className="text-matrix-text">*</span> | ACCOUNT
          </div>
          <div className="flex gap-2">
            <span className="bg-matrix-dim text-black text-lg font-black w-8 h-8 rounded-sm flex items-center justify-center leading-none pt-1">L1</span>
            <span className="bg-matrix-dim text-black text-lg font-black w-8 h-8 rounded-sm flex items-center justify-center leading-none pt-1">R1</span>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-4 relative z-10">
        {perps.map((p, idx) => (
          <div key={p.symbol} className={`border-2 p-4 flex justify-between items-center ${idx === 0 ? 'border-matrix-text bg-matrix-dark/20' : 'border-matrix-dim opacity-60'}`}>
            <div>
              <div className="text-3xl font-black text-matrix-text">{p.symbol}</div>
              <div className="text-xl text-matrix-dim font-bold">FUNDING: {p.funding}</div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white">${p.price}</div>
              <div className="inline-block bg-matrix-alert text-black px-2 text-xl font-black mt-1">LVG: {p.leverage}</div>
            </div>
          </div>
        ))}
        <div className="border-4 border-dashed border-matrix-dark p-8 flex items-center justify-center text-matrix-dim text-2xl font-black italic">
          --- SIGNAL_STABLE: AWAITING_ORDERS ---
        </div>
      </div>
      
      <div className="mt-auto border-t-4 border-matrix-dim h-20 flex items-center justify-center relative z-10">
        <div className="text-3xl font-black text-matrix-text animate-pulse">PRESS [A] TO INITIALIZE POSITION</div>
      </div>
    </div>
  );
};
