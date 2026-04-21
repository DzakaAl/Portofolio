"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api, adminApi } from "@/lib/api";
import type {
  VisitorSummary,
  Project,
  Certificate,
  Message,
  TechStack,
} from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CountUp from "@/components/reactbits/CountUp";
import {
  FolderKanban,
  Eye,
  Award,
  MessageSquare,
  Users,
  Activity,
  ArrowUpRight,
  BarChart3,
  Cpu,
  Mail,
  Clock,
  Zap,
  FileText,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [visitorSummary, setVisitorSummary] = useState<VisitorSummary | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certCount, setCertCount] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [techStack, setTechStack] = useState<TechStack[]>([]);
  const [componentViews, setComponentViews] = useState<{ component_name: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getVisitorSummary().catch(() => null),
      api.getProjects().catch(() => []),
      api.getCertificates().catch(() => []),
      adminApi.getMessages().catch(() => []),
      api.getTechStack().catch(() => []),
      adminApi.getComponentViews().catch(() => []),
    ])
      .then(([vs, projs, certs, msgs, ts, cv]) => {
        setVisitorSummary(vs);
        setProjects(projs as Project[]);
        setCertCount((certs as Certificate[]).length);
        setMessages(msgs as Message[]);
        setTechStack(ts as TechStack[]);
        setComponentViews(cv || []);
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: "Projects",
      value: projects.length,
      icon: FolderKanban,
      light: "bg-blue-500/10",
      color: "text-blue-500",
      href: "/admin/projects",
    },
    {
      title: "Visitors",
      value: visitorSummary?.totalVisitors || 0,
      icon: Users,
      light: "bg-emerald-500/10",
      color: "text-emerald-500",
      href: "/admin/visitors",
    },
    {
      title: "Certificates",
      value: certCount,
      icon: Award,
      light: "bg-purple-500/10",
      color: "text-purple-500",
      href: "/admin/certificates",
    },
    {
      title: "Messages",
      value: messages.length,
      icon: MessageSquare,
      light: "bg-orange-500/10",
      color: "text-orange-500",
      href: "/admin/messages",
    },
    {
      title: "Tech Stack",
      value: techStack.length,
      icon: Cpu,
      light: "bg-cyan-500/10",
      color: "text-cyan-500",
      href: "/admin/tech-stack",
    },
  ];

  const quickActions = [
    { label: "Projects", href: "/admin/projects", icon: FolderKanban, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Certificates", href: "/admin/certificates", icon: Award, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Messages", href: "/admin/messages", icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Visitors", href: "/admin/visitors", icon: BarChart3, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Content", href: "/admin/content", icon: FileText, color: "text-pink-500", bg: "bg-pink-500/10" },
    { label: "Tech Stack", href: "/admin/tech-stack", icon: Cpu, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  ];

  const recentMessages = messages.slice(0, 4);
  const recentProjects = [...projects].reverse().slice(0, 4);

  function timeAgo(dateStr?: string) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-48 bg-muted animate-pulse rounded-lg" />
          <div className="h-4 w-72 bg-muted animate-pulse rounded-lg mt-2" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-28 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-52 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-xl bg-[hsl(var(--gradient-from))]">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Overview of your portfolio analytics and content
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="border-border/50 hover:border-border transition-all hover:shadow-lg overflow-hidden group cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-xl ${stat.light} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className={`h-3.5 w-3.5 ${stat.color} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </div>
                <div className="text-2xl font-bold tabular-nums">
                  <CountUp from={0} to={stat.value} duration={1.8} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{stat.title}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="h-3.5 w-3.5" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <div className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-border/50 hover:border-border bg-card hover:bg-muted/30 transition-all group cursor-pointer">
                <div className={`p-2 rounded-xl ${action.bg} group-hover:scale-110 transition-transform`}>
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <span className="text-xs font-medium text-center">{action.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Messages + Recent Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Messages */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-base">
                <div className="p-1.5 rounded-lg bg-orange-500/10">
                  <MessageSquare className="h-4 w-4 text-orange-500" />
                </div>
                Recent Messages
              </CardTitle>
              <Link
                href="/admin/messages"
                className="text-xs text-muted-foreground hover:text-[hsl(var(--gradient-from))] flex items-center gap-1 transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentMessages.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Mail className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No messages yet
              </div>
            ) : (
              <div className="space-y-2">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{msg.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1 flex-shrink-0 mt-0.5">
                        <Clock className="h-3 w-3" />
                        {timeAgo(msg.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-base">
                <div className="p-1.5 rounded-lg bg-blue-500/10">
                  <FolderKanban className="h-4 w-4 text-blue-500" />
                </div>
                Recent Projects
              </CardTitle>
              <Link
                href="/admin/projects"
                className="text-xs text-muted-foreground hover:text-[hsl(var(--gradient-from))] flex items-center gap-1 transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentProjects.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <FolderKanban className="h-8 w-8 mx-auto mb-2 opacity-30" />
                No projects yet
              </div>
            ) : (
              <div className="space-y-2">
                {recentProjects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{proj.title}</p>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{proj.technologies}</p>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {proj.featured && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            Featured
                          </Badge>
                        )}
                        {proj.category && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            {proj.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics: Visitor Stats + Section Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitor Stats */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2.5 text-base">
                <div className="p-1.5 rounded-lg bg-blue-500/10">
                  <Eye className="h-4 w-4 text-blue-500" />
                </div>
                Visitor Statistics
              </CardTitle>
              <Link
                href="/admin/visitors"
                className="text-xs text-muted-foreground hover:text-[hsl(var(--gradient-from))] flex items-center gap-1 transition-colors"
              >
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {[
              { label: "Total Page Views", value: visitorSummary?.totalViews || 0, color: "text-blue-500" },
              { label: "Unique Visitors", value: visitorSummary?.totalVisitors || 0, color: "text-emerald-500" },
              { label: "Today's Visitors", value: visitorSummary?.todayVisitors || 0, color: "text-orange-500" },
              { label: "This Week", value: visitorSummary?.weekVisitors || 0, color: "text-purple-500" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`font-semibold text-sm tabular-nums ${item.color}`}>
                  <CountUp from={0} to={item.value} duration={1.8} />
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Section Views */}
        <Card className="border-border/50">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2.5 text-base">
              <div className="p-1.5 rounded-lg bg-purple-500/10">
                <BarChart3 className="h-4 w-4 text-purple-500" />
              </div>
              Section Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {componentViews.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No data available yet
                </p>
              ) : (
                componentViews.map((cv) => {
                  const maxViews = Math.max(...componentViews.map((c) => c.views), 1);
                  const pct = (cv.views / maxViews) * 100;
                  return (
                    <div key={cv.component_name}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="capitalize font-medium text-sm">{cv.component_name}</span>
                        <span className="text-muted-foreground text-xs tabular-nums">{cv.views} views</span>
                      </div>
                      <div className="w-full bg-muted/60 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-[hsl(var(--gradient-from))] h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
