import { FFmpegLoadError, getFfmpeg } from "@/lib/ffmpeg";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export type RingtoneFormat = "mp3" | "m4r" | "ogg";

const MIME_MAP: Record<RingtoneFormat, string> = {
  mp3: "audio/mpeg",
  m4r: "audio/mp4",
  ogg: "audio/ogg",
};

export async function createRingtone(
  file: File,
  startTime: number,
  endTime: number,
  fadeInDuration: number,
  fadeOutDuration: number,
  format: RingtoneFormat,
  onProgress: (progress: number) => void,
): Promise<Blob> {
  const ffmpeg = await getFfmpeg();
  ffmpeg.on("progress", ({ progress: p }) => onProgress(Math.round(p * 100)));
  try {
    const ext = file.name.split(".").pop() ?? "mp3";
    const inputName = `input.${ext}`;
    const segDuration = endTime - startTime;
    const filters: string[] = [];
    if (fadeInDuration > 0) {
      filters.push(`afade=t=in:st=0:d=${fadeInDuration}`);
    }
    if (fadeOutDuration > 0) {
      const fadeStart = segDuration - fadeOutDuration;
      filters.push(`afade=t=out:st=${fadeStart}:d=${fadeOutDuration}`);
    }
    const codecArgs: string[] =
      format === "mp3"
        ? ["-c:a", "libmp3lame", "-b:a", "192k"]
        : format === "ogg"
          ? ["-c:a", "libvorbis", "-b:a", "192k"]
          : ["-c:a", "aac", "-b:a", "192k"];
    const realExt = format === "m4r" ? "m4a" : format;
    const outputName = `output.${realExt}`;
    await ffmpeg.writeFile(inputName, await fetchFile(file));
    const ffArgs = [
      "-i",
      inputName,
      "-ss",
      String(startTime),
      "-t",
      String(segDuration),
      "-vn",
      ...(filters.length > 0 ? ["-af", filters.join(",")] : []),
      ...codecArgs,
      outputName,
    ];
    await ffmpeg.exec(ffArgs);
    const data = await ffmpeg.readFile(outputName);
    return new Blob([(data as Uint8Array).buffer as ArrayBuffer], {
      type: MIME_MAP[format],
    });
  } catch (err) {
    if (err instanceof FFmpegLoadError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Ringtone creation failed: ${message}`);
  }
}
