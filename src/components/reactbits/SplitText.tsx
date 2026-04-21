"use client";

import React, { useEffect, useRef, useState } from "react";

interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: "chars" | "words";
  from?: { opacity?: number; y?: number; x?: number };
  to?: { opacity?: number; y?: number; x?: number };
  threshold?: number;
  rootMargin?: string;
  textAlign?: string;
  onLetterAnimationComplete?: () => void;
  showCallback?: boolean;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = "",
  delay = 50,
  duration = 0.6,
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-50px",
  textAlign = "center",
  onLetterAnimationComplete,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const completedRef = useRef(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const items =
    splitType === "chars" ? text.split("") : text.split(" ");

  const totalItems = items.filter((i) => i !== " ").length;

  const handleTransitionEnd = () => {
    completedRef.current += 1;
    if (completedRef.current >= totalItems && onLetterAnimationComplete) {
      onLetterAnimationComplete();
    }
  };

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ textAlign: textAlign as React.CSSProperties["textAlign"] }}
      aria-label={text}
    >
      {items.map((item, i) => (
        <span
          key={i}
          onTransitionEnd={i === items.length - 1 || item !== " " ? handleTransitionEnd : undefined}
          className="inline-block transition-all"
          style={{
            opacity: isVisible ? (to.opacity ?? 1) : (from.opacity ?? 0),
            transform: isVisible
              ? `translateY(${to.y ?? 0}px) translateX(${to.x ?? 0}px)`
              : `translateY(${from.y ?? 40}px) translateX(${from.x ?? 0}px)`,
            transitionDuration: `${duration}s`,
            transitionDelay: `${i * delay}ms`,
            transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            whiteSpace: item === " " ? "pre" : undefined,
            minWidth: item === " " ? "0.3em" : undefined,
          }}
        >
          {item === " " ? "\u00A0" : item}
          {splitType === "words" && i < items.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </div>
  );
};

export default SplitText;
