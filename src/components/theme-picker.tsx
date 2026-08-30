import { useState } from "react";
import { toast } from "sonner";
import { Check, Loader2, Palette } from "lucide-react";
import { useSiteTheme } from "@/hooks/use-site-theme";
import { THEMES, type ThemeDef, type ThemeId } from "@/lib/themes";

/**
 * Mini mockup rendered with a theme's own fixed swatch colors — deliberately
 * NOT driven by CSS tokens, so every card keeps showing its own style no
 * matter which theme is currently live.
 */

const PREVIEW_FONT: Partial<Record<ThemeId, string>> = {
  editorial: "'Fraunces', Georgia, serif",
  terminal: "'JetBrains Mono', monospace",
  swiss: "'Inter Tight', sans-serif",
  aurora: "'Space Grotesk', sans-serif",
  cyberpunk: "'Chakra Petch', sans-serif",
  clay: "'Nunito', sans-serif",
  popart: "'Bungee', sans-serif",
  y2k: "'Michroma', sans-serif",
  retro: "'DM Serif Display', Georgia, serif",
  bohemian: "'Cormorant Garamond', Georgia, serif",
  handwritten: "'Caveat', cursive",
  pixel: "'Press Start 2P', monospace",
};

const PREVIEW_RADIUS: Partial<Record<ThemeId, number>> = {
  brutal: 2,
  terminal: 2,
  editorial: 3,
  swiss: 0,
  cyberpunk: 2,
  pixel: 0,
  popart: 6,
  handwritten: 10,
  aurora: 12,
  clay: 18,
  y2k: 18,
  bohemian: 16,
  retro: 14,
};

const PREVIEW_SHADOW: Partial<Record<ThemeId, string>> = {
  brutal: "3px 3px 0 0 #111110",
  popart: "4px 4px 0 0 #111111",
  pixel: "4px 4px 0 0 rgba(0,0,0,.85)",
  bento: "0 8px 22px -14px rgba(0,0,0,.35)",
  clay: "0 10px 20px -10px rgba(97,79,197,.45)",
  y2k: "0 10px 24px -12px rgba(124,58,237,.45)",
  bohemian: "0 8px 20px -12px rgba(63,53,41,.3)",
  handwritten: "0 4px 10px rgba(43,43,43,.14)",
  retro: "4px 4px 0 0 rgba(74,47,29,.18)",
};

function ThemePreview({ def }: { def: ThemeDef }) {
  const s = def.swatch;
  const radius = PREVIEW_RADIUS[def.id] ?? 12;
  const font = PREVIEW_FONT[def.id] ?? "'Space Grotesk', sans-serif";
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
            style={{ color: s.text, fontFamily: font }}
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
          boxShadow: PREVIEW_SHADOW[def.id],
        }}
      >
        <p
          className="truncate text-[11px] font-bold leading-tight"
          style={{
            color: s.text,
            fontFamily: font,
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
              color: def.id === "glass" || def.id === "terminal" || def.id === "cyberpunk" || def.id === "pixel" || def.id === "swiss" ? "#fff" : s.bg,
              borderRadius: radius > 6 ? 999 : Math.max(2, radius - 1),
              boxShadow: PREVIEW_SHADOW[def.id],
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
