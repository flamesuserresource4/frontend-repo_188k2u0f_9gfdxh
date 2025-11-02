import React from 'react';

export default function GameHUD({ score, timeLeft, best, state, onStart, onReset }) {
  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-3 md:gap-6">
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 rounded-xl bg-gray-900 text-white text-sm md:text-base">Score: <span className="font-semibold">{score}</span></div>
        <div className={`px-4 py-2 rounded-xl text-sm md:text-base ${timeLeft <= 5 ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-900'}`}>Time: <span className="font-semibold">{timeLeft}s</span></div>
        <div className="px-4 py-2 rounded-xl bg-gray-100 text-gray-900 text-sm md:text-base">Best: <span className="font-semibold">{best}</span></div>
      </div>
      <div className="flex items-center gap-2">
        {state !== 'playing' && (
          <button onClick={onStart} className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium shadow hover:bg-indigo-700 transition">
            {state === 'idle' ? 'Start Game' : 'Play Again'}
          </button>
        )}
        {state === 'playing' && (
          <button onClick={onReset} className="px-5 py-2 rounded-xl bg-gray-200 text-gray-900 font-medium hover:bg-gray-300 transition">
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
