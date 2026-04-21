"use client";

import React, { useEffect, useRef, useState } from "react";

interface FadeContentProps {
  blur?: boolean;
  duration?: number;
  easing?: string;
  initialOpacity?: number;
  children: React.ReactNode;
}

const FadeContent: React.FC<FadeContentProps> = ({
  blur = true,
  duration = 1000,
  easing = "ease-out",
  initialOpacity = 0,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : initialOpacity,
        filter: blur && !isVisible ? "blur(8px)" : "blur(0px)",
        transition: `opacity ${duration}ms ${easing}, filter ${duration}ms ${easing}`,
      }}
    >
      {children}
    </div>
  );
};

export default FadeContent;
