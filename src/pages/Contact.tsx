import { useState } from "react";
import { useMutation } from "convex/react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";

export default function Contact() {
  const sendMessage = useMutation(api.messages.sendMessage);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    try {
      await sendMessage({ name, email, subject, body });
      toast("Message sent.", {
        description: "Expect a reply within one business day.",
      });
      setName("");
      setEmail("");
      setSubject("");
      setBody("");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not send the message.",
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-6xl px-6 pt-16 pb-24 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Send a message
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Not ready to book a slot? Send a short note instead — questions
              about a project, availability, or rates are all welcome.
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              Prefer to talk live?{" "}
              <Link
                to="/book"
                className="cursor-pointer underline underline-offset-2 hover:text-foreground"
              >
                Book an appointment
              </Link>{" "}
              instead.
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onSubmit={handleSubmit}
            className="mt-12 max-w-xl space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  maxLength={100}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
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
              <Label htmlFor="contact-subject">Subject</Label>
              <Input
                id="contact-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="New build inquiry"
                maxLength={150}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact-body">Message</Label>
              <Textarea
                id="contact-body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={7}
                maxLength={3000}
                placeholder="Tell me a little about what you need."
                required
              />
            </div>
            <Button type="submit" size="lg" disabled={sending} className="cursor-pointer">
              {sending && <Loader2 className="mr-2 size-4 animate-spin" />}
              Send message
            </Button>
          </motion.form>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
