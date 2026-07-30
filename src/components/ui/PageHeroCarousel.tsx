import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';

export interface CarouselSlide {
  id: string;
  image: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  ctaText?: string;
  ctaAction?: () => void;
  tags?: string[];
  themeColor?: 'sky' | 'emerald' | 'amber' | 'purple' | 'indigo';
}

interface PageHeroCarouselProps {
  slides: CarouselSlide[];
  autoPlayInterval?: number; // In milliseconds, default 15000ms (15 seconds)
  aspectRatio?: string; // CSS aspect ratio or class
  className?: string;
}

export default function PageHeroCarousel({
  slides,
  autoPlayInterval = 15000, // 15 seconds per slide as requested!
  className = ''
}: PageHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Continuous auto-advance logic (15s interval, never pauses on hover)
  useEffect(() => {
    if (slides.length <= 1) return;

    // Clear existing timer if any
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIndex, slides.length, autoPlayInterval]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[currentIndex];

  // Soft, gradual cross-fade variant (no abrupt pushes)
  const slideVariants = {
    enter: {
      opacity: 0,
      scale: 1.05,
      filter: 'blur(4px)'
    },
    center: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        opacity: { duration: 1.3, ease: [0.4, 0.0, 0.2, 1] as const },
        scale: { duration: 1.5, ease: [0.4, 0.0, 0.2, 1] as const },
        filter: { duration: 0.9 }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      filter: 'blur(3px)',
      transition: {
        opacity: { duration: 1.1, ease: [0.4, 0.0, 0.2, 1] as const },
        scale: { duration: 1.1 },
        filter: { duration: 0.7 }
      }
    }
  };

  // Theme color maps for badges & accents
  const themeStyles = {
    sky: {
      badgeBg: 'bg-sky-500/15 border-sky-400/30 text-sky-300',
      progressBg: 'bg-sky-400',
      activeDot: 'bg-sky-400 w-10',
      buttonBg: 'from-sky-500 via-blue-600 to-cyan-500 text-slate-950 shadow-sky-500/30',
      tagBg: 'bg-sky-950/70 border-sky-400/30 text-sky-200'
    },
    emerald: {
      badgeBg: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
      progressBg: 'bg-emerald-400',
      activeDot: 'bg-emerald-400 w-10',
      buttonBg: 'from-emerald-500 via-teal-600 to-green-500 text-slate-950 shadow-emerald-500/30',
      tagBg: 'bg-emerald-950/70 border-emerald-400/30 text-emerald-200'
    },
    amber: {
      badgeBg: 'bg-amber-500/15 border-amber-400/30 text-amber-300',
      progressBg: 'bg-amber-400',
      activeDot: 'bg-amber-400 w-10',
      buttonBg: 'from-amber-500 via-orange-600 to-yellow-500 text-slate-950 shadow-amber-500/30',
      tagBg: 'bg-amber-950/70 border-amber-400/30 text-amber-200'
    },
    purple: {
      badgeBg: 'bg-purple-500/15 border-purple-400/30 text-purple-300',
      progressBg: 'bg-purple-400',
      activeDot: 'bg-purple-400 w-10',
      buttonBg: 'from-purple-500 via-indigo-600 to-cyan-500 text-white shadow-purple-500/30',
      tagBg: 'bg-purple-950/70 border-purple-400/30 text-purple-200'
    },
    indigo: {
      badgeBg: 'bg-indigo-500/15 border-indigo-400/30 text-indigo-300',
      progressBg: 'bg-indigo-400',
      activeDot: 'bg-indigo-400 w-10',
      buttonBg: 'from-indigo-500 via-purple-600 to-blue-500 text-white shadow-indigo-500/30',
      tagBg: 'bg-indigo-950/70 border-indigo-400/30 text-indigo-200'
    }
  };

  const style = themeStyles[currentSlide.themeColor || 'sky'];

  return (
    <section
      className={`relative w-full h-[80vh] sm:h-[88vh] lg:h-screen min-h-[520px] sm:min-h-[600px] lg:min-h-[720px] bg-slate-950 overflow-hidden select-none group ${className}`}
    >
      {/* 100vw EDGE-TO-EDGE FULL SCREEN BACKGROUND CAROUSEL */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide.id}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          {/* Main Slide Image: 100% width and height cover edge-to-edge without any dark gaps */}
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center transition-all duration-700"
            referrerPolicy="no-referrer"
          />

          {/* Legibility Gradients: Top overlay for transparent header, dark bottom vignette for indicators */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950/90 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent w-full lg:w-2/3 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* CENTERED CONTENT OVERLAY CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-start pt-24 sm:pt-32 lg:pt-36 pb-20 pointer-events-none">
        <div className="max-w-3xl space-y-4 sm:space-y-6 pointer-events-auto">
          {currentSlide.badge && (
            <motion.div
              key={`badge-${currentSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-mono font-bold tracking-wider uppercase border ${style.badgeBg} backdrop-blur-md shadow-lg`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{currentSlide.badge}</span>
            </motion.div>
          )}

          <motion.h1
            key={`title-${currentSlide.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white tracking-tight leading-[1.08] drop-shadow-xl"
          >
            {currentSlide.title}
          </motion.h1>

          {currentSlide.description && (
            <motion.p
              key={`desc-${currentSlide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="text-sm sm:text-base md:text-lg text-slate-200 font-sans leading-relaxed max-w-2xl drop-shadow-md"
            >
              {currentSlide.description}
            </motion.p>
          )}

          {/* Tags / Badges */}
          {currentSlide.tags && currentSlide.tags.length > 0 && (
            <motion.div
              key={`tags-${currentSlide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
              className="flex flex-wrap gap-2 pt-1"
            >
              {currentSlide.tags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl text-xs font-mono border backdrop-blur-md ${style.tagBg}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-white/90" />
                  <span>{tag}</span>
                </span>
              ))}
            </motion.div>
          )}

          {/* CTA Action Button */}
          {currentSlide.ctaText && currentSlide.ctaAction && (
            <motion.div
              key={`cta-${currentSlide.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="pt-3"
            >
              <button
                onClick={currentSlide.ctaAction}
                className={`px-8 py-3.5 sm:py-4 rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center text-center cursor-pointer bg-gradient-to-r ${style.buttonBg} hover:opacity-95 transition-all shadow-xl hover:scale-[1.03] active:scale-[0.98]`}
              >
                <span>{currentSlide.ctaText}</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        aria-label="Anterior"
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-slate-950/40 hover:bg-slate-900/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md opacity-70 group-hover:opacity-100 transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xl"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Siguiente"
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-slate-950/40 hover:bg-slate-900/80 border border-white/20 text-white flex items-center justify-center backdrop-blur-md opacity-70 group-hover:opacity-100 transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xl"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>
    </section>
  );
}
