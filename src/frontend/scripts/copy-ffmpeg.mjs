// Cross-platform script that copies @ffmpeg/core's UMD assets (ffmpeg-core.js
// and ffmpeg-core.wasm) from node_modules into src/frontend/public/ffmpeg/ so
// the in-browser FFmpeg loader can fetch them at runtime.
//
// Run via `pnpm copy:ffmpeg` (wired into the build script in package.json).
import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve from the frontend root (scripts/ -> ../) so the script works no
// matter where `pnpm` invokes it from.
const frontendRoot = resolve(__dirname, "..");
const sourceDir = resolve(
  frontendRoot,
  "node_modules",
  "@ffmpeg",
  "core",
  "dist",
  "umd",
);
const destDir = resolve(frontendRoot, "public", "ffmpeg");

const files = ["ffmpeg-core.js", "ffmpeg-core.wasm"];

if (!existsSync(sourceDir)) {
  console.error(
    `[copy-ffmpeg] Source directory not found: ${sourceDir}. ` +
      "Run `pnpm install` first so @ffmpeg/core is present in node_modules.",
  );
  process.exit(1);
}

mkdirSync(destDir, { recursive: true });

for (const file of files) {
  const src = resolve(sourceDir, file);
  const dest = resolve(destDir, file);
  if (!existsSync(src)) {
    console.error(`[copy-ffmpeg] Missing source file: ${src}`);
    process.exit(1);
  }
  copyFileSync(src, dest);
  console.log(`[copy-ffmpeg] Copied ${file} -> ${dest}`);
}

console.log("[copy-ffmpeg] Done.");
