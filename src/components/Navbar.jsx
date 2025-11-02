import React from 'react';
import { Gamepad2 } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 border-b border-gray-200 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gamepad2 className="w-6 h-6 text-indigo-600" />
          <span className="font-semibold text-gray-900 tracking-tight">NeoArcade</span>
        </div>
        <nav className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
          <a href="#play" className="hover:text-gray-900 transition-colors">Play</a>
          <a href="#about" className="hover:text-gray-900 transition-colors">About</a>
          <a href="#how" className="hover:text-gray-900 transition-colors">How to Play</a>
        </nav>
      </div>
    </header>
  );
}
