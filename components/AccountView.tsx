
import React, { useState, useEffect } from 'react';
import { KeyAction } from '../types';

interface AccountViewProps {
  keyAction: KeyAction | null;
}

export const AccountView: React.FC<AccountViewProps> = ({ keyAction }) => {
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [focusedColumn, setFocusedColumn] = useState(0); // 0: HL, 1: Arbitrum
  
  const fullAddress = "0x88f273412a8901cde4a1bb22390f12c129e4a1";
  const displayAddress = "0x88f2...e4a1";

  // Handle keys passed from App
  useEffect(() => {
    if (!keyAction) return;

    if (keyAction === 'X') {
      setShowAddressDialog(true);
    } else if (keyAction === 'BACK' && (showAddressDialog)) {
      setShowAddressDialog(false);
    } else if (keyAction === 'LEFT') {
      setFocusedColumn(0);
    } else if (keyAction === 'RIGHT') {
      setFocusedColumn(1);
    }
  }, [keyAction, showAddressDialog]);

  return (
    <div className="flex-1 flex flex-col h-full bg-matrix-bg p-4 font-mono overflow-hidden relative crt-bulge">
      {/* Matrix Grid Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none z-0" 
           style={{ backgroundImage: 'linear-gradient(#00FF41 1px, transparent 1px), linear-gradient(90deg, #00FF41 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Header Area */}
      <div className="border-b-4 border-matrix-dim mb-4 pb-3 flex justify-between items-center relative z-10">
        <h2 className="text-4xl font-black text-matrix-text glow-text tracking-tighter leading-none pt-1">> SYS_ACCOUNT</h2>
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-matrix-dim uppercase tracking-widest whitespace-nowrap pt-1">
             SPOT | PERP | <span className="text-matrix-text">*</span>
          </div>
          <div className="flex gap-2">
            <span className="bg-matrix-dim text-black text-lg font-black w-8 h-8 rounded-sm flex items-center justify-center leading-none pt-1">L1</span>
            <span className="bg-matrix-dim text-black text-lg font-black w-8 h-8 rounded-sm flex items-center justify-center leading-none pt-1">R1</span>
          </div>
        </div>
      </div>

      {/* Main Content: Two Columns */}
      <div className="grid grid-cols-2 gap-6 relative z-10 flex-1 mb-2">
        
        {/* HYPERLIQUID ACCOUNT */}
        <div className={`border-4 p-4 flex flex-col transition-all duration-150 ${focusedColumn === 0 ? 'border-matrix-text bg-matrix-dark/20' : 'border-matrix-dim bg-black/40'}`}>
           <div className="flex items-center gap-2 mb-4">
             {focusedColumn === 0 && <span className="animate-blink text-matrix-text text-xl">█</span>}
             <h3 className={`text-2xl font-black uppercase tracking-tighter ${focusedColumn === 0 ? 'text-matrix-text' : 'text-matrix-dim'}`}>>> HYPERLIQUID_DEX</h3>
           </div>
           
           <div className="space-y-6 flex-1">
             <div>
               <div className="text-lg text-matrix-dim font-bold uppercase mb-1">Total_Asset_Value</div>
               <div className="text-5xl font-black text-white">$42,904.32</div>
             </div>

             <div className="bg-matrix-dark/40 p-3 border-l-4 border-matrix-text">
               <div className="text-sm text-matrix-dim uppercase">24h_PnL_Flux</div>
               <div className="text-3xl font-black text-matrix-text">+$1,240.50 (+2.8%)</div>
             </div>

             <div className="flex justify-between items-end border-b border-matrix-dark pb-2">
               <span className="text-xl text-matrix-dim font-bold uppercase">USDC_Balance</span>
               <span className="text-3xl font-black text-matrix-text">3,124.20</span>
             </div>
           </div>

           <div className={`mt-4 py-3 h-14 border-2 flex items-center justify-center text-xl font-black tracking-tighter transition-none ${focusedColumn === 0 ? 'bg-matrix-text text-black border-matrix-text shadow-[0_0_15px_rgba(0,255,65,0.6)]' : 'bg-black text-matrix-dim border-matrix-dim'}`}>
              <div className="pt-1">WITHDRAW USDC -&gt;</div>
           </div>
        </div>
        
        {/* ARBITRUM WALLET */}
        <div className={`border-4 p-4 flex flex-col transition-all duration-150 ${focusedColumn === 1 ? 'border-matrix-text bg-matrix-dark/20' : 'border-matrix-dim bg-black/40'}`}>
           <div className="flex items-center gap-2 mb-4">
             {focusedColumn === 1 && <span className="animate-blink text-matrix-text text-xl">█</span>}
             <h3 className={`text-2xl font-black uppercase tracking-tighter ${focusedColumn === 1 ? 'text-matrix-text' : 'text-matrix-dim'}`}>>> ARBITRUM_L2</h3>
           </div>

           <div className="space-y-6 flex-1">
             <div className="flex justify-between items-center bg-matrix-dark/30 p-2 border border-matrix-dim/30">
                <span className="text-lg text-matrix-dim font-black uppercase">Address</span>
                <div className="flex items-center gap-2">
                   <span className="text-xl font-bold text-white font-mono">{displayAddress}</span>
                   <div className="bg-matrix-dim text-black w-6 h-6 rounded-sm flex items-center justify-center text-xs font-black shadow-sm">X</div>
                </div>
             </div>

             <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-xl text-matrix-dim font-bold uppercase">ETH_Balance</span>
                 <span className="text-3xl font-black text-matrix-text">1.4502</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-xl text-matrix-dim font-bold uppercase">USDC_Balance</span>
                 <span className="text-3xl font-black text-matrix-text">1,204.00</span>
               </div>
             </div>

             <div className="mt-2 text-[14px] text-matrix-dim font-bold text-center">
                GAS: 12 GWEI ≈ $0.01
             </div>
           </div>

           <div className={`mt-4 py-3 h-14 border-2 flex items-center justify-center text-xl font-black tracking-tighter transition-none ${focusedColumn === 1 ? 'bg-matrix-text text-black border-matrix-text shadow-[0_0_15px_rgba(0,255,65,0.6)]' : 'bg-black text-matrix-dim border-matrix-dim'}`}>
              <div className="pt-1">&lt;- DEPOSIT USDC</div>
           </div>
        </div>
      </div>

      {/* Full Address Popup */}
      {showAddressDialog && (
        <div className="absolute inset-0 z-[200] flex items-center justify-center p-8 bg-black/90 backdrop-blur-md">
           <div className="border-4 border-matrix-text bg-black p-8 max-w-lg w-full shadow-[0_0_40px_rgba(0,255,65,0.4)] relative">
              <div className="text-matrix-dim text-sm font-black mb-2 uppercase tracking-[0.2em]">Full_Wallet_Signature</div>
              <div className="text-3xl font-black text-white break-all font-mono leading-relaxed bg-matrix-dark/20 p-4 border border-matrix-dim">
                {fullAddress}
              </div>
              <div className="mt-8 flex justify-center">
                 <div className="bg-matrix-text text-black px-8 py-3 text-2xl font-black animate-pulse cursor-pointer" onClick={() => setShowAddressDialog(false)}>
                    [B] CLOSE_BUFFER
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
