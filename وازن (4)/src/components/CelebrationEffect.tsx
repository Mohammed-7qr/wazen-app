import React, { useEffect, useRef } from 'react';

interface ConfettiProps {
  duration?: number; // duration in ms to spawn particles, default 3500
  spawnFromCenterOnly?: boolean;
}

export const CelebrationEffect: React.FC<ConfettiProps> = ({ 
  duration = 3500,
  spawnFromCenterOnly = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let isSpawning = true;

    // Handle resizing
    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class
    interface Particle {
      x: number;
      y: number;
      size: number;
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
      opacity: number;
      shape: 'circle' | 'square' | 'triangle' | 'star';
    }

    const particles: Particle[] = [];
    const colors = [
      '#10B981', // Emerald / الأخضر البراق
      '#F59E0B', // Amber / الذهبي المتوهج
      '#EF4444', // Red / الأحمر الناري
      '#3B82F6', // Blue / الأزرق الملكي
      '#8B5CF6', // Purple / البنفسجي الساحر
      '#EC4899', // Pink / الوردي الزاهي
      '#06B6D4', // Cyan / الفيروزي المنعش
      '#D2A24C'  // Pure Gold / الذهب الخالص
    ];

    const createParticle = (x: number, y: number, angleRange?: { min: number, max: number }): Particle => {
      const angle = angleRange 
        ? Math.random() * (angleRange.max - angleRange.min) + angleRange.min
        : Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 4;
      return {
        x,
        y,
        size: Math.random() * 7 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - Math.random() * 4 - 1, // upward burst bias
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        opacity: 1,
        shape: ['circle', 'square', 'triangle', 'star'][Math.floor(Math.random() * 4)] as any
      };
    };

    // Initial burst from the center of screen
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.45; // Center height area

    const burstCount = 130;
    for (let i = 0; i < burstCount; i++) {
      particles.push(createParticle(centerX, centerY));
    }

    // Stop spawning new particles after duration
    const stopTimeout = setTimeout(() => {
      isSpawning = false;
    }, duration);

    // Render helper for star shape
    const drawStar = (cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      ctx.beginPath();
      ctx.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
      }
      ctx.lineTo(cx, cy - outerRadius);
      ctx.closePath();
      ctx.fill();
    };

    // Main animation frame loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // If allowed to spawn continuously from bottom corners
      if (isSpawning && !spawnFromCenterOnly && Math.random() < 0.35) {
        // Left side shooting right-up
        particles.push(createParticle(
          window.innerWidth * 0.05, 
          window.innerHeight * 0.85, 
          { min: -Math.PI / 3, max: -Math.PI / 12 }
        ));
        // Right side shooting left-up
        particles.push(createParticle(
          window.innerWidth * 0.95, 
          window.innerHeight * 0.85, 
          { min: -Math.PI * 11 / 12, max: -Math.PI * 2 / 3 }
        ));
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // Apply physics
        p.x += p.speedX;
        p.y += p.speedY;
        p.speedY += 0.16; // soft gravity
        p.speedX *= 0.985; // friction / air resistance
        p.rotation += p.rotationSpeed;
        
        // Progressive fade out
        if (p.speedY > 1.5) {
          p.opacity -= 0.012;
        }

        // Remove off-screen or faded particles
        if (p.opacity <= 0 || p.y > canvas.height + 20 || p.x < -20 || p.x > canvas.width + 20) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'square') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        } else if (p.shape === 'triangle') {
          ctx.beginPath();
          ctx.moveTo(0, -p.size / 2);
          ctx.lineTo(p.size / 2, p.size / 2);
          ctx.lineTo(-p.size / 2, p.size / 2);
          ctx.closePath();
          ctx.fill();
        } else if (p.shape === 'star') {
          drawStar(0, 0, 5, p.size / 2, p.size / 4);
        }
        ctx.restore();
      }

      if (particles.length > 0 || isSpawning) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(stopTimeout);
    };
  }, [duration, spawnFromCenterOnly]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[99999]"
      style={{ display: 'block' }}
    />
  );
};
