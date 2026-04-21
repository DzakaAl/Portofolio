"use client";

import { useEffect, useState, useMemo } from "react";
import { adminApi } from "@/lib/api";
import type { VisitorStat, VisitorSummary } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Users,
  Eye,
  CalendarDays,
  TrendingUp,
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Bot,
  Search,
  Loader2,
  BarChart3,
  Clock,
  Layers,
} from "lucide-react";
import CountUp from "@/components/reactbits/CountUp";

// ── helpers ──────────────────────────────────────────────────────────────────
function formatDate(str: string) {
  if (!str) return "—";
  try {
    return new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(str));
  } catch {
    return str;
  }
}

function DeviceIcon({ device }: { device: string }) {
  const d = device.toLowerCase();
  if (d === "mobile") return <Smartphone className="h-3.5 w-3.5" />;
  if (d === "tablet") return <Tablet className="h-3.5 w-3.5" />;
  return <Monitor className="h-3.5 w-3.5" />;
}

function browserColor(browser: string) {
  const map: Record<string, string> = {
    chrome: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
    firefox: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
    safari: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    edge: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20",
    opera: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  };
  return map[browser.toLowerCase()] ?? "bg-muted/60 text-muted-foreground border-border/50";
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminVisitorsPage() {
  const [stats, setStats] = useState<VisitorStat[]>([]);
  const [summary, setSummary] = useState<VisitorSummary | null>(null);
  const [componentViews, setComponentViews] = useState<{ component_name: string; views: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deviceFilter, setDeviceFilter] = useState<string>("all");

  useEffect(() => {
    Promise.all([
      adminApi.getVisitorStats(),
      adminApi.getVisitorSummary(),
      adminApi.getComponentViews(),
    ])
      .then(([s, sum, cv]) => {
        setStats(s);
        setSummary(sum);
        setComponentViews(cv);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = stats;
    if (deviceFilter !== "all") {
      list = list.filter((v) => v.device.toLowerCase() === deviceFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.session_id.toLowerCase().includes(q) ||
          v.ipAddress?.toLowerCase().includes(q) ||
          v.browser.toLowerCase().includes(q) ||
          v.os.toLowerCase().includes(q)
      );
    }
    return list;
  }, [stats, search, deviceFilter]);

  // Device breakdown
  const deviceBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    stats.forEach((v) => {
      const d = v.device.toLowerCase();
      counts[d] = (counts[d] ?? 0) + 1;
    });
    return counts;
  }, [stats]);

  // Browser breakdown
  const browserBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    stats.forEach((v) => {
      counts[v.browser] = (counts[v.browser] ?? 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [stats]);

  const maxCv = Math.max(...componentViews.map((c) => c.views), 1);
  const total = stats.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-[hsl(var(--gradient-from))]">
          <Users className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Visitors</h1>
          <p className="text-muted-foreground text-sm">
            Detailed analytics — last 50 unique sessions
          </p>
        </div>
      </div>

      {/* Summary cards */}
      {summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Visitors", value: summary.totalVisitors, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
            { label: "Total Views", value: summary.totalViews, icon: Eye, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Today", value: summary.todayVisitors, icon: CalendarDays, color: "text-violet-500", bg: "bg-violet-500/10" },
            { label: "This Week", value: summary.weekVisitors, icon: TrendingUp, color: "text-amber-500", bg: "bg-amber-500/10" },
          ].map((item) => (
            <Card key={item.label} className="border-border/50">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${item.bg} flex-shrink-0`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-xl font-bold leading-none mt-0.5">
                    <CountUp to={item.value} duration={1200} />
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Component Views */}
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[hsl(var(--gradient-from))]" />
              Section Views
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {componentViews.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No data yet</p>
            )}
            {componentViews.map((cv) => (
              <div key={cv.component_name} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="capitalize font-medium">{cv.component_name}</span>
                  <span className="text-muted-foreground">{cv.views.toLocaleString()}</span>
                </div>
                <div className="h-2 rounded-full bg-muted/50 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[hsl(var(--gradient-from))] transition-all duration-700"
                    style={{ width: `${Math.round((cv.views / maxCv) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Device + Browser Breakdown */}
        <div className="space-y-4">
          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Monitor className="h-4 w-4 text-[hsl(var(--gradient-from))]" />
                Device Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3 flex-wrap">
              {Object.entries(deviceBreakdown).map(([device, count]) => (
                <button
                  key={device}
                  onClick={() => setDeviceFilter(deviceFilter === device ? "all" : device)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                    deviceFilter === device
                      ? "bg-[hsl(var(--gradient-from))] text-white border-transparent"
                      : "border-border/50 text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <DeviceIcon device={device} />
                  <span className="capitalize">{device}</span>
                  <span className={deviceFilter === device ? "text-white/70" : "text-muted-foreground"}>
                    ({count})
                  </span>
                </button>
              ))}
              {deviceFilter !== "all" && (
                <button
                  onClick={() => setDeviceFilter("all")}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  Clear
                </button>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Globe className="h-4 w-4 text-[hsl(var(--gradient-from))]" />
                Browser Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              {browserBreakdown.map(([browser, count]) => (
                <span
                  key={browser}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${browserColor(browser)}`}
                >
                  {browser}
                  <span className="opacity-60 ml-0.5">{count}</span>
                </span>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Visitor Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4 text-[hsl(var(--gradient-from))]" />
              Sessions
              <span className="text-muted-foreground font-normal text-xs">
                ({filtered.length}/{total})
              </span>
            </CardTitle>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search IP, browser, session…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 rounded-xl text-xs bg-muted/40 border-border/50"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border/50 bg-muted/30">
                  <th className="text-left py-2.5 px-4 text-muted-foreground font-medium">Session</th>
                  <th className="text-left py-2.5 px-4 text-muted-foreground font-medium">Device</th>
                  <th className="text-left py-2.5 px-4 text-muted-foreground font-medium">Browser / OS</th>
                  <th className="text-left py-2.5 px-4 text-muted-foreground font-medium">IP Address</th>
                  <th className="text-right py-2.5 px-4 text-muted-foreground font-medium">Views</th>
                  <th className="text-left py-2.5 px-4 text-muted-foreground font-medium">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Last Visit
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-muted-foreground">
                      No visitors found
                    </td>
                  </tr>
                )}
                {filtered.map((v) => (
                  <tr
                    key={v.session_id}
                    className="border-b border-border/30 hover:bg-muted/20 transition-colors"
                  >
                    {/* Session */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <code className="font-mono text-[10px] opacity-70 truncate max-w-[80px]">
                          {v.session_id?.slice(0, 8)}…
                        </code>
                        {v.isBot && (
                          <Badge variant="outline" className="gap-0.5 text-[9px] px-1 py-0 h-4 rounded-full bg-red-500/10 text-red-500 border-red-500/20">
                            <Bot className="h-2.5 w-2.5" /> bot
                          </Badge>
                        )}
                      </div>
                    </td>
                    {/* Device */}
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <DeviceIcon device={v.device} />
                        <span className="capitalize">{v.device}</span>
                      </span>
                    </td>
                    {/* Browser / OS */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-0.5">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium border w-fit ${browserColor(v.browser)}`}>
                          {v.browser}
                        </span>
                        <span className="text-muted-foreground text-[10px]">{v.os}</span>
                      </div>
                    </td>
                    {/* IP */}
                    <td className="py-3 px-4">
                      <code className="text-[10px] font-mono text-muted-foreground">
                        {v.ipAddress || "—"}
                      </code>
                    </td>
                    {/* Views */}
                    <td className="py-3 px-4 text-right">
                      <span className="font-semibold text-foreground">{v.totalComponentViews}</span>
                      <span className="text-muted-foreground ml-1">/ {v.visitCount} req</span>
                    </td>
                    {/* Last visit */}
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {formatDate(v.lastVisit)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Components viewed expand — shown as tags per row below */}
          {filtered.some((v) => v.componentsViewed?.length > 0) && (
            <div className="px-4 pb-4 pt-2 space-y-2">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                Sections visited per session
              </p>
              {filtered.map(
                (v) =>
                  v.componentsViewed?.length > 0 && (
                    <div key={v.session_id + "-cv"} className="flex items-center gap-2 flex-wrap">
                      <code className="text-[10px] font-mono text-muted-foreground/60 w-16 truncate shrink-0">
                        {v.session_id?.slice(0, 6)}…
                      </code>
                      {v.componentsViewed.map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-[hsl(var(--gradient-from)/0.1)] border border-[hsl(var(--gradient-from)/0.2)] text-[hsl(var(--gradient-from))] capitalize"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
