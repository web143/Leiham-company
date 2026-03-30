'use client';
import React, { useRef } from 'react';
import { cn } from '@/lib/utils';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export const AnimatedButton: React.FC<{
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ icon, children, onClick, disabled, className, ...props }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const button = buttonRef.current;
    if (!button || disabled) return;

    const xTo = gsap.quickTo(button, "x", { duration: 0.8, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(button, "y", { duration: 0.8, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = button.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.2); // 20% magnetic pull
      yTo(y * 0.2);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [disabled]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        `relative cursor-pointer z-0 flex items-center justify-center gap-2 overflow-hidden rounded-xl
        border border-zinc-700 bg-zinc-800
        px-5 py-2.5 font-bold text-zinc-200 transition-all duration-500
        before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]
        before:rounded-[100%] before:bg-zinc-200 before:transition-transform before:duration-1000 before:content-[""]
        hover:text-zinc-900 hover:before:translate-x-[0%] hover:before:translate-y-[0%] 
        active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed
        disabled:hover:text-zinc-200 disabled:hover:before:translate-x-[150%] disabled:hover:before:translate-y-[150%]`,
        className
      )}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};


// Variante azul para botones primarios
export const AnimatedButtonBlue: React.FC<{
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ icon, children, onClick, disabled, className, ...props }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useGSAP(() => {
    const button = buttonRef.current;
    if (!button || disabled) return;

    const xTo = gsap.quickTo(button, "x", { duration: 0.8, ease: "elastic.out(1, 0.3)" });
    const yTo = gsap.quickTo(button, "y", { duration: 0.8, ease: "elastic.out(1, 0.3)" });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { height, width, left, top } = button.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      xTo(x * 0.2);
      yTo(y * 0.2);
    };

    const handleMouseLeave = () => {
      xTo(0);
      yTo(0);
    };

    button.addEventListener("mousemove", handleMouseMove);
    button.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      button.removeEventListener("mousemove", handleMouseMove);
      button.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [disabled]);

  return (
    <button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        `relative cursor-pointer z-0 flex items-center justify-center gap-2 overflow-hidden rounded-xl
        border border-[#0066B3] bg-[#0066B3]
        px-5 py-2.5 font-bold text-white transition-all duration-500
        before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]
        before:rounded-[100%] before:bg-white before:transition-transform before:duration-1000 before:content-[""]
        hover:text-[#0066B3] hover:before:translate-x-[0%] hover:before:translate-y-[0%]
        active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed
        disabled:hover:text-white disabled:hover:before:translate-x-[150%] disabled:hover:before:translate-y-[150%]`,
        className
      )}
      {...props}
    >
      {icon && <span>{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
};
