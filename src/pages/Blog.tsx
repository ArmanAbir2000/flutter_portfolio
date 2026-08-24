import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Link } from "react-router";
import { api } from "@/convex/_generated/api";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { EASE } from "@/lib/motion";
import { useDocumentMeta } from "@/lib/seo";

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function Blog() {
  useDocumentMeta({
    title: "Writing — Shiki Code Studio",
    description:
      "Notes on Flutter architecture, Laravel APIs, and shipping mobile products — from the desk of Arman Abir.",
  });

  const posts = useQuery(api.siteContent.listPosts, {});

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      <main className="flex-1">
        <div className="mx-auto w-full max-w-3xl px-6 pt-16 pb-24 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Writing
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
              Notes on Flutter architecture, Laravel backends, and what
              shipping real products actually teaches you.
            </p>
          </motion.div>

          {posts === undefined ? (
            <div className="mt-16 flex items-center gap-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Loading…
            </div>
          ) : posts.length === 0 ? (
            <div className="mt-16 border border-dashed border-border/60 p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Nothing published yet — check back soon.
              </p>
            </div>
          ) : (
            <div className="mt-12">
              {posts.map((post, i) => (
                <motion.article
                  key={post._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: Math.min(i * 0.05, 0.2),
                    ease: EASE,
                  }}
                  className="border-t border-border/60 py-8 first:border-t-0 first:pt-0"
                >
                  <Link to={"/blog/" + post.slug} className="group block cursor-pointer">
                    <div className="flex items-center justify-between gap-4">
                      <span className="font-mono text-xs tabular-nums text-muted-foreground">
                        {formatDate(post.publishedAt)}
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                    </div>
                    <h2 className="mt-3 text-lg font-semibold tracking-tight transition-colors group-hover:text-foreground">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                        {post.tags.map((t) => (
                          <span
                            key={t}
                            className="font-mono text-xs text-muted-foreground"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
