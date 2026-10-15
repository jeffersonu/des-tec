import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';

export interface CarouselSlide {
  id: string;
  image: string;
  mobileImage?: string;
  tabletImage?: string;
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
  autoPlayInterval?: number; // In milliseconds, default 5000ms (5 seconds)
  className?: string;
}

export default function PageHeroCarousel({
  slides,
  autoPlayInterval = 5000, // 5s is the ideal duration for lively, automatic hero rotation
  className = ''
}: PageHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Touch swipe support for smartphone users
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 45) {
      handleNext();
    } else if (distance < -45) {
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Helper to start or restart the continuous automatic rotation timer
  const startAutoTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!slides || slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, autoPlayInterval);
  };

  // Start continuous auto-advance on mount and whenever slides or interval changes
  useEffect(() => {
    startAutoTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slides.length, autoPlayInterval]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
    startAutoTimer(); // restart countdown so user has full interval after manual interaction
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    startAutoTimer();
  };

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    startAutoTimer();
  };

  const currentSlide = slides[currentIndex] || slides[0];

  // Soft cross-fade variant optimized for performance across devices
  const slideVariants = {
    enter: {
      opacity: 0,
      scale: 1.03,
      filter: 'blur(3px)'
    },
    center: {
      opacity: 1,
      scale: 1,
      filter: 'blur(0px)',
      transition: {
        opacity: { duration: 0.8, ease: [0.4, 0.0, 0.2, 1] as const },
        scale: { duration: 1.1, ease: [0.4, 0.0, 0.2, 1] as const },
        filter: { duration: 0.6 }
      }
    },
    exit: {
      opacity: 0,
      scale: 0.98,
      filter: 'blur(2px)',
      transition: {
        opacity: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] as const },
        scale: { duration: 0.7 },
        filter: { duration: 0.4 }
      }
    }
  };

  // Theme color maps for badges & accents
  const themeStyles = {
    sky: {
      badgeBg: 'bg-sky-500/15 border-sky-400/30 text-sky-300',
      activeDot: 'bg-sky-400 w-8',
      buttonBg: 'from-sky-500 via-blue-600 to-cyan-500 text-slate-950 shadow-sky-500/30',
      tagBg: 'bg-sky-950/70 border-sky-400/30 text-sky-200',
      progressBar: 'bg-sky-400'
    },
    emerald: {
      badgeBg: 'bg-emerald-500/15 border-emerald-400/30 text-emerald-300',
      activeDot: 'bg-emerald-400 w-8',
      buttonBg: 'from-emerald-500 via-teal-600 to-green-500 text-slate-950 shadow-emerald-500/30',
      tagBg: 'bg-emerald-950/70 border-emerald-400/30 text-emerald-200',
      progressBar: 'bg-emerald-400'
    },
    amber: {
      badgeBg: 'bg-amber-500/15 border-amber-400/30 text-amber-300',
      activeDot: 'bg-amber-400 w-8',
      buttonBg: 'from-amber-500 via-orange-600 to-yellow-500 text-slate-950 shadow-amber-500/30',
      tagBg: 'bg-amber-950/70 border-amber-400/30 text-amber-200',
      progressBar: 'bg-amber-400'
    },
    purple: {
      badgeBg: 'bg-purple-500/15 border-purple-400/30 text-purple-300',
      activeDot: 'bg-purple-400 w-8',
      buttonBg: 'from-purple-500 via-indigo-600 to-cyan-500 text-white shadow-purple-500/30',
      tagBg: 'bg-purple-950/70 border-purple-400/30 text-purple-200',
      progressBar: 'bg-purple-400'
    },
    indigo: {
      badgeBg: 'bg-indigo-500/15 border-indigo-400/30 text-indigo-300',
      activeDot: 'bg-indigo-400 w-8',
      buttonBg: 'from-indigo-500 via-purple-600 to-blue-500 text-white shadow-indigo-500/30',
      tagBg: 'bg-indigo-950/70 border-indigo-400/30 text-indigo-200',
      progressBar: 'bg-indigo-400'
    }
  };

  const style = themeStyles[currentSlide.themeColor || 'sky'];

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`relative w-full min-h-[580px] h-[86dvh] sm:min-h-[640px] sm:h-[82vh] lg:min-h-[720px] lg:h-screen lg:max-h-[920px] bg-slate-950 overflow-hidden select-none group ${className}`}
    >
      {/* RESPONSIVE FULL-BLEED SLIDE BACKGROUND WITH <picture> ART DIRECTION */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentSlide.id}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full overflow-hidden"
        >
          <picture className="w-full h-full block">
            {/* Smartphone screen (< 640px): Dedicated vertical portrait framing (9:16) */}
            {currentSlide.mobileImage && (
              <source
                media="(max-width: 639px)"
                srcSet={currentSlide.mobileImage}
              />
            )}
            {/* Tablet screen (640px - 1023px): Balanced tablet framing (4:3) */}
            {currentSlide.tabletImage && (
              <source
                media="(max-width: 1023px)"
                srcSet={currentSlide.tabletImage}
              />
            )}
            {/* PC / Desktop (>= 1024px): 16:9 widescreen cinematic framing */}
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="w-full h-full object-cover object-bottom sm:object-center transition-all duration-700 select-none"
              referrerPolicy="no-referrer"
              draggable={false}
            />
          </picture>

          {/* Adaptive Legibility Overlays */}
          {/* Mobile / Tablet vertical gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-slate-950/95 pointer-events-none sm:hidden" />
          
          {/* Desktop horizontal gradient */}
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/60 to-transparent w-full lg:w-3/5 pointer-events-none" />
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-b from-slate-950/80 via-transparent to-slate-950/90 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* CENTERED / RESPONSIVE CONTENT OVERLAY CONTAINER */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-start sm:justify-center items-start pt-20 sm:pt-28 lg:pt-32 pb-24 sm:pb-20 pointer-events-none">
        <div className="max-w-3xl space-y-3 sm:space-y-4 md:space-y-5 pointer-events-auto">
          {currentSlide.badge && (
            <motion.div
              key={`badge-${currentSlide.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono font-bold tracking-wider uppercase border ${style.badgeBg} backdrop-blur-md shadow-lg`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentSlide.badge}</span>
            </motion.div>
          )}

          <motion.h1
            key={`title-${currentSlide.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-black text-white tracking-tight leading-[1.12] drop-shadow-xl"
          >
            {currentSlide.title}
          </motion.h1>

          {currentSlide.description && (
            <motion.p
              key={`desc-${currentSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="text-xs sm:text-sm md:text-base text-slate-200 font-sans leading-relaxed max-w-2xl drop-shadow-md"
            >
              {currentSlide.description}
            </motion.p>
          )}

          {/* Tags / Badges */}
          {currentSlide.tags && currentSlide.tags.length > 0 && (
            <motion.div
              key={`tags-${currentSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.5 }}
              className="flex flex-wrap gap-1.5 sm:gap-2 pt-0.5"
            >
              {currentSlide.tags.map((tag) => (
                <span
                  key={tag}
                  className={`inline-flex items-center space-x-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-xl text-[10px] sm:text-xs font-mono border backdrop-blur-md ${style.tagBg}`}
                >
                  <CheckCircle2 className="w-3 h-3 text-white/90" />
                  <span>{tag}</span>
                </span>
              ))}
            </motion.div>
          )}

          {/* CTA Action Button */}
          {currentSlide.ctaText && currentSlide.ctaAction && (
            <motion.div
              key={`cta-${currentSlide.id}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="pt-2 sm:pt-3"
            >
              <button
                onClick={currentSlide.ctaAction}
                className={`px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center text-center cursor-pointer bg-gradient-to-r ${style.buttonBg} hover:opacity-95 transition-all shadow-xl hover:scale-[1.03] active:scale-[0.98]`}
              >
                <span>{currentSlide.ctaText}</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* LATERAL DESKTOP/TABLET NAVIGATION ARROWS (Hidden on mobile to never overlap text) */}
      <button
        onClick={handlePrev}
        aria-label="Anterior diapositiva"
        className="hidden sm:flex absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-950/50 hover:bg-slate-900/90 border border-white/20 text-white items-center justify-center backdrop-blur-md opacity-80 hover:opacity-100 transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xl"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Siguiente diapositiva"
        className="hidden sm:flex absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-slate-950/50 hover:bg-slate-900/90 border border-white/20 text-white items-center justify-center backdrop-blur-md opacity-80 hover:opacity-100 transition-all cursor-pointer hover:scale-110 active:scale-95 shadow-2xl"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* BOTTOM CONTROL BAR: Responsive for Mobile thumbs, Tablets, and PC */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:right-8 sm:translate-x-0 z-20 flex flex-col items-center gap-2">
        {/* Visual Animated Progress Bar indicating automatic advance countdown */}
        <div className="w-28 sm:w-36 h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
          <motion.div
            key={`progress-${currentIndex}`}
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: autoPlayInterval / 1000, ease: 'linear' }}
            className={`h-full rounded-full ${style.progressBar}`}
          />
        </div>

        <div className="flex items-center space-x-3 bg-slate-950/75 border border-white/15 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full backdrop-blur-md shadow-2xl">
          {/* Mobile touch prev button */}
          <button
            onClick={handlePrev}
            aria-label="Anterior"
            className="p-1 sm:p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer active:scale-90"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Slide Dots / Indicators */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 px-1">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Ir a diapositiva ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === currentIndex
                    ? `${style.activeDot} bg-white shadow-sm`
                    : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>

          {/* Mobile touch next button */}
          <button
            onClick={handleNext}
            aria-label="Siguiente"
            className="p-1 sm:p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-all cursor-pointer active:scale-90"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
