import { useMemo } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

const WEEKS = 52;

/** GitHub-style green ramp, tuned for the dark background. */
const LEVEL_CLASSES = [
  "bg-muted/30",
  "bg-emerald-800/70",
  "bg-emerald-600",
  "bg-emerald-400",
  "bg-emerald-300",
] as const;

export type GitHubDay = { date: string; count: number };

export type GitHubCalendar = {
  total: number;
  days: GitHubDay[];
};

type Cell =
  | { kind: "day"; date: Date; iso: string; level: number; count: number }
  | { kind: "empty" }
  | { kind: "future" };

function levelFor(count: number): number {
  if (count <= 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 9) return 3;
  return 4;
}

/** Deterministic PRNG so demo data is stable across renders/reloads. */
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

function buildDemoYear(): { columns: Cell[][]; total: number } {
  const rand = mulberry32(20260823);
  const today = new Date();
  today.setHours(12, 0, 0, 0);

  // Align the grid so each column is one Sun–Sat week ending today.
  const end = new Date(today);
  end.setDate(end.getDate() + (6 - end.getDay()));

  let streakLeft = 0;
  const columns: Cell[][] = [];
  let total = 0;

  for (let w = WEEKS - 1; w >= 0; w--) {
    const col: Cell[] = [];
    for (let d = 6; d >= 0; d--) {
      const date = new Date(end);
      date.setDate(end.getDate() - (w * 7 + d));

      if (date > today) {
        col.push({ kind: "future" });
        continue;
      }

      const weekend = date.getDay() === 0 || date.getDay() === 6;
      if (streakLeft <= 0 && rand() < (weekend ? 0.04 : 0.14)) {
        streakLeft = 2 + Math.floor(rand() * 11);
      }

      let count = 0;
      const r = rand();
      if (streakLeft > 0) {
        streakLeft--;
        count = r < 0.25 ? 4 : r < 0.7 ? 7 : 11;
      } else if (!weekend) {
        count = r < 0.38 ? 0 : r < 0.68 ? 1 : r < 0.9 ? 4 : 8;
      } else {
        count = r < 0.75 ? 0 : r < 0.93 ? 1 : 4;
      }
      total += count;
      col.push({
        kind: "day",
        date,
        iso: date.toISOString().slice(0, 10),
        level: levelFor(count),
        count,
      });
    }
    columns.push(col);
  }
  return { columns, total };
}

function buildRealColumns(days: GitHubDay[]): Cell[][] {
  if (days.length === 0) return [];

  const sorted = [...days].sort((a, b) => (a.date < b.date ? -1 : 1));
  const counts = new Map(sorted.map((d) => [d.date, d.count]));

  const first = new Date(sorted[0].date + "T00:00:00Z");
  const last = new Date(sorted[sorted.length - 1].date + "T00:00:00Z");
  const todayIso = new Date().toISOString().slice(0, 10);

  // Pad so the first column starts on Sunday.
  const cells: Cell[] = [];
  for (let i = 0; i < first.getUTCDay(); i++) cells.push({ kind: "empty" });

  const cursor = new Date(first);
  while (cursor <= last) {
    const iso = cursor.toISOString().slice(0, 10);
    const count = counts.get(iso) ?? 0;
    cells.push({
      kind: "day",
      date: cursor,
      iso,
      level: levelFor(count),
      count,
    });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  // Chunk into week columns of 7.
  const columns: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    const col = cells
      .slice(i, i + 7)
      .map((cell) =>
        cell.kind === "day" && cell.iso > todayIso
          ? ({ kind: "future" } as Cell)
          : cell,
      );
    columns.push(col);
  }
  return columns;
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export function ContributionMap({ data }: { data?: GitHubCalendar | null }) {
  const built = useMemo(() => {
    if (data && data.days.length > 0) {
      return { columns: buildRealColumns(data.days), total: data.total };
    }
    return buildDemoYear();
  }, [data]);

  const { columns, total } = built;

  // Month label positions: first week where the month changes.
  const monthLabels = useMemo(() => {
    const labels: { index: number; name: string }[] = [];
    let lastMonth = -1;
    columns.forEach((col, i) => {
      const first = col.find((c) => c.kind === "day") ?? col[0];
      if (!first || first.kind !== "day") return;
      const month = first.date.getMonth();
      if (month !== lastMonth) {
        lastMonth = month;
        labels.push({ index: i, name: MONTHS[month] });
      }
    });
    return labels;
  }, [columns]);

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="inline-flex min-w-full flex-col gap-2">
        {/* Month labels */}
        <div className="relative ml-8 h-3">
          {monthLabels.map((m) => (
            <span
              key={m.index}
              className="absolute font-mono text-[10px] text-muted-foreground"
              style={{ left: m.index * 13 }}
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
                className="h-[10px] font-mono text-[9px] leading-[10px] text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
          {columns.map((week, wi) => (
            <motion.div
              key={wi}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, ease: EASE, delay: Math.min(wi * 0.015, 0.75) }}
              className="flex flex-col gap-[3px]"
            >
              {Array.from({ length: 7 }).map((_, di) => {
                const day: Cell | undefined = week[di];
                if (!day) return <span key={di} className="h-[10px] w-[10px]" />;
                if (day.kind !== "day") {
                  return (
                    <span
                      key={di}
                      className={
                        "h-[10px] w-[10px] rounded-[2px] " +
                        (day.kind === "empty" ? "bg-muted/30" : "bg-transparent")
                      }
                    />
                  );
                }
                return (
                  <span
                    key={di}
                    title={
                      day.date.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      }) +
                      " · " +
                      (day.count === 0
                        ? "No contributions"
                        : day.count +
                          " contribution" +
                          (day.count === 1 ? "" : "s"))
                    }
                    className={
                      "h-[10px] w-[10px] rounded-[2px] " +
                      LEVEL_CLASSES[day.level]
                    }
                  />
                );
              })}
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="mt-2 flex items-center justify-between">
          <p className="font-mono text-xs tabular-nums text-muted-foreground">
            {total.toLocaleString()} contributions in the last year
            {!data && " · live data connecting…"}
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
