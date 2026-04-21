"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useSession, signIn } from "next-auth/react";
import { connectSocket, disconnectSocket } from "@/lib/socket";
import type { ChatMessage } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, Wifi, WifiOff } from "lucide-react";
import FadeContent from "@/components/reactbits/FadeContent";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";

export function ChatRoom() {
  const trackingRef = useVisitorTracking("chat");
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<ReturnType<typeof connectSocket> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeUser = useMemo(
    () =>
      session?.user
        ? {
            name: session.user.name || "Anonymous",
            email: session.user.email || "",
            image: session.user.image || "",
          }
        : null,
    [session?.user]
  );

  // Always connect so visitors can read chat history/messages without login
  useEffect(() => {
    const socket = connectSocket();
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
    });
    socket.on("disconnect", () => setConnected(false));

    socket.on("chat:message", (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("chat:history", (history: ChatMessage[]) => {
      setMessages(history);
    });

    return () => {
      socket.off("chat:message");
      socket.off("chat:history");
      socket.off("connect");
      socket.off("disconnect");
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket || !socket.connected) return;

    if (activeUser) {
      socket.emit("chat:join", {
        name: activeUser.name,
        email: activeUser.email,
        image: activeUser.image,
      });
    } else {
      socket.emit("chat:leave");
    }
  }, [connected, activeUser]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !socketRef.current) return;
    if (!activeUser) {
      signIn("google");
      return;
    }

    const msg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      text: input.trim(),
      user: { name: activeUser.name, email: activeUser.email, image: activeUser.image },
      timestamp: new Date().toISOString(),
    };
    socketRef.current.emit("chat:message", msg);
    setInput("");
    inputRef.current?.focus();
  }, [input, activeUser]);

  const timeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <section ref={trackingRef} id="chat" className="relative py-20">
      <div className="relative z-10 max-w-6xl mx-auto px-4">

        <FadeContent blur duration={800} initialOpacity={0}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Chat <span className="text-[hsl(var(--gradient-from))]">Room</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Join the conversation and connect with me in real-time
            </p>
          </div>
        </FadeContent>

        {/* Terminal-style chat container */}
        <div className="relative rounded-2xl overflow-hidden border border-[hsl(var(--gradient-from)/0.2)] shadow-[0_0_40px_-8px_hsl(var(--gradient-from)/0.25)] dark:bg-black/60 bg-card/90 backdrop-blur-xl">

          {/* Glow line top */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gradient-from)/0.7)] to-transparent" />

          {/* Header bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-[hsl(var(--gradient-from)/0.1)] dark:bg-black/40 bg-foreground/5">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 block" />
                <span className="w-3 h-3 rounded-full bg-amber-400/80 block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 block" />
              </div>
              <span className="font-mono text-xs text-[hsl(var(--gradient-from)/0.6)] ml-2 hidden sm:block">
                chat@portfolio ~ {messages.length} messages
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {connected ? (
                <>
                  <Wifi className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-[11px] font-mono text-emerald-400">CONNECTED</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse block" />
                </>
              ) : (
                <>
                  <WifiOff className="h-3.5 w-3.5 text-rose-400" />
                  <span className="text-[11px] font-mono text-rose-400">OFFLINE</span>
                </>
              )}
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="h-[420px]" ref={scrollRef}>
            <div className="p-5 space-y-4">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-16 h-16 rounded-2xl border border-[hsl(var(--gradient-from)/0.2)] bg-[hsl(var(--gradient-from)/0.05)] flex items-center justify-center">
                    <MessageCircle className="h-7 w-7 text-[hsl(var(--gradient-from)/0.4)]" />
                  </div>
                  <p className="text-xs text-[hsl(var(--gradient-from)/0.4)] font-mono">[ No messages yet. Start the conversation. ]</p>
                </div>
              )}

              {messages.map((msg, idx) => {
                const isOwner = msg.user.email?.toLowerCase().includes("dzakaal10@gmail") ||
                  msg.user.name?.toLowerCase().includes("dzaka al");
                const isMe = activeUser && msg.user.email === activeUser.email;
                // Owner always right, others always left
                const isRight = isOwner;
                const prevMsg = messages[idx - 1];
                const isSameUser = prevMsg && prevMsg.user.email === msg.user.email;

                return (
                  <div key={msg.id} className={`flex gap-3 ${isRight ? "flex-row-reverse" : "flex-row"}`}>
                    {/* Avatar */}
                    <div className="flex-shrink-0 w-8">
                      {!isSameUser && (
                        <div className={`ring-2 ${isRight ? "ring-[hsl(var(--gradient-to)/0.5)]" : "ring-[hsl(var(--gradient-from)/0.3)]"} rounded-full`}>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.user.image} alt={msg.user.name} />
                            <AvatarFallback className={`text-[10px] font-bold ${isRight ? "bg-[hsl(var(--gradient-to)/0.25)] text-[hsl(var(--gradient-to))]" : "bg-[hsl(var(--gradient-from)/0.25)] text-[hsl(var(--gradient-from))]"}`}>
                              {msg.user.name?.charAt(0)?.toUpperCase() || "?"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>

                    {/* Bubble */}
                    <div className={`flex flex-col max-w-[72%] ${isRight ? "items-end" : "items-start"}`}>
                      {!isSameUser && (
                        <div className={`flex items-center gap-2 mb-1 ${isRight ? "flex-row-reverse" : ""}`}>
                          <span className={`text-[11px] font-semibold ${isRight ? "text-[hsl(var(--gradient-to))]" : "text-[hsl(var(--gradient-from))]"}`}>
                            {isMe ? "You" : msg.user.name}{isOwner && " 👑"}
                          </span>
                          <span className="text-[10px] text-muted-foreground/50">{timeAgo(msg.timestamp)}</span>
                        </div>
                      )}
                      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                        isRight
                          ? "bg-[hsl(var(--gradient-to)/0.85)] text-white border border-[hsl(var(--gradient-to)/0.3)] rounded-tr-sm shadow-[0_0_12px_-2px_hsl(var(--gradient-to)/0.35)]"
                          : "bg-[hsl(var(--gradient-from)/0.1)] text-foreground border border-[hsl(var(--gradient-from)/0.2)] rounded-tl-sm shadow-[0_0_12px_-2px_hsl(var(--gradient-from)/0.15)]"
                      }`}>
                        {msg.text}
                      </div>
                      {isSameUser && (
                        <span className="text-[9px] text-muted-foreground/40 mt-0.5">{timeAgo(msg.timestamp)}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          {/* Input area */}
          <div className="border-t border-[hsl(var(--gradient-from)/0.1)] dark:bg-black/50 bg-foreground/5">
            {!activeUser ? (
              <div className="flex flex-col items-center py-8 gap-4 px-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Sign in to join the conversation</p>
                </div>
                <button
                  onClick={() => { signIn("google"); }}
                  className="group relative flex items-center gap-3 px-6 py-3 rounded-xl border border-[hsl(var(--gradient-from)/0.3)] bg-[hsl(var(--gradient-from)/0.05)] hover:bg-[hsl(var(--gradient-from)/0.1)] text-black text-sm font-medium transition-all duration-200 hover:border-[hsl(var(--gradient-from)/0.6)] hover:shadow-[0_0_20px_-4px_hsl(var(--gradient-from)/0.4)] dark:text-white"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Continue with Google
                </button>
              </div>
            ) : (
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-7 w-7 ring-2 ring-[hsl(var(--gradient-to)/0.4)] flex-shrink-0">
                    <AvatarImage src={activeUser.image} alt={activeUser.name} />
                    <AvatarFallback className="text-[10px] bg-[hsl(var(--gradient-to)/0.25)] text-[hsl(var(--gradient-to))] font-bold">
                      {activeUser.name?.charAt(0)?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <form
                    onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                    className="flex flex-1 gap-2"
                  >
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={connected ? "Type a message..." : "Connecting..."}
                      className="h-10 rounded-xl dark:bg-white/5 bg-background border-[hsl(var(--gradient-from)/0.2)] text-foreground placeholder:text-muted-foreground text-sm focus-visible:ring-[hsl(var(--gradient-from)/0.4)] focus-visible:border-[hsl(var(--gradient-from)/0.5)]"
                      disabled={!connected}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!connected || !input.trim()}
                      className="h-10 w-10 rounded-xl bg-[hsl(var(--gradient-from))] hover:opacity-90 text-white border-0 shadow-[0_0_16px_-2px_hsl(var(--gradient-from)/0.5)] disabled:opacity-30 disabled:shadow-none flex-shrink-0 transition-all duration-200"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
                <p className="text-[10px] font-mono text-cyan-500/30 mt-2 pl-10">
                  Logged in as <span className="text-cyan-400/50">{activeUser.name}</span>
                </p>
              </div>
            )}
          </div>

          {/* Glow line bottom */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />
        </div>
      </div>
    </section>
  );
}
