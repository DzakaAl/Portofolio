"use client";

import { useEffect, useState, useRef } from "react";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"counting" | "done">("counting");
  const [visible, setVisible] = useState(true);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  const DURATION = 2200; // ms to go 0→100

  useEffect(() => {
    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      // Ease-out: fast start, slow near 100
      const t = Math.min(elapsed / DURATION, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = Math.floor(eased * 100);
      setProgress(val);

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setProgress(100);
        setPhase("done");
        setTimeout(() => {
          setVisible(false);
          onComplete();
        }, 600);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!visible) return null;

  const bars = 20;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
      style={{
        opacity: phase === "done" ? 0 : 1,
        transition: phase === "done" ? "opacity 0.5s ease-out" : "none",
      }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,200,0.015) 2px, rgba(0,255,200,0.015) 4px)",
        }}
      />

      {/* Corner brackets */}
      {[
        "top-6 left-6 border-t-2 border-l-2",
        "top-6 right-6 border-t-2 border-r-2",
        "bottom-6 left-6 border-b-2 border-l-2",
        "bottom-6 right-6 border-b-2 border-r-2",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-8 h-8 border-cyan-500/60 ${cls}`}
        />
      ))}

      {/* Horizontal scan line */}
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none"
        style={{
          top: `${progress}%`,
          transition: "top 0.05s linear",
          boxShadow: "0 0 12px 1px rgba(0,255,220,0.3)",
        }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-10 w-full max-w-sm px-8">

        {/* Big percentage */}
        <div className="relative select-none flex items-baseline gap-3">
          <span
            className="font-mono font-black tracking-tighter leading-none text-cyan-400"
            style={{
              fontSize: "clamp(6rem, 20vw, 10rem)",
              filter: `drop-shadow(0 0 ${Math.floor(progress / 10) + 4}px rgba(0,255,220,0.6))`,
            }}
          >
            {progress}
          </span>
          <span
            className="font-mono font-black text-cyan-400"
            style={{
              fontSize: "clamp(6rem, 20vw, 10rem)",
              filter: `drop-shadow(0 0 ${Math.floor(progress / 10) + 4}px rgba(0,255,220,0.6))`,
            }}
          >
            %
          </span>
        </div>

        {/* Segmented progress bar */}
        <div className="w-full flex gap-0.5">
          {Array.from({ length: bars }).map((_, i) => {
            const filled = (i / bars) * 100 <= progress;
            const partial = !filled && ((i / bars) * 100 <= progress + 5);
            return (
              <div
                key={i}
                className="flex-1 h-1.5 rounded-sm transition-all duration-75"
                style={{
                  background: filled
                    ? `hsl(${180 + i * 4}, 100%, 65%)`
                    : partial
                    ? "rgba(0,255,220,0.2)"
                    : "rgba(255,255,255,0.05)",
                  boxShadow: filled ? `0 0 6px hsl(${180 + i * 4}, 100%, 65%)` : "none",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
