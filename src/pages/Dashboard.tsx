import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CalendarClock,
  Check,
  Inbox as InboxIcon,
  LayoutList,
  Loader2,
  LogOut,
  Mail,
  MailOpen,
  Palette,
  PenLine,
} from "lucide-react";
import { Link, useNavigate } from "react-router";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { useAuth } from "@/hooks/use-auth";
import { Reveal } from "@/components/motion-primitives";
import {
  ContentPanels,
  ProjectsManager,
} from "@/components/dashboard-editors";
import { AppearancePanel } from "@/components/theme-picker";
import { EASE, fadeUp, viewportOnce } from "@/lib/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const statusCycle = {
  pending: "confirmed",
  confirmed: "done",
  done: "pending",
} as const;

type Status = keyof typeof statusCycle;
type ApptDoc = Doc<"appointments">;
type MsgDoc = Doc<"messages">;

function formatDate(date: string, time: string) {
  const parsed = new Date(date + "T" + time + ":00");
  if (Number.isNaN(parsed.getTime())) return date + " · " + time;
  return parsed.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function Sidebar({
  tab,
  onTabChange,
  onSignOut,
}: {
  tab: TabId;
  onTabChange: (id: TabId) => void;
  onSignOut: () => void;
}) {
  return (
    <aside className="flex w-full shrink-0 flex-row items-center justify-between border-b border-border/60 px-6 py-4 sm:h-screen sm:w-60 sm:flex-col sm:justify-start sm:border-b-0 sm:border-r sm:py-8">
      <Link to="/" className="flex items-center gap-2">
        <span className="size-2 rounded-full bg-foreground" />
        <span className="text-sm font-semibold tracking-tight">Shiki Code Studio</span>
      </Link>

      <nav className="flex flex-row gap-1 sm:mt-10 sm:w-full sm:flex-col">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onTabChange(id)}
            aria-current={tab === id ? "page" : undefined}
            className={
              "flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors " +
              (tab === id
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground")
            }
          >
            <Icon className="size-4" />
            {label}
          </button>
        ))}
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

function AppointmentRow({
  appointment,
  onCycle,
}: {
  appointment: ApptDoc;
  onCycle: () => void;
}) {
  return (
    <motion.li
      {...fadeUp}
      viewport={viewportOnce}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{appointment.name}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{appointment.email}</p>
          {appointment.topic && (
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{appointment.topic}</p>
          )}
          <p className="mt-2 flex items-center gap-1.5 text-xs tabular-nums text-muted-foreground">
            <CalendarClock className="size-3.5" />
            {formatDate(appointment.date, appointment.time)}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onCycle}
          className="cursor-pointer shrink-0 self-start gap-2 sm:self-auto"
        >
          Mark {statusCycle[appointment.status]}
        </Button>
      </div>
      <Separator />
    </motion.li>
  );
}

function MessageRow({
  message,
  onToggle,
}: {
  message: MsgDoc;
  onToggle: () => void;
}) {
  return (
    <motion.li
      {...fadeUp}
      viewport={viewportOnce}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium">
            {message.handled ? (
              <MailOpen className="size-3.5 shrink-0 text-muted-foreground" />
            ) : (
              <Mail className="size-3.5 shrink-0" />
            )}
            <span className={message.handled ? "text-muted-foreground" : ""}>
              {message.subject}
            </span>
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {message.name} · {message.email}
          </p>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-muted-foreground">
            {message.body}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="cursor-pointer shrink-0 self-start gap-2 sm:self-auto"
        >
          <Check className="size-3.5" />
          {message.handled ? "Reopen" : "Handled"}
        </Button>
      </div>
      <Separator />
    </motion.li>
  );
}

const TABS = [
  { id: "inbox", label: "Inbox", icon: InboxIcon },
  { id: "content", label: "Page content", icon: PenLine },
  { id: "projects", label: "Projects", icon: LayoutList },
  { id: "appearance", label: "Appearance", icon: Palette },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<TabId>("inbox");

  const appointments = useQuery(api.appointments.listAppointments, {});
  const messages = useQuery(api.messages.listMessages, {});
  const setAppointmentStatus = useMutation(
    api.appointments.setAppointmentStatus,
  );
  const setHandled = useMutation(api.messages.setHandled);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleCycle = async (id: ApptDoc["_id"], current: Status) => {
    try {
      await setAppointmentStatus({ id, status: statusCycle[current] });
    } catch {
      toast.error("Could not update the appointment.");
    }
  };

  const handleToggle = async (id: MsgDoc["_id"], handled: boolean) => {
    try {
      await setHandled({ id, handled });
    } catch {
      toast.error("Could not update the message.");
    }
  };

  const pendingCount =
    appointments?.filter((a) => a.status === "pending").length ?? 0;
  const unreadCount = messages?.filter((m) => !m.handled).length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className="min-h-screen bg-background text-foreground sm:flex"
    >
      <Sidebar tab={tab} onTabChange={setTab} onSignOut={handleSignOut} />

      <main className="flex-1 px-6 py-12 sm:px-12 lg:px-16">
        <div className="mx-auto w-full max-w-3xl pb-16">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Owner console
          </p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {user?.email ? "Signed in as " + user.email + ". ": ""}
            Manage your inbox, site content and appearance.
          </p>

          {/* Tabs */}
          <div className="mt-8 flex flex-wrap gap-2">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={
                  "flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm transition-all active:scale-[0.97] " +
                  (tab === id
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground")
                }
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>

          {tab === "inbox" && (
          <>
          <Reveal as="section" className="mt-12">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Appointment requests
              </h2>
              <Badge variant="outline">{pendingCount} pending</Badge>
            </div>
            {appointments === undefined ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No appointment requests yet.
              </p>
            ) : (
              <ul>
                {appointments.map((a) => (
                  <AppointmentRow
                    key={a._id}
                    appointment={a}
                    onCycle={() => handleCycle(a._id, a.status)}
                  />
                ))}
              </ul>
            )}
          </Reveal>

          <Reveal as="section" delay={0.05} className="mt-14">
            <div className="mb-6 flex items-baseline justify-between">
              <h2 className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Messages
              </h2>
              <Badge variant="outline">{unreadCount} open</Badge>
            </div>
            {messages === undefined ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : messages.length === 0 ? (
              <p className="text-sm text-muted-foreground">No messages yet.</p>
            ) : (
              <ul>
                {messages.map((m) => (
                  <MessageRow
                    key={m._id}
                    message={m}
                    onToggle={() => handleToggle(m._id, !m.handled)}
                  />
                ))}
              </ul>
            )}
          </Reveal>
          </>
          )}

          {tab === "content" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mt-12"
            >
              <ContentPanels />
            </motion.div>
          )}

          {tab === "projects" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mt-12"
            >
              <ProjectsManager />
            </motion.div>
          )}

          {tab === "appearance" && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="mt-12"
            >
              <AppearancePanel />
            </motion.div>
          )}
        </div>
      </main>
    </motion.div>
  );
}
