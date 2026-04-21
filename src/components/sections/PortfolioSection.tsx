"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { Project, Certificate, TechStack } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FadeContent from "@/components/reactbits/FadeContent";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";
import {
  ExternalLink, Github, Globe, Star, GitFork, Eye, Code2,
  X, Trophy, Calendar, Building2, Award, Layers, ChevronRight
} from "lucide-react";

// â”€â”€ Tech badge palette â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const techBadgeColors = [
  "bg-blue-500/15 text-blue-300 border-blue-500/30",
  "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  "bg-violet-500/15 text-violet-300 border-violet-500/30",
  "bg-amber-500/15 text-amber-300 border-amber-500/30",
  "bg-rose-500/15 text-rose-300 border-rose-500/30",
  "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  "bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30",
];

// â”€â”€ GitHub Stats type â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
interface GitHubStats {
  stars: number;
  forks: number;
  watchers: number;
  language: string | null;
  issues: number;
  loading: boolean;
  error: boolean;
}

// â”€â”€ Extract owner/repo from github URL â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function parseGitHubRepo(url: string): string | null {
  try {
    const match = url.match(/github\.com\/([^/]+\/[^/]+?)(?:\.git)?(?:[/?#]|$)/);
    return match ? match[1] : null;
  } catch { return null; }
}

// â”€â”€ Project Detail Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [ghStats, setGhStats] = useState<GitHubStats>({ stars: 0, forks: 0, watchers: 0, language: null, issues: 0, loading: true, error: false });

  useEffect(() => {
    const repo = project.github_url ? parseGitHubRepo(project.github_url) : null;
    if (!repo) { setGhStats(s => ({ ...s, loading: false })); return; }

    fetch(`https://api.github.com/repos/${repo}`)
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          setGhStats({ stars: data.stargazers_count, forks: data.forks_count, watchers: data.subscribers_count, language: data.language, issues: data.open_issues_count, loading: false, error: false });
        } else {
          setGhStats(s => ({ ...s, loading: false, error: true }));
        }
      })
      .catch(() => setGhStats(s => ({ ...s, loading: false, error: true })));
  }, [project.github_url]);

  const techs = project.technologies?.split(",").map(t => t.trim()).filter(Boolean) ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-[hsl(var(--gradient-to)/0.2)] dark:bg-[#080810]/95 bg-card/95 shadow-[0_0_60px_-8px_hsl(var(--gradient-to)/0.4)] backdrop-blur-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Browser chrome title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border/40 bg-muted/20 flex-shrink-0">
          <div className="flex gap-1.5">
            <button
              onClick={onClose}
              className="group w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="h-1.5 w-1.5 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <p className="flex-1 text-center text-xs font-mono text-muted-foreground pr-8 truncate">
            {project.category ? `${project.category} — ` : ""}{project.title}
          </p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {/* Image with GitHub Stats overlay */}
        <div className="aspect-video w-full overflow-hidden bg-black relative">
          <img
            src={project.image && project.image.trim() ? project.image : "/placeholder.png"}
            alt={project.title}
            className="w-full h-full object-cover opacity-90"
          />
          {project.github_url && project.show_github !== false && project.show_github !== 0 && (
            <div className="absolute inset-x-0 bottom-0 px-4 pb-4 pt-10 bg-gradient-to-t from-black via-black/80 to-transparent">
              {ghStats.loading ? (
                <div className="flex gap-2">
                  {[1,2,3,4].map(i => <div key={i} className="h-14 flex-1 rounded-xl bg-white/10 animate-pulse" />)}
                </div>
              ) : !ghStats.error && (
                <div className="flex gap-2">
                  <div className="flex flex-1 flex-col items-center gap-1 px-2 py-2.5 rounded-xl bg-[#1a1a2e] border border-amber-500/40">
                    <Star className="h-4 w-4 text-amber-400" />
                    <span className="text-sm font-bold text-amber-300 leading-none">{ghStats.stars}</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-1 px-2 py-2.5 rounded-xl bg-[#1a1a2e] border border-[hsl(var(--gradient-from)/0.5)]">
                    <GitFork className="h-4 w-4 text-[hsl(var(--gradient-from))]" />
                    <span className="text-sm font-bold text-[hsl(var(--gradient-from))] leading-none">{ghStats.forks}</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-1 px-2 py-2.5 rounded-xl bg-[#1a1a2e] border border-[hsl(var(--gradient-to)/0.5)]">
                    <Eye className="h-4 w-4 text-[hsl(var(--gradient-to))]" />
                    <span className="text-sm font-bold text-[hsl(var(--gradient-to))] leading-none">{ghStats.watchers}</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-1 px-2 py-2.5 rounded-xl bg-[#1a1a2e] border border-emerald-500/40">
                    <Code2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300 leading-none text-center truncate w-full text-center">{ghStats.language || "—"}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* Title + category */}
          <div>
            {project.category && (
              <span className="text-[11px] font-mono text-[hsl(var(--gradient-to)/0.7)] uppercase tracking-widest">{project.category}</span>
            )}
            <h3 className="text-xl font-bold text-foreground mt-1">{project.title}</h3>
          </div>

          {/* Description */}
          <p className="text-sm text-foreground/70 leading-relaxed">{project.description}</p>

          {/* Tech Stack */}
          {techs.length > 0 && (
            <div>
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" /> Tech Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {techs.map((tech, i) => (
                  <span key={i} className={`text-[11px] px-2.5 py-1 rounded-full border font-medium ${techBadgeColors[i % techBadgeColors.length]}`}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            {project.github_url && project.show_github !== false && project.show_github !== 0 && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[hsl(var(--gradient-from)/0.2)] dark:bg-white/5 bg-foreground/5 dark:hover:bg-white/10 hover:bg-foreground/10 text-foreground text-sm font-medium transition-all hover:border-[hsl(var(--gradient-from)/0.4)]">
                <Github className="h-4 w-4" /> View Code
              </a>
            )}
            {project.live_url && project.show_demo !== false && project.show_demo !== 0 && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[hsl(var(--gradient-to))] hover:opacity-90 text-white text-sm font-medium transition-all shadow-[0_0_20px_-4px_hsl(var(--gradient-to)/0.5)]">
                <Globe className="h-4 w-4" /> Live Demo
              </a>
            )}
          </div>
        </div>
        </div>{/* end scrollable */}
      </div>
    </div>
  );
}

// â”€â”€ Certificate Detail Modal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CertModal({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  const url = cert.credential_url || cert.credentialUrl;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl border border-amber-500/20 dark:bg-[#080810]/95 bg-card/95 shadow-[0_0_60px_-8px_rgba(245,158,11,0.3)] backdrop-blur-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Browser chrome title bar */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-amber-500/10 bg-muted/20 flex-shrink-0">
          <div className="flex gap-1.5">
            <button
              onClick={onClose}
              className="group w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 flex items-center justify-center transition-colors"
              aria-label="Close"
            >
              <X className="h-1.5 w-1.5 text-red-900 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
          </div>
          <p className="flex-1 text-center text-xs font-mono text-muted-foreground pr-8 truncate">
            {cert.issuer} — {cert.title}
          </p>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cert.image && (
          <div className="aspect-video w-full overflow-hidden bg-black">
            <img src={cert.image} alt={cert.title} className="w-full h-full object-contain" />
          </div>
        )}

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Award className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{cert.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Building2 className="h-3 w-3" /><span>{cert.issuer}</span>
                <span>Â·</span>
                <Calendar className="h-3 w-3" /><span>{cert.date}</span>
              </div>
            </div>
          </div>

          {cert.description && (
            <p className="text-sm text-foreground/70 leading-relaxed">{cert.description}</p>
          )}

          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-medium transition-all shadow-[0_0_20px_-4px_rgba(245,158,11,0.4)]">
              <ExternalLink className="h-4 w-4" /> View Credential
            </a>
          )}
        </div>
        </div>{/* end scrollable */}
      </div>
    </div>
  );
}

export function PortfolioSection() {
  const trackingRef = useVisitorTracking("portfolio");
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [techStack, setTechStack] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  useEffect(() => {
    Promise.all([api.getProjects(), api.getCertificates(), api.getTechStack()])
      .then(([p, c, t]) => { setProjects(p); setCertificates(c); setTechStack(t); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") { setSelectedProject(null); setSelectedCert(null); } };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (loading) {
    return (
      <section id="portfolio" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/5 rounded w-48 mx-auto" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 rounded-xl" />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const techByCategory = techStack.reduce<Record<string, TechStack[]>>((acc, item) => {
    const cat = item.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const dotColors = ["bg-emerald-500","bg-violet-500","bg-amber-500","bg-cyan-500","bg-rose-500","bg-fuchsia-500","bg-blue-500"];

  return (
    <section ref={trackingRef} id="portfolio" className="relative py-20">
      {/* Modals */}
      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
      {selectedCert && <CertModal cert={selectedCert} onClose={() => setSelectedCert(null)} />}

      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full bg-[hsl(var(--gradient-from)/0.05)] blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-[hsl(var(--gradient-to)/0.05)] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <FadeContent blur duration={800} initialOpacity={0}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              My <span className="text-[hsl(var(--gradient-from))]">Portfolio</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Showcasing my recent projects, certifications, and technical skills
            </p>
          </div>
        </FadeContent>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8 bg-white/5 border border-[hsl(var(--gradient-from)/0.15)] rounded-xl p-1">
            <TabsTrigger value="projects" className="rounded-lg text-xs data-[state=active]:bg-[hsl(var(--gradient-from))] data-[state=active]:text-white data-[state=active]:shadow-none text-muted-foreground">
              Projects
            </TabsTrigger>
            <TabsTrigger value="certificates" className="rounded-lg text-xs data-[state=active]:bg-[hsl(var(--gradient-from))] data-[state=active]:text-white data-[state=active]:shadow-none text-muted-foreground">
              Certificates
            </TabsTrigger>
            <TabsTrigger value="techstack" className="rounded-lg text-xs data-[state=active]:bg-[hsl(var(--gradient-from))] data-[state=active]:text-white data-[state=active]:shadow-none text-muted-foreground">
              Tech Stack
            </TabsTrigger>
          </TabsList>

          {/* â”€â”€ Projects â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {projects.map((project) => {
                const techs = project.technologies?.split(",").map(t => t.trim()).filter(Boolean) ?? [];
                return (
                  <FadeContent key={project.id} blur duration={600} initialOpacity={0}>
                    <div
                      className="group relative rounded-2xl border border-[hsl(var(--gradient-from)/0.15)] overflow-hidden flex flex-col h-full cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-[hsl(var(--gradient-to)/0.4)] hover:shadow-[0_0_30px_-6px_hsl(var(--gradient-to)/0.4)] dark:bg-[#0a0a14]/80 bg-card/80 backdrop-blur-sm"
                      onClick={() => setSelectedProject(project)}
                    >
                      {/* Hover glow top line */}
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gradient-to)/0.6)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      {/* Image */}
                      <div className="aspect-video overflow-hidden bg-black/50 relative">
                        <img
                          src={project.image && project.image.trim() ? project.image : "/placeholder.png"}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
                        />
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent opacity-70" />
                        {/* Category badge */}
                        {project.category && (
                          <span className="absolute top-3 left-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#1a1a2e] border border-[hsl(var(--gradient-from)/0.5)] text-[hsl(var(--gradient-from))] font-semibold shadow-lg">
                            {project.category}
                          </span>
                        )}
                        {project.featured && (
                          <span className="absolute top-3 right-3 text-[10px] font-mono px-2.5 py-1 rounded-full bg-amber-950 border border-amber-500/60 text-amber-300 font-semibold shadow-lg flex items-center gap-1">
                            <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" /> Featured
                          </span>
                        )}
                      </div>

                      {/* Body */}
                      <div className="flex flex-col flex-1 p-4 gap-3">
                        <div>
                          <h3 className="font-bold text-sm text-white group-hover:text-[hsl(var(--gradient-to))] transition-colors">{project.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{project.description}</p>
                        </div>

                        {/* Tech badges */}
                        <div className="flex flex-wrap gap-1.5">
                          {techs.slice(0, 4).map((tech, i) => (
                            <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${techBadgeColors[i % techBadgeColors.length]}`}>
                              {tech}
                            </span>
                          ))}
                          {techs.length > 4 && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-[hsl(var(--gradient-from)/0.12)] text-muted-foreground font-medium">
                              +{techs.length - 4}
                            </span>
                          )}
                        </div>

                        {/* Action row */}
                        <div className="flex items-center justify-between mt-auto pt-1 border-t border-[hsl(var(--gradient-from)/0.08)]">
                          <div className="flex gap-2">
                            {project.github_url && project.show_github !== false && project.show_github !== 0 && (
                              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="h-7 w-7 rounded-lg border border-[hsl(var(--gradient-from)/0.15)] bg-white/5 hover:bg-[hsl(var(--gradient-from)/0.1)] flex items-center justify-center transition-colors">
                                <Github className="h-3.5 w-3.5 text-muted-foreground" />
                              </a>
                            )}
                            {project.live_url && project.show_demo !== false && project.show_demo !== 0 && (
                              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()}
                                className="h-7 w-7 rounded-lg border border-[hsl(var(--gradient-from)/0.2)] bg-[hsl(var(--gradient-from)/0.1)] hover:bg-[hsl(var(--gradient-from)/0.2)] flex items-center justify-center transition-colors">
                                <Globe className="h-3.5 w-3.5 text-[hsl(var(--gradient-from))]" />
                              </a>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 group-hover:text-[hsl(var(--gradient-to)/0.6)] transition-colors">
                            Details <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </FadeContent>
                );
              })}
            </div>

            <div className="text-center mt-10">
              <a href="https://github.com/dzakal20" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-[hsl(var(--gradient-from)/0.25)] bg-[hsl(var(--gradient-from)/0.05)] hover:bg-[hsl(var(--gradient-from)/0.12)] text-black dark:text-white text-sm font-medium transition-all hover:border-[hsl(var(--gradient-from)/0.5)] hover:shadow-[0_0_20px_-4px_hsl(var(--gradient-from)/0.3)]">
                <Github className="h-4 w-4" />
                View All Projects on GitHub
              </a>
            </div>
          </TabsContent>

          {/* â”€â”€ Certificates â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <TabsContent value="certificates">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {certificates.map((cert) => (
                <FadeContent key={cert.id} blur duration={600} initialOpacity={0}>
                  <div
                    className="group relative rounded-2xl border border-[hsl(var(--gradient-from)/0.15)] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-500/30 hover:shadow-[0_0_30px_-6px_rgba(245,158,11,0.3)] dark:bg-[#0a0a14]/80 bg-card/80 backdrop-blur-sm"
                    onClick={() => setSelectedCert(cert)}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {cert.image ? (
                      <div className="aspect-video overflow-hidden bg-black/50 relative">
                        <img src={cert.image} alt={cert.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/30 to-transparent" />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-amber-950/50 to-orange-950/50 flex items-center justify-center border-b border-[hsl(var(--gradient-from)/0.08)]">
                        <Award className="h-12 w-12 text-amber-500/30" />
                      </div>
                    )}

                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors line-clamp-2">{cert.title}</h3>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Building2 className="h-3 w-3 text-amber-500/50" />
                        <span>{cert.issuer}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{cert.date}</span>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[hsl(var(--gradient-from)/0.08)] mt-2">
                        {(cert.credential_url || cert.credentialUrl) ? (
                          <a href={cert.credential_url || cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[11px] text-amber-400/70 hover:text-amber-400 transition-colors">
                            <ExternalLink className="h-3 w-3" /> Credential
                          </a>
                        ) : <span />}
                        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5 group-hover:text-amber-400/50 transition-colors">
                          Details <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </FadeContent>
              ))}
            </div>
          </TabsContent>

          {/* â”€â”€ Tech Stack â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <TabsContent value="techstack">
            <FadeContent blur duration={600} initialOpacity={0}>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
                {techStack.map((tech) => (
                  <div key={tech.id} className="group relative flex flex-col items-center justify-center gap-3 p-5 md:p-6 rounded-2xl border border-[hsl(var(--gradient-from)/0.12)] dark:bg-[#0a0a14]/80 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(var(--gradient-to)/0.3)] hover:shadow-[0_0_20px_-4px_hsl(var(--gradient-to)/0.3)] overflow-hidden">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gradient-to)/0.5)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    {tech.icon && (
                      <div className="w-12 h-12 md:w-14 md:h-14 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: tech.icon }} />
                    )}
                    <span className="text-xs font-medium text-center text-muted-foreground group-hover:text-foreground transition-colors leading-tight">{tech.name}</span>
                  </div>
                ))}
              </div>

              {Object.keys(techByCategory).length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                  {Object.entries(techByCategory).map(([category, items], i) => (
                    <div key={category} className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[hsl(var(--gradient-from)/0.15)] bg-[hsl(var(--gradient-from)/0.05)] backdrop-blur-sm">
                      <div className={`w-2 h-2 rounded-full ${dotColors[i % dotColors.length]}`} />
                      <span className="text-xs font-medium text-muted-foreground">{category}</span>
                      <span className="text-[10px] text-muted-foreground/60">({items.length})</span>
                    </div>
                  ))}
                </div>
              )}
            </FadeContent>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
