"use client";

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { WelcomeSection } from "@/components/sections/WelcomeSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { ChatRoom } from "@/components/sections/ChatRoom";
import { ContactSection } from "@/components/sections/ContactSection";
import CosmicBackground from "@/components/reactbits/CosmicBackground";
import { LoadingScreen } from "@/components/LoadingScreen";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <LoadingScreen onComplete={() => setLoaded(true)} />
      <main
        className="min-h-screen"
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease-in",
        }}
      >
      <Navbar />
      <WelcomeSection />

      {/* Shared cosmic canvas spanning About → Contact */}
      <div className="relative">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <CosmicBackground overlayOpacity={0.2} />
        </div>
        <AboutSection />
        <PortfolioSection />
        <ChatRoom />
        <ContactSection />
      </div>

      {/* Footer */}
      <footer className="relative py-8 border-t border-divider text-center text-sm text-text-secondary overflow-hidden">
        {/* Animated background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute w-[400px] h-[400px] -left-[200px] -bottom-[200px] rounded-full bg-primary/8 sm:blur-[80px] blur-[20px] sm:animate-float-orb" />
          <div className="absolute w-[350px] h-[350px] -right-[175px] -bottom-[175px] rounded-full bg-[hsl(var(--gradient-to))]/8 sm:blur-[80px] blur-[20px] sm:animate-float-orb" style={{ animationDelay: '4s' }} />
          <div className="absolute w-[250px] h-[250px] left-1/2 -translate-x-1/2 -bottom-[125px] rounded-full bg-info/8 sm:blur-[60px] blur-[16px] sm:animate-float-orb" style={{ animationDelay: '8s' }} />
          {/* Subtle dot grid */}
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--primary) / 0.06) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>
        <p className="relative z-10">&copy; {new Date().getFullYear()} M. Dzaka Al Fikri. Built with React, TypeScript, and Tailwind CSS.</p>
      </footer>
    </main>
    </>
  );
}