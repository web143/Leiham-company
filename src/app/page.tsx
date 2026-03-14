'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const HeroLeiham = dynamic(() => import('@/components/HeroLeiham'), { 
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black" />
});

const CalculadoraFinanciamiento = dynamic(() => import('@/components/CalculadoraFinanciamiento'), { 
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black" />
});

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('leiham-theme');
    if (saved === 'light') setIsDark(false);
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('leiham-theme', newMode ? 'dark' : 'light');
    }
  };

  return (
    <main className={`transition-colors duration-300 ${mounted ? (isDark ? 'bg-black' : 'bg-white') : 'bg-black'}`}>
      <button
        onClick={toggleTheme}
        className="fixed top-3 right-3 z-[100] flex items-center gap-1 p-1 rounded-full transition-all duration-300 border bg-slate-800 border-slate-700"
        style={{ width: '56px', height: '28px' }}
      >
        <span className={`text-sm flex-1 flex justify-center ${!isDark ? 'opacity-100' : 'opacity-30'}`}>☀️</span>
        <span className={`text-sm flex-1 flex justify-center ${isDark ? 'opacity-100' : 'opacity-30'}`}>🌙</span>
      </button>
      <HeroLeiham isDark={mounted ? isDark : true} />
      <CalculadoraFinanciamiento isDark={mounted ? isDark : true} />
    </main>
  );
}
