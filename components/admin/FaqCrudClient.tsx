"use client";

import * as React from "react";
import { toast } from "sonner";
import { createFaqAction, deleteFaqAction } from "@/lib/actions/admin/faqs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { FaqItem } from "@/lib/queries/faqs";

interface FaqCrudClientProps {
  initialFaqs: FaqItem[];
}

export function FaqCrudClient({ initialFaqs }: FaqCrudClientProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleCreateFaq(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await createFaqAction(formData);
      if (res.success) {
        toast.success(res.message);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to create FAQ.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteFaq(id: string) {
    if (!confirm("Delete this FAQ item?")) return;
    try {
      const res = await deleteFaqAction(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to delete FAQ.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Frequently Asked Questions</h2>
          <p className="text-xs text-muted-foreground">Manage public FAQs and help center answers</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-xl gap-1.5 text-xs">
              <Plus className="size-4" />
              <span>Create FAQ</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="font-heading">Add FAQ Item</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateFaq} className="space-y-3.5 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Category</label>
                  <Input name="category" required defaultValue="General" placeholder="General, Privacy, Features" className="rounded-xl h-10 text-xs" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Display Order</label>
                  <Input name="order" type="number" required defaultValue="1" className="rounded-xl h-10 text-xs" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Question</label>
                <Input name="question" required placeholder="What makes TCT Orbit different?" className="rounded-xl h-10 text-xs" />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Answer</label>
                <Textarea name="answer" required rows={4} placeholder="Full explanatory answer..." className="rounded-xl text-xs leading-relaxed" />
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-xl text-xs">
                {loading && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                <span>Save Question</span>
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[120px] font-semibold text-xs">Category</TableHead>
              <TableHead className="w-[80px] font-semibold text-xs">Order</TableHead>
              <TableHead className="font-semibold text-xs">Question &amp; Answer</TableHead>
              <TableHead className="text-right font-semibold text-xs pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialFaqs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-xs text-muted-foreground">
                  No FAQs found.
                </TableCell>
              </TableRow>
            ) : (
              initialFaqs.map((faq) => (
                <TableRow key={faq.id} className="hover:bg-muted/30">
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">
                      {faq.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{faq.order}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="font-semibold text-xs text-foreground">{faq.question}</div>
                    <div className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">{faq.answer}</div>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="rounded-lg h-7 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
