import '@vly-ai/integrations';
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { VlyToolbar } from "../vly-toolbar-readonly.tsx";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { MotionConfig } from "framer-motion";
import React, { StrictMode, useEffect, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import { ThemeSettingsProvider, useThemeSettings, applyPaletteVars, applyAnimVars } from "@/hooks/use-theme-settings";
import "./index.css";
import { initAnalytics, trackPageview } from "@/lib/analytics";
import { SiteThemeProvider } from "@/hooks/use-site-theme";

// Plausible loads only when VITE_PLAUSIBLE_DOMAIN is set at build time.
initAnalytics();

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Projects = lazy(() => import("./pages/Projects.tsx"));
const ProjectDetail = lazy(() => import("./pages/ProjectDetail.tsx"));
const Blog = lazy(() => import("./pages/Blog.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const Book = lazy(() => import("./pages/Book.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Silent error boundary — if VlyToolbar crashes it renders nothing instead of
 *  crashing the whole app (e.g. hook errors in WebContainer environment). */
class ToolbarErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: Error) {
    console.warn("[VlyToolbar] Caught error, toolbar disabled:", err.message);
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const basePath = import.meta.env.VITE_BASE_PATH || "/";
const convexUrl = import.meta.env.VITE_CONVEX_URL as string | undefined;

// Theme bootstrapping (data-theme + .dark) happens pre-paint in index.html;
// <SiteThemeProvider> keeps it in sync with the owner's published choice.

/**
 * Syncs palette and animation CSS variables onto <html> via inline styles.
 * Inline styles have the highest specificity, so they always override
 * any CSS rule including the site theme's html[data-theme] selectors.
 */
function ThemeApplier() {
  const { paletteId, animationId } = useThemeSettings();
  useEffect(() => {
    applyPaletteVars(paletteId);
    applyAnimVars(animationId);

    // Apply animation CSS class for visual effects (glitch scanlines, wobble, etc.)
    const el = document.documentElement;
    const animClasses = [
      "anim-cinematic", "anim-kinetic", "anim-liquid",
      "anim-glitch", "anim-editorial", "anim-playful",
    ];
    for (const c of animClasses) el.classList.remove(c);
    el.classList.add(`anim-${animationId}`);
  }, [paletteId, animationId]);
  return null;
}

const convex = convexUrl ? new ConvexReactClient(convexUrl) : null;

/** Visible notice instead of a blank screen when the app is built without a
 *  Convex URL (e.g. a static GitHub Pages build missing VITE_CONVEX_URL). */
function MissingConvexConfig() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold">Deployment configuration missing</p>
        <p className="mt-2 text-xs leading-5 text-muted-foreground">
          This build has no <code>VITE_CONVEX_URL</code>. Set it at build time
          (e.g. in the GitHub Pages workflow) and redeploy.
        </p>
      </div>
    </div>
  );
}



function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  // SPA pageviews for Plausible (no-op unless analytics is configured).
  useEffect(() => {
    trackPageview();
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}


function App() {
  if (!convex) return <MissingConvexConfig />;
  return (
    <ConvexAuthProvider client={convex}>
      <SiteThemeProvider>
        <ThemeSettingsProvider>
          <ThemeApplier />
        <MotionConfig reducedMotion="user">
          <RouteSyncer />
          <Suspense fallback={<RouteLoading />}>
            <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:slug" element={<ProjectDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/book" element={<Book />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/auth"
              element={<AuthPage redirectAfterAuth="/dashboard" />}
            />
            <Route
              path="/dashboard"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
          </Suspense>
        </MotionConfig>
          </ThemeSettingsProvider>
        </SiteThemeProvider>
        <Toaster />
    </ConvexAuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ToolbarErrorBoundary>
        <VlyToolbar />
      </ToolbarErrorBoundary>
      <BrowserRouter basename={basePath}>
        <App />
      </BrowserRouter>
    </RootErrorBoundary>
  </StrictMode>,
);
