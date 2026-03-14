import { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

const HeroLeiham = dynamic(() => import('@/components/HeroLeiham'), { ssr: false });
const CalculadoraFinanciamiento = dynamic(() => import('@/components/CalculadoraFinanciamiento'), { ssr: false });

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
        localStorage.setItem('leiham-theme', newMode ? 'dark' : 'light');
        if (typeof window !== 'undefined') {
            document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');
        }
    };

    return (
        <main suppressHydrationWarning className="transition-colors duration-300">
            <button
                onClick={toggleTheme}
                suppressHydrationWarning
                className={`fixed top-4 right-4 z-[100] flex items-center gap-1.5 p-1 rounded-full transition-all duration-300 border ${
                    isDark
                        ? 'bg-slate-800 border-slate-700'
                        : 'bg-slate-100 border-slate-300'
                }`}
                style={{ width: '64px', height: '32px' }}
            >
                {/* Sol */}
                <span className={`text-sm transition-all duration-300 flex-1 flex justify-center ${!isDark ? 'opacity-100 scale-110' : 'opacity-30'}`}>
                    ☀️
                </span>
                {/* Luna */}
                <span className={`text-sm transition-all duration-300 flex-1 flex justify-center ${isDark ? 'opacity-100 scale-110' : 'opacity-30'}`}>
                    🌙
                </span>
            </button>
            <HeroLeiham isDark={mounted ? isDark : true} />
            <CalculadoraFinanciamiento isDark={mounted ? isDark : true} />
        </main>
    );
}
