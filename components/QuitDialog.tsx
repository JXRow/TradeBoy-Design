
import React, { useState, useEffect } from 'react';

interface QuitDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const QuitDialog: React.FC<QuitDialogProps> = ({ onConfirm, onCancel }) => {
  const fullText = "Warning: Disconnecting from the construct will terminate all active sessions. Do you wish to proceed?";
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);
  const [selection, setSelection] = useState(1); // 0: YES, 1: NO

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[index]);
        setIndex(prev => prev + 1);
      }, 30);
      return () => clearTimeout(timeout);
    }
  }, [index, fullText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') setSelection(0);
      if (e.key === 'ArrowRight') setSelection(1);
      if (e.key === 'Enter') {
        if (selection === 0) onConfirm();
        else onCancel();
      }
      if (e.key === 'Escape' || e.key === 'Backspace') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection, onConfirm, onCancel]);

  return (
    <div className="absolute inset-0 z-[300] flex items-center justify-center p-12">
      {/* Dim Overlay */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm"></div>
      
      {/* Dialog Box */}
      <div className="relative w-[540px] border-4 border-matrix-dim bg-black p-10 shadow-[0_0_30px_rgba(0,143,17,0.3)] crt-bulge">
        
        <div className="min-h-[120px] text-2xl font-bold text-matrix-text leading-relaxed mb-10">
          <span className="mr-3 text-matrix-dim font-black">></span>
          {displayedText}<span className="animate-blink">_</span>
        </div>
        
        <div className="flex gap-8">
          <button 
            onClick={onConfirm}
            className={`flex-1 py-4 text-xl font-black border-2 transition-all ${selection === 0 ? 'bg-matrix-text text-black border-matrix-text' : 'bg-black text-matrix-dim border-matrix-dark opacity-40'}`}
          >
            <div className="flex items-center justify-center">
              {selection === 0 && <span className="animate-blink mr-2">></span>}
              Yes (Quit)
            </div>
          </button>
          
          <button 
            onClick={onCancel}
            className={`flex-1 py-4 text-xl font-black border-2 transition-all ${selection === 1 ? 'bg-matrix-text text-black border-matrix-text' : 'bg-black text-matrix-dim border-matrix-dark'}`}
          >
            <div className="flex items-center justify-center">
              {selection === 1 && <span className="animate-blink mr-2">></span>}
              No (Stay)
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
