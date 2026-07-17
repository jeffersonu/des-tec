import React, { useEffect, useRef } from 'react';
import { useTimeTheme } from '../../context/TimeThemeContext';

// Helper to parse hex colors to rgb values (declared outside to avoid recreate on render)
const hexToRgb = (hex: string) => {
  let r = 107, g = 114, b = 128;
  try {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex, 16);
    r = (bigint >> 16) & 255;
    g = (bigint >> 8) & 255;
    b = bigint & 255;
  } catch (e) {
    // fallback
  }
  return { r, g, b };
};

export default function InteractiveStarsCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTimeTheme();
  const themeRef = useRef(theme);

  // Update theme ref whenever the theme changes to keep loop performance optimal
  const rgbRef = useRef(hexToRgb(theme.particleColor));

  useEffect(() => {
    themeRef.current = theme;
    rgbRef.current = hexToRgb(theme.particleColor);
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Track mouse position with smooth interpolation
    const mouse = { x: width / 2, y: height / 2, targetX: width / 2, targetY: height / 2 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Subtle human-centric drifting corporate particles (micro-dots)
    interface MicroParticle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
    }

    const particles: MicroParticle[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.8,
      speedY: -(Math.random() * 0.08 + 0.02), // Float upwards very slowly
      speedX: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.2 + 0.05,
    }));

    const render = () => {
      // Clear with transparent/very light base so the body CSS color shows through
      ctx.clearRect(0, 0, width, height);

      const currentTheme = themeRef.current;
      const rgb = rgbRef.current;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Draw subtle interactive warm accent light glow under mouse (Apple/Stripe corporate vibe)
      const mouseGlow = ctx.createRadialGradient(
        mouse.x, mouse.y, 0,
        mouse.x, mouse.y, 420
      );
      
      const glowOpacityBase = currentTheme.id === 'night' ? 0.08 : 0.04;
      mouseGlow.addColorStop(0, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${glowOpacityBase})`); 
      mouseGlow.addColorStop(0.5, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${glowOpacityBase * 0.25})`);
      mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = mouseGlow;
      ctx.fillRect(0, 0, width, height);

      // Draw subtle micro-grid of corporate dots in a SINGLE batched path
      const gridSpacing = 60;
      ctx.fillStyle = currentTheme.id === 'night' 
        ? 'rgba(255, 255, 255, 0.015)' 
        : 'rgba(107, 114, 128, 0.035)'; // extremely light gray/silver dots
        
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSpacing) {
        for (let y = 0; y < height; y += gridSpacing) {
          ctx.moveTo(x + 0.6, y);
          ctx.arc(x, y, 0.6, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      // Update and Draw gentle micro-particles
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        // Wrap around borders
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Multiplied opacity for richer night look
        const opacityMult = currentTheme.id === 'night' ? 1.6 : 1.0;
        ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${Math.min(0.9, p.opacity * opacityMult)})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="space-stars-canvas"
      className="fixed inset-0 w-full h-full -z-50 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
