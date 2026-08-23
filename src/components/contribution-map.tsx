import { useMemo } from "react";
import { motion } from "framer-motion";

const WEEKS = 52;

const LEVEL_CLASSES = [
  "bg-muted/30",
  "bg-foreground/20",
  "bg-foreground/35",
  "bg-foreground/55",
  "bg-foreground/85",
] as const;

type DayCell = {
  date: Date;
  level: number;
};

/** Deterministic PRNG so the map is stable across renders/reloads. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildYear(): { days: DayCell[][]; total: number } {
  const rand = mulberry32(20260823);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  // Align the grid so each column is one Sun–Sat week ending today.
  const end = new Date(today);
  end.setDate(end.getDate() + (6 - end.getDay()));

  // One long-lived streak to make it feel human.
  let streakLeft = 0;

  const weeks: DayCell[][] = [];
  let total = 0;

  for (let w = WEEKS - 1; w >= 0; w--) {
    const col: DayCell[] = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(end);
      date.setDate(end.getDate() - (w * 7 + d));

      if (date > today) {
        col.push({ date, level: -1 }); // future cell
        continue;
      }

      const weekend = date.getDay() === 0 || date.getDay() === 6;
      if (streakLeft <= 0 && rand() < (weekend ? 0.04 : 0.14)) {
        streakLeft = 2 + Math.floor(rand() * 11); // start a streak
      }

      let level = 0;
      const r = rand();
      if (streakLeft > 0) {
        streakLeft--;
        level = r < 0.25 ? 2 : r < 0.7 ? 3 : 4;
      } else if (!weekend) {
        level = r < 0.38 ? 0 : r < 0.68 ? 1 : r < 0.9 ? 2 : 3;
      } else {
        level = r < 0.75 ? 0 : r < 0.93 ? 1 : 2;
      }
      total += level === 0 ? 0 : level * 2 + Math.floor(rand() * 3);
      col.push({ date, level });
    }
    weeks.push(col);
  }
  return { days: weeks, total };
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export function ContributionMap() {
  const { days, total } = useMemo(buildYear, []);

  // Month label positions: first week where the month changes.
  const monthLabels = useMemo(() => {
    const labels: { index: number; name: string }[] = [];
    let lastMonth = -1;
    days.forEach((col, i) => {
      const first = col.find((c) => c.level >= 0) ?? col[0];
      if (!first) return;
      if (first.date.getMonth() !== lastMonth) {
        lastMonth = first.date.getMonth();
        labels.push({ index: i, name: MONTHS[lastMonth] });
      }
    });
    return labels;
  }, [days]);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="inline-flex min-w-full flex-col gap-2">
        {/* Month labels */}
        <div className="relative ml-8 h-3">
          {monthLabels.map((m) => (
            <span
              key={m.index}
              className="absolute font-mono text-[10px] text-muted-foreground"
              style={{ left: m.index * 15 }}
            >
              {m.name}
            </span>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex gap-[3px]"
          aria-label="Contribution activity for the last year"
          role="img"
        >
          <div className="mr-1 flex w-6 shrink-0 flex-col gap-[3px] pt-px">
            {["Mon", "", "Wed", "", "Fri", "", ""].map((label, i) => (
              <span
                key={i}
                className="h-[11px] font-mono text-[9px] leading-[11px] text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
          {days.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((day, di) => (
                <span
                  key={di}
                  title={
                    day.level < 0
                      ? undefined
                      : `${day.date.toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })} · ${day.level === 0 ? "No contributions" : day.level * 2 + "+ contributions"}`
                  }
                  className={
                    "h-[11px] w-[11px] rounded-[2px] " +
                    (day.level < 0
                      ? "bg-transparent"
                      : LEVEL_CLASSES[day.level])
                  }
                />
              ))}
            </div>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-between">
          <p className="font-mono text-xs tabular-nums text-muted-foreground">
            {total.toLocaleString()} contributions in the last year
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground">Less</span>
            {LEVEL_CLASSES.map((cls) => (
              <span key={cls} className={"size-[10px] rounded-[2px] " + cls} />
            ))}
            <span className="text-[10px] text-muted-foreground">More</span>
          </div>
        </div>
      </div>
    </div>
  );
}
