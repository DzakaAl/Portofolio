"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { AlertCircle, KeyRound, User, ArrowRight, Shield, Terminal, Eye, EyeOff } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await adminApi.login({ username, password });
      if (res.success && res.token) {
        localStorage.setItem("admin_token", res.token);
        onOpenChange(false);
        router.push("/admin");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      setUsername("");
      setPassword("");
      setError("");
    }
    onOpenChange(value);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden border-[hsl(var(--gradient-from)/0.35)] dark:bg-[#07070f] bg-card gap-0 shadow-[0_0_60px_-10px_hsl(var(--gradient-from)/0.4)]">
        {/* Corner accents */}
        <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-[hsl(var(--gradient-from)/0.7)] rounded-tl-sm pointer-events-none" />
        <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-[hsl(var(--gradient-from)/0.7)] rounded-tr-sm pointer-events-none" />
        <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-[hsl(var(--gradient-from)/0.7)] rounded-bl-sm pointer-events-none" />
        <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-[hsl(var(--gradient-from)/0.7)] rounded-br-sm pointer-events-none" />

        {/* Top glow line */}
        <div className="absolute inset-x-0 top-0 h-px bg-[hsl(var(--gradient-from)/0.6)]" />

        {/* Header */}
        <div className="relative px-6 pt-8 pb-5 border-b border-[hsl(var(--gradient-from)/0.12)]">
          {/* Ambient glow orb */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 rounded-full bg-[hsl(var(--gradient-from)/0.08)] blur-2xl pointer-events-none" />

          <div className="relative flex flex-col items-center gap-3">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-[hsl(var(--gradient-from)/0.5)] dark:text-white tracking-tight">Authentication</h2>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="px-6 py-6 space-y-4">
          {/* Username */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-mono text-[hsl(var(--gradient-from)/0.7)] uppercase tracking-widest">
              <span className="text-[hsl(var(--gradient-from)/0.4)]">//</span> Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--gradient-from)/0.5)]" />
              <Input
                id="login-username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                required
                minLength={3}
                autoComplete="username"
          className="pl-10 h-11 dark:bg-[hsl(var(--gradient-from)/0.05)] bg-background border-[hsl(var(--gradient-from)/0.2)] text-foreground placeholder:text-muted-foreground placeholder:font-mono focus-visible:border-[hsl(var(--gradient-from)/0.6)] focus-visible:ring-[hsl(var(--gradient-from)/0.2)] focus-visible:bg-background rounded-xl font-mono transition-all"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-[10px] font-mono text-[hsl(var(--gradient-from)/0.7)] uppercase tracking-widest">
              <span className="text-[hsl(var(--gradient-from)/0.4)]">//</span> Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--gradient-from)/0.5)]" />
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="current-password"
              className="pl-10 pr-10 h-11 dark:bg-[hsl(var(--gradient-from)/0.05)] bg-background border-[hsl(var(--gradient-from)/0.2)] text-foreground placeholder:text-muted-foreground focus-visible:border-[hsl(var(--gradient-from)/0.6)] focus-visible:ring-[hsl(var(--gradient-from)/0.2)] focus-visible:bg-background rounded-xl font-mono transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--gradient-from)/0.5)] hover:text-[hsl(var(--gradient-from))] transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-sm p-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs">ERR: {error}</span>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-11 gap-2 bg-[hsl(var(--gradient-from))] hover:bg-[hsl(var(--gradient-from)/0.85)] text-white shadow-[0_0_24px_-4px_hsl(var(--gradient-from)/0.6)] transition-all rounded-xl font-mono tracking-wide border-0"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span className="text-sm">LOADING...</span>
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm">LOGIN</span>
              </>
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
