import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CONTENT_KEYS } from "@/lib/content";
import {
  applyTheme,
  asThemeId,
  DEFAULT_THEME,
  readStoredTheme,
  type ThemeId,
} from "@/lib/themes";

/**
 * Site-wide theme state.
 *
 * The active theme is a single source of truth with three layers:
 *  - localStorage: instant paint (index.html applies it pre-React).
 *  - Convex `siteContent` key "theme": the owner's published choice, which
 *    every visitor follows reactively (change it in /dashboard → Appearance).
 *  - <html data-theme> + `.dark`: what the CSS in src/index.css keys off of.
 *
 * `setTheme` applies optimistically and then persists; non-owners get an
 * error back from the owner-guarded mutation and the caller can revert.
 */

type SiteThemeContextValue = {
  theme: ThemeId;
  /** Optimistically apply + persist. Resolves false when saving failed. */
  setTheme: (id: ThemeId) => Promise<boolean>;
};

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null);

export function SiteThemeProvider({ children }: { children: ReactNode }) {
  // Start from localStorage — index.html already painted this theme.
  const [theme, setThemeState] = useState<ThemeId>(
    () => readStoredTheme() ?? DEFAULT_THEME,
  );

  // Follow the owner's published theme once the public query resolves.
  const rows = useQuery(api.siteContent.list, {});
  useEffect(() => {
    if (!rows) return;
    const remote = asThemeId(
      rows.find((r) => r.key === CONTENT_KEYS.theme)?.data,
    );
    if (remote) setThemeState(remote);
  }, [rows]);

  // Reflect state onto the document whenever it changes.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const updateContent = useMutation(api.siteContent.update);

  const setTheme = useCallback(
    async (id: ThemeId) => {
      setThemeState(id);
      applyTheme(id);
      try {
        await updateContent({ key: CONTENT_KEYS.theme, data: { theme: id } });
        return true;
      } catch {
        return false;
      }
    },
    [updateContent],
  );

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  return (
    <SiteThemeContext.Provider value={value}>
      {children}
    </SiteThemeContext.Provider>
  );
}

export function useSiteTheme(): SiteThemeContextValue {
  const ctx = useContext(SiteThemeContext);
  if (!ctx) {
    throw new Error("useSiteTheme must be used inside <SiteThemeProvider>");
  }
  return ctx;
}
