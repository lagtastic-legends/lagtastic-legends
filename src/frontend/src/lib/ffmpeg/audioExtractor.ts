import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { FFmpegLoadError, ensureFfmpegReady } from "./loadFfmpeg";

export type AudioFormat = "mp3" | "wav" | "flac" | "aac" | "ogg" | "m4a";
export type QualityPreset = "lossless" | "high" | "standard" | "low";

const MIME_MAP: Record<AudioFormat, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  flac: "audio/flac",
  aac: "audio/aac",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
};

function buildAudioArgs(format: AudioFormat, quality: QualityPreset): string[] {
  if (format === "flac" || (format === "wav" && quality === "lossless")) {
    return ["-c:a", format === "flac" ? "flac" : "pcm_s16le"];
  }
  if (format === "wav") {
    return ["-c:a", "pcm_s16le", "-ar", "44100"];
  }
  const bitrateMap: Record<QualityPreset, string> = {
    lossless: "320k",
    high: "320k",
    standard: "192k",
    low: "128k",
  };
  const bitrate = bitrateMap[quality];
  if (format === "mp3") return ["-c:a", "libmp3lame", "-b:a", bitrate];
  if (format === "aac" || format === "m4a")
    return ["-c:a", "aac", "-b:a", bitrate];
  if (format === "ogg") return ["-c:a", "libvorbis", "-b:a", bitrate];
  return ["-c:a", "copy"];
}

export async function extractAudio(
  file: File,
  format: AudioFormat,
  quality: QualityPreset,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  console.log(
    "[AudioExtractor] Starting extractAudio for",
    file.name,
    "format:",
    format,
    "quality:",
    quality,
  );
  const ffmpeg = await ensureFfmpegReady();
  console.log("[AudioExtractor] FFmpeg ready. Setting progress handler.");

  ffmpeg.on("progress", ({ progress: p }) => {
    const pct = Math.round(p * 100);
    console.log("[AudioExtractor] FFmpeg progress:", pct, "%");
    onProgress(pct);
  });

  ffmpeg.on("log", ({ message }) => {
    console.log("[AudioExtractor] FFmpeg log:", message);
  });

  try {
    const ext = file.name.split(".").pop() ?? "mp4";
    const inputName = `input.${ext}`;
    const outputName = `output.${format}`;

    console.log(
      "[AudioExtractor] Writing input file:",
      inputName,
      "size:",
      file.size,
    );
    const fileData = await fetchFile(file);
    console.log(
      "[AudioExtractor] fetchFile returned, type:",
      typeof fileData,
      "length:",
      (fileData as Uint8Array).length ?? "N/A",
    );
    await ffmpeg.writeFile(inputName, fileData);
    console.log("[AudioExtractor] writeFile completed.");

    const audioArgs = buildAudioArgs(format, quality);
    const args = ["-i", inputName, "-vn", ...audioArgs, outputName];
    console.log("[AudioExtractor] Executing ffmpeg with args:", args);
    await ffmpeg.exec(args);
    console.log("[AudioExtractor] ffmpeg.exec completed.");

    console.log("[AudioExtractor] Reading output file:", outputName);
    const data = await ffmpeg.readFile(outputName);
    console.log(
      "[AudioExtractor] readFile completed. Output size:",
      (data as Uint8Array).length ?? "N/A",
    );

    const blob = new Blob([(data as Uint8Array).buffer as ArrayBuffer], {
      type: MIME_MAP[format],
    });
    console.log(
      "[AudioExtractor] Blob created. size:",
      blob.size,
      "type:",
      blob.type,
    );
    return blob;
  } catch (err) {
    if (err instanceof FFmpegLoadError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[AudioExtractor] Error during extraction:", message, err);
    throw new Error(`Audio extraction failed: ${message}`);
  }
}
