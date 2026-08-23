import { useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Check,
  FileText,
  Loader2,
  LogOut,
  Pencil,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

function Sidebar({
  onSignOut,
}: {
  onSignOut: () => void;
}) {
  return (
    <aside className="flex w-full shrink-0 flex-row items-center justify-between border-b border-border/60 px-6 py-4 sm:h-screen sm:w-60 sm:flex-col sm:justify-start sm:border-b-0 sm:border-r sm:py-8">
      <Link to="/" className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-foreground" />
        <span className="text-sm font-semibold tracking-tight">Brief</span>
      </Link>

      <nav className="flex flex-row gap-1 sm:mt-10 sm:w-full sm:flex-col">
        <div className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm font-medium">
          <FileText className="size-4 text-muted-foreground" />
          Overview
        </div>
      </nav>

      <Button
        variant="ghost"
        size="sm"
        onClick={onSignOut}
        className="cursor-pointer gap-2 text-muted-foreground sm:mt-auto sm:w-full sm:justify-start"
      >
        <LogOut className="size-4" />
        Sign out
      </Button>
    </aside>
  );
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const project = useQuery(api.projects.getMyProject, {});
  const ensureProject = useMutation(api.projects.ensureMyProject);
  const updateProject = useMutation(api.projects.updateMyProject);
  const toggleScopeItem = useMutation(api.projects.toggleScopeItem);

  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [audience, setAudience] = useState("");
  const [saving, setSaving] = useState(false);

  // Seed the brief the first time the user signs in.
  useEffect(() => {
    void ensureProject().catch((err) => console.error(err));
  }, [ensureProject]);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setSummary(project.summary);
      setAudience(project.audience);
    }
  }, [project]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const openEdit = () => {
    if (project) {
      setName(project.name);
      setSummary(project.summary);
      setAudience(project.audience);
    }
    setEditOpen(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProject({ name, summary, audience });
      toast("Brief updated.");
      setEditOpen(false);
    } catch {
      toast.error("Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (index: number, done: boolean) => {
    try {
      await toggleScopeItem({ index, done });
    } catch {
      toast.error("Could not update scope item.");
    }
  };

  const doneCount = project?.scope.filter((s) => s.done).length ?? 0;
  const totalCount = project?.scope.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background text-foreground sm:flex"
    >
      <Sidebar onSignOut={handleSignOut} />

      <main className="flex-1 px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-2xl">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Private · Just for you
              </p>
              {project ? (
                <h1 className="mt-3 text-3xl font-bold tracking-tight">
                  {project.name}
                </h1>
              ) : (
                <Loader2 className="mt-3 size-6 animate-spin text-muted-foreground" />
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={openEdit}
              disabled={!project}
              className="cursor-pointer self-start gap-2 sm:self-auto"
            >
              <Pencil className="size-3.5" />
              Edit
            </Button>
          </div>

          {!project ? (
            <div className="mt-16 flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Preparing your brief…
            </div>
          ) : (
            <>
              {/* Summary */}
              <section className="mt-12">
                <Separator className="mb-8" />
                <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  What it is about
                </h2>
                <p className="mt-4 whitespace-pre-line text-base leading-7">
                  {project.summary || (
                    <span className="text-muted-foreground">
                      Not written yet — click Edit to summarize your project.
                    </span>
                  )}
                </p>
              </section>

              {/* Audience */}
              <section className="mt-12">
                <Separator className="mb-8" />
                <h2 className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  <Users className="size-3.5" />
                  Who it is for
                </h2>
                <p className="mt-4 text-base leading-7">
                  {project.audience || (
                    <span className="text-muted-foreground">
                      Not written yet.
                    </span>
                  )}
                </p>
              </section>

              {/* Scope */}
              <section className="mt-12 pb-24">
                <Separator className="mb-8" />
                <div className="flex items-baseline justify-between">
                  <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                    Version 1 scope
                  </h2>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {doneCount}/{totalCount} done
                  </span>
                </div>
                <ul className="mt-4">
                  {project.scope.map((item, i) => (
                    <li key={`${i}-${item.text}`}>
                      <button
                        type="button"
                        onClick={() => handleToggle(i, !item.done)}
                        className="group flex w-full cursor-pointer items-start gap-3 py-3 text-left"
                      >
                        <span
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors ${
                            item.done
                              ? "border-foreground bg-foreground text-background"
                              : "border-border group-hover:border-muted-foreground"
                          }`}
                        >
                          {item.done && <Check className="size-3" />}
                        </span>
                        <span
                          className={`text-sm leading-6 transition-colors ${
                            item.done
                              ? "text-muted-foreground line-through"
                              : ""
                          }`}
                        >
                          {item.text}
                        </span>
                      </button>
                      {i < project.scope.length - 1 && <Separator />}
                    </li>
                  ))}
                </ul>
              </section>
            </>
          )}

          {/* Edit dialog */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="tracking-tight">Edit brief</DialogTitle>
                <DialogDescription>
                  Keep it short. This is the whole point of version 1.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 py-2">
                <div className="grid gap-2">
                  <Label htmlFor="brief-name">Name</Label>
                  <Input
                    id="brief-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={80}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brief-summary">What it is about</Label>
                  <Textarea
                    id="brief-summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={5}
                    maxLength={1200}
                    placeholder="One clear paragraph."
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brief-audience">Who it is for</Label>
                  <Input
                    id="brief-audience"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    maxLength={200}
                    placeholder="e.g. Just me"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setEditOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {user?.email && (
            <p className="pb-8 text-xs text-muted-foreground">
              Signed in as {user.email}
            </p>
          )}
        </div>
      </main>
    </motion.div>
  );
}
