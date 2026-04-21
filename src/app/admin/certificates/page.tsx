"use client";

import { useEffect, useState } from "react";
import { api, adminApi } from "@/lib/api";
import type { Certificate } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Plus, Pencil, Trash2, Loader2, ExternalLink, Award, GripVertical } from "lucide-react";
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

const emptyCert: Partial<Certificate> = {
  title: "",
  issuer: "",
  date: "",
  description: "",
  image: "",
  credential_url: "",
  display_order: 0,
};

function SortableCertCard({
  cert,
  onEdit,
  onDelete,
}: {
  cert: Certificate;
  onEdit: (c: Certificate) => void;
  onDelete: (id: number) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cert.id! });
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
          {cert.image ? (
            <img src={cert.image} alt={cert.title} className="w-16 h-12 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-16 h-12 rounded-xl bg-muted/60 flex items-center justify-center flex-shrink-0">
              <Award className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{cert.title}</h3>
            <p className="text-sm text-muted-foreground">{cert.issuer} &middot; {cert.date}</p>
            {(cert.credential_url || cert.credentialUrl) && (
              <a href={cert.credential_url || cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-0.5">
                <ExternalLink className="h-3 w-3" />
                View Credential
              </a>
            )}
          </div>
          <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => onEdit(cert)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-500/10 hover:border-red-500/30" onClick={() => cert.id && onDelete(cert.id)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminCertificatesPage() {
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Certificate>>(emptyCert);
  const [isEditing, setIsEditing] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const fetchCerts = async () => {
    try {
      const data = await api.getCertificates();
      setCertificates(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCerts(); }, []);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = certificates.findIndex((c) => c.id === active.id);
    const newIndex = certificates.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(certificates, oldIndex, newIndex);
    setCertificates(reordered);
    try {
      await adminApi.reorderCertificates(reordered.map((c, i) => ({ id: c.id!, display_order: i })));
    } catch {
      toast({ title: "Error", description: "Failed to save order", variant: "destructive" });
      fetchCerts();
    }
  };

  const openCreate = () => {
    setEditing({ ...emptyCert });
    setIsEditing(false);
    setDialogOpen(true);
  };

  const openEdit = (cert: Certificate) => {
    setEditing({ ...cert, credential_url: cert.credential_url || cert.credentialUrl });
    setIsEditing(true);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!editing.title || !editing.issuer || !editing.date) {
      toast({ title: "Validation Error", description: "Title, issuer, and date are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (isEditing && editing.id) {
        await adminApi.updateCertificate(editing.id, editing);
        toast({ title: "Success", description: "Certificate updated" });
      } else {
        await adminApi.createCertificate({ ...editing, display_order: certificates.length });
        toast({ title: "Success", description: "Certificate created" });
      }
      setDialogOpen(false);
      fetchCerts();
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this certificate?")) return;
    try {
      await adminApi.deleteCertificate(id);
      toast({ title: "Success", description: "Certificate deleted" });
      fetchCerts();
    } catch (err) {
      toast({ title: "Error", description: err instanceof Error ? err.message : "Failed to delete", variant: "destructive" });
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[hsl(var(--gradient-from))]">
            <Award className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Certificates</h1>
            <p className="text-muted-foreground text-sm">{certificates.length} credentials &mdash; drag to reorder</p>
          </div>
        </div>
        <Button onClick={openCreate} className="gap-2 rounded-xl bg-[hsl(var(--gradient-from))] text-white hover:bg-[hsl(var(--gradient-from)/0.85)] shadow-[0_0_20px_-4px_hsl(var(--gradient-from)/0.4)]">
          <Plus className="h-4 w-4" />
          Add Certificate
        </Button>
      </div>

      <div className="grid gap-3">
        {certificates.length === 0 && (
          <Card className="border-border/50">
            <CardContent className="py-12 text-center text-muted-foreground">No certificates yet.</CardContent>
          </Card>
        )}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={certificates.map((c) => c.id!)} strategy={verticalListSortingStrategy}>
            {certificates.map((cert) => (
              <SortableCertCard key={cert.id} cert={cert} onEdit={openEdit} onDelete={handleDelete} />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] border-border/50">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Certificate" : "Create Certificate"}</DialogTitle>
          </DialogHeader>
          <div className="p-6 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Certificate Image</Label>
              <ImageUpload value={editing.image} onChange={(url) => setEditing({ ...editing, image: url })} label="Upload Certificate Image" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Title *</Label>
              <Input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="h-10 rounded-xl" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Issuer *</Label>
                <Input value={editing.issuer || ""} onChange={(e) => setEditing({ ...editing, issuer: e.target.value })} className="h-10 rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Date *</Label>
                <Input value={editing.date || ""} onChange={(e) => setEditing({ ...editing, date: e.target.value })} placeholder="e.g. November 2024" className="h-10 rounded-xl" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Credential URL</Label>
              <Input value={editing.credential_url || ""} onChange={(e) => setEditing({ ...editing, credential_url: e.target.value })} className="h-10 rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</Label>
              <Textarea value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="rounded-xl" />
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