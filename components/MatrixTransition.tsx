import React, { useEffect, useRef } from 'react';

export const MatrixTransition: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 720;
    canvas.height = 480;

    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789日한㐦㐧㐨";
    const fontSize = 24;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = 1;
    }

    let animationFrameId: number;

    const draw = () => {
      // Very slight fade for long trails
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00FF41";
      ctx.font = `bold ${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationFrameId = window.requestAnimationFrame(draw);
    };

    draw();

    return () => window.cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-[100] pointer-events-none"
      style={{ width: '720px', height: '480px' }}
    />
  );
};