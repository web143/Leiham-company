"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";


export default function HeroLeiham({ isDark = true }: { isDark?: boolean }) {
    const products = [
        {
            src: "/catalogo_assets/olla_presion.png",
            alt: "Olla de Presión Royal Prestige",
            width: 420,
            height: 460,
            mobileWidth: 160,
            mobileHeight: 175,
            mobilePosition: "left-[-2%] top-[30%]",
            rotate: -8,
            floatDuration: 7,
            floatAmplitude: 15,
            left: "0vw",
            top: "20vh",
            scrollTarget: { x: -500, y: 300, scale: 0 },
        },
        {
            src: "/catalogo_assets/jarra.png",
            alt: "Jarra Royal Prestige",
            width: 250,
            height: 320,
            mobileWidth: 95,
            mobileHeight: 120,
            mobilePosition: "left-[12%] top-[5%]",
            rotate: -10,
            floatDuration: 7,
            floatAmplitude: 15,
            left: "12vw",
            top: "3vh",
            scrollTarget: { x: -400, y: -350, scale: 0 },
        },
        {
            src: "/catalogo_assets/cuchillo_chef.png",
            alt: "Cuchillo Chef Royal Prestige",
            width: 480,
            height: 180,
            mobileWidth: 170,
            mobileHeight: 65,
            mobilePosition: "left-[-1%] bottom-[18%]",
            rotate: -20,
            floatDuration: 6,
            floatAmplitude: 12,
            left: "0vw",
            bottom: "8vh",
            scrollTarget: { x: -600, y: 400, scale: 0 },
        },
        {
            src: "/catalogo_assets/licuadora.png",
            alt: "Licuadora Royal Prestige",
            width: 420,
            height: 460,
            mobileWidth: 160,
            mobileHeight: 175,
            mobilePosition: "right-[-2%] top-[30%]",
            rotate: 8,
            floatDuration: 7,
            floatAmplitude: 15,
            right: "0vw",
            top: "20vh",
            scrollTarget: { x: 500, y: 250, scale: 0 },
        },
        {
            src: "/catalogo_assets/multipan.png",
            alt: "Wok Royal Prestige",
            width: 320,
            height: 400,
            mobileWidth: 95,
            mobileHeight: 120,
            mobilePosition: "right-[12%] top-[5%]",
            rotate: -20,
            floatDuration: 6,
            floatAmplitude: 12,
            right: "12vw",
            top: "3vh",
            scrollTarget: { x: 600, y: 380, scale: 0 },
        },
        {
            src: "/catalogo_assets/Expertea.png",
            alt: "Sartén Deluxe Easy Release",
            width: 380,
            height: 140,
            mobileWidth: 170,
            mobileHeight: 65,
            mobilePosition: "right-[-1%] bottom-[18%]",
            rotate: -30,
            floatDuration: 7,
            floatAmplitude: 15,
            right: "0vw",
            bottom: "8vh",
            scrollTarget: { x: 450, y: -350, scale: 0 },
        },
    ];

    const sectionRef = useRef<HTMLElement>(null);
    const [isMobileHero, setIsMobileHero] = useState(false);
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const check = () => setIsMobileHero(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end end"]
    });

    // Call hooks unconditionally to comply with React's Rules of Hooks
    const springProgress = useSpring(scrollYProgress, {
        stiffness: isMobileHero ? 60 : 100,
        damping: isMobileHero ? 40 : 30
    });
    const desktopBlur = useTransform(springProgress, [0.5, 0.65], [0, 20]);
    const blurStyle = useTransform(desktopBlur, v => `blur(${v}px)`);

    // Choose the progress value based on device (without conditional hooks)
    const progress = isMobileHero ? scrollYProgress : springProgress;

    // On mobile: scale capped at 3 (vs 8 on desktop) — halves the GPU rasterization cost
    const titleScale = useTransform(progress, [0, 0.6], [1, isMobileHero ? 3 : 8]);
    const titleOpacity = useTransform(progress, [0, 0.1, 0.55, 0.65], [1, 1, 1, 0]);
    const titleLetterSpacing = useTransform(progress, [0, 0.6], ["-0.02em", "0.3em"]);

    // Subtitle animations
    const subtitleOpacity = useTransform(progress, [0, 0.2], [1, 0]);
    const subtitleY = useTransform(progress, [0, 0.2], [0, 30]);

    const overlayOpacity = useTransform(progress, [0.6, 0.75], [0, 1]);

    return (
        <section ref={sectionRef} style={{ height: isMobileHero ? '150vh' : '250vh' }} className={cn("relative transition-colors duration-300", isDark ? 'bg-black' : 'bg-white')}>
            <div className={cn("sticky top-0 h-screen overflow-hidden", !isMobileHero && "min-w-[1200px] overflow-x-auto")}>
                <motion.div className="w-full h-full relative flex items-center justify-center">
                    <motion.div
                        style={{ opacity: overlayOpacity }}
                        className={cn("absolute inset-0 z-50 pointer-events-none transition-colors duration-300", isDark ? "bg-black" : "bg-white")}
                    />
                    {/* Lamp Effect */}
                    <div style={{ position: 'absolute', top: '-10px', left: 0, right: 0, zIndex: 1, pointerEvents: 'none', height: '320px', overflow: 'visible' }}>
                        {/* Glow principal */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '320px',
                            background: isDark
                                ? 'radial-gradient(ellipse 90% 120% at 50% 0%, rgba(0,102,179,0.55) 0%, transparent 70%)'
                                : 'radial-gradient(ellipse 90% 120% at 50% 0%, rgba(0,102,179,0.75) 0%, transparent 70%)',
                            filter: 'blur(15px)'
                        }} />
                    </div>
                    {/* Gradiente de fondo sutil azul */}
                    <div className={cn("absolute inset-0 blur-3xl transition-opacity duration-300", isDark ? "bg-gradient-to-br from-[#0066B3]/[0.08] via-transparent to-[#0066B3]/[0.15]" : "bg-gradient-to-br from-[#0066B3]/[0.03] via-transparent to-[#0066B3]/[0.05]")} />

                    {/* Patrón de puntos refinado */}
                    <div
                        className={cn("absolute inset-0 transition-opacity duration-300", isDark ? "opacity-[0.03]" : "opacity-[0.06]")}
                        style={{
                            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0, 102, 179, 0.4) 1px, transparent 0)`,
                            backgroundSize: "50px 50px",
                        }}
                    />

                    {/* Productos flotantes */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {products.map((product, index) => (
                            <FloatingProduct
                                key={index}
                                {...product}
                                scrollProgress={progress}
                            />
                        ))}
                    </div>

                    {/* Contenido central - Solo marca */}
                    <div className="relative z-30 container mx-auto px-4 md:px-6" style={{ maxWidth: '55%', zIndex: 40 }}>
                        <div className="text-center">
                            {/* Leiham Company */}
                            <motion.div
                                style={{
                                    scale: titleScale,
                                    opacity: titleOpacity,
                                    letterSpacing: titleLetterSpacing,
                                    // Blur disabled on mobile — too expensive
                                    filter: isMobileHero ? "none" : blurStyle,
                                    transformOrigin: "center center",
                                    willChange: "transform, opacity",
                                }}
                            >
                                <h1 className={cn("text-[clamp(2rem,6vw,9rem)] font-black tracking-tight uppercase leading-none transition-colors duration-300", isDark ? "text-white" : "text-slate-900")}>
                                    LEIHAM<br />COMPANY
                                </h1>
                            </motion.div>

                            {/* By Royal Prestige */}
                            <motion.p
                                style={{ opacity: subtitleOpacity, y: subtitleY }}
                                className="text-[0.5rem] md:text-sm tracking-[0.25em] md:tracking-[0.4em] text-[#0066B3] font-medium uppercase mt-8"
                            >
                                BY ROYAL PRESTIGE
                            </motion.p>
                        </div>
                    </div>

                    {/* Flecha scroll indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 1 }}
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
                    >
                        <motion.div
                            animate={{ y: [0, 12, 0] }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                            }}
                            className={cn("flex flex-col items-center gap-2 transition-colors duration-300", isDark ? "text-white/40" : "text-slate-400")}
                        >
                            <span className="text-xs tracking-[0.3em] uppercase font-light">
                                Scroll
                            </span>
                            <ChevronDown className="w-6 h-6" />
                        </motion.div>
                    </motion.div>

                    {/* Gradiente inferior suave */}
                    <div className={cn("absolute inset-0 pointer-events-none transition-opacity duration-300", isDark ? "bg-gradient-to-t from-black via-transparent to-black/40" : "bg-gradient-to-t from-white via-transparent to-white/10")} />

                    {/* Línea decorativa sutil */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{
                            duration: 2,
                            delay: 1.2,
                            ease: [0.25, 0.4, 0.25, 1],
                        }}
                        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0066B3]/60 to-transparent"
                    />
                </motion.div>
            </div>
        </section>
    );
}

// Componente FloatingProduct para cada utensilio
function FloatingProduct({
    src,
    alt,
    className,
    width = 200,
    height = 200,
    mobileWidth,
    mobileHeight,
    mobilePosition,
    rotate = 0,
    floatDuration = 6,
    floatAmplitude = 20,
    scrollProgress,
    scrollTarget,
    left,
    right,
    top,
    bottom,
}: {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    mobileWidth?: number;
    mobileHeight?: number;
    mobilePosition?: string;
    rotate?: number;
    floatDuration?: number;
    floatAmplitude?: number;
    scrollProgress?: MotionValue<number>;
    scrollTarget: { x: number; y: number; scale: number };
    left?: string;
    right?: string;
    top?: string;
    bottom?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [repulse, setRepulse] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    // Fallback MotionValue to ensure useTransform is always called with valid input
    const fallbackProgress = useMotionValue(0);
    const progress = scrollProgress ?? fallbackProgress;

    // TODOS los hooks siempre se llaman al inicio del componente
    const moveX = useTransform(progress, [0, 0.5], [0, scrollTarget.x]);
    const moveY = useTransform(progress, [0, 0.5], [0, scrollTarget.y]);
    const scaleOut = useTransform(progress, [0, 0.5], [1, scrollTarget.scale]);
    const opacityOut = useTransform(progress, [0, 0.4], [1, 0]);

    const finalWidth = isMobile && mobileWidth ? mobileWidth : width;
    const finalHeight = isMobile && mobileHeight ? mobileHeight : height;

    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Skip mouse repulse on touch/mobile — saves expensive layout reads every frame
        if (isMobile) return;
        const handleMouseMove = (e: MouseEvent) => {
            if (!ref.current) return;
            const rect = ref.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dx = e.clientX - centerX;
            const dy = e.clientY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const repulseRadius = 180;

            if (distance < repulseRadius) {
                const force = (repulseRadius - distance) / repulseRadius;
                const pushX = -(dx / distance) * force * 60;
                const pushY = -(dy / distance) * force * 60;
                setRepulse({ x: pushX, y: pushY });
            } else {
                setRepulse({ x: 0, y: 0 });
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [isMobile]);

    return (
        <motion.div
            ref={ref}
            style={{
                position: 'absolute',
                left: isMobile ? undefined : left,
                right: isMobile ? undefined : right,
                top: isMobile ? undefined : top,
                bottom: isMobile ? undefined : bottom,
                opacity: isMobile ? 1 : opacityOut,
                scale: isMobile ? 1 : scaleOut,
                x: isMobile ? 0 : moveX,
                y: isMobile ? 0 : moveY,
                willChange: "transform, opacity",
                transform: "translateZ(0)",
                zIndex: scrollTarget.scale === 0 ? 30 : 20, // using scrollTarget.scale to identify 'isHero' intent if needed
            }}
            className={cn("z-20", isMobile ? mobilePosition : "")}
        >
            <motion.div
                animate={{
                    x: repulse.x,
                    y: repulse.y,
                    rotate: rotate,
                }}
                transition={{
                    x: { type: "spring", stiffness: 120, damping: 18 },
                    y: { type: "spring", stiffness: 120, damping: 18 },
                }}
                style={{ willChange: "transform" }}
            >
                <motion.div
                    animate={{
                        // Simpler 3-keyframe float on mobile for better performance
                        y: isMobile
                            ? [0, floatAmplitude * 0.6, 0]
                            : [0, floatAmplitude, 0, -floatAmplitude / 2, 0],
                    }}
                    transition={{
                        duration: isMobile ? floatDuration * 1.3 : floatDuration,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                    style={{ width: finalWidth, height: finalHeight, willChange: "transform" }}
                    className="relative"
                >
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-contain"
                        style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))" }}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
