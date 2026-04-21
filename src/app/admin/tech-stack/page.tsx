"use client";

import { useEffect, useState } from "react";
import { api, adminApi } from "@/lib/api";
import type { TechStack } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Loader2, Layers, Search, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const emptyTech: Partial<TechStack> = {
  name: "",
  category: "",
  icon: "",
  display_order: 0,
};

function SortableTechCard({
  tech,
  onEdit,
  onDelete,
}: {
  tech: TechStack;
  onEdit: (t: TechStack) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tech.id! });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };
  return (
    <div ref={setNodeRef} style={style}>
      <Card className="border-border/50 hover:border-border transition-all group">
        <CardContent className="p-4 flex items-center gap-3">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 rounded-lg text-muted-foreground/40 hover:text-muted-foreground hover:bg-accent/60 transition-all flex-shrink-0 touch-none"
            aria-label="Drag to reorder"
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-muted/60 flex items-center justify-center p-1.5">
            <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: tech.icon }} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-semibold truncate block">{tech.name}</span>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 rounded-full mt-0.5">{tech.category}</Badge>
          </div>
          <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => onEdit(tech)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => tech.id && onDelete(tech.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminTechStackPage() {
  const { toast } = useToast();
  const [techStack, setTechStack] = useState<TechStack[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<TechStack>>(emptyTech);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const fetchTech = async () => {
    try {
      const data = await api.getTechStack();
      setTechStack(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTech(); }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = techStack.findIndex((t) => t.id === active.id);
    const newIndex = techStack.findIndex((t) => t.id === over.id);
    const reordered = arrayMove(techStack, oldIndex, newIndex);
    setTechStack(reordered);
    try {
      await adminApi.reorderTechStack(reordered.map((t, i) => ({ id: t.id!, display_order: i })));
    } catch {
      toast({ title: "Error", description: "Failed to save order", variant: "destructive" });
      fetchTech();
    }
  };

  const openCreate = () => {
    setEditing({ ...emptyTech });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (tech: TechStack) => {
    setEditing({ ...tech });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing.name || !editing.category || !editing.icon) {
      toast({ title: "Validation Error", description: "Name, category, and icon are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (isEditing && editing.id) {
        await adminApi.updateTechStack(editing.id, editing);
        toast({ title: "Success", description: "Tech stack updated" });
      } else {
        await adminApi.createTechStack({ ...editing, display_order: techStack.length });
        toast({ title: "Success", description: "Tech stack created" });
      }
      setDialogOpen(false);
      fetchTech();
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this tech stack item?")) return;
    try {
      await adminApi.deleteTechStack(id);
      toast({ title: "Success", description: "Tech stack deleted" });
      fetchTech();
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete", variant: "destructive" });
    }
  };

  const categories = Array.from(new Set(techStack.map((t) => t.category || "Other")));
  const isFiltered = search.trim() !== "" || filterCategory !== "all";
  const filtered = techStack.filter((tech) => {
    const matchSearch = !search || tech.name.toLowerCase().includes(search.toLowerCase()) || tech.category.toLowerCase().includes(search.toLowerCase());
    const matchCategory = filterCategory === "all" || tech.category === filterCategory;
    return matchSearch && matchCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[hsl(var(--gradient-from))]">
            <Layers className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Tech Stack</h1>
            <p className="text-muted-foreground text-sm">
              {techStack.length} technologies {!isFiltered && <span>&mdash; drag to reorder</span>}
            </p>
          </div>
        </div>
        <Button onClick={openCreate} className="gap-2 rounded-xl bg-[hsl(var(--gradient-from))] text-white hover:bg-[hsl(var(--gradient-from)/0.85)] shadow-[0_0_20px_-4px_hsl(var(--gradient-from)/0.4)]">
          <Plus className="h-4 w-4" />
          Add Tech
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search technologies..." className="pl-10 h-10 rounded-xl bg-muted/50 border-border" />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant={filterCategory === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterCategory("all")} className="rounded-full text-xs h-8">All</Button>
          {categories.map((cat) => (
            <Button key={cat} variant={filterCategory === cat ? "default" : "outline"} size="sm" onClick={() => setFilterCategory(cat)} className="rounded-full text-xs h-8">{cat}</Button>
          ))}
        </div>
      </div>

      {isFiltered && (
        <p className="text-xs text-muted-foreground -mt-2">
          Clear search and filters to drag-and-drop reorder.
        </p>
      )}

      {filtered.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="py-12 text-center text-muted-foreground">
            {isFiltered ? "No matching technologies found." : "No tech stack items yet."}
          </CardContent>
        </Card>
      ) : isFiltered ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((tech) => (
            <Card key={tech.id} className="border-border/50 hover:border-border transition-all group">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-muted/60 flex items-center justify-center p-1.5">
                  <div className="w-full h-full [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: tech.icon }} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold truncate block">{tech.name}</span>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 rounded-full mt-0.5">{tech.category}</Badge>
                </div>
                <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg" onClick={() => openEdit(tech)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => tech.id && handleDelete(tech.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-3">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={techStack.map((t) => t.id!)} strategy={verticalListSortingStrategy}>
              {techStack.map((tech) => (
                <SortableTechCard key={tech.id} tech={tech} onEdit={openEdit} onDelete={handleDelete} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg border-border/50">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Tech Stack" : "Add Tech Stack"}</DialogTitle>
          </DialogHeader>
          <div className="p-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name *</Label>
                <Input value={editing.name || ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} placeholder="e.g. React" className="h-10 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category *</Label>
                <Input value={editing.category || ""} onChange={(e) => setEditing({ ...editing, category: e.target.value })} placeholder="e.g. Frontend" className="h-10 rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Icon (SVG) *</Label>
              <Textarea value={editing.icon || ""} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} rows={4} placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">...</svg>' className="rounded-xl font-mono text-xs" />
              {editing.icon && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50 mt-1">
                  <span className="text-xs text-muted-foreground">Preview:</span>
                  <div className="w-8 h-8 [&>svg]:w-full [&>svg]:h-full" dangerouslySetInnerHTML={{ __html: editing.icon }} />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2 rounded-xl bg-[hsl(var(--gradient-from))] text-white hover:bg-[hsl(var(--gradient-from)/0.85)]">
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