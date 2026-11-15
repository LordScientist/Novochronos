// 2D Environment & Parallax Renderer for POWER RUN: The Last Signal
// Renders multi-layer parallax backgrounds, celestial terrain, obstacles, and batteries

import { Obstacle, BatteryPickup } from '../../types/game';

export interface EnvironmentTheme {
  name: 'Moon' | 'Mars' | 'Deep Space';
  skyGradient: [string, string];
  horizonColor: string;
  mountainColor: string;
  midgroundColor: string;
  foregroundBase: string;
  gridLineColor: string;
  hazardColor: string;
  hazardStroke: string;
}

export const THEMES: Record<string, EnvironmentTheme> = {
  Moon: {
    name: 'Moon',
    skyGradient: ['#000000', '#030712'],
    horizonColor: '#111827',
    mountainColor: '#1f2937',
    midgroundColor: '#374151',
    foregroundBase: '#4b5563',
    gridLineColor: 'rgba(255, 255, 255, 0.08)',
    hazardColor: '#334155',
    hazardStroke: '#94a3b8',
  },
  Mars: {
    name: 'Mars',
    skyGradient: ['#0f0505', '#2a0e08'],
    horizonColor: '#451a03',
    mountainColor: '#78350f',
    midgroundColor: '#9a3412',
    foregroundBase: '#c2410c',
    gridLineColor: 'rgba(251, 146, 60, 0.12)',
    hazardColor: '#7c2d12',
    hazardStroke: '#f97316',
  },
  'Deep Space': {
    name: 'Deep Space',
    skyGradient: ['#02040a', '#0c0a24'],
    horizonColor: '#17133d',
    mountainColor: '#241a54',
    midgroundColor: '#3b2575',
    foregroundBase: '#4c1d95',
    gridLineColor: 'rgba(192, 132, 252, 0.1)',
    hazardColor: '#475569',
    hazardStroke: '#a855f7',
  },
};

export class EnvironmentRenderer2D {
  private starfield: { x: number; y: number; radius: number; alpha: number; twinkleSpeed: number }[] = [];

  constructor() {
    // Generate pre-seeded deep stars
    for (let i = 0; i < 180; i++) {
      this.starfield.push({
        x: Math.random() * 2400,
        y: Math.random() * 1200,
        radius: Math.random() * 1.6 + 0.5,
        alpha: Math.random() * 0.7 + 0.3,
        twinkleSpeed: Math.random() * 3 + 1,
      });
    }
  }

  renderBackground(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scrollOffset: number,
    theme: EnvironmentTheme,
    time: number
  ) {
    // 1. Sky Gradient
    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, theme.skyGradient[0]);
    sky.addColorStop(0.65, theme.skyGradient[1]);
    sky.addColorStop(1, theme.horizonColor);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    // 2. Distant Starfield (0.04x speed)
    ctx.fillStyle = '#ffffff';
    const starOffset = (scrollOffset * 0.04) % 2400;
    this.starfield.forEach((star) => {
      let sx = (star.x - starOffset) % 2400;
      if (sx < 0) sx += 2400;
      if (sx <= width && star.y <= height * 0.75) {
        const twinkle = Math.sin(time * star.twinkleSpeed) * 0.35 + 0.65;
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.beginPath();
        ctx.arc(sx, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1.0;

    // Distant Earth / Mars Planet in Sky
    if (theme.name === 'Moon') {
      // Blue Marble Earth in lunar sky
      const earthX = (width * 0.75 - scrollOffset * 0.015) % (width * 1.5);
      ctx.save();
      ctx.beginPath();
      ctx.arc(earthX, height * 0.18, 28, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(earthX - 4, height * 0.18 - 4, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (theme.name === 'Mars') {
      // Deimos / Phobos tiny moon
      const phobosX = (width * 0.8 - scrollOffset * 0.02) % (width * 1.5);
      ctx.save();
      ctx.beginPath();
      ctx.arc(phobosX, height * 0.16, 7, 0, Math.PI * 2);
      ctx.fillStyle = '#e2e8f0';
      ctx.fill();
      ctx.restore();
    }

    // 3. Layer 1: Distant Mountain Silhouettes (0.12x speed)
    this.drawMountainLayer(ctx, width, height, scrollOffset * 0.12, height * 0.42, 65, theme.mountainColor, 320);

    // 4. Layer 2: Midground Terrain Ridges (0.35x speed)
    this.drawRidgeLayer(ctx, width, height, scrollOffset * 0.35, height * 0.58, 45, theme.midgroundColor, 180);

    // 5. Layer 3: Main Active Surface Track (1.0x speed)
    this.drawForegroundTrack(ctx, width, height, scrollOffset, theme);
  }

  private drawMountainLayer(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    offset: number,
    baseY: number,
    amplitude: number,
    color: string,
    wavelength: number
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, h);

    const step = 25;
    for (let x = 0; x <= w + step; x += step) {
      const worldX = x + offset;
      const y =
        baseY -
        Math.sin(worldX / wavelength) * amplitude -
        Math.cos(worldX / (wavelength * 0.45)) * (amplitude * 0.4);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }

  private drawRidgeLayer(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    offset: number,
    baseY: number,
    amplitude: number,
    color: string,
    wavelength: number
  ) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, h);

    const step = 20;
    for (let x = 0; x <= w + step; x += step) {
      const worldX = x + offset;
      const y =
        baseY -
        Math.sin(worldX / wavelength) * amplitude -
        Math.sin(worldX / (wavelength * 0.3)) * (amplitude * 0.3);
      ctx.lineTo(x, y);
    }

    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }

  // -------------------------------------------------------------
  // Foreground 3-Lane Track Surface
  // -------------------------------------------------------------
  private drawForegroundTrack(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    scrollOffset: number,
    theme: EnvironmentTheme
  ) {
    // 3 Discrete Navigation Corridor Lanes:
    // Lane 0: 28% of height
    // Lane 1: 50% of height
    // Lane 2: 72% of height
    const laneY = [h * 0.28, h * 0.50, h * 0.72];

    // Subtle lane guide tracks (clean, futuristic rover wheel pathways)
    laneY.forEach((y) => {
      // Lane centerline dashes
      ctx.strokeStyle = theme.gridLineColor;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([16, 24]);
      ctx.lineDashOffset = -scrollOffset;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.setLineDash([]);

      // Lane boundary markers
      ctx.fillStyle = theme.gridLineColor;
      const markerSpacing = 160;
      const startX = -(scrollOffset % markerSpacing);
      for (let mx = startX; mx < w; mx += markerSpacing) {
        ctx.fillRect(mx, y - 2, 4, 4);
      }
    });

    // Lower Ground Rim Terrain Details
    const bottomGroundY = h * 0.88;
    ctx.fillStyle = theme.foregroundBase;
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.lineTo(0, bottomGroundY);

    for (let x = 0; x <= w; x += 30) {
      const bump = Math.sin((x + scrollOffset) * 0.05) * 5;
      ctx.lineTo(x, bottomGroundY + bump);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();
  }

  // -------------------------------------------------------------
  // Render Obstacles (Rocks, Boulders, Craters, Debris)
  // -------------------------------------------------------------
  renderObstacle(ctx: CanvasRenderingContext2D, obs: Obstacle, theme: EnvironmentTheme, _time: number) {
    ctx.save();
    ctx.translate(obs.x, obs.y ?? 0);

    // Ground contact shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, obs.height * 0.35, obs.width * 0.55, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (obs.type === 'boulder' || obs.type === 'rock') {
      // Angular Basalt / Anorthosite Rock
      ctx.fillStyle = theme.hazardColor;
      ctx.strokeStyle = theme.hazardStroke;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.moveTo(-obs.width * 0.45, obs.height * 0.25);
      ctx.lineTo(-obs.width * 0.35, -obs.height * 0.35);
      ctx.lineTo(0, -obs.height * 0.48);
      ctx.lineTo(obs.width * 0.42, -obs.height * 0.2);
      ctx.lineTo(obs.width * 0.48, obs.height * 0.32);
      ctx.lineTo(obs.width * 0.1, obs.height * 0.45);
      ctx.lineTo(-obs.width * 0.3, obs.height * 0.42);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Rock facet highlights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-obs.width * 0.35, -obs.height * 0.35);
      ctx.lineTo(0, 0);
      ctx.lineTo(obs.width * 0.42, -obs.height * 0.2);
      ctx.stroke();
    } else if (obs.type === 'crater') {
      // Impact Crater Depression
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.ellipse(0, 0, obs.width * 0.48, obs.height * 0.32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = theme.hazardStroke;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Ejecta rim blanket
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, obs.width * 0.58, obs.height * 0.4, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Abandoned Mission Debris / Metallic Hardware Fragment
      ctx.fillStyle = '#64748b';
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.fillRect(-obs.width * 0.4, -obs.height * 0.35, obs.width * 0.8, obs.height * 0.7);
      ctx.strokeRect(-obs.width * 0.4, -obs.height * 0.35, obs.width * 0.8, obs.height * 0.7);

      // Hazard hazard stripes
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(-obs.width * 0.2, -obs.height * 0.35);
      ctx.lineTo(-obs.width * 0.05, -obs.height * 0.35);
      ctx.lineTo(-obs.width * 0.25, obs.height * 0.35);
      ctx.lineTo(-obs.width * 0.4, obs.height * 0.35);
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // -------------------------------------------------------------
  // Render Battery Pickups (High Visibility Glowing Energy Cell)
  // -------------------------------------------------------------
  renderBattery(ctx: CanvasRenderingContext2D, battery: BatteryPickup, time: number) {
    if (battery.collected) return;

    ctx.save();
    // Smooth sinusoidal floating bobbing
    const bob = Math.sin(time * 5 + battery.pulsePhase) * 6;
    ctx.translate(battery.x, (battery.y ?? 0) + bob);

    // Subtle pulsating glow halo
    const glowRadius = 24 + Math.sin(time * 6) * 4;
    const radialGlow = ctx.createRadialGradient(0, 0, 4, 0, 0, glowRadius);
    radialGlow.addColorStop(0, 'rgba(56, 189, 248, 0.75)');
    radialGlow.addColorStop(0.5, 'rgba(14, 165, 233, 0.25)');
    radialGlow.addColorStop(1, 'rgba(14, 165, 233, 0)');
    ctx.fillStyle = radialGlow;
    ctx.beginPath();
    ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
    ctx.fill();

    // Cylindrical Battery Shell (Metallic casing)
    const bw = battery.width;
    const bh = battery.height;
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;

    // Body
    ctx.beginPath();
    ctx.roundRect(-bw * 0.45, -bh * 0.45, bw * 0.9, bh * 0.9, 6);
    ctx.fill();
    ctx.stroke();

    // Positive Terminal Cap
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(bw * 0.45, -bh * 0.2, 5, bh * 0.4);

    // Internal Neon Power Bars (Green / Cyan energy charge)
    const barCount = 3;
    const barWidth = 4;
    const barSpacing = 7;
    const startX = -((barCount * barSpacing) / 2) + 2;

    for (let i = 0; i < barCount; i++) {
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 8;
      ctx.fillRect(startX + i * barSpacing, -bh * 0.28, barWidth, bh * 0.56);
    }
    ctx.shadowBlur = 0;

    // Energy Lightning Bolt Icon
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(1, -7);
    ctx.lineTo(-4, 0);
    ctx.lineTo(0, 0);
    ctx.lineTo(-2, 7);
    ctx.lineTo(4, -1);
    ctx.lineTo(0, -1);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}
