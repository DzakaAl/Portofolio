"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginDialog } from "@/components/LoginDialog";

const sections = [
  { label: "Home", href: "#welcome" },
  { label: "About", href: "#about" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Chat", href: "#chat" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "dark:bg-black/70 bg-background/90 backdrop-blur-md border-b border-[hsl(var(--gradient-from)/0.2)] shadow-[0_4px_30px_-8px_hsl(var(--gradient-from)/0.2)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#welcome" className="text-xl font-bold text-[hsl(var(--gradient-from))]">
          Portfolio
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {sections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
            >
              {s.label}
            </a>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-foreground/5"
            onClick={() => setLoginOpen(true)}
          >
            Login
          </Button>
          <ThemeToggle />
        </div>

        {/* Mobile toggle */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden dark:bg-black/80 bg-background/95 backdrop-blur-md border-b border-[hsl(var(--gradient-from)/0.15)] px-4 pb-4">
          {sections.map((s) => (
            <a
              key={s.href}
              href={s.href}
              onClick={() => setMobileOpen(false)}
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {s.label}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false);
              setLoginOpen(true);
            }}
            className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            Login
          </button>
        </div>
      )}
    </nav>

    <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
