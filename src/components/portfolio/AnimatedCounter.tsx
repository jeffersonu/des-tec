import React, { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  /** The final target value to animate up to */
  value: number;
  /** Label describing the metric (e.g. "Proyectos desarrollados") */
  label: string;
  /** Suffix to append to the formatted value (e.g. "+", "h+") */
  suffix?: string;
  /** Prefix to prepend to the formatted value (e.g. "€") */
  prefix?: string;
}

/**
 * AnimatedCounter component.
 * Animates a numeric counter from 0 to the target value when the component scroll into view.
 * Uses IntersectionObserver for efficient viewport detection and requestAnimationFrame for 60fps animations.
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  label,
  suffix = "",
  prefix = ""
}) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let isMounted = true;

    if (elementRef.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            let start = 0;
            const end = value;
            const duration = 1500; // Animation duration in milliseconds
            const startTime = performance.now();

            const animate = (now: number) => {
              if (!isMounted) return;
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              
              // Ease-out quadratic calculation for visual smoothness
              const easeProgress = progress * (2 - progress);
              setCount(Math.floor(easeProgress * end));

              if (progress < 1) {
                requestAnimationFrame(animate);
              } else {
                setCount(end);
              }
            };

            requestAnimationFrame(animate);
            // Disconnect immediately after triggering to only animate once
            if (observer) observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(elementRef.current);
    }

    return () => {
      isMounted = false;
      if (observer) observer.disconnect();
    };
  }, [value]);

  // Formats large values with 'k' abbreviation (e.g., 150000 -> 150k)
  const formatCount = (num: number) => {
    if (value >= 100000) {
      return (num / 1000).toFixed(0) + "k";
    }
    return num.toLocaleString();
  };

  return (
    <div
      ref={elementRef}
      className="bg-white/70 backdrop-blur-md border border-[var(--color-secondary)]/[0.05] p-5 sm:p-6 rounded-2xl text-center shadow-[0_4px_20px_rgba(15,23,42,0.02)] hover:shadow-md transition-all duration-300"
    >
      <div className="text-3xl sm:text-4xl font-extrabold font-display text-[var(--color-primary)] tracking-tight mb-1">
        {prefix}{formatCount(count)}{suffix}
      </div>
      <div className="text-[10px] sm:text-xs font-bold text-[var(--color-secondary)] uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
};

export default AnimatedCounter;
