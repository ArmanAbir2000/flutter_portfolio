import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import {
  Download,
  Github,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  CONTENT_KEYS,
  asCapabilities,
  asHero,
  asInProgress,
  asSkills,
  asSocials,
  defaultCapabilities,
  defaultHero,
  defaultInProgress,
  defaultSkills,
  defaultSocials,
  type Capability,
  type HeroContent,
  type InProgressContent,
  type SocialsContent,
} from "@/lib/content";

type ContentRow = { key: string; data: unknown };
type Project = Doc<"portfolioProjects">;

const inputCls = "text-sm";
const cardCls =
  "rounded-lg border border-border/60 bg-background p-6 space-y-5";

/** Draft state that follows the stored value until the user edits. */
function useDraft<T>(
  rows: ContentRow[] | undefined,
  key: string,
  fallback: T,
  guard: (d: unknown) => T | null,
) {
  const stored = useMemo(
    () =>
      (rows?.find((r) => r.key === key)?.data !== undefined
        ? guard(rows!.find((r) => r.key === key)!.data)
        : null) ?? fallback,
    [rows, key, fallback, guard],
  );
  const [draft, setDraft] = useState<T>(stored);
  const [dirty, setDirty] = useState(false);
  useEffect(() => {
    if (!dirty) setDraft(stored);
  }, [stored, dirty]);
  const update = (next: T) => {
    setDraft(next);
    setDirty(true);
  };
  return { draft, update, dirty, resetDirty: () => setDirty(false) };
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cardCls}>
      <div>
        <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function SaveButton({
  onSave,
  dirty,
  label = "Save changes",
}: {
  onSave: () => Promise<void>;
  dirty: boolean;
  label?: string;
}) {
  const [saving, setSaving] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <Button
        size="sm"
        disabled={saving || !dirty}
        className="cursor-pointer transition-transform active:scale-[0.97]"
        onClick={async () => {
          setSaving(true);
          await onSave();
          setSaving(false);
        }}
      >
        {saving ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Save className="mr-2 size-4" />
        )}
        {label}
      </Button>
      {!dirty && !saving && (
        <span className="text-xs text-muted-foreground">All changes saved</span>
      )}
    </div>
  );
}

/** Hook shared by all section editors. */
function useSectionSaver(key: string) {
  const updateContent = useMutation(api.siteContent.update);
  return async (data: unknown): Promise<boolean> => {
    try {
      await updateContent({ key, data });
      toast.success("Saved — live on your site.");
      return true;
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not save. Are you the owner?",
      );
      return false;
    }
  };
}

/* ------------------------------ Hero ------------------------------ */

export function HeroEditor({ rows }: { rows?: ContentRow[] }) {
  const save = useSectionSaver(CONTENT_KEYS.hero);
  const { draft, update, dirty, resetDirty } = useDraft<HeroContent>(
    rows,
    CONTENT_KEYS.hero,
    defaultHero,
    asHero,
  );

  return (
    <SectionCard
      title="Hero"
      description="The headline and intro at the top of your landing page."
    >
      <div className="grid gap-2">
        <Label htmlFor="hero-title">Headline</Label>
        <Input
          id="hero-title"
          value={draft.title}
          maxLength={140}
          onChange={(e) => update({ ...draft, title: e.target.value })}
          className={inputCls}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="hero-sub">Intro paragraph</Label>
        <Textarea
          id="hero-sub"
          rows={4}
          maxLength={600}
          value={draft.subtitle}
          onChange={(e) => update({ ...draft, subtitle: e.target.value })}
          className={inputCls}
        />
        <p className="text-right text-[11px] text-muted-foreground">
          {draft.subtitle.length}/600
        </p>
      </div>
      <SaveButton
        dirty={dirty}
        onSave={async () => {
          if (!draft.title.trim()) {
            toast.error("Headline can't be empty.");
            return;
          }
          if (await save(draft)) resetDirty();
        }}
      />
    </SectionCard>
  );
}

/* ----------------------------- Skills ----------------------------- */

export function SkillsEditor({ rows }: { rows?: ContentRow[] }) {
  const save = useSectionSaver(CONTENT_KEYS.skills);
  const { draft, update, dirty, resetDirty } = useDraft<string[]>(
    rows,
    CONTENT_KEYS.skills,
    defaultSkills,
    asSkills,
  );
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    const s = newSkill.trim();
    if (!s || draft.includes(s)) return;
    update([...draft, s]);
    setNewSkill("");
  };

  return (
    <SectionCard
      title="Skills marquee"
      description="The scrolling strip under the hero."
    >
      <div className="flex flex-wrap gap-2">
        {draft.map((s) => (
          <Badge key={s} variant="outline" className="gap-1 pr-1.5">
            {s}
            <button
              type="button"
              aria-label={"Remove " + s}
              className="cursor-pointer rounded-full p-0.5 hover:bg-muted"
              onClick={() => update(draft.filter((x) => x !== s))}
            >
              <X className="size-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={newSkill}
          placeholder="Add a skill…"
          maxLength={40}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addSkill()}
          className={`${inputCls} max-w-xs`}
        />
        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer"
          onClick={addSkill}
        >
          <Plus className="mr-1 size-4" /> Add
        </Button>
      </div>
      <SaveButton
        dirty={dirty}
        onSave={async () => {
          if (await save(draft)) resetDirty();
        }}
      />
    </SectionCard>
  );
}

/* --------------------------- Capabilities --------------------------- */

export function CapabilitiesEditor({ rows }: { rows?: ContentRow[] }) {
  const save = useSectionSaver(CONTENT_KEYS.capabilities);
  const { draft, update, dirty, resetDirty } = useDraft<Capability[]>(
    rows,
    CONTENT_KEYS.capabilities,
    defaultCapabilities,
    asCapabilities,
  );

  return (
    <SectionCard
      title='"What I do"'
      description="Numbered automatically in display order."
    >
      {draft.map((cap, i) => (
        <div key={i} className="rounded-md border border-border/60 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs tabular-nums text-muted-foreground">
              {String(i + 1).padStart(2, "0")}
            </span>
            <Button
              size="icon"
              variant="ghost"
              aria-label={"Remove " + cap.title}
              className="size-7 cursor-pointer"
              onClick={() => update(draft.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
          <Input
            value={cap.title}
            placeholder="Title"
            maxLength={60}
            onChange={(e) =>
              update(
                draft.map((c, idx) =>
                  idx === i ? { ...c, title: e.target.value } : c,
                ),
              )
            }
            className={inputCls}
          />
          <Textarea
            rows={3}
            maxLength={400}
            value={cap.body}
            placeholder="Description"
            onChange={(e) =>
              update(
                draft.map((c, idx) =>
                  idx === i ? { ...c, body: e.target.value } : c,
                ),
              )
            }
            className={inputCls}
          />
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        className="cursor-pointer"
        onClick={() => update([...draft, { title: "", body: "" }])}
      >
        <Plus className="mr-1 size-4" /> Add capability
      </Button>
      <Separator />
      <SaveButton
        dirty={dirty}
        onSave={async () => {
          if (draft.some((c) => !c.title.trim())) {
            toast.error("Every capability needs a title.");
            return;
          }
          if (await save(draft)) resetDirty();
        }}
      />
    </SectionCard>
  );
}

/* --------------------------- In progress --------------------------- */

type ListKey = "client" | "personal";

export function InProgressEditor({ rows }: { rows?: ContentRow[] }) {
  const save = useSectionSaver(CONTENT_KEYS.inProgress);
  const { draft, update, dirty, resetDirty } = useDraft<InProgressContent>(
    rows,
    CONTENT_KEYS.inProgress,
    defaultInProgress,
    asInProgress,
  );

  const listEditor = (listKey: ListKey, heading: string) => (
    <div className="space-y-3">
      <h4 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
        {heading}
      </h4>
      {draft[listKey].map((item, i) => (
        <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-start">
          <Input
            value={item.name}
            placeholder="Project name"
            maxLength={80}
            className={`${inputCls} sm:w-56`}
            onChange={(e) =>
              update({
                ...draft,
                [listKey]: draft[listKey].map((it, idx) =>
                  idx === i ? { ...it, name: e.target.value } : it,
                ),
              })
            }
          />
          <Input
            value={item.context}
            placeholder="Short status line"
            maxLength={140}
            className={inputCls}
            onChange={(e) =>
              update({
                ...draft,
                [listKey]: draft[listKey].map((it, idx) =>
                  idx === i ? { ...it, context: e.target.value } : it,
                ),
              })
            }
          />
          <Button
            size="icon"
            variant="ghost"
            aria-label="Remove item"
            className="size-8 shrink-0 cursor-pointer"
            onClick={() =>
              update({
                ...draft,
                [listKey]: draft[listKey].filter((_, idx) => idx !== i),
              })
            }
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button
        size="sm"
        variant="outline"
        className="cursor-pointer"
        onClick={() =>
          update({
            ...draft,
            [listKey]: [...draft[listKey], { name: "", context: "" }],
          })
        }
      >
        <Plus className="mr-1 size-4" /> Add item
      </Button>
    </div>
  );

  return (
    <SectionCard
      title='"In progress right now"'
      description="Two columns under What I do."
    >
      {listEditor("client", "Client & contract work")}
      <Separator />
      {listEditor("personal", "Personal & open source")}
      <SaveButton
        dirty={dirty}
        onSave={async () => {
          const all = [...draft.client, ...draft.personal];
          if (all.some((x) => !x.name.trim())) {
            toast.error("Every item needs a name.");
            return;
          }
          if (await save(draft)) resetDirty();
        }}
      />
    </SectionCard>
  );
}

/* ------------------------- Projects manager ------------------------- */

type FormState = {
  id?: Doc<"portfolioProjects">["_id"];
  title: string;
  year: string;
  category: string;
  featured: boolean;
  summary: string;
  description: string;
  tagsCsv: string;
  stackCsv: string;
  highlightsText: string;
  liveUrl: string;
  repoUrl: string;
};

const emptyForm: FormState = {
  title: "",
  year: String(new Date().getFullYear()),
  category: "",
  featured: false,
  summary: "",
  description: "",
  tagsCsv: "",
  stackCsv: "",
  highlightsText: "",
  liveUrl: "",
  repoUrl: "",
};

const csv = (s: string) =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
const lines = (s: string) =>
  s
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);

/* ---- GitHub repo importer ---- */

const GITHUB_USER = "ArmanAbir2000";

type GhRepo = {
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  homepage: string | null;
  html_url: string;
  pushed_at: string;
  fork: boolean;
};

export function ProjectsManager() {
  const projects = useQuery(api.portfolio.listProjects, {});
  const saveProject = useMutation(api.portfolio.saveProject);
  const deleteProject = useMutation(api.portfolio.deleteProject);

  const [form, setForm] = useState<FormState | null>(null);
  const [busy, setBusy] = useState(false);

  // Image uploads (available once the project exists, i.e. edit mode).
  const generateUploadUrl = useMutation(api.portfolio.generateUploadUrl);
  const setCover = useMutation(api.portfolio.setCover);
  const addShot = useMutation(api.portfolio.addShot);
  const removeShotM = useMutation(api.portfolio.removeShot);
  const [uploading, setUploading] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const shotInputRef = useRef<HTMLInputElement>(null);

  const editing = form?.id ? projects?.find((p) => p._id === form.id) : undefined;

  const uploadImage = async (file: File, kind: "cover" | "shot") => {
    if (!form?.id) return;
    setUploading(kind);
    try {
      const postUrl = await generateUploadUrl({});
      const res = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed (" + res.status + ")");
      const { storageId } = (await res.json()) as { storageId: string };
      if (kind === "cover") {
        await setCover({ id: form.id, storageId: storageId as Id<"_storage"> });
        toast.success("Cover updated.");
      } else {
        await addShot({ id: form.id, storageId: storageId as Id<"_storage"> });
        toast.success("Screenshot added.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(null);
    }
  };

  // GitHub import panel state.
  const [showGh, setShowGh] = useState(false);
  const [ghRepos, setGhRepos] = useState<GhRepo[] | null>(null);
  const [ghLoading, setGhLoading] = useState(false);

  const loadGhRepos = async () => {
    setGhLoading(true);
    try {
      const res = await fetch(
        `https://api.github.com/users/${GITHUB_USER}/repos?sort=pushed&per_page=100&type=owner`,
      );
      if (!res.ok) throw new Error("GitHub returned " + res.status);
      const repos = (await res.json()) as GhRepo[];
      setGhRepos(repos.filter((r) => !r.fork));
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not load repositories.",
      );
    } finally {
      setGhLoading(false);
    }
  };

  /** Pre-fill the editor with everything GitHub already knows. */
  const importRepo = (r: GhRepo) => {
    const year = new Date(r.pushed_at || Date.now()).getFullYear();
    setForm({
      ...emptyForm,
      title: r.name,
      year: String(Number.isInteger(year) && year >= 2000 && year <= 2100 ? year : new Date().getFullYear()),
      category: "Personal Project",
      summary: (r.description ?? "").slice(0, 200),
      description: r.description ?? "",
      tagsCsv: r.language ?? "",
      stackCsv: r.language ?? "",
      liveUrl: r.homepage ?? "",
      repoUrl: r.html_url,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startEdit = (p: Project) =>
    setForm({
      id: p._id,
      title: p.title,
      year: String(p.year),
      category: p.category,
      featured: p.featured,
      summary: p.summary,
      description: p.description,
      tagsCsv: p.tags.join(", "),
      stackCsv: p.stack.join(", "),
      highlightsText: p.highlights.join("\n"),
      liveUrl: p.liveUrl ?? "",
      repoUrl: p.repoUrl ?? "",
    });

  const handleSave = async () => {
    if (!form) return;
    const year = Number(form.year);
    if (!form.title.trim() || !Number.isInteger(year) || year < 2000 || year > 2100) {
      toast.error("A title and a valid year (e.g. 2025) are required.");
      return;
    }
    setBusy(true);
    try {
      await saveProject({
        id: form.id,
        title: form.title,
        summary: form.summary,
        description: form.description,
        category: form.category,
        tags: csv(form.tagsCsv),
        stack: csv(form.stackCsv),
        highlights: lines(form.highlightsText),
        liveUrl: form.liveUrl,
        repoUrl: form.repoUrl,
        year,
        featured: form.featured,
      });
      toast.success(form.id ? "Project updated." : "Project added.");
      setForm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save project.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (p: Project) => {
    if (!confirm(`Delete "${p.title}"? This cannot be undone.`)) return;
    try {
      await deleteProject({ id: p._id });
      toast.success("Project deleted.");
      if (form?.id === p._id) setForm(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not delete.");
    }
  };

  return (
    <SectionCard
      title="Selected work"
      description="Featured projects appear on the landing page; everything appears on /projects."
    >
      {!form && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            className="w-fit cursor-pointer"
            onClick={() => setForm({ ...emptyForm })}
          >
            <Plus className="mr-1 size-4" /> New project
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="w-fit cursor-pointer"
            onClick={() => {
              setShowGh((s) => !s);
              if (!ghRepos && !ghLoading) void loadGhRepos();
            }}
          >
            <Github className="mr-1 size-4" />
            {showGh ? "Hide GitHub repos" : "Import from GitHub"}
            {showGh &&
              (ghLoading ? (
                <Loader2 className="ml-1 size-3.5 animate-spin" />
              ) : (
                <RefreshCw
                  className="ml-1 size-3.5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    void loadGhRepos();
                  }}
                />
              ))}
          </Button>
        </div>
      )}

      {!form && showGh && (
        <div className="rounded-md border border-border/60 p-4">
          <p className="mb-3 text-xs text-muted-foreground">
            Public non-fork repositories for github.com/{GITHUB_USER}. Import
            pre-fills the form — review and hit Save to publish.
          </p>
          {ghLoading && ghRepos === null ? (
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          ) : ghRepos !== null && ghRepos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No public repositories found.</p>
          ) : (
            <ul className="max-h-72 divide-y divide-border/40 overflow-y-auto rounded-md border border-border/40">
              {(ghRepos ?? []).map((r) => {
                const added = projects?.some(
                  (p) => p.repoUrl === r.html_url || p.title === r.name,
                );
                return (
                  <li
                    key={r.name}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {[r.language, r.stargazers_count + " ★", r.description]
                          .filter(Boolean)
                          .join(" · ") || "No description"}
                      </p>
                    </div>
                    {added ? (
                      <span className="shrink-0 text-xs text-emerald-400">added ✓</span>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="shrink-0 cursor-pointer"
                        onClick={() => importRepo(r)}
                      >
                        <Download className="mr-1 size-3.5" /> Import
                      </Button>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {form && (
        <div className="rounded-md border border-border/60 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">
              {form.id ? "Edit project" : "New project"}
            </h4>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Close editor"
              className="size-7 cursor-pointer"
              onClick={() => setForm(null)}
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-[1fr_6rem_auto]">
            <div className="grid gap-1.5">
              <Label>Title</Label>
              <Input
                value={form.title}
                maxLength={90}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Year</Label>
              <Input
                value={form.year}
                inputMode="numeric"
                onChange={(e) => setForm({ ...form, year: e.target.value })}
                className={inputCls}
              />
            </div>
            <label className="mt-6 flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="size-4 accent-current"
              />
              Featured
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Category</Label>
              <Input
                value={form.category}
                placeholder="Client Project"
                maxLength={50}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Live URL</Label>
              <Input
                value={form.liveUrl}
                placeholder="https://…"
                onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <Label>Summary (cards)</Label>
            <Textarea
              rows={2}
              maxLength={220}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Full description</Label>
            <Textarea
              rows={5}
              maxLength={2500}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputCls}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label>Tags (comma-separated)</Label>
              <Input
                value={form.tagsCsv}
                placeholder="Flutter, Laravel"
                onChange={(e) => setForm({ ...form, tagsCsv: e.target.value })}
                className={inputCls}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Stack (comma-separated)</Label>
              <Input
                value={form.stackCsv}
                placeholder="Flutter, Dart, BLoC"
                onChange={(e) => setForm({ ...form, stackCsv: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label>Highlights (one per line)</Label>
            <Textarea
              rows={4}
              value={form.highlightsText}
              onChange={(e) =>
                setForm({ ...form, highlightsText: e.target.value })
              }
              className={inputCls}
            />
          </div>
          <div className="grid gap-1.5">
            <Label>Source URL</Label>
            <Input
              value={form.repoUrl}
              placeholder="https://github.com/…"
              onChange={(e) => setForm({ ...form, repoUrl: e.target.value })}
              className={inputCls}
            />
          </div>

          {form.id && (
            <div className="space-y-3 rounded-md border border-border/60 p-4">
              <div>
                <p className="text-sm font-semibold">App UI showcase</p>
                <p className="text-xs text-muted-foreground">
                  Uploads save immediately — no need to press Save project.
                </p>
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadImage(f, "cover");
                  e.target.value = "";
                }}
              />
              <input
                ref={shotInputRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void uploadImage(f, "shot");
                  e.target.value = "";
                }}
              />
              <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
                {/* Cover */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Cover (cards)</p>
                  {editing?.cover ? (
                    <img
                      src={editing.cover}
                      alt="Project cover"
                      className="aspect-video w-full rounded-md border border-border/60 object-cover"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => coverInputRef.current?.click()}
                      disabled={uploading !== null}
                      className="grid aspect-video w-full cursor-pointer place-items-center rounded-md border border-dashed border-border/60 text-xs text-muted-foreground hover:text-foreground"
                    >
                      {uploading === "cover" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "+ Upload cover"
                      )}
                    </button>
                  )}
                  {editing?.cover && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 w-fit cursor-pointer text-xs"
                        disabled={uploading !== null}
                        onClick={() => coverInputRef.current?.click()}
                      >
                        Replace
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-fit cursor-pointer text-xs text-red-400 hover:text-red-300"
                        disabled={uploading !== null}
                        onClick={async () => {
                          if (!form.id) return;
                          setUploading("cover");
                          try {
                            await setCover({ id: form.id });
                            toast.success("Cover removed.");
                          } finally {
                            setUploading(null);
                          }
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>
                {/* Screenshots gallery */}
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Screenshots ({editing?.shots?.length ?? 0}/12)
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(editing?.shots ?? []).map((url) => (
                      <div key={url} className="relative">
                        <img
                          src={url}
                          alt="Screenshot"
                          className="h-24 w-auto rounded-md border border-border/60 object-cover"
                        />
                        <button
                          type="button"
                          aria-label="Remove screenshot"
                          disabled={uploading !== null}
                          onClick={async () => {
                            if (!form.id) return;
                            await removeShotM({ id: form.id, url });
                          }}
                          className="absolute -right-1.5 -top-1.5 grid size-5 cursor-pointer place-items-center rounded-full border border-border bg-background text-muted-foreground hover:text-red-400"
                        >
                          <X className="size-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => shotInputRef.current?.click()}
                      disabled={uploading !== null || (editing?.shots?.length ?? 0) >= 12}
                      className="grid h-24 w-16 cursor-pointer place-items-center rounded-md border border-dashed border-border/60 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                      {uploading === "shot" ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        "+ Add"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              size="sm"
              disabled={busy}
              className="cursor-pointer transition-transform active:scale-[0.97]"
              onClick={handleSave}
            >
              {busy ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              Save project
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="cursor-pointer"
              onClick={() => setForm(null)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {projects === undefined ? (
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      ) : (
        <ul className="divide-y divide-border/40 rounded-md border border-border/60">
          {projects.map((p) => (
            <li
              key={p._id}
              className="flex items-center justify-between gap-3 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="flex items-center gap-2 truncate text-sm font-medium">
                  {p.featured && (
                    <Star className="size-3.5 shrink-0 fill-current text-amber-400" />
                  )}
                  {p.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {p.year} · /{p.slug} · {p.category}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={"Edit " + p.title}
                  className="size-8 cursor-pointer"
                  onClick={() => startEdit(p)}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label={"Delete " + p.title}
                  className="size-8 cursor-pointer text-red-400 hover:text-red-300"
                  onClick={() => handleDelete(p)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </li>
          ))}
          {projects.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-muted-foreground">
              No projects yet.
            </li>
          )}
        </ul>
      )}
    </SectionCard>
  );
}

/* ------------------------------ Socials ------------------------------ */

export function SocialsEditor({ rows }: { rows?: ContentRow[] }) {
  const save = useSectionSaver(CONTENT_KEYS.socials);
  const { draft, update, dirty, resetDirty } = useDraft<SocialsContent>(
    rows,
    CONTENT_KEYS.socials,
    defaultSocials,
    asSocials,
  );

  const fields = [
    { key: "github" as const, label: "GitHub profile URL", ph: "https://github.com/username" },
    { key: "facebook" as const, label: "Facebook profile / page URL", ph: "https://facebook.com/yourname" },
    {
      key: "email" as const,
      label: "Email address",
      ph: "you@example.com",
    },
  ];

  return (
    <SectionCard
      title="Footer social links"
      description="Shown as icons on every page footer. Leave a field empty to hide that icon."
    >
      {fields.map(({ key, label, ph }) => (
        <div className="grid gap-2" key={key}>
          <Label htmlFor={"socials-" + key}>{label}</Label>
          <Input
            id={"socials-" + key}
            value={draft[key]}
            placeholder={ph}
            maxLength={300}
            onChange={(e) => update({ ...draft, [key]: e.target.value })}
            className={inputCls}
          />
        </div>
      ))}
      <SaveButton
        dirty={dirty}
        onSave={async () => {
          if (await save(draft)) resetDirty();
        }}
      />
    </SectionCard>
  );
}

export function ContentPanels() {
  const rows = useQuery(api.siteContent.list, {}) as
    | ContentRow[]
    | undefined;
  return (
    <div className="space-y-6">
      <HeroEditor rows={rows} />
      <SkillsEditor rows={rows} />
      <CapabilitiesEditor rows={rows} />
      <InProgressEditor rows={rows} />
      <SocialsEditor rows={rows} />
    </div>
  );
}
