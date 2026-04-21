"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import type { HeroContent } from "@/types";
import DarkVeil from "@/components/reactbits/DarkVeil";
import ProfileCard from "@/components/reactbits/ProfileCard";
import { Github, Linkedin, Instagram, Mail, Download, ChevronDown } from "lucide-react";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";

export function WelcomeSection() {
  const trackingRef = useVisitorTracking("hero");
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [loading, setLoading] = useState(true);

  // Typing animation state
  const [currentTitle, setCurrentTitle] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    api
      .getHero()
      .then(setHero)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Build titles array from hero data
  const titles = useMemo(() => {
    if (!hero?.title) return ["Developer"];
    return hero.title.split("&").map((t) => t.trim());
  }, [hero?.title]);

  // Typing animation effect
  useEffect(() => {
    if (!titles.length) return;
    const currentWord = titles[currentTitle];
    const timeout = setTimeout(
      () => {
        if (!isDeleting && displayText !== currentWord) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else if (isDeleting && displayText !== "") {
          setDisplayText(currentWord.slice(0, displayText.length - 1));
        } else if (!isDeleting && displayText === currentWord) {
          setTimeout(() => setIsDeleting(true), 1500);
        } else if (isDeleting && displayText === "") {
          setIsDeleting(false);
          setCurrentTitle((prev) => (prev + 1) % titles.length);
        }
      },
      isDeleting ? 50 : 150
    );
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentTitle, titles]);

  const scrollToNext = useCallback(() => {
    document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const scrollToProjects = useCallback(() => {
    document.querySelector("#portfolio")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const downloadCV = useCallback(() => {
    if (!hero?.cv_url) return;
    const link = document.createElement("a");
    link.href = hero.cv_url;
    link.download = "CV_M_Dzaka_Al_Fikri.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [hero?.cv_url]);

  const filteredBio = useMemo(() => {
    if (!hero?.bio) return "";
    return hero.bio
      .replace(
        "I'm a Bangkit Academy graduate currently pursuing my degree in Informatics at Ahmad Dahlan University (UAD). My journey in technology started with a passion for solving real-world problems through code and data.",
        ""
      )
      .trim();
  }, [hero?.bio]);

  if (loading) {
    return (
      <section id="welcome" className="relative min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </section>
    );
  }

  if (!hero) return null;

  return (
    <section
      ref={trackingRef}
      id="welcome"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <DarkVeil
          hueShift={0}
          noiseIntensity={0}
          speed={1.6}
          warpAmount={5}
          scanlineIntensity={0}
          scanlineFrequency={0}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 text-foreground drop-shadow-sm">
                Hi, I&apos;m{" "}
                <span className="text-[hsl(var(--gradient-from))] text-justify">
                  {hero.name}
                </span>
              </h1>

              {/* Typing animation */}
              <div className="h-16 flex items-center justify-center lg:justify-start">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold drop-shadow-sm text-heading-accent">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </h2>
              </div>
            </motion.div>

            {/* Bio */}
            {filteredBio && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg mb-8 max-w-2xl drop-shadow-sm text-text-secondary text-justify"
              >
                {filteredBio}
              </motion.p>
            )}

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[hsl(var(--gradient-from))] hover:opacity-90 text-white px-8 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-[0_0_24px_-4px_hsl(var(--gradient-from)/0.5)] transition-all justify-center"
                onClick={scrollToProjects}
              >
                View My Work
                <ChevronDown size={20} />
              </motion.button>

              {hero.cv_url && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border border-[hsl(var(--gradient-from)/0.5)] text-[hsl(var(--gradient-from))] hover:bg-[hsl(var(--gradient-from)/0.1)] px-8 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all justify-center backdrop-blur-sm"
                  onClick={downloadCV}
                >
                  Download CV
                  <Download size={20} />
                </motion.button>
              )}
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex gap-6 justify-center lg:justify-start"
            >
              {hero.github && (
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  href={hero.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Github size={24} />
                </motion.a>
              )}
              {hero.instagram && (
                <motion.a
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  href={hero.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Instagram size={24} />
                </motion.a>
              )}
              {hero.linkedin && (
                <motion.a
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  href={hero.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin size={24} />
                </motion.a>
              )}
              {hero.email && (
                <motion.a
                  whileHover={{ scale: 1.2, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  href={`mailto:${hero.email}`}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail size={24} />
                </motion.a>
              )}
            </motion.div>
          </motion.div>

          {/* Right Content — 3D ProfileCard */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <ProfileCard
              avatarUrl={hero.avatar || ""}
              miniAvatarUrl={hero.avatar || ""}
              name={hero.name}
              title={hero.title}
              handle={hero.email?.split("@")[0] || ""}
              status="Online"
              contactText="Contact Me"
              showUserInfo={false}
              enableTilt={true}
              showBehindGradient
              onContactClick={() => {
                document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 cursor-pointer"
        onClick={scrollToNext}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.div>
    </section>
  );
}
