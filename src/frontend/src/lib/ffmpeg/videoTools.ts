import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import { FFmpegLoadError, ensureFfmpegReady } from "./loadFfmpeg";

export type VideoFormat = "mp4" | "mov" | "avi" | "mkv";
export type CompressPreset = "1080p" | "720p" | "480p" | "360p";

const RESOLUTION_MAP: Record<CompressPreset, string> = {
  "1080p": "1920:1080",
  "720p": "1280:720",
  "480p": "854:480",
  "360p": "640:360",
};

const MIME_MAP: Record<VideoFormat, string> = {
  mp4: "video/mp4",
  mov: "video/quicktime",
  avi: "video/x-msvideo",
  mkv: "video/x-matroska",
};

async function withFfmpeg<T>(
  onProgress: (progress: number) => void,
  operation: (ffmpeg: FFmpeg) => Promise<T>,
): Promise<T> {
  console.log("[VideoTools] Starting operation, ensuring FFmpeg ready...");
  const ffmpeg = await ensureFfmpegReady();
  console.log("[VideoTools] FFmpeg ready. Setting progress handler.");

  ffmpeg.on("progress", ({ progress: p }) => {
    const pct = Math.round(p * 100);
    console.log("[VideoTools] FFmpeg progress:", pct, "%");
    onProgress(pct);
  });

  ffmpeg.on("log", ({ message }) => {
    console.log("[VideoTools] FFmpeg log:", message);
  });

  try {
    const result = await operation(ffmpeg);
    console.log("[VideoTools] Operation completed successfully.");
    return result;
  } catch (err) {
    if (err instanceof FFmpegLoadError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[VideoTools] Operation failed:", message, err);
    throw new Error(`Conversion failed: ${message}`);
  }
}

export async function convertVideoFormat(
  file: File,
  format: VideoFormat,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  return withFfmpeg(onProgress, async (ffmpeg) => {
    const ext = file.name.split(".").pop() ?? "mp4";
    const inputName = `input.${ext}`;
    const outputName = `output.${format}`;

    console.log(
      "[VideoTools/convert] Writing input:",
      inputName,
      "size:",
      file.size,
    );
    const fileData = await fetchFile(file);
    console.log(
      "[VideoTools/convert] fetchFile returned, length:",
      (fileData as Uint8Array).length ?? "N/A",
    );
    await ffmpeg.writeFile(inputName, fileData);
    console.log("[VideoTools/convert] writeFile done.");

    const args = ["-i", inputName, "-c", "copy", outputName];
    console.log("[VideoTools/convert] Executing:", args);
    await ffmpeg.exec(args);
    console.log("[VideoTools/convert] exec done.");

    const data = await ffmpeg.readFile(outputName);
    console.log(
      "[VideoTools/convert] readFile done. Output size:",
      (data as Uint8Array).length ?? "N/A",
    );
    return new Blob([(data as Uint8Array).buffer as ArrayBuffer], {
      type: MIME_MAP[format],
    });
  });
}

export async function compressVideo(
  file: File,
  resolution: string,
  bitrate: number,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  return withFfmpeg(onProgress, async (ffmpeg) => {
    const ext = file.name.split(".").pop() ?? "mp4";
    const inputName = `input.${ext}`;
    const scale = RESOLUTION_MAP[resolution as CompressPreset] ?? "1280:720";

    console.log(
      "[VideoTools/compress] Writing input:",
      inputName,
      "size:",
      file.size,
    );
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputName, fileData);
    console.log("[VideoTools/compress] writeFile done.");

    const args = [
      "-i",
      inputName,
      "-vf",
      `scale=${scale}`,
      "-b:v",
      `${bitrate}k`,
      "-c:v",
      "libx264",
      "-preset",
      "fast",
      "-c:a",
      "aac",
      "output.mp4",
    ];
    console.log("[VideoTools/compress] Executing:", args);
    await ffmpeg.exec(args);
    console.log("[VideoTools/compress] exec done.");

    const data = await ffmpeg.readFile("output.mp4");
    console.log(
      "[VideoTools/compress] readFile done. Output size:",
      (data as Uint8Array).length ?? "N/A",
    );
    return new Blob([(data as Uint8Array).buffer as ArrayBuffer], {
      type: "video/mp4",
    });
  });
}

export async function muteVideo(
  file: File,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  return withFfmpeg(onProgress, async (ffmpeg) => {
    const ext = file.name.split(".").pop() ?? "mp4";
    const inputName = `input.${ext}`;
    const outputName = `output.${ext}`;

    console.log(
      "[VideoTools/mute] Writing input:",
      inputName,
      "size:",
      file.size,
    );
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputName, fileData);
    console.log("[VideoTools/mute] writeFile done.");

    const args = ["-i", inputName, "-an", "-c:v", "copy", outputName];
    console.log("[VideoTools/mute] Executing:", args);
    await ffmpeg.exec(args);
    console.log("[VideoTools/mute] exec done.");

    const data = await ffmpeg.readFile(outputName);
    console.log(
      "[VideoTools/mute] readFile done. Output size:",
      (data as Uint8Array).length ?? "N/A",
    );
    return new Blob([(data as Uint8Array).buffer as ArrayBuffer], {
      type: file.type || "video/mp4",
    });
  });
}

export async function makeGif(
  file: File,
  options: { fps: number; width: number; loop: number },
  onProgress: (progress: number) => void,
): Promise<Blob> {
  return withFfmpeg(onProgress, async (ffmpeg) => {
    const ext = file.name.split(".").pop() ?? "mp4";
    const inputName = `input.${ext}`;

    console.log(
      "[VideoTools/gif] Writing input:",
      inputName,
      "size:",
      file.size,
    );
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputName, fileData);
    console.log("[VideoTools/gif] writeFile done.");

    const args = [
      "-i",
      inputName,
      "-vf",
      `fps=${options.fps},scale=${options.width}:-1:flags=lanczos`,
      "-loop",
      String(options.loop),
      "output.gif",
    ];
    console.log("[VideoTools/gif] Executing:", args);
    await ffmpeg.exec(args);
    console.log("[VideoTools/gif] exec done.");

    const data = await ffmpeg.readFile("output.gif");
    console.log(
      "[VideoTools/gif] readFile done. Output size:",
      (data as Uint8Array).length ?? "N/A",
    );
    return new Blob([(data as Uint8Array).buffer as ArrayBuffer], {
      type: "image/gif",
    });
  });
}

export async function mergeMedia(
  files: File[],
  onProgress: (progress: number) => void,
): Promise<Blob> {
  return withFfmpeg(onProgress, async (ffmpeg) => {
    const ext = files[0].name.split(".").pop() ?? "mp4";
    let concat = "";
    for (let i = 0; i < files.length; i++) {
      const name = `input${i}.${ext}`;
      console.log(
        "[VideoTools/merge] Writing input",
        i,
        ":",
        name,
        "size:",
        files[i].size,
      );
      const fileData = await fetchFile(files[i]);
      await ffmpeg.writeFile(name, fileData);
      concat += `file '${name}'\n`;
    }
    console.log("[VideoTools/merge] Writing concat.txt");
    await ffmpeg.writeFile("concat.txt", concat);

    const args = [
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      "concat.txt",
      "-c",
      "copy",
      `merged.${ext}`,
    ];
    console.log("[VideoTools/merge] Executing:", args);
    await ffmpeg.exec(args);
    console.log("[VideoTools/merge] exec done.");

    const data = await ffmpeg.readFile(`merged.${ext}`);
    console.log(
      "[VideoTools/merge] readFile done. Output size:",
      (data as Uint8Array).length ?? "N/A",
    );
    return new Blob([(data as Uint8Array).buffer as ArrayBuffer], {
      type: files[0].type || "video/mp4",
    });
  });
}

export interface SplitSegment {
  name: string;
  blob: Blob;
}

export async function splitMedia(
  file: File,
  timepoints: string[],
  onProgress: (progress: number, total: number) => void,
): Promise<SplitSegment[]> {
  console.log(
    "[VideoTools/split] Starting splitMedia for",
    file.name,
    "timepoints:",
    timepoints,
  );
  const ffmpeg = await ensureFfmpegReady();
  console.log("[VideoTools/split] FFmpeg ready.");

  ffmpeg.on("log", ({ message }) => {
    console.log("[VideoTools/split] FFmpeg log:", message);
  });

  try {
    const ext = file.name.split(".").pop() ?? "mp4";
    const inputName = `input.${ext}`;

    console.log(
      "[VideoTools/split] Writing input:",
      inputName,
      "size:",
      file.size,
    );
    const fileData = await fetchFile(file);
    await ffmpeg.writeFile(inputName, fileData);
    console.log("[VideoTools/split] writeFile done.");

    const points = ["00:00:00", ...timepoints, "99:99:99"];
    const results: SplitSegment[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const outName = `part${i + 1}.${ext}`;
      const args = [
        "-i",
        inputName,
        "-ss",
        points[i],
        "-to",
        points[i + 1],
        "-c",
        "copy",
        outName,
      ];
      console.log("[VideoTools/split] Executing segment", i + 1, ":", args);
      await ffmpeg.exec(args);
      console.log("[VideoTools/split] Segment", i + 1, "exec done.");

      try {
        const data = await ffmpeg.readFile(outName);
        console.log(
          "[VideoTools/split] Segment",
          i + 1,
          "readFile done. size:",
          (data as Uint8Array).length ?? "N/A",
        );
        results.push({
          name: outName,
          blob: new Blob([(data as Uint8Array).buffer as ArrayBuffer], {
            type: file.type || "video/mp4",
          }),
        });
      } catch (readErr) {
        console.warn(
          "[VideoTools/split] Segment",
          i + 1,
          "readFile failed (empty segment?):",
          readErr,
        );
      }
      onProgress(i + 1, points.length - 1);
    }
    console.log(
      "[VideoTools/split] All segments processed. count:",
      results.length,
    );
    return results;
  } catch (err) {
    if (err instanceof FFmpegLoadError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[VideoTools/split] Error during split:", message, err);
    throw new Error(`Split failed: ${message}`);
  }
}
