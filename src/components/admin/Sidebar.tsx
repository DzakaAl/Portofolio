"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileEdit,
  FolderKanban,
  Award,
  Layers,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Users,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const navGroups = [
  {
    label: "Management",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Content", href: "/admin/content", icon: FileEdit },
      { label: "Projects", href: "/admin/projects", icon: FolderKanban },
      { label: "Certificates", href: "/admin/certificates", icon: Award },
      { label: "Tech Stack", href: "/admin/tech-stack", icon: Layers },
      { label: "Messages", href: "/admin/messages", icon: MessageSquare },
    ],
  },
  {
    label: "Analytics",
    items: [
      { label: "Visitors", href: "/admin/visitors", icon: Users },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.replace("/");
  };

  const navContent = (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div className="px-5 py-4 border-b border-border/50">
        <Link href="/admin" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
          <div>
            <span className="text-sm font-bold text-[hsl(var(--gradient-from))]">Admin Panel</span>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Portfolio Management</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold px-3 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative",
                      isActive
                        ? "bg-[hsl(var(--gradient-from))] text-white shadow-[0_0_20px_-4px_hsl(var(--gradient-from)/0.4)]"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 flex-shrink-0",
                        isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isActive && <ChevronRight className="h-3.5 w-3.5 text-white/70" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-3 pt-2 border-t border-border/50 space-y-1">
        <button
          onClick={() => setPreviewOpen(true)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all"
        >
          <Monitor className="h-4 w-4" />
          <span className="flex-1 text-left">View Site</span>
          <ExternalLink className="h-3 w-3 opacity-50" />
        </button>
        <div className="flex items-center justify-between px-1 py-1">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-red-500 hover:bg-red-500/10 gap-2 rounded-xl"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] border-r border-border/50 bg-card/50 backdrop-blur-sm h-screen sticky top-0 shrink-0">
        {navContent}
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border/50 px-4 h-14 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[hsl(var(--gradient-from))] flex items-center justify-center">
            <span className="text-white font-bold text-xs">A</span>
          </div>
          <span className="text-sm font-bold text-[hsl(var(--gradient-from))]">Admin</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-xl"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 w-[260px] h-full bg-card border-r border-border/50 z-50 shadow-2xl">
            {navContent}
          </aside>
        </div>
      )}

      {/* Site Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl w-full h-[85vh] flex flex-col p-0 gap-0 border-border/50 overflow-hidden">
          <DialogHeader className="px-4 py-3 border-b border-border/50 flex-shrink-0">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-xs font-mono text-muted-foreground flex-1 text-center pr-10">
                localhost:3000 — Portfolio Preview
              </DialogTitle>
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                Open
              </a>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">
            <iframe
              src="/"
              className="w-full h-full border-0"
              title="Portfolio Preview"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
