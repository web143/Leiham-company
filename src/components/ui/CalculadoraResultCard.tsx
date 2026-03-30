"use client";

import React from "react";
import { motion, useReducedMotion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CalculadoraResultCardProps {
  // Content
  title: string;
  mainValue: string | React.ReactNode;
  
  // Left Section
  leftLabel?: string;
  leftValue?: string;
  leftSub?: string;

  // Right Section
  rightLabel?: string;
  rightValue?: string;
  rightSub?: string;

  // Styling
  accentColor?: string;
  secondaryColor?: string;
  isDark?: boolean;
  className?: string;

  // Animation controls
  enableAnimations?: boolean;
}

const defaultProps: Partial<CalculadoraResultCardProps> = {
  accentColor: "#0066B3", // Royal Prestige Blue
  secondaryColor: "#ffffff",
  enableAnimations: true,
  isDark: true,
};

export function CalculadoraResultCard(props: CalculadoraResultCardProps) {
  const {
    title,
    mainValue,
    leftLabel,
    leftValue,
    leftSub,
    rightLabel,
    rightValue,
    rightSub,
    accentColor,
    secondaryColor,
    isDark,
    className,
    enableAnimations,
  } = { ...defaultProps, ...props };

  const shouldReduceMotion = useReducedMotion();
  const shouldAnimate = enableAnimations && !shouldReduceMotion;

  // Generate circular dots positions
  const generateDots = (count: number, radius: number, centerX: number, centerY: number) => {
    const dots = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * 2 * Math.PI;
      const x = Math.round((centerX + radius * Math.cos(angle)) * 1000) / 1000;
      const y = Math.round((centerY + radius * Math.sin(angle)) * 1000) / 1000;
      dots.push({ x, y, angle, delay: i * 0.02 });
    }
    return dots;
  };

  // Reducimos un poco el radio para que encaje mejor en móviles (w-full max-w-sm)
  const outerDots = generateDots(40, 140, 160, 150);
  const innerDots = generateDots(28, 110, 160, 150);

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.08,
        delayChildren: 0.05,
      }
    }
  };

  const dotVariants: Variants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: isDark ? 0.3 : 0.2, // Más sutil para no robar atención al número
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Colores dinámicos
  const bgColor = isDark ? "bg-white/[0.04]" : "bg-slate-50";
  const borderColor = isDark ? "border-white/10" : "border-slate-200";
  const innerBgColor = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,102,179,0.02)";
  const textColorSecondary = isDark ? "text-white/40" : "text-slate-500";
  const textColorPrimary = isDark ? "text-white" : "text-slate-900";
  
  // Gradient fade para tapar el final del círculo en la parte inferior
  const gradientOverlay = isDark 
    ? "linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(15, 23, 42, 0.8) 60%, rgba(15, 23, 42, 1) 80%)"
    : "linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(248, 250, 252, 0.8) 60%, rgba(248, 250, 252, 1) 80%)";

  return (
    <motion.div
      className={cn("w-full transition-colors duration-300", className)}
      initial={shouldAnimate ? "hidden" : "visible"}
      animate="visible"
      variants={shouldAnimate ? containerVariants : {}}
    >
      <motion.div className={cn(`${bgColor} border ${borderColor} rounded-2xl overflow-hidden shadow-xl`, isDark ? "shadow-black/20" : "shadow-[#0066B3]/5")}>
        {/* Título y Sección central conteniendo los puntos */}
        <div className="relative overflow-hidden w-full h-[320px] flex items-center justify-center pt-8">
            
          {/* Fondo desenfocado */}
          <div className="absolute inset-0 backdrop-blur-[2px]" style={{ backgroundColor: innerBgColor }} />

          {/* SVG Dots Container */}
          <div className="absolute inset-0 flex items-center justify-center -mt-6">
            <svg className="w-[320px] h-[320px] max-w-none" viewBox="0 0 320 320">
              {/* Outer dots */}
              {outerDots.map((dot, index) => (
                <motion.circle
                  key={`outer-${index}`}
                  cx={dot.x}
                  cy={dot.y}
                  r="6"
                  fill="currentColor"
                  style={{ color: accentColor }}
                  variants={shouldAnimate ? dotVariants : {}}
                  initial="hidden"
                  animate="visible"
                />
              ))}

              {/* Inner dots */}
              {innerDots.map((dot, index) => (
                <motion.circle
                  key={`inner-${index}`}
                  cx={dot.x}
                  cy={dot.y}
                  r="5"
                  fill="currentColor"
                  style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.15)" }}
                  variants={shouldAnimate ? dotVariants : {}}
                  initial="hidden"
                  animate="visible"
                />
              ))}
            </svg>
          </div>

          {/* Typography / Text Overlay Center */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none -mt-10">
            <motion.div 
              className={cn("text-xs font-bold uppercase tracking-[0.2em] mb-3", accentColor === '#ffffff' ? textColorSecondary : "text-[#0066B3]")}
              initial={shouldAnimate ? { opacity: 0, y: -10, scale: 0.95 } : {}}
              animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 25 }}
            >
              {title}
            </motion.div>
            <motion.div 
              className={cn("text-4xl md:text-5xl font-black tracking-tighter drop-shadow-lg", textColorPrimary)}
              style={{ filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))" }}
              initial={shouldAnimate ? { opacity: 0, y: 15, scale: 0.9, filter: "blur(4px)" } : {}}
              animate={shouldAnimate ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" } : {}}
              transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 25 }}
            >
              {mainValue}
            </motion.div>
          </div>

          {/* Fade del tercio inferior para integrar los valores secundarios */}
          <div className="absolute bottom-0 left-0 right-0 h-[140px] pointer-events-none z-10" style={{ background: gradientOverlay }} />
        </div>

        {/* Sección Inferior de Desglose */}
        {(leftLabel || rightLabel) && (
          <div className="relative z-20 px-6 pb-6 pt-2 bg-transparent flex justify-between items-end">
            
            {/* Sector Izquierdo */}
            {leftLabel && (
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2">
                        <motion.div
                            className="w-1 h-3 rounded-full"
                            style={{ backgroundColor: accentColor }}
                            initial={shouldAnimate ? { opacity: 0, scaleY: 0 } : {}}
                            animate={shouldAnimate ? { opacity: 1, scaleY: 1 } : {}}
                            transition={{ delay: 0.4 }}
                        />
                        <motion.div
                            className={cn("text-xs font-semibold", textColorSecondary)}
                            initial={shouldAnimate ? { opacity: 0, x: -10 } : {}}
                            animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.45 }}
                        >
                            {leftLabel}
                        </motion.div>
                    </div>
                    <div>
                        <motion.div
                            className={cn("text-xl tracking-tight font-black", textColorPrimary)}
                            initial={shouldAnimate ? { opacity: 0, y: 10 } : {}}
                            animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5 }}
                        >
                            {leftValue}
                        </motion.div>
                        {leftSub && (
                            <motion.div
                                className={cn("text-[10px] font-bold mt-0.5", accentColor === '#ffffff' ? textColorSecondary : "text-[#0066B3]")}
                                initial={shouldAnimate ? { opacity: 0, y: 5 } : {}}
                                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.55 }}
                            >
                                {leftSub}
                            </motion.div>
                        )}
                    </div>
                </div>
            )}

            {/* Sector Derecho */}
            {rightLabel && (
                <div className="flex flex-col items-end text-right gap-1.5">
                    <div className="flex items-center gap-2">
                        <motion.div
                            className={cn("text-xs font-semibold", textColorSecondary)}
                            initial={shouldAnimate ? { opacity: 0, x: 10 } : {}}
                            animate={shouldAnimate ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.45 }}
                        >
                            {rightLabel}
                        </motion.div>
                        <motion.div
                            className="w-1 h-3 rounded-full"
                            style={{ backgroundColor: secondaryColor !== '#ffffff' ? secondaryColor : isDark ? '#ffffff' : '#94a3b8' }}
                            initial={shouldAnimate ? { opacity: 0, scaleY: 0 } : {}}
                            animate={shouldAnimate ? { opacity: 1, scaleY: 1 } : {}}
                            transition={{ delay: 0.4 }}
                        />
                    </div>
                    <div>
                        <motion.div
                            className={cn("text-xl tracking-tight font-black", textColorPrimary)}
                            initial={shouldAnimate ? { opacity: 0, y: 10 } : {}}
                            animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.5 }}
                        >
                            {rightValue}
                        </motion.div>
                        {rightSub && (
                            <motion.div
                                className={cn("text-[10px] font-bold mt-0.5", secondaryColor !== '#ffffff' ? "text-slate-400" : textColorSecondary)}
                                initial={shouldAnimate ? { opacity: 0, y: 5 } : {}}
                                animate={shouldAnimate ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.55 }}
                            >
                                {rightSub}
                            </motion.div>
                        )}
                    </div>
                </div>
            )}

          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
