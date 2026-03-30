'use client';
import useEmblaCarousel from 'embla-carousel-react';
import { ReactNode, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

// ─── Types ───────────────────────────────────────────────────────────────────

export type CarouselProps = {
  children: ReactNode;
  className?: string;
  index?: number;
  onIndexChange?: (index: number) => void;
};

export type CarouselContentProps = {
  children: ReactNode;
  className?: string;
};

export type CarouselItemProps = {
  children: ReactNode;
  className?: string;
};

// ─── Carousel ────────────────────────────────────────────────────────────────

function Carousel({ children, className, index, onIndexChange }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, dragFree: false });

  // Sync controlled index → embla
  useEffect(() => {
    if (!emblaApi || index === undefined) return;
    if (emblaApi.selectedScrollSnap() !== index) {
      emblaApi.scrollTo(index, false);
    }
  }, [emblaApi, index]);

  // Sync embla → controlled index
  const onSelect = useCallback(() => {
    if (!emblaApi || !onIndexChange) return;
    onIndexChange(emblaApi.selectedScrollSnap());
  }, [emblaApi, onIndexChange]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
    return () => { emblaApi.off('select', onSelect); };
  }, [emblaApi, onSelect]);

  return (
    <div className={cn('overflow-hidden', className)} ref={emblaRef}>
      {children}
    </div>
  );
}

// ─── CarouselContent ─────────────────────────────────────────────────────────

function CarouselContent({ children, className }: CarouselContentProps) {
  return (
    <div className={cn('flex', className)}>
      {children}
    </div>
  );
}

// ─── CarouselItem ─────────────────────────────────────────────────────────────

function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <div className={cn('min-w-0 shrink-0 grow-0 basis-full', className)}>
      {children}
    </div>
  );
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export { Carousel, CarouselContent, CarouselItem };
