'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * SmoothScroll — wraps the app with Lenis smooth scroll on desktop.
 *
 * On touch/mobile devices (iOS, Android) we skip Lenis intentionally:
 * native momentum scroll is already silky smooth and Lenis would override it.
 *
 * Framer Motion's useScroll() works seamlessly because Lenis updates
 * the native window.scrollY rather than using a fake scroll container.
 *
 * Scrollable containers inside the page (product lists, calculator panel)
 * need the `data-lenis-prevent` attribute to stop Lenis from hijacking them.
 */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Only apply smooth scroll on pointer devices (mouse/trackpad)
    // iOS/Android native momentum scroll is already excellent
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;

    const lenis = new Lenis({
      // 1.1 seconds duration — matches Apple's ~70% expo-out curve
      duration: 1.1,
      // Expo-out easing: starts fast, decelerates naturally. Same Apple uses.
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      // wheelMultiplier: 1.0 feels natural; >1 is faster, <1 is slower
      wheelMultiplier: 1.0,
    });

    (window as any).lenis = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    // Synchronize GSAP ticker with Lenis raf
    gsap.ticker.add((time)=>{
      lenis.raf(time * 1000)
    })

    // Turn off lag smoothing in GSAP to prevent synchronization issues with Lenis
    gsap.ticker.lagSmoothing(0, 0)

    // Cleanup
    return () => {
      gsap.ticker.remove((time)=>{
        lenis.raf(time * 1000)
      })
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
