import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { animationPresets } from "@/lib/animations";
import { useThemeSettings, PALETTE_META } from "@/hooks/use-theme-settings";
import { EASE } from "@/lib/motion";

const cardCls =
  "rounded-lg border border-border/60 bg-background p-6 space-y-5";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className={cardCls}>
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      {children}
    </section>
  );
}

export function DashboardThemePanel() {
  const {
    animationId,
    paletteId,
    setAnimationId,
    setPaletteId,
  } = useThemeSettings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="space-y-6"
    >
      {/* Animations */}
      <Section title="Animation Style">
        <p className="text-xs text-muted-foreground">
          Controls how elements reveal, hover, and transition across the site.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {animationPresets.map((a) => {
            const active = a.id === animationId;
            return (
              <button
                key={a.id}
                type="button"
                onClick={() => setAnimationId(a.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-md border p-3 text-left transition-all",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border/60 hover:border-muted-foreground/40 hover:bg-muted/30",
                )}
              >
                <span className="text-xl">{a.icon}</span>
                <span className="text-[10px] font-medium">{a.name}</span>
                <span className="text-[9px] text-muted-foreground">
                  {(a.duration * 1000).toFixed(0)}ms
                </span>
                {active && (
                  <Check className="absolute right-1 top-1 size-3 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* Palettes */}
      <Section title="Color Palette">
        <p className="text-xs text-muted-foreground">
          Full color scheme overrides layered on top of the active site theme.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {PALETTE_META.map((p) => {
            const active = p.id === paletteId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPaletteId(p.id)}
                className={cn(
                  "relative flex flex-col items-center gap-1.5 rounded-md border p-3 text-left transition-all",
                  active
                    ? "border-primary bg-primary/10"
                    : "border-border/60 hover:border-muted-foreground/40 hover:bg-muted/30",
                )}
              >
                <div className="flex gap-0.5">
                  {p.swatches.map((color, i) => (
                    <span
                      key={i}
                      className="size-3 rounded-full border border-white/10"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <span className="text-[10px] font-medium">
                  {p.icon} {p.name}
                </span>
                {active && (
                  <Check className="absolute right-1 top-1 size-3 text-primary" />
                )}
              </button>
            );
          })}
        </div>
      </Section>
    </motion.div>
  );
}
