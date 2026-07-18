import React, { useEffect, useState, useRef } from 'react';

export default function Cursor() {
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);
  // Only devices whose PRIMARY input is a real mouse/trackpad (fine pointer)
  // should get the custom cursor. Touch devices fire a synthetic 'mousemove'
  // once per tap (for legacy web compatibility), which is exactly what made
  // the dot appear to "teleport" to whatever was tapped and then freeze —
  // there's no real continuous mouse movement to follow on a phone.
  const [isFinePointer, setIsFinePointer] = useState(false);
  const mouseRef = useRef({ x: 0, y: 0 });
  const dotPos = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const hasMovedRef = useRef(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setIsFinePointer(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isFinePointer) return;

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      setHidden(false);
      
      if (!hasMovedRef.current) {
        dotPos.current.x = e.clientX;
        dotPos.current.y = e.clientY;
        ringPos.current.x = e.clientX;
        ringPos.current.y = e.clientY;
        hasMovedRef.current = true;
      }
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    // Physics simulation loop inside requestAnimationFrame (lerping coordinates)
    const updateTrail = () => {
      if (!hasMovedRef.current) {
        requestRef.current = requestAnimationFrame(updateTrail);
        return;
      }

      // Dot follows mouse position
      const targetDotX = mouseRef.current.x;
      const targetDotY = mouseRef.current.y;
      
      const dDotX = targetDotX - dotPos.current.x;
      const dDotY = targetDotY - dotPos.current.y;
      
      // Fast organic lag (0.28 lerp factor)
      dotPos.current.x += dDotX * 0.28;
      dotPos.current.y += dDotY * 0.28;
      
      // Ring follows the dot position for a perfect cascading lag effect
      const dRingX = dotPos.current.x - ringPos.current.x;
      const dRingY = dotPos.current.y - ringPos.current.y;
      
      // Slower organic lag (0.12 lerp factor)
      ringPos.current.x += dRingX * 0.12;
      ringPos.current.y += dRingY * 0.12;
      
      // Update DOM elements using GPU-accelerated translate3d
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`;
      }
      
      requestRef.current = requestAnimationFrame(updateTrail);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.interactive-card') ||
        target.classList.contains('interactive-hover')
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    requestRef.current = requestAnimationFrame(updateTrail);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isFinePointer]);

  // Touch/coarse-pointer devices get no custom cursor at all — nothing to
  // mount, nothing to freeze mid-screen.
  if (!isFinePointer) return null;

  return (
    <>
      {/* Outer physics-controlled container for the Dot (moved purely by JS, no transitions on transform) */}
      <div
        ref={dotRef}
        id="custom-cursor-dot"
        className={`fixed top-0 left-0 pointer-events-none z-50 ${
          hidden ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300 ease-out`}
        style={{
          transform: `translate3d(${dotPos.current.x}px, ${dotPos.current.y}px, 0) translate(-50%, -50%)`,
          willChange: 'transform',
        }}
      >
        {/* Inner visual element of the Dot (handles hover states and scales smoothly with CSS transitions) */}
        <div
          className={`w-2.5 h-2.5 bg-purple-400 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] shadow-[0_0_10px_rgba(168,85,247,0.9)] ${
            hovered ? 'scale-150 bg-purple-300 shadow-[0_0_14px_rgba(168,85,247,1)]' : 'scale-100'
          } ${hidden ? 'scale-0' : 'scale-100'} transition-all`}
        />
      </div>

      {/* Outer physics-controlled container for the Ring (moved purely by JS, no transitions on transform) */}
      <div
        ref={ringRef}
        id="custom-cursor-ring"
        className={`fixed top-0 left-0 pointer-events-none z-50 ${
          hidden ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300 ease-out`}
        style={{
          transform: `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) translate(-50%, -50%)`,
          willChange: 'transform',
        }}
      >
        {/* Inner visual element of the Ring (handles scaling, background-color, and borders smoothly with CSS transitions) */}
        <div
          className={`w-8 h-8 border rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(147,51,234,0.15)] ${
            hovered
              ? 'scale-150 border-purple-300 bg-purple-500/10 shadow-[0_0_20px_rgba(147,51,234,0.3)]'
              : 'scale-100 border-purple-500/40 bg-transparent'
          } ${hidden ? 'scale-0' : 'scale-100'}`}
        />
      </div>
    </>
  );
}
