import React from 'react';
import Spline from '@splinetool/react-spline';

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] w-full overflow-hidden flex items-stretch" id="home">
      <div className="relative w-full h-[70vh] md:h-[78vh] rounded-none">
        <Spline scene="https://prod.spline.design/nnNYb3ZFbRxKghMM/scene.splinecode" style={{ width: '100%', height: '100%' }} />

        {/* Gradient overlay for readability - does not block interaction */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white via-white/30 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-6 md:bottom-10 flex justify-center">
        <div className="px-4">
          <div className="mx-auto max-w-2xl text-center bg-white/70 backdrop-blur rounded-2xl p-5 border border-gray-200 shadow-sm">
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-gray-900">
              Play a minimalist 3D-inspired browser game
            </h1>
            <p className="mt-2 md:mt-3 text-gray-600 text-sm md:text-base">
              Interact with the controller and then scroll to jump into the game. No installs. Just HTML, CSS and JavaScript.
            </p>
            <a href="#play" className="inline-flex mt-4 items-center justify-center rounded-xl bg-indigo-600 text-white px-4 py-2 md:px-6 md:py-3 font-medium shadow hover:bg-indigo-700 transition-colors">
              Start Playing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
