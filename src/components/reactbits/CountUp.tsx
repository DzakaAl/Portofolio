"use client";

import React, { useEffect, useRef, useState } from "react";

interface CountUpProps {
  from?: number;
  to: number;
  separator?: string;
  direction?: "up" | "down";
  duration?: number;
  className?: string;
  startCounting?: boolean;
}

const CountUp: React.FC<CountUpProps> = ({
  from = 0,
  to,
  separator = ",",
  direction = "up",
  duration = 2,
  className = "",
  startCounting,
}) => {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const shouldCount = startCounting !== undefined ? startCounting : inView;

  useEffect(() => {
    if (!shouldCount) return;

    const start = direction === "up" ? from : to;
    const end = direction === "up" ? to : from;
    const range = end - start;
    const stepTime = (duration * 1000) / Math.abs(range || 1);
    let current = start;
    const timer = setInterval(() => {
      current += range > 0 ? 1 : -1;
      setCount(current);
      if (current === end) clearInterval(timer);
    }, Math.max(stepTime, 16));

    return () => clearInterval(timer);
  }, [shouldCount, from, to, direction, duration]);

  const formatted = count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);

  return (
    <span ref={ref} className={className}>
      {formatted}
    </span>
  );
};

export default CountUp;
