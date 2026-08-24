import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { MaskText, Reveal } from "@/components/motion-primitives";
import { EASE } from "@/lib/motion";

export default function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen flex-col bg-background text-foreground"
    >
      {/* Main Content */}
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="relative mx-auto max-w-5xl px-4">
          <div className="flex min-h-[200px] items-center justify-center text-center">
            <div>
              <MaskText
                as="h1"
                text="404"
                delay={0.1}
                className="block font-mono text-5xl font-bold tabular-nums tracking-tight"
              />
              <Reveal as="p" delay={0.4} className="mt-4 text-lg text-muted-foreground">
                Page not found
              </Reveal>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
                className="mt-8"
              >
                <Button
                  asChild
                  variant="outline"
                  className="group cursor-pointer transition-transform active:scale-[0.97]"
                >
                  <Link to="/">
                    <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
                    Back to the studio
                  </Link>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
