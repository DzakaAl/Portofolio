"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { ContactInfo } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import FadeContent from "@/components/reactbits/FadeContent";
import { Send, CheckCircle, AlertCircle, Mail, MapPin, Github, Instagram, Linkedin, Twitter } from "lucide-react";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";

export function ContactSection() {
  const trackingRef = useVisitorTracking("contact");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);

  useEffect(() => {
    api.getContactInfo().then(setContactInfo).catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      await api.sendMessage({ name: form.name, email: form.email, message: `[${form.subject}] ${form.message}` });
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  const socials = [
    { href: contactInfo?.github, icon: Github, label: "GitHub" },
    { href: contactInfo?.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: contactInfo?.instagram, icon: Instagram, label: "Instagram" },
    { href: contactInfo?.twitter, icon: Twitter, label: "Twitter" },
  ].filter((s) => s.href);

  return (
    <section ref={trackingRef} id="contact" className="relative py-20">
      {/* Ambient glow orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -right-32 w-[500px] h-[500px] rounded-full bg-[hsl(var(--gradient-from)/0.06)] blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-[400px] h-[400px] rounded-full bg-[hsl(var(--gradient-to)/0.06)] blur-3xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto px-4">
        {/* Section Title */}
        <FadeContent blur duration={800} initialOpacity={0}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Get In <span className="text-[hsl(var(--gradient-from))]">Touch</span>
            </h2>
            <p className="text-muted-foreground text-sm md:text-base">
              Have a question or want to work together? I&apos;d love to hear from you!
            </p>
          </div>
        </FadeContent>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Contact Info */}
          <FadeContent blur duration={800} initialOpacity={0}>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Let&apos;s Connect</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  I&apos;m always interested in new opportunities and collaborations.
                  Feel free to reach out through the form or any of the channels below.
                </p>
              </div>

              {/* Email */}
              {contactInfo?.email && (
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-[hsl(var(--gradient-from)/0.2)] dark:bg-[#0a0a14]/80 bg-card/80 backdrop-blur-sm shadow-[0_0_20px_-6px_hsl(var(--gradient-from)/0.15)]">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--gradient-from))] flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_-4px_hsl(var(--gradient-from)/0.6)]">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Email</p>
                    <p className="text-sm font-medium text-foreground/80">{contactInfo.email}</p>
                  </div>
                </div>
              )}

              {/* Location */}
              {contactInfo?.location && (
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-[hsl(var(--gradient-from)/0.15)] dark:bg-[#0a0a14]/80 bg-card/80 backdrop-blur-sm shadow-[0_0_20px_-6px_hsl(var(--gradient-from)/0.1)]">
                  <div className="w-10 h-10 rounded-xl bg-rose-700 flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_-4px_rgba(225,29,72,0.5)]">
                    <MapPin className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-medium">Location</p>
                    <p className="text-sm font-medium text-foreground/80">{contactInfo.location}</p>
                  </div>
                </div>
              )}

              {/* Social Icons */}
              {socials.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3 text-muted-foreground">Follow Me</p>
                  <div className="flex gap-3">
                    {socials.map((s) => (
                      <a
                        key={s.label}
                        href={s.href!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="w-10 h-10 rounded-xl flex items-center justify-center transition-all dark:bg-white/5 bg-foreground/5 hover:bg-[hsl(var(--gradient-from)/0.15)] text-muted-foreground hover:text-[hsl(var(--gradient-from))] border border-[hsl(var(--gradient-from)/0.15)] hover:border-[hsl(var(--gradient-from)/0.5)] shadow-[0_0_12px_-4px_hsl(var(--gradient-from)/0.2)]"
                      >
                        <s.icon className="h-5 w-5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FadeContent>

          {/* Right — Form */}
          <FadeContent blur duration={1000} initialOpacity={0}>
            <div className="relative rounded-2xl border border-[hsl(var(--gradient-to)/0.2)] p-6 md:p-8 dark:bg-[#0a0a14]/80 bg-card/80 backdrop-blur-sm overflow-hidden shadow-[0_0_40px_-10px_hsl(var(--gradient-to)/0.2)]">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--gradient-to)/0.5)] to-transparent" />
              <h3 className="text-lg font-bold mb-6 text-foreground">Send a Message</h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs font-medium">Name</Label>
                    <Input
                      id="name"
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      placeholder="Your name"
                      required
                      minLength={2}
                      maxLength={100}
                      className="rounded-xl dark:bg-white/5 bg-background border-[hsl(var(--gradient-from)/0.2)] text-foreground placeholder:text-muted-foreground focus-visible:border-[hsl(var(--gradient-from)/0.5)] focus-visible:ring-[hsl(var(--gradient-from)/0.3)]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-medium">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com"
                      required
                      className="rounded-xl dark:bg-white/5 bg-background border-[hsl(var(--gradient-from)/0.2)] text-foreground placeholder:text-muted-foreground focus-visible:border-[hsl(var(--gradient-from)/0.5)] focus-visible:ring-[hsl(var(--gradient-from)/0.3)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-xs font-medium">Subject</Label>
                  <Input
                    id="subject"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    placeholder="Project Inquiry"
                    className="rounded-xl dark:bg-white/5 bg-background border-[hsl(var(--gradient-from)/0.2)] text-foreground placeholder:text-muted-foreground focus-visible:border-[hsl(var(--gradient-from)/0.5)] focus-visible:ring-[hsl(var(--gradient-from)/0.3)]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-xs font-medium">Message</Label>
                  <Textarea
                    id="message"
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    placeholder="Write your message here..."
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={5}
                    className="rounded-xl dark:bg-white/5 bg-background border-[hsl(var(--gradient-from)/0.2)] text-foreground placeholder:text-muted-foreground focus-visible:border-[hsl(var(--gradient-from)/0.5)] focus-visible:ring-[hsl(var(--gradient-from)/0.3)]"
                  />
                </div>

                {status === "success" && (
                  <div className="flex items-center gap-2 text-success text-sm">
                    <CheckCircle className="h-4 w-4" />
                    Message sent successfully!
                  </div>
                )}

                {status === "error" && (
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {errorMsg || "Failed to send message"}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full gap-2 rounded-xl bg-[hsl(var(--gradient-from))] hover:opacity-90 text-white shadow-[0_0_20px_-4px_hsl(var(--gradient-from)/0.5)] transition-all"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </FadeContent>
        </div>
      </div>
    </section>
  );
}
