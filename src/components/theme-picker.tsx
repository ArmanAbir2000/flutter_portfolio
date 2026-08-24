import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, Palette } from "lucide-react";
import { useSiteTheme } from "@/hooks/use-site-theme";
import { THEMES, type ThemeDef } from "@/lib/themes";

/**
 * Mini mockup rendered with a theme's own fixed swatch colors — deliberately
 * NOT driven by CSS tokens, so every card keeps showing its own style no
 * matter which theme is currently live.
 */
function ThemePreview({ def }: { def: ThemeDef }) {
  const s = def.swatch;
  const radius = def.id === "brutal" || def.id === "terminal" ? 2 : def.id === "editorial" ? 3 : 12;
  return (
    <div
      aria-hidden
      className="relative h-28 w-full overflow-hidden border-b"
      style={{ background: s.bg, borderColor: s.border }}
    >
      {/* faux nav */}
      <div className="flex items-center justify-between px-3 pt-2.5">
        <div className="flex items-center gap-1.5">
          <span
            className="block size-1.5 rounded-full"
            style={{ background: s.accent }}
          />
          <span
            className="text-[9px] font-semibold"
            style={{
              color: s.text,
              fontFamily:
                def.id === "editorial"
                  ? "'Fraunces', Georgia, serif"
                  : def.id === "terminal"
                    ? "'JetBrains Mono', monospace"
                    : "'Space Grotesk', sans-serif",
            }}
          >
            studio
          </span>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-1 w-4 rounded-full"
              style={{ background: s.mutedText, opacity: 0.55 }}
            />
          ))}
        </div>
      </div>
      {/* faux hero card */}
      <div
        className="absolute inset-x-3 bottom-3 p-2.5"
        style={{
          background: s.surface,
          border: `1px solid ${s.border}`,
          borderRadius: radius,
          boxShadow:
            def.id === "brutal"
              ? `3px 3px 0 0 ${s.text}`
              : def.id === "bento"
                ? "0 8px 22px -14px rgba(0,0,0,.35)"
                : undefined,
        }}
      >
        <p
          className="truncate text-[11px] font-bold leading-tight"
          style={{
            color: s.text,
            fontFamily:
              def.id === "editorial"
                ? "'Fraunces', Georgia, serif"
                : def.id === "terminal"
                  ? "'JetBrains Mono', monospace"
                  : "'Space Grotesk', sans-serif",
            letterSpacing: def.id === "editorial" ? 0 : "-0.02em",
          }}
        >
          Flutter apps with serious backbones.
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span
            className="px-2 py-1 text-[8px] font-semibold"
            style={{
              background: s.accent,
              color: def.id === "glass" ? "#fff" : s.bg,
              borderRadius: radius > 6 ? 999 : Math.max(2, radius - 1),
              boxShadow:
                def.id === "brutal" ? `2px 2px 0 0 ${s.text}` : undefined,
            }}
          >
            Book a call
          </span>
          <span
            className="block h-1.5 w-10 rounded-full"
            style={{ background: s.mutedText, opacity: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}

export function AppearancePanel() {
  const { theme, setTheme } = useSiteTheme();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorFor, setErrorFor] = useState<string | null>(null);

  const choose = async (id: ThemeDef["id"]) => {
    if (id === theme || pendingId) return;
    setPendingId(id);
    setErrorFor(null);
    const ok = await setTheme(id);
    setPendingId(null);
    if (ok) {
      toast.success("Theme published — live for every visitor.");
    } else {
      setErrorFor(id);
      toast.error(
        "Could not publish the theme. Are you signed in as the owner?",
      );
    }
  };

  return (
    <section className="space-y-5">
      <div>
        <h3 className="flex items-center gap-2 text-sm font-semibold tracking-tight">
          <Palette className="size-4 text-muted-foreground" />
          Site theme
        </h3>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          A theme restyles the entire site — palette, typography, shapes,
          shadows, textures and motion. Publishing applies it instantly for
          every visitor on every page.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {THEMES.map((def) => {
          const active = def.id === theme;
          const failed = errorFor === def.id;
          return (
            <button
              key={def.id}
              type="button"
              onClick={() => void choose(def.id)}
              aria-pressed={active}
              disabled={!!pendingId}
              className={
                "group cursor-pointer overflow-hidden rounded-xl border text-left transition-all " +
                (active
                  ? "border-foreground ring-2 ring-ring/40"
                  : "border-border/60 hover:border-muted-foreground/60") +
                (failed ? " ring-2 ring-destructive/50" : "")
              }
            >
              <ThemePreview def={def} />
              <div className="space-y-1 bg-card p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold tracking-tight">
                    {def.name}
                  </span>
                  {active ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      <Check className="size-3" /> Live
                    </span>
                  ) : pendingId === def.id ? (
                    <Loader2 className="size-3.5 shrink-0 animate-spin text-muted-foreground" />
                  ) : (
                    <span className="shrink-0 text-[10px] uppercase tracking-wider text-muted-foreground">
                      {def.mode}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {def.tagline} · {def.fontLabel}
                </p>
                <p className="text-[11px] leading-4 text-muted-foreground/80">
                  {def.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground">
        Tip: open your public site in another tab — it switches the moment you
        click a card.
      </p>
    </section>
  );
}
