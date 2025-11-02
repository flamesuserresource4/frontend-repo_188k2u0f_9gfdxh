import React, { useEffect, useRef, useState, useCallback } from 'react';
import GameHUD from './GameHUD';

// Simple arcade clicker: tap the glowing orbs to score before the timer runs out.
export default function GameCanvas() {
  const canvasRef = useRef(null);
  const [playing, setPlaying] = useState('idle'); // idle | playing | ended
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(() => {
    const v = typeof window !== 'undefined' ? localStorage.getItem('neo_best') : null;
    return v ? parseInt(v, 10) : 0;
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const targetsRef = useRef([]);
  const rafRef = useRef(null);
  const startTimeRef = useRef(0);

  const spawnTarget = useCallback((w, h) => {
    const radius = 14 + Math.random() * 18;
    const speed = 0.7 + Math.random() * 1.3;
    const angle = Math.random() * Math.PI * 2;
    const hue = Math.floor(Math.random() * 360);
    return {
      x: Math.random() * (w - radius * 2) + radius,
      y: Math.random() * (h - radius * 2) + radius,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      r: radius,
      hue,
      life: 0,
    };
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(Math.max(320, rect.height) * dpr);
    canvas.style.width = rect.width + 'px';
    canvas.style.height = Math.max(320, rect.height) + 'px';
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    targetsRef.current = [];
    setPlaying('idle');
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(30);
    targetsRef.current = [];
    setPlaying('playing');
    startTimeRef.current = performance.now();

    // Initial targets
    const canvas = canvasRef.current;
    if (canvas) {
      const w = canvas.width;
      const h = canvas.height;
      for (let i = 0; i < 8; i++) targetsRef.current.push(spawnTarget(w, h));
    }
  }, [spawnTarget]);

  // Main loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let last = performance.now();

    const draw = (t) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.width;
      const h = canvas.height;

      // Time
      if (playing === 'playing') {
        const elapsed = (t - startTimeRef.current) / 1000;
        const left = Math.max(0, 30 - Math.floor(elapsed));
        if (left !== timeLeft) setTimeLeft(left);
        if (left <= 0) {
          setPlaying('ended');
          const newBest = Math.max(best, score);
          setBest(newBest);
          localStorage.setItem('neo_best', String(newBest));
        }
      }

      // Update
      const dt = Math.min(0.032, (t - last) / 1000);
      last = t;

      // Background
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#0b1020';
      ctx.fillRect(0, 0, w, h);

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1 * dpr;
      const grid = 40 * dpr;
      for (let gx = 0; gx < w; gx += grid) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += grid) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // Targets
      const arr = targetsRef.current;
      if (playing === 'playing') {
        for (let i = 0; i < arr.length; i++) {
          const a = arr[i];
          a.x += a.vx * 60 * dt;
          a.y += a.vy * 60 * dt;
          a.life += dt;

          // Bounce
          if (a.x < a.r || a.x > w - a.r) a.vx *= -1;
          if (a.y < a.r || a.y > h - a.r) a.vy *= -1;
        }

        // Spawn occasionally
        if (Math.random() < 0.01 && arr.length < 16) arr.push(spawnTarget(w, h));
      }

      // Draw targets with glow
      for (let i = 0; i < arr.length; i++) {
        const a = arr[i];
        const glow = 0.4 + 0.6 * Math.sin(a.life * 4);
        const grad = ctx.createRadialGradient(a.x, a.y, a.r * 0.2, a.x, a.y, a.r * 2.2);
        grad.addColorStop(0, `hsla(${a.hue} 100% 60% / 0.95)`);
        grad.addColorStop(1, `hsla(${a.hue} 100% 50% / 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r * (1.15 + 0.05 * Math.sin(a.life * 6)), 0, Math.PI * 2);
        ctx.fill();

        // Core
        ctx.fillStyle = `hsla(${a.hue} 100% 65% / 1)`;
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r * 0.55, 0, Math.PI * 2);
        ctx.fill();

        // Shine
        ctx.fillStyle = `hsla(${a.hue} 100% 95% / ${0.6 * glow})`;
        ctx.beginPath();
        ctx.arc(a.x - a.r * 0.2, a.y - a.r * 0.2, a.r * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, timeLeft, best, score]);

  // Resize handling
  useEffect(() => {
    resizeCanvas();
    const onR = () => resizeCanvas();
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, [resizeCanvas]);

  // Pointer handling
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const onClick = (e) => {
      if (playing !== 'playing') return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * dpr;
      const y = (e.clientY - rect.top) * dpr;

      const arr = targetsRef.current;
      for (let i = arr.length - 1; i >= 0; i--) {
        const a = arr[i];
        const dx = a.x - x;
        const dy = a.y - y;
        if (dx * dx + dy * dy <= a.r * a.r) {
          // Pop
          arr.splice(i, 1);
          setScore((s) => s + 1);
          // Spawn a couple of new ones for pace
          const w = canvas.width;
          const h = canvas.height;
          if (arr.length < 16) arr.push(spawnTarget(w, h));
          if (arr.length < 16 && Math.random() < 0.6) arr.push(spawnTarget(w, h));
          break;
        }
      }
    };

    canvas.addEventListener('click', onClick);
    return () => canvas.removeEventListener('click', onClick);
  }, [playing, spawnTarget]);

  useEffect(() => {
    // Initialize size after mount
    setTimeout(resizeCanvas, 0);
  }, [resizeCanvas]);

  return (
    <section id="play" className="relative py-10 md:py-14">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900">Neon Orbs</h2>
        </div>

        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
          <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-fuchsia-50">
            <GameHUD
              score={score}
              timeLeft={timeLeft}
              best={best}
              state={playing}
              onStart={startGame}
              onReset={resetGame}
            />
          </div>

          <div className="relative">
            <canvas ref={canvasRef} className="block w-full h-[420px] md:h-[520px] cursor-crosshair" />

            {playing === 'idle' && (
              <div className="absolute inset-0 grid place-items-center pointer-events-none">
                <div className="text-center px-6 py-4 rounded-2xl bg-white/80 backdrop-blur border border-gray-200 shadow">
                  <p className="text-gray-800 font-medium">Tap the glowing orbs to score points.</p>
                  <p className="text-gray-600 text-sm mt-1">You have 30 seconds. Good luck!</p>
                </div>
              </div>
            )}

            {playing === 'ended' && (
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center px-6 py-6 rounded-2xl bg-white/90 backdrop-blur border border-gray-200 shadow">
                  <p className="text-2xl font-bold text-gray-900">Game Over</p>
                  <p className="mt-2 text-gray-700">Your score: <span className="font-semibold">{score}</span></p>
                  <p className="text-gray-500 text-sm">Best: {best}</p>
                  <button onClick={startGame} className="mt-4 px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">Play Again</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div id="how" className="mt-8 text-gray-600 text-sm leading-relaxed">
          <p>
            Tip: Targets have subtle motion and glow. Aim slightly ahead of their path. On touch devices, just tap them. The
            game is built using only web standards: a canvas with JavaScript for rendering and Tailwind CSS for styling.
          </p>
        </div>
      </div>
    </section>
  );
}
