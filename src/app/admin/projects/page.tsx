"use client";

import { useEffect, useState } from "react";
import { api, adminApi } from "@/lib/api";
import type { Project } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, Loader2, ExternalLink, Github, FolderKanban, Star, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const emptyProject: Partial<Project> = {
  title: "",
  description: "",
  category: "",
  image: "",
  technologies: "",
  github_url: "",
  live_url: "",
  featured: false,
  show_github: true,
  show_demo: true,
  display_order: 0,
};

function SortableProjectCard({
  project,
  onEdit,
  onDelete,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (id: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: project.id! });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className="border-border/50 hover:border-border transition-all group overflow-hidden">
        <CardContent className="p-4 flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded-lg text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent/60 transition-all flex-shrink-0 touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>

          {project.image && project.image.trim() ? (
            <img
              src={project.image}
              alt={project.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-muted/60 flex items-center justify-center flex-shrink-0">
              <FolderKanban className="h-6 w-6 text-muted-foreground" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold truncate">{project.title}</h3>
              {project.featured && (
                <Badge variant="secondary" className="gap-1 text-[10px] px-1.5 py-0 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  Featured
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate mt-0.5">
              {project.description}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {project.category && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 rounded-full">
                  {project.category}
                </Badge>
              )}
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <Github className="h-3.5 w-3.5" />
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>

          <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg"
              onClick={() => onEdit(project)}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10 hover:border-red-500/30"
              onClick={() => project.id && onDelete(project.id)}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project>>(emptyProject);
  const [isEditing, setIsEditing] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = projects.findIndex((p) => p.id === active.id);
    const newIndex = projects.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(projects, oldIndex, newIndex);

    setProjects(reordered);

    try {
      await adminApi.reorderProjects(
        reordered.map((p, i) => ({ id: p.id!, display_order: i }))
      );
    } catch (err) {
      toast({ title: "Error", description: "Failed to save order", variant: "destructive" });
      fetchProjects();
    }
  };

  const openCreate = () => {
    setEditingProject({ ...emptyProject });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (project: Project) => {
    setEditingProject({ ...project });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editingProject.title || !editingProject.description || !editingProject.technologies) {
      toast({
        title: "Validation Error",
        description: "Title, description, and technologies are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      if (isEditing && editingProject.id) {
        await adminApi.updateProject(editingProject.id, editingProject);
        toast({ title: "Success", description: "Project updated" });
      } else {
        await adminApi.createProject({ ...editingProject, display_order: projects.length });
        toast({ title: "Success", description: "Project created" });
      }
      setDialogOpen(false);
      fetchProjects();
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await adminApi.deleteProject(id);
      toast({ title: "Success", description: "Project deleted" });
      fetchProjects();
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[hsl(var(--gradient-from))]">
            <FolderKanban className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Projects</h1>
            <p className="text-muted-foreground text-sm">
              {projects.length} projects &mdash; drag to reorder
            </p>
          </div>
        </div>
        <Button onClick={openCreate} className="gap-2 rounded-xl bg-[hsl(var(--gradient-from))] text-white hover:bg-[hsl(var(--gradient-from)/0.85)] shadow-[0_0_20px_-4px_hsl(var(--gradient-from)/0.4)]">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
      </div>

      {/* Projects List */}
      <div className="grid gap-3">
        {projects.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center text-muted-foreground">
              No projects yet. Click &ldquo;Add Project&rdquo; to create one.
            </CardContent>
          </Card>
        )}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={projects.map((p) => p.id!)} strategy={verticalListSortingStrategy}>
            {projects.map((project) => (
              <SortableProjectCard
                key={project.id}
                project={project}
                onEdit={openEdit}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] border-border/50">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Project" : "Create Project"}
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Project Image</Label>
              <ImageUpload
                value={editingProject.image}
                onChange={(url) => setEditingProject({ ...editingProject, image: url })}
                label="Upload Project Image"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title *</Label>
                <Input
                  value={editingProject.title || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, title: e.target.value })
                  }
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</Label>
                <Input
                  value={editingProject.category || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, category: e.target.value })
                  }
                  placeholder="e.g. Web Development"
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Technologies * (comma-separated)</Label>
                <Input
                  value={editingProject.technologies || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, technologies: e.target.value })
                  }
                  placeholder="React,TypeScript,Tailwind"
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">GitHub URL</Label>
                <Input
                  value={editingProject.github_url || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, github_url: e.target.value })
                  }
                  className="h-10 rounded-xl"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Live URL</Label>
                <Input
                  value={editingProject.live_url || ""}
                  onChange={(e) =>
                    setEditingProject({ ...editingProject, live_url: e.target.value })
                  }
                  className="h-10 rounded-xl"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
              <Switch
                checked={editingProject.featured || false}
                onCheckedChange={(checked) =>
                  setEditingProject({ ...editingProject, featured: checked })
                }
              />
              <div>
                <Label className="text-sm font-medium">Featured Project</Label>
                <p className="text-xs text-muted-foreground">Show this project prominently</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <Switch
                  checked={editingProject.show_github !== false}
                  onCheckedChange={(checked) =>
                    setEditingProject({ ...editingProject, show_github: checked })
                  }
                />
                <div>
                  <Label className="text-sm font-medium">Show GitHub Link</Label>
                  <p className="text-xs text-muted-foreground">Display on portfolio</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/40">
                <Switch
                  checked={editingProject.show_demo !== false}
                  onCheckedChange={(checked) =>
                    setEditingProject({ ...editingProject, show_demo: checked })
                  }
                />
                <div>
                  <Label className="text-sm font-medium">Show Demo Link</Label>
                  <p className="text-xs text-muted-foreground">Display on portfolio</p>
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description *</Label>
              <Textarea
                value={editingProject.description || ""}
                onChange={(e) =>
                  setEditingProject({ ...editingProject, description: e.target.value })
                }
                rows={4}
                className="rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="gap-2 rounded-xl bg-[hsl(var(--gradient-from))] text-white hover:bg-[hsl(var(--gradient-from)/0.85)]"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {isEditing ? "Update" : "Create"}
              </Button>
            </div>
          </div>{/* end scroll */}
        </DialogContent>
      </Dialog>
    </div>
  );
}