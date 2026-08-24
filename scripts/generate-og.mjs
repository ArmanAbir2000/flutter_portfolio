/**
 * OG share-card generator — renders public/og/og-default.png (1200×630).
 *
 * Run: bun run og        (or: node scripts/generate-og.mjs)
 *
 * Design mirrors the site: near-black canvas, IBM Plex Mono type, corner
 * brackets + sparkle mark from the favicon, one green "available" accent.
 */
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg } from "@resvg/resvg-js";

const here = dirname(fileURLToPath(import.meta.url));
const font = (name) => resolve(here, "og-fonts", name);

const W = 1200;
const H = 630;

// Sparkle mark lifted straight from public/logo.svg (viewBox 512×512,
// path drawn around translate(137,101)); we crop a window around it.
const MARK_PATH =
  "M0 0 C1.98 0 3.96 0 6 0 C6.11214844 1.12921875 6.11214844 1.12921875 6.2265625 2.28125 C8.51377119 20.75830847 16.31252267 39.06893965 31 51 C43.08361357 59.32394203 56.46515287 63.97539551 71 66 C71 67.65 71 69.3 71 71 C69.1128125 71.4021875 69.1128125 71.4021875 67.1875 71.8125 C47.81736807 76.15922834 29.50469751 83.47198647 18.21875 100.72265625 C11.13249192 112.3579317 8.19701903 123.73466542 6 137 C4.02 137 2.04 137 0 137 C-0.17015625 136.14019531 -0.3403125 135.28039062 -0.515625 134.39453125 C-4.72307923 113.87200183 -10.94306599 96.37189387 -28.88476562 84.15698242 C-39.70991759 77.11662204 -52.19069499 73.208425 -65 72 C-65 70.02 -65 68.04 -65 66 C-63.38544922 65.65388672 -63.38544922 65.65388672 -61.73828125 65.30078125 C-41.85740803 60.91711045 -24.13459363 54.32953766 -12.3125 36.8125 C-5.485394 25.55321812 -2.05440229 12.91610327 0 0 Z ";

function bracket(x, y, dx, dy) {
  const L = 30;
  return `<path d="M ${x} ${y + dy * L} L ${x} ${y} L ${x + dx * L} ${y}" fill="none" stroke="#ffffff" stroke-opacity="0.18" stroke-width="2"/>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="glow" cx="82%" cy="6%" r="70%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.09"/>
      <stop offset="55%" stop-color="#ffffff" stop-opacity="0.02"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.05"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="#0a0a0a"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- corner brackets, echoing the favicon frame -->
  ${bracket(56, 56, 1, 1)}
  ${bracket(W - 56, 56, -1, 1)}
  ${bracket(56, H - 56, 1, -1)}
  ${bracket(W - 56, H - 56, -1, -1)}

  <!-- brand row -->
  <svg x="72" y="62" width="44" height="44" viewBox="40 70 200 200">
    <path d="${MARK_PATH}" transform="translate(137,101)" fill="#fafafa"/>
  </svg>
  <text x="134" y="92" font-family="IBM Plex Mono" font-weight="500"
    font-size="21" letter-spacing="6" fill="#d4d4d4">SHIKI CODE STUDIO</text>

  <!-- headline -->
  <text x="70" y="330" font-family="IBM Plex Mono" font-weight="700"
    font-size="118" letter-spacing="-5" fill="#fafafa">ARMAN ABIR</text>

  <text x="74" y="398" font-family="IBM Plex Mono" font-weight="400"
    font-size="37" letter-spacing="-0.5" fill="#a1a1aa">Flutter apps with serious backbones.</text>

  <!-- hairline -->
  <rect x="72" y="484" width="1056" height="1" fill="#ffffff" fill-opacity="0.12"/>

  <!-- footer row -->
  <text x="72" y="546" font-family="IBM Plex Mono" font-weight="500"
    font-size="20" letter-spacing="4" fill="#71717a">FLUTTER · LARAVEL · FIREBASE</text>

  <circle cx="905" cy="539" r="5" fill="#34d399"/>
  <text x="924" y="546" font-family="IBM Plex Mono" font-weight="500"
    font-size="20" letter-spacing="3" fill="#e4e4e7">AVAILABLE FOR WORK</text>

  <rect y="${H - 4}" width="${W}" height="4" fill="url(#fade)"/>
</svg>`;

const out = resolve(here, "..", "public", "og", "og-default.png");
mkdirSync(dirname(out), { recursive: true });

const png = new Resvg(svg, {
  fitTo: { mode: "original" },
  background: "#0a0a0a",
  font: {
    loadSystemFonts: false,
    fontFiles: [
      font("IBMPlexMono-Regular.ttf"),
      font("IBMPlexMono-Medium.ttf"),
      font("IBMPlexMono-Bold.ttf"),
    ],
    defaultFontFamily: "IBM Plex Mono",
  },
})
  .render()
  .asPng();

await import("node:fs").then((fs) => fs.writeFileSync(out, png));
console.log(`Wrote ${out} (${(png.length / 1024).toFixed(1)} kB)`);
