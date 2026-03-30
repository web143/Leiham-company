"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { products } from '@/lib/products';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

// Importación dinámica para deshabilitar SSR y prevenir errores en móvil
const HeroLeiham = dynamic(() => import('../components/HeroLeiham'), { 
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black" />
});

const CalculadoraFinanciamiento = dynamic(() => import('../components/CalculadoraFinanciamiento'), { 
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black" />
});

const CatalogoViewer = dynamic(() => import('../components/CatalogoViewer'), { ssr: false });

export default function Home() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [catalogoItems, setCatalogoItems] = useState<any[]>([]);

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
      <ThemeToggle isDark={isDark} onToggle={toggleTheme} className="fixed top-3 right-3 z-[100] shadow-lg" />
      <HeroLeiham isDark={mounted ? isDark : true} />
      <CatalogoViewer isDark={mounted ? isDark : true} onProductsChange={(items) => setCatalogoItems([...items])} />
      <CalculadoraFinanciamiento isDark={mounted ? isDark : true} externalItems={catalogoItems} />
    </main>
  );
}
