"use client";

import { useRef, useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface Star {
  x: number;
  y: number;
  r: number;
  alpha: number;
  alphaSpeed: number;
  speed: number;
  hue: number;
  /** bright large stars get a glow radius */
  glowR: number;
}

interface Comet {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  width: number;
  alpha: number;
  decay: number;
  hue: number;
  active: boolean;
}

interface CosmicBackgroundProps {
  starCount?: number;
  overlayOpacity?: number;
}

export default function CosmicBackground({
  starCount = 600,
  overlayOpacity = 0.2,
}: CosmicBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = !mounted || resolvedTheme === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let W = 0;
    let H = 0;
    const stars: Star[] = [];
    // Up to 6 comets simultaneously
    const comets: Comet[] = Array.from({ length: 6 }, () => ({
      x: 0, y: 0, vx: 0, vy: 0, len: 0, width: 0,
      alpha: 0, decay: 0, hue: 200, active: false,
    }));

    function resize() {
      const parent = canvas!.parentElement!;
      W = parent.clientWidth;
      H = parent.clientHeight;
      canvas!.width = W;
      canvas!.height = H;
    }

    function initStars() {
      stars.length = 0;
      const isMobile = W < 768;
      const count = isMobile ? Math.min(starCount, 150) : starCount;
      const huePool = isDark
        ? [205, 215, 225, 240, 255, 270, 185, 195, 300, 180]
        : [210, 220, 230, 260, 200];

      for (let i = 0; i < count; i++) {
        const r = Math.random() < 0.08
          ? Math.random() * 1.2 + 1.8   // bright large star
          : Math.random() * 1.0 + 0.25; // typical small star
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r,
          glowR: r > 1.8 ? r * 3.5 : 0,
          alpha: Math.random() * 0.75 + 0.2,
          alphaSpeed: (Math.random() * 0.007 + 0.002) * (Math.random() < 0.5 ? 1 : -1),
          speed: Math.random() * 0.06 + 0.005,
          hue: huePool[Math.floor(Math.random() * huePool.length)],
        });
      }
    }

    function spawnComet() {
      const idle = comets.find((c) => !c.active);
      if (!idle) return;

      // Start from top-left quadrant area going right-downward
      const edge = Math.random();
      if (edge < 0.6) {
        // from top edge
        idle.x = Math.random() * W * 0.75;
        idle.y = -10;
      } else {
        // from left edge
        idle.x = -10;
        idle.y = Math.random() * H * 0.5;
      }

      const angleDeg = 20 + Math.random() * 35; // 20-55 deg
      const angle = (angleDeg * Math.PI) / 180;
      const spd = 4 + Math.random() * 8;
      idle.vx = Math.cos(angle) * spd;
      idle.vy = Math.sin(angle) * spd;
      idle.len = 120 + Math.random() * 200;
      idle.width = 1.2 + Math.random() * 1.6;
      idle.alpha = 0.9 + Math.random() * 0.1;
      idle.decay = 0.008 + Math.random() * 0.012;
      idle.hue = [195, 210, 220, 240, 260][Math.floor(Math.random() * 5)];
      idle.active = true;
    }

    let cometTimer = 0;
    // Stagger initial comet spawns
    let cometInterval = 60 + Math.random() * 80;

    function drawNebula() {
      const nebulas = [
        { cx: W * 0.12, cy: H * 0.22, r: W * 0.30, h: 245 },
        { cx: W * 0.88, cy: H * 0.60, r: W * 0.28, h: 210 },
        { cx: W * 0.50, cy: H * 0.08, r: W * 0.22, h: 270 },
        { cx: W * 0.72, cy: H * 0.82, r: W * 0.24, h: 190 },
        { cx: W * 0.30, cy: H * 0.70, r: W * 0.20, h: 225 },
      ];
      for (const n of nebulas) {
        const grd = ctx!.createRadialGradient(n.cx, n.cy, 0, n.cx, n.cy, n.r);
        if (isDark) {
          grd.addColorStop(0, `hsla(${n.h},85%,48%,0.08)`);
          grd.addColorStop(0.45, `hsla(${n.h + 25},70%,38%,0.04)`);
          grd.addColorStop(1, "transparent");
        } else {
          grd.addColorStop(0, `hsla(${n.h},70%,68%,0.1)`);
          grd.addColorStop(1, "transparent");
        }
        ctx!.fillStyle = grd;
        ctx!.fillRect(0, 0, W, H);
      }
    }

    function drawStar(s: Star) {
      // Glow for bright stars
      if (s.glowR > 0 && isDark) {
        const glow = ctx!.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.glowR);
        glow.addColorStop(0, `hsla(${s.hue},90%,95%,${s.alpha * 0.4})`);
        glow.addColorStop(1, "transparent");
        ctx!.fillStyle = glow;
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, s.glowR, 0, Math.PI * 2);
        ctx!.fill();
      }
      // Core dot
      ctx!.beginPath();
      ctx!.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx!.fillStyle = isDark
        ? `hsla(${s.hue},85%,97%,${s.alpha})`
        : `hsla(${s.hue},60%,55%,${s.alpha * 0.5})`;
      ctx!.fill();
    }

    function drawComet(c: Comet) {
      const tailX = c.x - c.vx * (c.len / Math.hypot(c.vx, c.vy));
      const tailY = c.y - c.vy * (c.len / Math.hypot(c.vx, c.vy));

      // Tail gradient
      const grad = ctx!.createLinearGradient(tailX, tailY, c.x, c.y);
      grad.addColorStop(0, "transparent");
      grad.addColorStop(0.6, `hsla(${c.hue},90%,85%,${c.alpha * 0.25})`);
      grad.addColorStop(1, `hsla(${c.hue},100%,98%,${c.alpha})`);
      ctx!.strokeStyle = grad;
      ctx!.lineWidth = c.width;
      ctx!.lineCap = "round";
      ctx!.beginPath();
      ctx!.moveTo(tailX, tailY);
      ctx!.lineTo(c.x, c.y);
      ctx!.stroke();

      // Bright head with glow
      const headGlow = ctx!.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.width * 5);
      headGlow.addColorStop(0, `hsla(${c.hue},100%,100%,${c.alpha})`);
      headGlow.addColorStop(0.4, `hsla(${c.hue},90%,90%,${c.alpha * 0.5})`);
      headGlow.addColorStop(1, "transparent");
      ctx!.fillStyle = headGlow;
      ctx!.beginPath();
      ctx!.arc(c.x, c.y, c.width * 5, 0, Math.PI * 2);
      ctx!.fill();
    }

    function draw() {
      ctx!.fillStyle = isDark ? "#000000" : "hsl(220,25%,97%)";
      ctx!.fillRect(0, 0, W, H);

      drawNebula();

      // Update & draw stars
      for (const s of stars) {
        s.y -= s.speed;
        if (s.y < -s.r) { s.y = H + s.r; s.x = Math.random() * W; }
        s.alpha += s.alphaSpeed;
        if (s.alpha > 0.95) { s.alpha = 0.95; s.alphaSpeed *= -1; }
        if (s.alpha < 0.08) { s.alpha = 0.08; s.alphaSpeed *= -1; }
        drawStar(s);
      }

      // Comet spawning — only in dark mode
      if (isDark) {
        cometTimer++;
        if (cometTimer >= cometInterval) {
          cometTimer = 0;
          cometInterval = 50 + Math.random() * 70;
          spawnComet();
        }

        for (const c of comets) {
          if (!c.active) continue;
          c.x += c.vx;
          c.y += c.vy;
          c.alpha -= c.decay;
          if (c.alpha <= 0 || c.x > W + 50 || c.y > H + 50) {
            c.active = false;
            continue;
          }
          drawComet(c);
        }
      }

      if (isVisible) {
        animId = requestAnimationFrame(draw);
      } else {
        animId = 0;
      }
    }

    let isVisible = true;
    const io = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible && !animId) {
        animId = requestAnimationFrame(draw);
      }
    }, { threshold: 0 });
    io.observe(canvas);

    const onResize = () => { resize(); initStars(); };
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas.parentElement!);
    window.addEventListener("resize", onResize);

    resize();
    initStars();
    // Kick off a couple comets right away so it doesn't look empty
    setTimeout(() => spawnComet(), 800);
    setTimeout(() => spawnComet(), 2200);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [isDark, starCount]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ willChange: "transform" }} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isDark
            ? `rgba(0,0,0,${overlayOpacity})`
            : `rgba(240,243,252,${overlayOpacity})`,
        }}
      />
    </>
  );
}
