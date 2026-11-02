"use client";

import { useRef } from "react";

type TruncatedTextProps = {
  text: string;
  className?: string;
};

/**
 * Renderiza el texto exactamente igual que antes (mismo <p> y mismas clases).
 * Al pasar el mouse, si el texto está visualmente cortado, aplica el `title`
 * nativo para que el navegador muestre el nombre completo. Si no está cortado,
 * no hace nada.
 */
export function TruncatedText({ text, className }: TruncatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);

  const handleMouseEnter = () => {
    const el = ref.current;
    if (!el) return;
    el.title = el.scrollWidth > el.clientWidth ? text : "";
  };

  return (
    <p ref={ref} onMouseEnter={handleMouseEnter} className={className}>
      {text}
    </p>
  );
}