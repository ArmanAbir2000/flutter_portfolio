import { useQuery } from "convex/react";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link, useParams } from "react-router";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SiteFooter, SiteHeader } from "@/components/site-chrome";
import { MaskText } from "@/components/motion-primitives";
import { EASE } from "@/lib/motion";
import { SITE_URL, useDocumentMeta } from "@/lib/seo";

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

function NotFound() {
  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-6 py-32 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
          404
        </p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">Post not found</h1>
        <Button asChild variant="outline" className="mt-8 cursor-pointer">
          <Link to="/blog">
            <ArrowLeft className="size-4" />
            All writing
          </Link>
        </Button>
      </div>
    </main>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const post = useQuery(api.siteContent.getPost, slug ? { slug } : "skip");

  useDocumentMeta({
    title: post ? post.title + " — Shiki Code Studio" : "Writing — Shiki Code Studio",
    description: post?.excerpt || undefined,
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />

      {post === undefined ? (
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </main>
      ) : !post ? (
        <NotFound />
      ) : (
        <main className="flex-1">
          <article className="mx-auto w-full max-w-3xl px-6 pt-16 pb-24 sm:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <Link
                to="/blog"
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                All writing
              </Link>
              <div className="mt-8 flex items-center gap-4 font-mono text-xs text-muted-foreground">
                <span className="tabular-nums">{formatDate(post.publishedAt)}</span>
                {post.tags.length > 0 && (
                  <>
                    <Separator orientation="vertical" className="h-3" />
                    <span>#{post.tags.join(" #")}</span>
                  </>
                )}
              </div>
              <MaskText
                as="h1"
                text={post.title}
                delay={0.1}
                className="mt-4 block text-3xl font-bold leading-tight tracking-tight sm:text-5xl"
              />
              {post.excerpt && (
                <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
              className="mt-12 space-y-6"
            >
              {post.body.split(/\n{2,}/).map((para, i) => (
                <p key={i} className="text-base leading-8 first:mt-0">
                  {para.trim()}
                </p>
              ))}
            </motion.div>

            <div className="mt-16 rounded-lg border border-border/60 p-6">
              <h2 className="text-sm font-semibold tracking-tight">
                Building something like this?
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                I help teams ship Flutter apps end to end — happy to talk
                through your project.
              </p>
              <Button asChild size="sm" className="mt-4 cursor-pointer">
                <Link to="/book">Book an appointment</Link>
              </Button>
            </div>

            {/* JSON-LD for the article — helps Google rich results */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "BlogPosting",
                  headline: post.title,
                  description: post.excerpt || undefined,
                  datePublished: post.publishedAt,
                  url: `${SITE_URL}/blog/${post.slug}`,
                  keywords: post.tags.join(", ") || undefined,
                  author: {
                    "@type": "Person",
                    name: "Arman Abir",
                    url: SITE_URL,
                  },
                  publisher: {
                    "@type": "Organization",
                    name: "Shiki Code Studio",
                  },
                }),
              }}
            />
          </article>
        </main>
      )}

      <SiteFooter />
    </div>
  );
}
