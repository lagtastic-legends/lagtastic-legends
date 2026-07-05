import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

let sharedInstance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;

export class FFmpegLoadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FFmpegLoadError";
  }
}

function getCorePaths(): { coreURL: string; wasmURL: string } {
  const coreURL = "/ffmpeg/ffmpeg-core.js";
  const wasmURL = "/ffmpeg/ffmpeg-core.wasm";
  return { coreURL, wasmURL };
}

async function doLoad(): Promise<FFmpeg> {
  console.log("[FFmpeg] Starting WASM load...");
  const ffmpeg = new FFmpeg();
  const { coreURL, wasmURL } = getCorePaths();
  console.log("[FFmpeg] Core paths:", { coreURL, wasmURL });

  try {
    console.log("[FFmpeg] Fetching coreURL as blob...");
    const coreBlob = await toBlobURL(coreURL, "text/javascript");
    console.log("[FFmpeg] Core blob fetched:", `${coreBlob.slice(0, 60)}...`);

    console.log("[FFmpeg] Fetching wasmURL as blob...");
    const wasmBlob = await toBlobURL(wasmURL, "application/wasm");
    console.log("[FFmpeg] WASM blob fetched, size:", wasmBlob.length);

    console.log("[FFmpeg] Calling ffmpeg.load()...");
    await ffmpeg.load({ coreURL: coreBlob, wasmURL: wasmBlob });
    console.log("[FFmpeg] ffmpeg.load() succeeded. loaded =", ffmpeg.loaded);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[FFmpeg] Load failed:", message, err);
    throw new FFmpegLoadError(`FFmpeg failed to load: ${message}`);
  }
  return ffmpeg;
}

export async function getFfmpeg(): Promise<FFmpeg> {
  console.log(
    "[FFmpeg] getFfmpeg() called. sharedInstance?.loaded =",
    sharedInstance?.loaded,
  );
  if (sharedInstance?.loaded) {
    console.log("[FFmpeg] Returning existing loaded instance.");
    return sharedInstance;
  }
  if (!loadPromise) {
    console.log("[FFmpeg] No loadPromise, starting doLoad()...");
    loadPromise = doLoad().then((ffmpeg) => {
      sharedInstance = ffmpeg;
      console.log("[FFmpeg] Instance stored in sharedInstance.");
      return ffmpeg;
    });
  } else {
    console.log("[FFmpeg] Reusing existing loadPromise.");
  }
  return loadPromise;
}

export function resetFfmpeg(): void {
  console.log("[FFmpeg] resetFfmpeg() called.");
  sharedInstance = null;
  loadPromise = null;
}

export async function ensureFfmpegReady(): Promise<FFmpeg> {
  const ffmpeg = await getFfmpeg();
  if (!ffmpeg.loaded) {
    throw new FFmpegLoadError("FFmpeg is not fully loaded.");
  }
  console.log("[FFmpeg] Readiness check passed.");
  return ffmpeg;
}
