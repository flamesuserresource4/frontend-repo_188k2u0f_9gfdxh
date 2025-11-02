import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GameCanvas from './components/GameCanvas';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <GameCanvas />
      <Footer />
    </div>
  );
}

export default App;
