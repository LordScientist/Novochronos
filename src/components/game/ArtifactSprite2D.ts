// 2D Vector Procedural Sprite Renderer for NASA Artifacts in POWER RUN
// Renders distinct, historically accurate silhouettes and details for all 8 NASA spacecraft

import { Artifact } from '../../types/artifact';

interface DrawContext {
  ctx: CanvasRenderingContext2D;
  x: number;
  y: number;
  width: number;
  height: number;
  time: number;
  tiltAngle: number;
  isInvulnerable: boolean;
  powerPercent: number;
}

export function drawArtifactSprite(
  artifact: Artifact,
  drawCtx: DrawContext
) {
  const { ctx, x, y, width, height, time, tiltAngle, isInvulnerable, powerPercent } = drawCtx;

  // Invulnerability blink effect (12 Hz)
  if (isInvulnerable && Math.floor(time * 14) % 2 === 0) {
    return;
  }

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tiltAngle);

  // Subtle mechanical suspension vibration
  const bounce = Math.sin(time * 16) * 1.5;
  ctx.translate(0, bounce);

  const id = artifact.id;

  if (id === 'opportunity-rover') {
    drawOpportunity(ctx, width, height, time, powerPercent);
  } else if (id === 'ingenuity-helicopter') {
    drawIngenuity(ctx, width, height, time, powerPercent);
  } else if (id === 'apollo-11-descent') {
    drawApollo11(ctx, width, height, time, powerPercent);
  } else if (id === 'insight-lander') {
    drawInSight(ctx, width, height, time, powerPercent);
  } else if (id === 'apollo-15-lrv') {
    drawApollo15LRV(ctx, width, height, time, powerPercent);
  } else if (id === 'sojourner-pathfinder') {
    drawSojourner(ctx, width, height, time, powerPercent);
  } else if (id === 'pioneer-10') {
    drawPioneer10(ctx, width, height, time, powerPercent);
  } else if (id === 'surveyor-3') {
    drawSurveyor3(ctx, width, height, time, powerPercent);
  } else {
    // Default fallback rover
    drawOpportunity(ctx, width, height, time, powerPercent);
  }

  ctx.restore();
}

// -------------------------------------------------------------
// 1. OPPORTUNITY ROVER (MER-B)
// Rocker-bogie 6 wheels, triangular solar deck, mast with Pancam
// -------------------------------------------------------------
function drawOpportunity(
  ctx: CanvasRenderingContext2D,
  w: number,
  _h: number,
  time: number,
  power: number
) {
  const scale = w / 110;
  ctx.scale(scale, scale);

  // Shadow on terrain
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 24, 48, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Rocker-Bogie Titanium Suspension Tubes
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(-32, 10);
  ctx.lineTo(-8, -4);
  ctx.lineTo(24, 6);
  ctx.lineTo(34, 18);
  ctx.stroke();

  // 6 Aluminum Cleated Wheels
  const wheelSpin = time * 8;
  const wheelPositions = [-34, -14, 10, 32];
  wheelPositions.forEach((wx) => {
    ctx.save();
    ctx.translate(wx, 18);
    ctx.rotate(wheelSpin);

    // Rim
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Tread spokes
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    for (let a = 0; a < 4; a++) {
      const angle = (a * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(-Math.cos(angle) * 7, -Math.sin(angle) * 7);
      ctx.lineTo(Math.cos(angle) * 7, Math.sin(angle) * 7);
      ctx.stroke();
    }
    ctx.restore();
  });

  // Warm Electronics Box (Gold Kapton Foil MLI)
  ctx.fillStyle = '#b45309';
  ctx.fillRect(-26, -10, 48, 16);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-26, -10, 48, 16);

  // Solar Array Deck (Photovoltaic dark blue/black cells)
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(-38, -10);
  ctx.lineTo(32, -10);
  ctx.lineTo(24, -18);
  ctx.lineTo(-30, -18);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // Pancam Mast (Periscope with twin camera lenses)
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(14, -18);
  ctx.lineTo(14, -36);
  ctx.stroke();

  // Camera Head
  ctx.fillStyle = '#334155';
  ctx.fillRect(8, -42, 16, 7);
  // Lens glow (green if power > 20%, red if low)
  ctx.fillStyle = power > 25 ? '#22c55e' : '#ef4444';
  ctx.beginPath();
  ctx.arc(22, -38.5, 2.5, 0, Math.PI * 2);
  ctx.fill();
}

// -------------------------------------------------------------
// 2. INGENUITY HELICOPTER (Mars Helicopter)
// Dual counter-rotating carbon blades, cube fuselage, solar square
// -------------------------------------------------------------
function drawIngenuity(
  ctx: CanvasRenderingContext2D,
  w: number,
  _h: number,
  time: number,
  _power: number
) {
  const scale = w / 100;
  ctx.scale(scale, scale);

  // Downward rotor wash shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 32, 38, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4 Slender Carbon-Fiber Landing Legs
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-10, 8);
  ctx.lineTo(-26, 26);
  ctx.moveTo(10, 8);
  ctx.lineTo(26, 26);
  ctx.stroke();

  // Carbon Leg Footpads
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(-28, 26, 6, 2.5);
  ctx.fillRect(22, 26, 6, 2.5);

  // Fuselage Avionics Cube (Gold/copper foil wrapped)
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-12, -4, 24, 16);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-12, -4, 24, 16);

  // Downward laser altimeter sensor light
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(0, 12, 2, 0, Math.PI * 2);
  ctx.fill();

  // Rotor Mast
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -4);
  ctx.lineTo(0, -32);
  ctx.stroke();

  // Solar Array Panel (Square horizontally atop mast)
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-14, -36, 28, 4);
  ctx.strokeStyle = '#bae6fd';
  ctx.lineWidth = 1;
  ctx.strokeRect(-14, -36, 28, 4);

  // Counter-rotating Dual Rotor Blades (High-speed motion illusion)
  const rotorBlur1 = Math.cos(time * 32);
  const rotorBlur2 = Math.sin(time * 32);

  // Upper Rotor
  ctx.strokeStyle = 'rgba(226, 232, 240, 0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-42 * rotorBlur1, -26);
  ctx.lineTo(42 * rotorBlur1, -26);
  ctx.stroke();

  // Lower Rotor
  ctx.strokeStyle = 'rgba(203, 213, 225, 0.85)';
  ctx.beginPath();
  ctx.moveTo(-38 * rotorBlur2, -18);
  ctx.lineTo(38 * rotorBlur2, -18);
  ctx.stroke();
}

// -------------------------------------------------------------
// 3. APOLLO 11 DESCENT STAGE
// Octagonal gold-foil stage, 4 outrigger legs with landing footpads
// -------------------------------------------------------------
function drawApollo11(
  ctx: CanvasRenderingContext2D,
  w: number,
  _h: number,
  _time: number,
  _power: number
) {
  const scale = w / 115;
  ctx.scale(scale, scale);

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 26, 52, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4 Outrigger Tubular Landing Struts
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  // Left leg
  ctx.moveTo(-24, 0);
  ctx.lineTo(-44, 22);
  // Right leg
  ctx.moveTo(24, 0);
  ctx.lineTo(44, 22);
  ctx.stroke();

  // Dish-shaped circular footpads
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.ellipse(-44, 23, 9, 3, 0, 0, Math.PI * 2);
  ctx.ellipse(44, 23, 9, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Octagonal Central Stage (Wrinkled gold Kapton foil)
  ctx.fillStyle = '#ca8a04';
  ctx.beginPath();
  ctx.moveTo(-28, -14);
  ctx.lineTo(28, -14);
  ctx.lineTo(34, 4);
  ctx.lineTo(-34, 4);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Descent Engine Bell Nozzle (Gimbaled central nozzle)
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(-10, 4);
  ctx.lineTo(10, 4);
  ctx.lineTo(14, 16);
  ctx.lineTo(-14, 16);
  ctx.closePath();
  ctx.fill();

  // Upper Stage Interface Mount Deck
  ctx.fillStyle = '#475569';
  ctx.fillRect(-20, -22, 40, 8);
  ctx.strokeStyle = '#94a3b8';
  ctx.strokeRect(-20, -22, 40, 8);

  // EASEP Scientific Instrument Compartment Panel
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-16, -10, 12, 10);
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 5px monospace';
  ctx.fillText('NASA', -15, -3);
}

// -------------------------------------------------------------
// 4. INSIGHT LANDER
// Dual circular UltraFlex solar arrays, central deck, SEIS dome
// -------------------------------------------------------------
function drawInSight(
  ctx: CanvasRenderingContext2D,
  w: number,
  _h: number,
  _time: number,
  _power: number
) {
  const scale = w / 125;
  ctx.scale(scale, scale);

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.ellipse(0, 22, 54, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  // Landing Legs
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-20, 4);
  ctx.lineTo(-38, 20);
  ctx.moveTo(20, 4);
  ctx.lineTo(38, 20);
  ctx.stroke();

  // Dual Circular UltraFlex Solar Panels (Iconic decagons)
  const drawArray = (centerX: number) => {
    ctx.save();
    ctx.translate(centerX, -6);
    ctx.fillStyle = '#0369a1';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Radial pie segments
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 1;
    for (let a = 0; a < 8; a++) {
      const angle = (a * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle) * 19, Math.sin(angle) * 19);
      ctx.stroke();
    }
    ctx.restore();
  };

  drawArray(-36);
  drawArray(36);

  // Central Science Deck
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-22, -10, 44, 16);
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-22, -10, 44, 16);

  // SEIS Seismometer Wind and Thermal Shield Dome
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(0, -10, 10, Math.PI, 0);
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Robotic Arm Deployment
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(14, -6);
  ctx.lineTo(24, -14);
  ctx.lineTo(28, -4);
  ctx.stroke();
}

// -------------------------------------------------------------
// 5. APOLLO 15 LUNAR ROVING VEHICLE (LRV)
// Open tubular chassis, wire mesh wheels, high-gain dish, antenna
// -------------------------------------------------------------
function drawApollo15LRV(
  ctx: CanvasRenderingContext2D,
  w: number,
  _h: number,
  time: number,
  _power: number
) {
  const scale = w / 115;
  ctx.scale(scale, scale);

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 22, 50, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 4 Open Wire-Mesh Wheels with Chevron Treads
  const wheelSpin = time * 7.5;
  [-30, 28].forEach((wx) => {
    ctx.save();
    ctx.translate(wx, 15);
    ctx.rotate(wheelSpin);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.stroke();

    // Wire mesh chevron pattern
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.2;
    for (let c = 0; c < 6; c++) {
      const angle = (c * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * 3, Math.sin(angle) * 3);
      ctx.lineTo(Math.cos(angle) * 10, Math.sin(angle) * 10);
      ctx.stroke();
    }
    ctx.restore();
  });

  // Chassis Tubular Aluminum Frame
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-36, 10);
  ctx.lineTo(34, 10);
  ctx.lineTo(26, -2);
  ctx.lineTo(-24, -2);
  ctx.closePath();
  ctx.stroke();

  // Two Folded Astronaut Lawn-Chairs
  ctx.fillStyle = '#64748b';
  ctx.fillRect(-12, -14, 10, 12);
  ctx.fillRect(2, -14, 10, 12);

  // High-Gain Parabolic Mesh Antenna
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(-20, -22, 12, 0.8 * Math.PI, 1.8 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-20, -10);
  ctx.lineTo(-20, -22);
  ctx.stroke();

  // Color TV Camera Mast (The camera that broadcast the Apollo liftoff)
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(22, 2);
  ctx.lineTo(24, -20);
  ctx.stroke();
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(20, -24, 10, 6);
}

// -------------------------------------------------------------
// 6. SOJOURNER PATHFINDER (Mars Pathfinder)
// Ultra-compact 6-wheel microrover, solar panel roof, APXS arm
// -------------------------------------------------------------
function drawSojourner(
  ctx: CanvasRenderingContext2D,
  w: number,
  _h: number,
  time: number,
  _power: number
) {
  const scale = w / 95;
  ctx.scale(scale, scale);

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 18, 36, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // 6 Compact Cleated Aluminum Wheels
  const wheelSpin = time * 9;
  [-22, 0, 22].forEach((wx) => {
    ctx.save();
    ctx.translate(wx, 13);
    ctx.rotate(wheelSpin);

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(0, 0, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(5, 0);
    ctx.moveTo(0, -5);
    ctx.lineTo(0, 5);
    ctx.stroke();
    ctx.restore();
  });

  // Body Warm Box (Gold foil insulated)
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-20, -4, 40, 14);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-20, -4, 40, 14);

  // Flat Photovoltaic Solar Deck
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-24, -9, 48, 5);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1;
  ctx.strokeRect(-24, -9, 48, 5);

  // APXS Sensor Arm deploying at rear
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-18, 4);
  ctx.lineTo(-32, 10);
  ctx.stroke();
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(-33, 10, 3, 0, Math.PI * 2);
  ctx.fill();

  // Front Stereo Cameras
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(18, -6, 5, 4);
}

// -------------------------------------------------------------
// 7. PIONEER 10 (Deep Space Probe)
// 2.74-meter golden parabolic high-gain antenna dish, RTG nuclear booms
// -------------------------------------------------------------
function drawPioneer10(
  ctx: CanvasRenderingContext2D,
  w: number,
  _h: number,
  time: number,
  _power: number
) {
  const scale = w / 125;
  ctx.scale(scale, scale);

  // Gentle cosmic rotation bob
  const drift = Math.sin(time * 2.5) * 0.05;
  ctx.rotate(drift);

  // RTG Nuclear Power Booms (Extended triangulated trusses)
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 2.5;
  // Left boom
  ctx.beginPath();
  ctx.moveTo(-12, 12);
  ctx.lineTo(-44, 26);
  ctx.stroke();
  // RTG Canisters
  ctx.fillStyle = '#334155';
  ctx.fillRect(-52, 22, 10, 9);

  // Magnetometer Boom (Right extended arm)
  ctx.beginPath();
  ctx.moveTo(12, 12);
  ctx.lineTo(48, 24);
  ctx.stroke();
  ctx.fillStyle = '#94a3b8';
  ctx.beginPath();
  ctx.arc(50, 25, 4, 0, Math.PI * 2);
  ctx.fill();

  // Hexagonal Spacecraft Instrument Compartment
  ctx.fillStyle = '#e2e8f0';
  ctx.beginPath();
  ctx.moveTo(-18, -4);
  ctx.lineTo(18, -4);
  ctx.lineTo(24, 16);
  ctx.lineTo(-24, 16);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Golden High-Gain Dish Antenna (Facing direction of flight)
  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.ellipse(0, -12, 34, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Subreflector Feed Horn Mast (Extended from dish center)
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(0, -28);
  ctx.stroke();
  ctx.fillStyle = '#ea580c';
  ctx.beginPath();
  ctx.arc(0, -28, 3, 0, Math.PI * 2);
  ctx.fill();
}

// -------------------------------------------------------------
// 8. SURVEYOR 3 (Lunar Lander)
// Triangular tubular frame, 3 landing legs, solar panel mast, scoop arm
// -------------------------------------------------------------
function drawSurveyor3(
  ctx: CanvasRenderingContext2D,
  w: number,
  _h: number,
  _time: number,
  _power: number
) {
  const scale = w / 110;
  ctx.scale(scale, scale);

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 24, 46, 7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 3 Tubular Landing Legs with Crushable Footpads
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-18, 6);
  ctx.lineTo(-38, 22);
  ctx.moveTo(18, 6);
  ctx.lineTo(38, 22);
  ctx.stroke();

  // Footpads
  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(-44, 22, 10, 3);
  ctx.fillRect(34, 22, 10, 3);

  // Triangular Open Aluminum Truss Spacecraft Frame
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(22, 6);
  ctx.lineTo(-22, 6);
  ctx.closePath();
  ctx.stroke();

  // Central Helium & Vernier Fuel Spheres
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();

  // Planar Solar Array Mast
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -14);
  ctx.lineTo(0, -38);
  ctx.stroke();

  // Flat Rectangular Solar Panel
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(-12, -42, 24, 6);
  ctx.strokeStyle = '#38bdf8';
  ctx.strokeRect(-12, -42, 24, 6);

  // Surface Sampler Scoop Mechanism (famous scoop retrieved by Apollo 12)
  ctx.strokeStyle = '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(14, 4);
  ctx.lineTo(28, 12);
  ctx.lineTo(36, 18);
  ctx.stroke();
  ctx.fillStyle = '#b45309';
  ctx.fillRect(34, 16, 6, 6);
}
