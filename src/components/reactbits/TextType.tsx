"use client";

import React, { useEffect, useState, useCallback } from "react";

interface TextTypeProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
  cursorBlinkDuration?: number;
  className?: string;
}

const TextType: React.FC<TextTypeProps> = ({
  texts,
  typingSpeed = 75,
  deletingSpeed = 50,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = "_",
  cursorBlinkDuration = 0.5,
  className = "",
}) => {
  const [displayed, setDisplayed] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [cursorVisible, setCursorVisible] = useState(true);

  // Cursor blink
  useEffect(() => {
    if (!showCursor) return;
    const interval = setInterval(() => {
      setCursorVisible((v) => !v);
    }, cursorBlinkDuration * 1000);
    return () => clearInterval(interval);
  }, [showCursor, cursorBlinkDuration]);

  const tick = useCallback(() => {
    const currentText = texts[textIndex] || "";

    if (!isDeleting) {
      // Typing
      if (charIndex < currentText.length) {
        setDisplayed(currentText.substring(0, charIndex + 1));
        setCharIndex((c) => c + 1);
      } else {
        // Pause before deleting
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    } else {
      // Deleting
      if (charIndex > 0) {
        setDisplayed(currentText.substring(0, charIndex - 1));
        setCharIndex((c) => c - 1);
      } else {
        setIsDeleting(false);
        setTextIndex((t) => (t + 1) % texts.length);
      }
    }
  }, [charIndex, isDeleting, textIndex, texts, pauseDuration]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return (
    <span className={className}>
      {displayed}
      {showCursor && (
        <span
          style={{ opacity: cursorVisible ? 1 : 0 }}
          className="transition-opacity"
        >
          {cursorCharacter}
        </span>
      )}
    </span>
  );
};

export default TextType;
