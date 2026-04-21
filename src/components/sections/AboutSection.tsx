"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AboutContent } from "@/types";
import FadeContent from "@/components/reactbits/FadeContent";
import CountUp from "@/components/reactbits/CountUp";
import { MapPin, Briefcase, GraduationCap, Award, CheckCircle, Code2 } from "lucide-react";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";

export function AboutSection() {
  const trackingRef = useVisitorTracking("about");
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    api
      .getAbout()
      .then(setAbout)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="about" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/5 rounded w-48 mx-auto" />
            <div className="h-4 bg-white/5 rounded w-full max-w-2xl mx-auto" />
          </div>
        </div>
      </section>
    );
  }

  if (!about) return null;

  return (
    <section ref={trackingRef} id="about" className="relative py-20">
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-[hsl(var(--gradient-from)/0.06)] blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] rounded-full bg-[hsl(var(--gradient-to)/0.06)] blur-3xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Section Title */}
        <FadeContent blur duration={800} initialOpacity={0}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              About <span className="text-[hsl(var(--gradient-from))]">Me</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Transforming ideas into intelligent solutions through code and creativity
            </p>
          </div>
        </FadeContent>

        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-stretch">
          {/* Left — Sidebar Profile Card */}
          <FadeContent blur duration={800} initialOpacity={0}>
            <div className="relative rounded-2xl border border-[hsl(var(--gradient-from)/0.2)] p-6 h-full flex flex-col dark:bg-[#0a0a14]/80 bg-card/80 backdrop-blur-sm overflow-hidden shadow-[0_0_40px_-10px_hsl(var(--gradient-from)/0.25)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gradient-from)/0.5)] to-transparent" />
              {/* Profile Image */}
              {about.profile_image && (
                <div className="w-full aspect-square max-w-[200px] mx-auto rounded-2xl overflow-hidden mb-4 border border-[hsl(var(--gradient-from)/0.3)]">
                  <img
                    src={about.profile_image}
                    alt={about.name || "Profile"}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Name & Role */}
              <div className="text-center mb-4">
                {about.name && (
                  <h3 className="text-lg font-bold text-foreground">{about.name}</h3>
                )}
                {about.role && (
                  <p className="text-sm font-medium text-emerald-400 flex items-center justify-center gap-1.5 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {about.role}
                  </p>
                )}
                {about.subtitle && (
                  <p className="text-xs text-muted-foreground mt-1">{about.subtitle}</p>
                )}
              </div>

              {/* Info items */}
              <div className="space-y-2.5 mb-4">
                {about.location && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 text-rose-400 flex-shrink-0" />
                    {about.location}
                  </div>
                )}
                {about.certification && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Award className="h-3.5 w-3.5 text-[hsl(var(--gradient-from))] flex-shrink-0" />
                    {about.certification}
                  </div>
                )}
                {about.availability && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    {about.availability}
                  </div>
                )}
              </div>

              {/* Experience — pushed into sidebar */}
              {about.experience && about.experience.length > 0 && (
                <div className="pt-4 border-t mb-4 border-[hsl(var(--gradient-from)/0.1)]">
                  <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
                    <Briefcase className="h-3.5 w-3.5 text-[hsl(var(--gradient-from))]" />
                    Experience
                  </h4>
                  <div className="space-y-2">
                    {about.experience.map((exp, i) => (
                      <div key={i} className="p-2.5 rounded-lg border dark:bg-white/3 bg-foreground/5 border-[hsl(var(--gradient-from)/0.12)]">
                        <p className="font-medium text-xs text-foreground/80">{exp.title}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {exp.company} &middot; {exp.period}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {about.education && about.education.length > 0 && (
                <div className="pt-4 border-t mb-4 border-[hsl(var(--gradient-from)/0.1)]">
                  <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
                    <GraduationCap className="h-3.5 w-3.5 text-[hsl(var(--gradient-to))]" />
                    Education
                  </h4>
                  <div className="space-y-2">
                    {about.education.map((edu, i) => (
                      <div key={i} className="p-2.5 rounded-lg border dark:bg-white/3 bg-foreground/5 border-[hsl(var(--gradient-from)/0.12)]">
                        <p className="font-medium text-xs text-foreground/80">{edu.degree}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {edu.institution} &middot; {edu.period}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {about.skills && about.skills.length > 0 && (
                <div className="pt-4 border-t mb-4 border-[hsl(var(--gradient-from)/0.1)]">
                  <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5 text-muted-foreground uppercase tracking-wider">
                    <Code2 className="h-3.5 w-3.5 text-[hsl(var(--gradient-from))]" />
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {about.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-medium px-2 py-1 rounded-full bg-[hsl(var(--gradient-from)/0.1)] text-[hsl(var(--gradient-from))] border border-[hsl(var(--gradient-from)/0.25)]"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Navigation */}
              <div className="pt-4 border-t border-[hsl(var(--gradient-from)/0.1)]">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Quick Navigation</p>
                <div className="flex gap-2">
                  <a href="#portfolio" className="flex-1 text-center text-xs font-medium px-3 py-2 rounded-lg bg-[hsl(var(--gradient-from))] text-white hover:opacity-90 transition-opacity shadow-[0_0_16px_-4px_hsl(var(--gradient-from)/0.6)]">
                    Projects
                  </a>
                  <a href="#contact" className="flex-1 text-center text-xs font-medium px-3 py-2 rounded-lg bg-[hsl(var(--gradient-from))] text-white hover:opacity-90 transition-opacity shadow-[0_0_16px_-4px_hsl(var(--gradient-from)/0.6)]">
                    Contact
                  </a>
                </div>
              </div>
            </div>
          </FadeContent>

          {/* Right — Single card with Summary + Strengths + Stats */}
          <FadeContent blur duration={1000} initialOpacity={0}>
            <div className="relative rounded-2xl border border-[hsl(var(--gradient-to)/0.2)] p-6 h-full flex flex-col dark:bg-[#0a0a14]/80 bg-card/80 backdrop-blur-sm overflow-hidden shadow-[0_0_40px_-10px_hsl(var(--gradient-to)/0.2)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gradient-to)/0.5)] to-transparent" />
              {/* Professional Summary */}
              <div className="mb-6">
                <h4 className="text-lg font-bold mb-4 flex items-center gap-2 text-foreground">
                  Professional Summary
                </h4>
                <div className="space-y-3 text-sm text-foreground/70 leading-relaxed text-justify">
                  {about.summary1 && <p>{about.summary1}</p>}
                  {about.summary2 && <p>{about.summary2}</p>}
                  {about.summary3 && <p>{about.summary3}</p>}
                </div>
              </div>

              {/* Stats — pushed to bottom */}
              {about.stats && about.stats.length > 0 && (
                <div className="pt-6 border-t mt-auto border-[hsl(var(--gradient-from)/0.1)]">
                  <h4 className="text-lg font-bold mb-4 text-foreground">Stats</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {about.stats.map((s, i) => (
                      <div
                        key={i}
                        className="relative p-4 rounded-xl text-center border border-[hsl(var(--gradient-from)/0.12)] dark:bg-white/3 bg-foreground/5 overflow-hidden group"
                      >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gradient-from)/0.4)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <p className="text-2xl font-bold text-foreground">
                          <CountUp
                            from={0}
                            to={parseInt(s.value) || 0}
                            duration={2}
                            separator=","
                          />
                          {s.value.replace(/\d+/g, '')}
                        </p>
                        <p className="text-xs mt-1 font-medium text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
}
