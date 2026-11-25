"use client";

import * as React from "react";
import { toast } from "sonner";
import { createPostAction, deletePostAction } from "@/lib/actions/admin/posts";
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
import { Plus, Trash2, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { SerializedPost } from "@/lib/queries/posts";

interface PostCrudClientProps {
  initialPosts: SerializedPost[];
}

export function PostCrudClient({ initialPosts }: PostCrudClientProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  async function handleCreatePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("published", "true");

    try {
      const res = await createPostAction(formData);
      if (res.success) {
        toast.success(res.message);
        setOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to create post.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeletePost(id: string) {
    if (!confirm("Delete this blog post?")) return;
    try {
      const res = await deletePostAction(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to delete post.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Blog Articles Registry</h2>
          <p className="text-xs text-muted-foreground">Manage and publish technical publications</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-xl gap-1.5 text-xs">
              <Plus className="size-4" />
              <span>Create Article</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="font-heading">Publish New Blog Article</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreatePost} className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Title</label>
                  <Input name="title" required placeholder="Article Title" className="rounded-xl h-10 text-xs" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Slug</label>
                  <Input name="slug" required placeholder="article-slug" className="rounded-xl h-10 text-xs font-mono" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Author</label>
                  <Input name="author" required defaultValue="TCT Orbit Engineering" className="rounded-xl h-10 text-xs" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Tags (comma-separated)</label>
                  <Input name="tags" required defaultValue="Engineering, Privacy" placeholder="Product, Design, Privacy" className="rounded-xl h-10 text-xs" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Cover Image Path</label>
                <Input name="coverImage" required defaultValue="/screenshots/blog-introducing.png" className="rounded-xl h-10 text-xs" />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Excerpt</label>
                <Textarea name="excerpt" required rows={2} placeholder="A short 1-2 sentence preview..." className="rounded-xl text-xs" />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Content (Markdown / MDX)</label>
                <Textarea name="content" required rows={6} placeholder="### Article content..." className="rounded-xl text-xs font-mono" />
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-xl text-xs">
                {loading && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                <span>Publish to Journal</span>
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="font-semibold text-xs">Title &amp; Slug</TableHead>
              <TableHead className="w-[140px] font-semibold text-xs">Author</TableHead>
              <TableHead className="w-[160px] font-semibold text-xs">Tags</TableHead>
              <TableHead className="w-[100px] font-semibold text-xs">Status</TableHead>
              <TableHead className="text-right font-semibold text-xs pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                  No articles published yet.
                </TableCell>
              </TableRow>
            ) : (
              initialPosts.map((post) => (
                <TableRow key={post.id} className="hover:bg-muted/30">
                  <TableCell>
                    <div className="font-semibold text-xs text-foreground">{post.title}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">/blog/{post.slug}</div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{post.author}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((t) => (
                        <Badge key={t} variant="secondary" className="text-[10px]">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Published
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-6 space-x-2">
                    <Button asChild variant="ghost" size="sm" className="rounded-lg h-7 px-2 text-xs">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <ExternalLink className="size-3" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
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
