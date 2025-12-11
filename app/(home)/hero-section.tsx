'use client';

import { useState } from 'react';
import { LiquidGlassCard } from './liquid-glass-card';

export function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative mb-6 aspect-[3.2] px-4 py-8 sm:px-6 md:px-12 md:py-12 flex items-center justify-center overflow-hidden rounded-2xl border border-fd-border bg-fd-background/50 backdrop-blur-sm transition-opacity duration-300"
      style={{ opacity: isLoaded ? 1 : 0 }}
    >
      <LiquidGlassCard onLoaded={() => setIsLoaded(true)} />
      <h1
        className="relative z-10 text-center text-fd-info dark:text-fd-card-foreground font-mono font-medium tracking-tight leading-relaxed max-w-full"
        style={{ fontSize: 'clamp(0.75rem, 2.5vw, 1.25rem)' }}
      >
        The creators, developers, and innovators leaving the world better than they found it.
      </h1>
    </div>
  );
}