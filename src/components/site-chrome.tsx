import { ArrowUpRight } from "lucide-react";
import { Link, NavLink } from "react-router";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/projects", label: "Work" },
  { to: "/book", label: "Book" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-foreground" />
          <span className="text-sm font-semibold tracking-tight">Portfolio</span>
        </Link>
        <nav className="flex items-center gap-1">
          <div className="hidden items-center sm:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "cursor-pointer rounded-md px-3 py-2 text-sm text-foreground"
                    : "cursor-pointer rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <Button asChild size="sm" className="ml-2 cursor-pointer">
            <Link to="/book">
              Book a call
              <ArrowUpRight className="size-3.5" />
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex h-auto w-full max-w-6xl flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Portfolio · Built with React,
          TypeScript, and Convex
        </p>
      </div>
    </footer>
  );
}
