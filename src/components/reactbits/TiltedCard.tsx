"use client";

import React, { useRef, useState, useCallback } from "react";

interface TiltedCardProps {
  imageSrc: string;
  altText?: string;
  captionText?: string;
  containerHeight?: string;
  containerWidth?: string;
  imageHeight?: string;
  imageWidth?: string;
  rotateAmplitude?: number;
  scaleOnHover?: number;
  showMobileWarning?: boolean;
  showTooltip?: boolean;
  displayOverlayContent?: boolean;
  overlayContent?: React.ReactNode;
}

const TiltedCard: React.FC<TiltedCardProps> = ({
  imageSrc,
  altText = "",
  captionText = "",
  containerHeight = "300px",
  containerWidth = "300px",
  imageHeight = "300px",
  imageWidth = "300px",
  rotateAmplitude = 12,
  scaleOnHover = 1.05,
  showMobileWarning: _showMobileWarning = false,
  showTooltip = false,
  displayOverlayContent = false,
  overlayContent,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(
    "perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)"
  );
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -rotateAmplitude;
      const rotateY = ((x - centerX) / centerX) * rotateAmplitude;
      setTransform(
        `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scaleOnHover})`
      );
      setTooltipPos({ x: e.clientX, y: e.clientY });
    },
    [rotateAmplitude, scaleOnHover]
  );

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)");
    setIsHovering(false);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  return (
    <div
      className="relative inline-block cursor-pointer"
      style={{ width: containerWidth, height: containerHeight }}
    >
      <div
        ref={cardRef}
        className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl transition-transform duration-200 ease-out"
        style={{ transform }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
      >
        <img
          src={imageSrc}
          alt={altText}
          className="object-cover rounded-xl"
          style={{ width: imageWidth, height: imageHeight }}
        />

        {/* Overlay Content */}
        {displayOverlayContent && overlayContent && (
          <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-xl">
            <div className="p-4 text-white w-full">{overlayContent}</div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && isHovering && captionText && (
        <div
          className="fixed z-50 px-3 py-1.5 bg-black/80 text-white text-sm rounded-lg pointer-events-none backdrop-blur-sm"
          style={{
            left: tooltipPos.x + 15,
            top: tooltipPos.y + 15,
          }}
        >
          {captionText}
        </div>
      )}
    </div>
  );
};

export default TiltedCard;
