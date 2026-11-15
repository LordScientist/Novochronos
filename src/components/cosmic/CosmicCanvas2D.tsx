// Realistic 2D Cosmic Parallax Background Canvas for ECHOES OF EXPLORATION
// Multi-layer starfields, deterministic color temperatures, parallax depth, and periodic shooting stars

import React, { useRef, useEffect } from 'react';

interface CosmicCanvas2DProps {
  className?: string;
  theme?: 'deep-space' | 'earth-orbit' | 'mars' | 'lunar';
  starCount?: number;
  interactiveParallax?: boolean;
}

interface Star2D {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
  layer: number;
}

interface Meteor2D {
  x: number;
  y: number;
  length: number;
  speed: number;
  alpha: number;
  angle: number;
  active: boolean;
}

export const CosmicCanvas2D: React.FC<CosmicCanvas2DProps> = ({
  className = '',
  theme = 'deep-space',
  starCount = 380,
  interactiveParallax = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactiveParallax) return;
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 35;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 25;
    };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    const stellarColors = ['#9db4ff', '#cad8ff', '#f8f9fa', '#fff4e8', '#ffd2a1'];
    const stars: Star2D[] = [];

    let seed = 1337;
    const random = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let i = 0; i < starCount; i++) {
      const layerRoll = random();
      const layer = layerRoll < 0.65 ? 0 : layerRoll < 0.9 ? 1 : 2;
      const colorIdx = Math.floor(random() * stellarColors.length);

      stars.push({
        x: random() * width,
        y: random() * height,
        radius: (random() * 1.3 + 0.4) * (layer === 2 ? 1.4 : layer === 1 ? 1.0 : 0.75),
        color: stellarColors[colorIdx],
        alpha: random() * 0.55 + 0.25,
        twinkleSpeed: random() * 2.5 + 0.8,
        phase: random() * Math.PI * 2,
        layer,
      });
    }

    const meteor: Meteor2D = {
      x: 0,
      y: 0,
      length: 0,
      speed: 0,
      alpha: 0,
      angle: (35 * Math.PI) / 180,
      active: false,
    };
    let meteorCooldown = 4.0;

    let lastTime = performance.now();

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      ctx.fillStyle = '#05070D';
      ctx.fillRect(0, 0, width, height);

      const nebula1 = ctx.createRadialGradient(
        width * 0.25 + mouseX * 0.2,
        height * 0.25 + mouseY * 0.2,
        0,
        width * 0.25,
        height * 0.25,
        width * 0.45
      );
      nebula1.addColorStop(0, 'rgba(8, 47, 73, 0.16)');
      nebula1.addColorStop(0.5, 'rgba(30, 27, 75, 0.08)');
      nebula1.addColorStop(1, 'rgba(5, 7, 13, 0)');
      ctx.fillStyle = nebula1;
      ctx.fillRect(0, 0, width, height);

      const nebula2 = ctx.createRadialGradient(
        width * 0.8 - mouseX * 0.15,
        height * 0.65 - mouseY * 0.15,
        0,
        width * 0.8,
        height * 0.65,
        width * 0.5
      );
      nebula2.addColorStop(0, 'rgba(46, 16, 101, 0.12)');
      nebula2.addColorStop(0.5, 'rgba(23, 37, 84, 0.06)');
      nebula2.addColorStop(1, 'rgba(5, 7, 13, 0)');
      ctx.fillStyle = nebula2;
      ctx.fillRect(0, 0, width, height);

      const t = now * 0.001;
      stars.forEach((star) => {
        const layerMultiplier = star.layer === 0 ? 0.2 : star.layer === 1 ? 0.6 : 1.2;
        let sx = star.x + mouseX * layerMultiplier;
        let sy = star.y + mouseY * layerMultiplier;

        if (sx < 0) sx += width;
        if (sx > width) sx -= width;
        if (sy < 0) sy += height;
        if (sy > height) sy -= height;

        const twinkle = Math.sin(t * star.twinkleSpeed + star.phase) * 0.2 + 0.8;
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.fillStyle = star.color;

        ctx.beginPath();
        ctx.arc(sx, sy, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      if (!meteor.active) {
        meteorCooldown -= dt;
        if (meteorCooldown <= 0) {
          meteor.active = true;
          meteor.x = Math.random() * (width * 0.7);
          meteor.y = Math.random() * (height * 0.35);
          meteor.length = 90 + Math.random() * 80;
          meteor.speed = 1100 + Math.random() * 600;
          meteor.alpha = 0;
          meteor.angle = ((25 + Math.random() * 20) * Math.PI) / 180;
        }
      } else {
        meteor.x += Math.cos(meteor.angle) * meteor.speed * dt;
        meteor.y += Math.sin(meteor.angle) * meteor.speed * dt;
        meteor.alpha += dt * 3.5;

        if (meteor.alpha > 0.95 || meteor.x > width || meteor.y > height) {
          meteor.active = false;
          meteorCooldown = 12 + Math.random() * 18;
        } else {
          const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
          const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

          const grad = ctx.createLinearGradient(tailX, tailY, meteor.x, meteor.y);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
          grad.addColorStop(0.7, 'rgba(84, 201, 245, 0.4)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0.95)');

          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(tailX, tailY);
          ctx.lineTo(meteor.x, meteor.y);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = Math.min(1.0, meteor.alpha);
          ctx.beginPath();
          ctx.arc(meteor.x, meteor.y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [interactiveParallax, starCount, theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 z-0 ${className}`}
      style={{ display: 'block' }}
    />
  );
};

