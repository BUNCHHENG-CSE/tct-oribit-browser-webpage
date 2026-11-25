"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  createReleaseAction,
  deleteReleaseAction,
  addReleaseAssetAction,
  deleteReleaseAssetAction,
  syncGitHubReleaseAction,
} from "@/lib/actions/admin/releases";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2, PackagePlus, RefreshCw, GitBranch } from "lucide-react";
import type { SerializedRelease } from "@/lib/queries/releases";

interface ReleaseCrudClientProps {
  initialReleases: SerializedRelease[];
}

export function ReleaseCrudClient({ initialReleases }: ReleaseCrudClientProps) {
  const [releaseOpen, setReleaseOpen] = React.useState(false);
  const [assetOpen, setAssetOpen] = React.useState(false);
  const [githubOpen, setGithubOpen] = React.useState(false);
  const [selectedReleaseId, setSelectedReleaseId] = React.useState<string | null>(null);
  const [channel, setChannel] = React.useState("STABLE");
  const [syncChannel, setSyncChannel] = React.useState("STABLE");
  const [platform, setPlatform] = React.useState("WINDOWS");
  const [loading, setLoading] = React.useState(false);

  async function handleSyncGitHub(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("channel", syncChannel);

    try {
      const res = await syncGitHubReleaseAction(formData);
      if (res.success) {
        toast.success(res.message);
        setGithubOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to synchronize from GitHub.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateRelease(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("channel", channel);

    try {
      const res = await createReleaseAction(formData);
      if (res.success) {
        toast.success(res.message);
        setReleaseOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to create release.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteRelease(id: string) {
    if (!confirm("Are you sure you want to delete this release and all its assets?")) return;
    try {
      const res = await deleteReleaseAction(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to delete release.");
    }
  }

  async function handleAddAsset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedReleaseId) return;
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("platform", platform);

    try {
      const res = await addReleaseAssetAction(selectedReleaseId, formData);
      if (res.success) {
        toast.success(res.message);
        setAssetOpen(false);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to add asset.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteAsset(id: string) {
    if (!confirm("Delete this binary asset?")) return;
    try {
      const res = await deleteReleaseAssetAction(id);
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to delete asset.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div>
          <h2 className="text-xl font-heading font-bold text-foreground">Releases Registry</h2>
          <p className="text-xs text-muted-foreground">Manage channels, versions, and build binaries</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Sync from GitHub Actions Dialog */}
          <Dialog open={githubOpen} onOpenChange={setGithubOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs">
                <RefreshCw className="size-3.5 text-primary" />
                <span>Sync GitHub Actions</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle className="font-heading flex items-center gap-2">
                  <GitBranch className="size-4 text-primary" />
                  <span>Sync from GitHub Actions / Releases</span>
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSyncGitHub} className="space-y-3.5 pt-2">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">GitHub Repository</label>
                  <Input
                    name="repo"
                    required
                    defaultValue="tctorbit/orbit-browser"
                    placeholder="owner/repo"
                    className="rounded-xl h-10 text-xs font-mono"
                  />
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Auto-imports Windows (.exe), macOS (.dmg), and Linux (.AppImage/.deb) artifacts published by CI/CD.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Release Channel</label>
                    <Select value={syncChannel} onValueChange={(val) => setSyncChannel(val || "STABLE")}>
                      <SelectTrigger className="rounded-xl h-10 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STABLE">Stable</SelectItem>
                        <SelectItem value="NOVA">Nova Beta</SelectItem>
                        <SelectItem value="DEEP">Deep Nightly</SelectItem>
                        <SelectItem value="CANARY">Canary Dev</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground mb-1 block">Release Tag (Optional)</label>
                    <Input
                      name="tag"
                      placeholder="e.g. v0.1.2 (leave empty for latest)"
                      className="rounded-xl h-10 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" disabled={loading} className="w-full rounded-xl text-xs font-semibold">
                    {loading ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <RefreshCw className="size-3.5 mr-1.5" />}
                    <span>Sync Binaries to Neon Database</span>
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={releaseOpen} onOpenChange={setReleaseOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="rounded-xl gap-1.5 text-xs">
              <Plus className="size-4" />
              <span>Create Release</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle className="font-heading">Create New Orbit Release</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateRelease} className="space-y-3.5 pt-2">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Version</label>
                  <Input name="version" required placeholder="v0.1.3" className="rounded-xl h-10 text-xs" />
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground mb-1 block">Channel</label>
                  <Select value={channel} onValueChange={(val) => setChannel(val || "STABLE")}>
                    <SelectTrigger className="rounded-xl h-10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STABLE">STABLE</SelectItem>
                      <SelectItem value="NOVA">NOVA</SelectItem>
                      <SelectItem value="DEEP">DEEP</SelectItem>
                      <SelectItem value="CANARY">CANARY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Title</label>
                <Input name="title" required placeholder="TCT Orbit v0.1.3 - Security Update" className="rounded-xl h-10 text-xs" />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Release Notes (Markdown)</label>
                <Textarea name="notes" required rows={4} placeholder="### Highlights&#10;- Fast startup optimizations&#10;- Bug fixes" className="rounded-xl text-xs font-mono" />
              </div>

              <Button type="submit" disabled={loading} className="w-full rounded-xl text-xs">
                {loading && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
                <span>Publish Release</span>
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>

      {/* Releases Table */}
      <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl overflow-hidden shadow-lg">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="w-[120px] font-semibold text-xs">Version</TableHead>
              <TableHead className="w-[100px] font-semibold text-xs">Channel</TableHead>
              <TableHead className="font-semibold text-xs">Title &amp; Notes</TableHead>
              <TableHead className="font-semibold text-xs">Assets</TableHead>
              <TableHead className="text-right font-semibold text-xs pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialReleases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-xs text-muted-foreground">
                  No releases found.
                </TableCell>
              </TableRow>
            ) : (
              initialReleases.map((release) => (
                <TableRow key={release.id} className="hover:bg-muted/30">
                  <TableCell className="font-mono font-bold text-xs text-foreground">
                    {release.version}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px]">
                      {release.channel}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    <div className="font-semibold text-xs text-foreground truncate">{release.title}</div>
                    <div className="text-[11px] text-muted-foreground truncate">{release.notes}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {release.assets.map((a) => (
                        <span
                          key={a.id}
                          className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted border border-border/40"
                        >
                          <span>{a.platform}</span>
                          <button
                            onClick={() => handleDeleteAsset(a.id)}
                            className="text-red-400 hover:text-red-500 ml-0.5"
                            title="Delete Asset"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right pr-6 space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedReleaseId(release.id);
                        setAssetOpen(true);
                      }}
                      className="rounded-lg h-7 px-2 text-[11px] gap-1"
                    >
                      <PackagePlus className="size-3" />
                      <span>Add Asset</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteRelease(release.id)}
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

      {/* Add Asset Dialog */}
      <Dialog open={assetOpen} onOpenChange={setAssetOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="font-heading">Attach Binary Asset</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddAsset} className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Platform</label>
                <Select value={platform} onValueChange={(val) => setPlatform(val || "WINDOWS")}>
                  <SelectTrigger className="rounded-xl h-10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WINDOWS">WINDOWS</SelectItem>
                    <SelectItem value="MACOS">MACOS</SelectItem>
                    <SelectItem value="LINUX">LINUX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Arch</label>
                <Input name="arch" required defaultValue="x64" placeholder="x64 or arm64" className="rounded-xl h-10 text-xs" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">File Type</label>
                <Input name="fileType" required defaultValue="exe" placeholder="exe, dmg, AppImage, deb" className="rounded-xl h-10 text-xs" />
              </div>

              <div>
                <label className="text-xs font-medium text-foreground mb-1 block">Size (Bytes)</label>
                <Input name="sizeBytes" type="number" required defaultValue="110000000" className="rounded-xl h-10 text-xs font-mono" />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">File URL</label>
              <Input name="fileUrl" required placeholder="https://downloads.tctorbit.com/releases/..." className="rounded-xl h-10 text-xs" />
            </div>

            <div>
              <label className="text-xs font-medium text-foreground mb-1 block">SHA-256 Checksum (64 Hex)</label>
              <Input name="sha256" required maxLength={64} placeholder="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" className="rounded-xl h-10 text-xs font-mono" />
            </div>

            <Button type="submit" disabled={loading} className="w-full rounded-xl text-xs mt-2">
              {loading && <Loader2 className="size-3.5 animate-spin mr-1.5" />}
              <span>Save &amp; Attach Asset</span>
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
