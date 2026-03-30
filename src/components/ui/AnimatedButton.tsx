'use client';
import { cn } from '@/lib/utils';
import React from 'react';

export const AnimatedButton: React.FC<{
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ icon, children, onClick, disabled, className, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      `relative cursor-pointer z-0 flex items-center justify-center gap-2 overflow-hidden rounded-xl
      border border-zinc-700 bg-zinc-800
      px-5 py-2.5 font-bold text-zinc-200 transition-all duration-500
      before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]
      before:rounded-[100%] before:bg-zinc-200 before:transition-transform before:duration-1000 before:content-[""]
      hover:scale-105 hover:text-zinc-900 hover:before:translate-x-[0%] hover:before:translate-y-[0%] 
      active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
      disabled:hover:text-zinc-200 disabled:hover:before:translate-x-[150%] disabled:hover:before:translate-y-[150%]`,
      className
    )}
    {...props}
  >
    {icon && <span>{icon}</span>}
    <span>{children}</span>
  </button>
);

// Variante azul para botones primarios
export const AnimatedButtonBlue: React.FC<{
  icon?: React.ReactNode;
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}> = ({ icon, children, onClick, disabled, className, ...props }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      `relative cursor-pointer z-0 flex items-center justify-center gap-2 overflow-hidden rounded-xl
      border border-[#0066B3] bg-[#0066B3]
      px-5 py-2.5 font-bold text-white transition-all duration-500
      before:absolute before:inset-0 before:-z-10 before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5]
      before:rounded-[100%] before:bg-white before:transition-transform before:duration-1000 before:content-[""]
      hover:scale-105 hover:text-[#0066B3] hover:before:translate-x-[0%] hover:before:translate-y-[0%]
      active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100
      disabled:hover:text-white disabled:hover:before:translate-x-[150%] disabled:hover:before:translate-y-[150%]`,
      className
    )}
    {...props}
  >
    {icon && <span>{icon}</span>}
    <span>{children}</span>
  </button>
);
