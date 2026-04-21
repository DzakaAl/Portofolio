"use client";

import { useEffect, useState } from "react";
import { api, adminApi } from "@/lib/api";
import type { HeroContent, AboutContent } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Save, Loader2, FileEdit, Sparkles, UserCircle } from "lucide-react";

export default function AdminContentPage() {
  const { toast } = useToast();
  const [hero, setHero] = useState<HeroContent | null>(null);
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([api.getHero(), api.getAbout()])
      .then(([h, a]) => {
        setHero(h);
        setAbout(a);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const saveHero = async () => {
    if (!hero) return;
    setSaving(true);
    try {
      await adminApi.updateHero(hero);
      toast({ title: "Success", description: "Hero content updated" });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const saveAbout = async () => {
    if (!about) return;
    setSaving(true);
    try {
      await adminApi.updateAbout(about.id || 1, about);
      toast({ title: "Success", description: "About content updated" });
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
          <FileEdit className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Edit Content</h1>
          <p className="text-muted-foreground text-sm">
            Manage your hero and about sections
          </p>
        </div>
      </div>

      <Tabs defaultValue="hero">
        <TabsList className="rounded-xl bg-muted/60 p-1">
          <TabsTrigger value="hero" className="rounded-lg gap-2">
            <Sparkles className="h-3.5 w-3.5" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="about" className="rounded-lg gap-2">
            <UserCircle className="h-3.5 w-3.5" />
            About
          </TabsTrigger>
        </TabsList>

        {/* Hero Tab */}
        <TabsContent value="hero">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {hero && (
                <>
                  {/* Avatar Upload */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Avatar
                    </Label>
                    <ImageUpload
                      value={hero.avatar}
                      onChange={(url) => setHero({ ...hero, avatar: url })}
                      label="Upload Avatar"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</Label>
                      <Input
                        value={hero.name}
                        onChange={(e) => setHero({ ...hero, name: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</Label>
                      <Input
                        value={hero.title}
                        onChange={(e) => setHero({ ...hero, title: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</Label>
                      <Input
                        value={hero.email}
                        onChange={(e) => setHero({ ...hero, email: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">CV URL</Label>
                      <Input
                        value={hero.cv_url || ""}
                        onChange={(e) => setHero({ ...hero, cv_url: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">GitHub URL</Label>
                      <Input
                        value={hero.github || ""}
                        onChange={(e) => setHero({ ...hero, github: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">LinkedIn URL</Label>
                      <Input
                        value={hero.linkedin || ""}
                        onChange={(e) => setHero({ ...hero, linkedin: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Instagram URL</Label>
                      <Input
                        value={hero.instagram || ""}
                        onChange={(e) => setHero({ ...hero, instagram: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Bio</Label>
                    <Textarea
                      value={hero.bio}
                      onChange={(e) => setHero({ ...hero, bio: e.target.value })}
                      rows={4}
                      className="rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={saveHero}
                    disabled={saving}
                    className="gap-2 rounded-xl bg-[hsl(var(--gradient-from))] text-white hover:bg-[hsl(var(--gradient-from)/0.85)] shadow-[0_0_20px_-4px_hsl(var(--gradient-from)/0.4)]"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save Hero
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Tab */}
        <TabsContent value="about">
          <Card className="border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-base">About Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {about && (
                <>
                  {/* Profile Image Upload */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Profile Image
                    </Label>
                    <ImageUpload
                      value={about.profile_image}
                      onChange={(url) => setAbout({ ...about, profile_image: url })}
                      label="Upload Profile Image"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</Label>
                      <Input
                        value={about.name || ""}
                        onChange={(e) => setAbout({ ...about, name: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</Label>
                      <Input
                        value={about.role || ""}
                        onChange={(e) => setAbout({ ...about, role: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Subtitle</Label>
                      <Input
                        value={about.subtitle || ""}
                        onChange={(e) => setAbout({ ...about, subtitle: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</Label>
                      <Input
                        value={about.location || ""}
                        onChange={(e) => setAbout({ ...about, location: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Certification</Label>
                      <Input
                        value={about.certification || ""}
                        onChange={(e) => setAbout({ ...about, certification: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Availability</Label>
                      <Input
                        value={about.availability || ""}
                        onChange={(e) => setAbout({ ...about, availability: e.target.value })}
                        className="h-10 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Summary 1</Label>
                    <Textarea
                      value={about.summary1 || ""}
                      onChange={(e) => setAbout({ ...about, summary1: e.target.value })}
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Summary 2</Label>
                    <Textarea
                      value={about.summary2 || ""}
                      onChange={(e) => setAbout({ ...about, summary2: e.target.value })}
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Summary 3</Label>
                    <Textarea
                      value={about.summary3 || ""}
                      onChange={(e) => setAbout({ ...about, summary3: e.target.value })}
                      rows={3}
                      className="rounded-xl"
                    />
                  </div>
                  <Button
                    onClick={saveAbout}
                    disabled={saving}
                    className="gap-2 rounded-xl bg-[hsl(var(--gradient-from))] text-white hover:bg-[hsl(var(--gradient-from)/0.85)] shadow-[0_0_20px_-4px_hsl(var(--gradient-from)/0.4)]"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save About
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
