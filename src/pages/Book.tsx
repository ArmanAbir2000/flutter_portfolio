import { useMemo, useState } from "react";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { MaskText } from "@/components/motion-primitives";
import { EASE } from "@/lib/motion";
import { sendViaWeb3Forms } from "@/lib/web3forms";

const TIMES = ["09:00", "10:30", "13:00", "15:00", "16:30"] as const;

function nextBusinessDays(count: number): string[] {
  const days: string[] = [];
  const d = new Date();
  d.setDate(d.getDate() + 1);
  while (days.length < count) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) {
      days.push(d.toISOString().slice(0, 10));
    }
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function formatDay(iso: string) {
  const parsed = new Date(iso + "T12:00:00");
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function Book() {
  const [searchParams] = useSearchParams();
  const projectSlug = searchParams.get("project");

  const createAppointment = useMutation(api.appointments.createAppointment);

  const businessDays = useMemo(() => nextBusinessDays(10), []);
  const [date, setDate] = useState(businessDays[0]);
  const [time, setTime] = useState<string>(TIMES[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(
    projectSlug ? "Context: project " + projectSlug + ".\n\n" : "",
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAppointment({ name, email, topic, date, time });

      // Best-effort instant email of the request; never blocks or fails the booking.
      void sendViaWeb3Forms({
        name: name.trim(),
        email: email.trim(),
        subject:
          "Appointment request — " + formatDay(date) + " at " + time,
        message:
          "Requested slot: " +
          formatDay(date) +
          " at " +
          time +
          "\n\nTopic:\n" +
          (topic.trim() || "(no topic provided)"),
      });

      toast("Appointment requested.", {
        description:
          formatDay(date) + " at " + time + " — I will confirm by email.",
      });
      setName("");
      setEmail("");
      setTopic("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not book the appointment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-24 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <MaskText
              as="h1"
              text="Book an appointment"
              className="block text-3xl font-bold tracking-tight sm:text-4xl"
            />
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground"
            >
              Pick a slot and tell me what you want to cover — a new build,
              an audit of existing code, or an ongoing engagement. Requests are
              confirmed by email within one business day.
            </motion.p>
            {projectSlug && (
              <p className="mt-4 inline-block rounded-md border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground">
                Re: /projects/{projectSlug}
              </p>
            )}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            onSubmit={handleSubmit}
            className="mt-12 grid gap-14 lg:grid-cols-[20rem_1fr] lg:gap-20"
          >
            {/* Slots */}
            <fieldset>
              <legend className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Pick a slot
              </legend>
              <div className="mt-4 space-y-6">
                <div>
                  <Label className="mb-2 block text-xs text-muted-foreground">
                    Day
                  </Label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                    {businessDays.map((iso) => (
                      <button
                        key={iso}
                        type="button"
                        onClick={() => setDate(iso)}
                        className={
                          "cursor-pointer rounded-md border px-3 py-2 text-xs transition-all active:scale-[0.95] " +
                          (date === iso
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground")
                        }
                      >
                        {formatDay(iso)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block text-xs text-muted-foreground">
                    Time
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {TIMES.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTime(t)}
                        className={
                          "cursor-pointer rounded-md border px-3 py-1.5 font-mono text-xs tabular-nums transition-all active:scale-[0.95] " +
                          (time === t
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground")
                        }
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <CalendarClock className="size-3.5" />
                  Selected: {formatDay(date)} · {time}
                </p>
              </div>
            </fieldset>

            {/* Details */}
            <fieldset className="space-y-6">
              <legend className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Your details
              </legend>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="book-name">Name</Label>
                  <Input
                    id="book-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    maxLength={100}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="book-email">Email</Label>
                  <Input
                    id="book-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    required
                    maxLength={200}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="book-topic">What should we cover?</Label>
                <Textarea
                  id="book-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={6}
                  maxLength={2000}
                  placeholder="A short brief: the problem, the timeline you have in mind, and anything I should look at beforehand."
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={submitting}
                className="cursor-pointer transition-transform active:scale-[0.98]"
              >
                {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                Request {formatDay(date)} at {time}
              </Button>
            </fieldset>
          </motion.form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
