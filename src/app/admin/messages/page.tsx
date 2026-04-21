"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import type { Message } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Trash2,
  Loader2,
  Mail,
  Clock,
  User,
  MessageSquare,
  Inbox,
  Reply,
} from "lucide-react";

export default function AdminMessagesPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    try {
      const data = await adminApi.getMessages();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      await adminApi.deleteMessage(id);
      toast({ title: "Success", description: "Message deleted" });
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete",
        variant: "destructive",
      });
    }
  };

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
          <MessageSquare className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-muted-foreground text-sm">
            {messages.length} messages from contact form
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No messages yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Messages from your contact form will appear here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message List */}
          <div className="lg:col-span-1">
            <ScrollArea className="h-[600px] rounded-2xl border border-border/50 bg-card">
              <div className="p-2 space-y-0.5">
                {messages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id;
                  return (
                    <button
                      key={msg.id}
                      onClick={() => setSelectedMessage(msg)}
                      className={`w-full text-left p-3 rounded-xl transition-all ${
                        isSelected
                          ? "bg-[hsl(var(--gradient-from))] text-white shadow-[0_0_20px_-4px_hsl(var(--gradient-from)/0.4)]"
                          : "hover:bg-accent/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isSelected ? "bg-white/20" : "bg-primary/10"
                        }`}>
                          <User className={`h-3.5 w-3.5 ${isSelected ? "text-white" : "text-primary"}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-sm truncate block">
                            {msg.name}
                          </span>
                          <p className={`text-xs truncate mt-0.5 ${isSelected ? "text-white/70" : "text-muted-foreground"}`}>
                            {msg.message}
                          </p>
                        </div>
                      </div>
                      <p className={`text-[10px] mt-1.5 pl-10 ${isSelected ? "text-white/50" : "text-muted-foreground/60"}`}>
                        {new Date(msg.created_at || "").toLocaleDateString()}
                      </p>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[hsl(var(--gradient-from)/0.12)] flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{selectedMessage.name}</p>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <Mail className="h-3 w-3" />
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10 hover:border-red-500/30"
                      onClick={() =>
                        selectedMessage.id && handleDelete(selectedMessage.id)
                      }
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <Separator className="bg-border/50" />

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(
                      selectedMessage.created_at || ""
                    ).toLocaleString()}
                  </div>

                  <div className="p-4 rounded-xl bg-muted/40 border border-border/30">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>

                  <Button
                    asChild
                    className="gap-2 rounded-xl bg-[hsl(var(--gradient-from))] text-white hover:bg-[hsl(var(--gradient-from)/0.85)] shadow-[0_0_20px_-4px_hsl(var(--gradient-from)/0.4)]"
                  >
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: Message from Portfolio&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for reaching out.%0D%0A%0D%0A`}
                    >
                      <Reply className="h-4 w-4" />
                      Reply via Email
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border/50">
                <CardContent className="py-16 text-center">
                  <div className="mx-auto w-16 h-16 rounded-2xl bg-muted/60 flex items-center justify-center mb-4">
                    <MessageSquare className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Select a message to view
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Click on any message from the list
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
