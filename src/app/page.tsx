"use client";

import dynamic from 'next/dynamic';
import { useState, useEffect, useRef } from 'react';
import { products } from '@/lib/products';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { useScroll, useTransform, motion } from 'framer-motion';
import { LightRays } from "@/components/ui/light-rays";
import { cn } from "@/lib/utils";

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
  const [hideThemeToggle, setHideThemeToggle] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  const catálogoOpacity = useTransform(scrollYProgress, [0.0, 0.75, 1.0], [0, 0, 1]);
  const catálogoScale = useTransform(scrollYProgress, [0.75, 1.0], [0.96, 1]);
  
  const catálogoMarginTop = useTransform(scrollYProgress, v => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const startVal = isMobile ? -180 : -200;
    const currentVal = startVal + (-100 - startVal) * v;
    return `${currentVal}vh`;
  });

  const catálogoPointerEvents = useTransform(scrollYProgress, v => v >= 0.95 ? "auto" : "none");

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('leiham-theme');
    if (saved === 'light') setIsDark(false);
    setMounted(true);

    const setRealH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setRealH();
    window.addEventListener('resize', setRealH);
    return () => window.removeEventListener('resize', setRealH);
  }, []);

  // Block iOS Safari pinch-to-zoom: iOS ignores user-scalable=no in the viewport meta tag
  // by policy, so we must intercept multi-touch gestures at the event level.
  // { passive: false } is required — browsers ignore preventDefault() on passive listeners.
  useEffect(() => {
    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    };
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => document.removeEventListener('touchmove', handleTouchMove);
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
      {!hideThemeToggle && (
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} className="fixed top-3 right-3 z-[100] shadow-lg" />
      )}
      <div ref={heroRef}>
        <HeroLeiham isDark={mounted ? isDark : true} scrollProgress={scrollYProgress} />
      </div>
      <motion.div
        style={{
          opacity: catálogoOpacity,
          scale: catálogoScale,
          marginTop: catálogoMarginTop,
          pointerEvents: catálogoPointerEvents,
          position: 'relative',
          zIndex: 10,
          width: '100%',
        }}
      >
        <div className={cn(
          "relative overflow-hidden transition-colors duration-300",
          isDark 
            ? "bg-black bg-gradient-to-br from-[#0066B3]/[0.08] via-transparent to-[#0066B3]/[0.15]" 
            : "bg-white bg-gradient-to-br from-[#0066B3]/[0.03] via-transparent to-[#0066B3]/[0.05]"
        )}>
          {/* Light Rays Corner Glow Effects */}
          <div className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 pointer-events-none z-0 opacity-75 sm:opacity-100 w-[35vw] h-[35vw] min-w-[300px] min-h-[300px] layout-blur-subtle">
            <LightRays />
          </div>
          <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 pointer-events-none z-0 opacity-75 sm:opacity-100 scale-x-[-1] w-[35vw] h-[35vw] min-w-[300px] min-h-[300px] layout-blur-subtle">
            <LightRays />
          </div>


          {/* Content layer */}
          <div className="relative z-10">
            <CatalogoViewer 
              isDark={mounted ? isDark : true} 
              onProductsChange={(items) => setCatalogoItems([...items])} 
              onOverlayStateChange={setHideThemeToggle}
            />
            <CalculadoraFinanciamiento isDark={mounted ? isDark : true} externalItems={catalogoItems} />
          </div>
        </div>
      </motion.div>
    </main>
  );
}
