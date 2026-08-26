import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Palette, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { animationPresets } from "@/lib/animations";
import { useThemeSettings, PALETTE_META } from "@/hooks/use-theme-settings";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Tab = "animations" | "palettes";

const tabs: { id: Tab; label: string; icon: typeof Palette }[] = [
  { id: "animations", label: "Animations", icon: Sparkles },
  { id: "palettes", label: "Palettes", icon: Palette },
];

function AnimationGrid() {
  const { animationId, setAnimationId } = useThemeSettings();
  return (
    <div className="grid grid-cols-2 gap-2">
      {animationPresets.map((a) => {
        const active = a.id === animationId;
        return (
          <button
            key={a.id}
            type="button"
            onClick={() => setAnimationId(a.id)}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-lg border p-3 text-left transition-all",
              active
                ? "border-primary bg-primary/10"
                : "border-border/60 hover:border-muted-foreground/40 hover:bg-muted/30",
            )}
          >
            <span className="text-2xl">{a.icon}</span>
            <div className="text-center">
              <span className="text-xs font-medium">{a.name}</span>
              <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                {a.description}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-[9px] text-muted-foreground">
                {(a.duration * 1000).toFixed(0)}ms
              </span>
              <span className="text-[9px] text-muted-foreground">·</span>
              <span className="text-[9px] text-muted-foreground">
                {a.distance}px
              </span>
            </div>
            {active && (
              <motion.span
                layoutId="anim-check"
                className="absolute right-1.5 top-1.5"
              >
                <Check className="size-3.5 text-primary" />
              </motion.span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function PaletteGrid() {
  const { paletteId, setPaletteId } = useThemeSettings();
  return (
    <div className="grid grid-cols-2 gap-2">
      {PALETTE_META.map((p) => {
        const active = p.id === paletteId;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => setPaletteId(p.id)}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-lg border p-3 text-left transition-all",
              active
                ? "border-primary bg-primary/10"
                : "border-border/60 hover:border-muted-foreground/40 hover:bg-muted/30",
            )}
          >
            <div className="flex gap-1">
              {p.swatches.map((color, i) => (
                <span
                  key={i}
                  className="size-4 rounded-full border border-white/10"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="text-center">
              <span className="text-xs font-medium">{p.icon} {p.name}</span>
            </div>
            {active && (
              <motion.span
                layoutId="palette-check"
                className="absolute right-1.5 top-1.5"
              >
                <Check className="size-3.5 text-primary" />
              </motion.span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function ThemeSettingsTrigger() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("animations");

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 cursor-pointer text-muted-foreground hover:text-foreground"
          title="Animation & palette settings"
        >
          <Sparkles className="size-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 sm:w-96" side="right">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="size-4" />
            Motion & Color
          </SheetTitle>
        </SheetHeader>

        <div className="mt-4 flex gap-1 rounded-lg bg-muted p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                tab === t.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <t.icon className="size-3" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-4 max-h-[calc(100vh-12rem)] overflow-y-auto pr-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {tab === "animations" && <AnimationGrid />}
              {tab === "palettes" && <PaletteGrid />}
            </motion.div>
          </AnimatePresence>
        </div>
      </SheetContent>
    </Sheet>
  );
}
