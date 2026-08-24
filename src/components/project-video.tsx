import { useRef, useState } from "react";
import { Play } from "lucide-react";

/**
 * Click-to-load video embed for YouTube / Vimeo demo links.
 * Nothing loads from the provider until the visitor presses play,
 * so project pages stay fast and cookie-free by default.
 */

export type ParsedVideo =
  | { kind: "youtube"; id: string }
  | { kind: "vimeo"; id: string }
  | null;

export function parseVideoUrl(url: string | undefined): ParsedVideo {
  const u = url?.trim();
  if (!u) return null;
  const yt = u.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (yt) return { kind: "youtube", id: yt[1] };
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d{6,})/);
  if (vm) return { kind: "vimeo", id: vm[1] };
  return null;
}

export function ProjectVideo({ url, title }: { url: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const parsed = parseVideoUrl(url);
  const labelRef = useRef<string>(title);

  if (!parsed) return null;

  const embedSrc =
    parsed.kind === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${parsed.id}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${parsed.id}?autoplay=1`;

  const thumb =
    parsed.kind === "youtube"
      ? `https://i.ytimg.com/vi/${parsed.id}/hqdefault.jpg`
      : undefined;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border/60 bg-muted">
      {playing ? (
        <iframe
          src={embedSrc}
          title={labelRef.current + " — demo video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full"
        />
      ) : (
        <button
          type="button"
          aria-label={"Play demo video for " + labelRef.current}
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 block size-full cursor-pointer"
        >
          {thumb && (
            <img
              src={thumb}
              alt=""
              loading="lazy"
              className="absolute inset-0 size-full scale-[1.35] object-cover opacity-75 transition-opacity duration-300 group-hover:opacity-90"
            />
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/25 transition-colors duration-300 group-hover:bg-black/15">
            <span className="inline-flex items-center gap-2.5 rounded-full bg-background px-5 py-2.5 text-sm font-semibold tracking-tight text-foreground shadow-lg transition-transform duration-300 group-hover:scale-105">
              <Play className="size-4 fill-current" />
              Watch demo
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
