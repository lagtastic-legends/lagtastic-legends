import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, D as Download, A as AnimatePresence } from "./index-C7SiQumv.js";
import { A as Alert, a as AlertDescription } from "./alert-B08A_fUg.js";
import { B as Button, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BUE6aIsi.js";
import { L as Label } from "./label-DjSXj35-.js";
import { e as ensureFfmpegReady, f as fetchFile, F as FFmpegLoadError, P as Progress } from "./loadFfmpeg-DdmWCwwW.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Ud0mtTtf.js";
import { U as Upload } from "./upload-B3IIcvra.js";
import { L as LoaderCircle } from "./loader-circle-B1soad14.js";
import { m as muteVideo, c as compressVideo, a as convertVideoFormat } from "./videoTools-DkMcdMVq.js";
import { I as Input } from "./input-DeaYCkik.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-gBfJxeso.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z",
      key: "uqj9uw"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15", key: "1ewh16" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15", key: "5ykzw1" }]
];
const VolumeX = createLucideIcon("volume-x", __iconNode);
const MIME_MAP = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  flac: "audio/flac",
  aac: "audio/aac",
  ogg: "audio/ogg",
  m4a: "audio/mp4"
};
function buildAudioArgs(format, quality) {
  if (format === "flac" || format === "wav" && quality === "lossless") {
    return ["-c:a", format === "flac" ? "flac" : "pcm_s16le"];
  }
  if (format === "wav") {
    return ["-c:a", "pcm_s16le", "-ar", "44100"];
  }
  const bitrateMap = {
    lossless: "320k",
    high: "320k",
    standard: "192k",
    low: "128k"
  };
  const bitrate = bitrateMap[quality];
  if (format === "mp3") return ["-c:a", "libmp3lame", "-b:a", bitrate];
  if (format === "aac" || format === "m4a")
    return ["-c:a", "aac", "-b:a", bitrate];
  if (format === "ogg") return ["-c:a", "libvorbis", "-b:a", bitrate];
  return ["-c:a", "copy"];
}
async function extractAudio(file, format, quality, onProgress) {
  console.log(
    "[AudioExtractor] Starting extractAudio for",
    file.name,
    "format:",
    format,
    "quality:",
    quality
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
      file.size
    );
    const fileData = await fetchFile(file);
    console.log(
      "[AudioExtractor] fetchFile returned, type:",
      typeof fileData,
      "length:",
      fileData.length ?? "N/A"
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
      data.length ?? "N/A"
    );
    const blob = new Blob([data.buffer], {
      type: MIME_MAP[format]
    });
    console.log(
      "[AudioExtractor] Blob created. size:",
      blob.size,
      "type:",
      blob.type
    );
    return blob;
  } catch (err) {
    if (err instanceof FFmpegLoadError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    console.error("[AudioExtractor] Error during extraction:", message, err);
    throw new Error(`Audio extraction failed: ${message}`);
  }
}
const QUALITY_DESCRIPTIONS = {
  lossless: "Lossless/Hi-Fi - Uncompressed audio (WAV/FLAC)",
  high: "High Quality - 320kbps MP3 or 256kbps AAC",
  standard: "Standard Quality - 192kbps MP3 (balanced size/quality)",
  low: "Low Quality - 64-128kbps MP3 (smaller file size)"
};
function AudioExtractPanel() {
  const [file, setFile] = reactExports.useState(null);
  const [format, setFormat] = reactExports.useState("mp3");
  const [quality, setQuality] = reactExports.useState("high");
  const [progress, setProgress] = reactExports.useState(0);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [outputBlob, setOutputBlob] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const handleFileChange = (e) => {
    var _a;
    const selectedFile = (_a = e.target.files) == null ? void 0 : _a[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setOutputBlob(null);
    }
  };
  const handleConvert = async () => {
    if (!file) {
      setError("Please select a video file first");
      return;
    }
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setOutputBlob(null);
    try {
      console.log("[AudioExtractPanel] Starting conversion for", file.name);
      const blob = await extractAudio(
        file,
        format,
        quality,
        (p) => setProgress(p)
      );
      console.log(
        "[AudioExtractPanel] Conversion succeeded. Blob size:",
        blob.size
      );
      setOutputBlob(blob);
      setProgress(100);
    } catch (err) {
      console.error("[AudioExtractPanel] Conversion failed:", err);
      const msg = err instanceof Error ? err.message : "Conversion failed";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.2 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "video-file", children: "Video File" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  id: "video-file",
                  type: "file",
                  accept: "video/*",
                  onChange: handleFileChange,
                  className: "hidden"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "outline",
                  onClick: () => {
                    var _a;
                    return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                  },
                  className: "w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-sm",
                  disabled: isProcessing,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 mr-2" }),
                    file ? file.name : "Choose Video File"
                  ]
                }
              )
            ] })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.2, delay: 0.05 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "format", children: "Output Format" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: format,
                onValueChange: (v) => setFormat(v),
                disabled: isProcessing,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "format", className: "transition-all duration-150", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mp3", children: "MP3" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "wav", children: "WAV" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "flac", children: "FLAC" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "aac", children: "AAC" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ogg", children: "OGG" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "m4a", children: "M4A" })
                  ] })
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: 6 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.2, delay: 0.1 },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "quality", children: "Quality Preset" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Select,
              {
                value: quality,
                onValueChange: (v) => setQuality(v),
                disabled: isProcessing,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { id: "quality", className: "transition-all duration-150", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "lossless", children: "Lossless/Hi-Fi" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "high", children: "High Quality" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "standard", children: "Standard Quality" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "low", children: "Low Quality" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: QUALITY_DESCRIPTIONS[quality] })
          ]
        }
      )
    ] }),
    isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "space-y-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Converting..." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              Math.round(progress),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "progress-smooth" })
        ]
      }
    ),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 4 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.15 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error }) })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleConvert,
          disabled: !file || isProcessing,
          className: "flex-1 transition-all duration-200 hover:scale-[1.02]",
          children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Converting..."
          ] }) : "Convert to Audio"
        }
      ),
      outputBlob && /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { type: "spring", stiffness: 400, damping: 20 },
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              onClick: handleDownload,
              variant: "secondary",
              className: "transition-all duration-200 hover:scale-105",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
                "Download"
              ]
            }
          )
        }
      )
    ] })
  ] });
}
function MuteVideoPanel() {
  const [file, setFile] = reactExports.useState(null);
  const [progress, setProgress] = reactExports.useState(0);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [outputUrl, setOutputUrl] = reactExports.useState(null);
  const [error, setError] = reactExports.useState("");
  const inputRef = reactExports.useRef(null);
  const handleFile = (e) => {
    var _a;
    const f = (_a = e.target.files) == null ? void 0 : _a[0];
    if (f) {
      setFile(f);
      setOutputUrl(null);
      setError("");
    }
  };
  const mute = async () => {
    if (!file) return;
    setIsProcessing(true);
    setProgress(0);
    setError("");
    setOutputUrl(null);
    try {
      console.log("[MuteVideoPanel] Starting mute for", file.name);
      const blob = await muteVideo(file, (p) => setProgress(p));
      console.log("[MuteVideoPanel] Mute succeeded. Blob size:", blob.size);
      setOutputUrl(URL.createObjectURL(blob));
    } catch (e) {
      console.error("[MuteVideoPanel] Mute failed:", e);
      const msg = e instanceof Error ? e.message : "Failed to mute video. Ensure FFmpeg WASM core is accessible.";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        "data-ocid": "mute.dropzone",
        onClick: () => {
          var _a;
          return (_a = inputRef.current) == null ? void 0 : _a.click();
        },
        className: "w-full border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all duration-200",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: inputRef,
              type: "file",
              accept: "video/*",
              className: "hidden",
              onChange: handleFile
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "w-8 h-8 mx-auto mb-3 text-muted-foreground" }),
          file ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: file.name }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Click to upload a video" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "MP4, MOV, AVI, MKV supported" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        "data-ocid": "mute.primary_button",
        onClick: mute,
        disabled: !file || isProcessing,
        className: "w-full",
        size: "lg",
        children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
          "Removing Audio..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "mr-2 h-4 w-4" }),
          "Remove Audio Track"
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        className: "space-y-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Processing..." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              progress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { "data-ocid": "mute.loading_state", value: progress })
        ]
      }
    ) }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { "data-ocid": "mute.error_state", className: "text-destructive text-sm", children: error }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: outputUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: outputUrl, download: `muted_${file == null ? void 0 : file.name}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            "data-ocid": "mute.secondary_button",
            variant: "outline",
            className: "w-full",
            size: "lg",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
              " Download Muted Video"
            ]
          }
        ) })
      }
    ) })
  ] });
}
function validateBitrate(bitrate) {
  const bitrateNum = Number.parseInt(bitrate);
  if (Number.isNaN(bitrateNum)) {
    return "Bitrate must be a valid number";
  }
  if (bitrateNum < 100) {
    return "Bitrate must be at least 100 kbps";
  }
  if (bitrateNum > 5e4) {
    return "Bitrate must be less than 50000 kbps";
  }
  return null;
}
function VideoCompressPanel() {
  const [file, setFile] = reactExports.useState(null);
  const [resolution, setResolution] = reactExports.useState("720p");
  const [bitrate, setBitrate] = reactExports.useState("1000");
  const [progress, setProgress] = reactExports.useState(0);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [outputBlob, setOutputBlob] = reactExports.useState(null);
  const [inputSize, setInputSize] = reactExports.useState(null);
  const [outputSize, setOutputSize] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const handleFileChange = (e) => {
    var _a;
    const selectedFile = (_a = e.target.files) == null ? void 0 : _a[0];
    if (selectedFile) {
      setFile(selectedFile);
      setInputSize(selectedFile.size);
      setError(null);
      setOutputBlob(null);
      setOutputSize(null);
    }
  };
  const handleCompress = async () => {
    if (!file) {
      setError("Please select a video file first");
      return;
    }
    const bitrateError = validateBitrate(bitrate);
    if (bitrateError) {
      setError(bitrateError);
      return;
    }
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setOutputBlob(null);
    setOutputSize(null);
    try {
      console.log(
        "[VideoCompressPanel] Starting compression for",
        file.name,
        "resolution:",
        resolution,
        "bitrate:",
        bitrate
      );
      const blob = await compressVideo(
        file,
        resolution,
        Number.parseInt(bitrate),
        (p) => setProgress(p)
      );
      console.log(
        "[VideoCompressPanel] Compression succeeded. Blob size:",
        blob.size
      );
      setOutputBlob(blob);
      setOutputSize(blob.size);
      setProgress(100);
    } catch (err) {
      console.error("[VideoCompressPanel] Compression failed:", err);
      const msg = err instanceof Error ? err.message : "Compression failed";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}_compressed.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const formatSize = (bytes) => {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "video-compress-file", children: "Video File" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              id: "video-compress-file",
              type: "file",
              accept: "video/*",
              onChange: handleFileChange,
              className: "hidden"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              className: "w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-sm",
              disabled: isProcessing,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 mr-2" }),
                file ? file.name : "Choose Video File"
              ]
            }
          )
        ] }),
        inputSize && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground mt-2", children: [
          "Input size: ",
          formatSize(inputSize)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in animation-delay-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "resolution", children: "Target Resolution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: resolution,
            onValueChange: (v) => setResolution(v),
            disabled: isProcessing,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "resolution",
                  className: "transition-all duration-150",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "1080p", children: "1080p (1920x1080)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "720p", children: "720p (1280x720)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "480p", children: "480p (854x480)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "360p", children: "360p (640x360)" })
              ] })
            ]
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in animation-delay-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "bitrate", children: "Target Bitrate (kbps)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            id: "bitrate",
            type: "number",
            value: bitrate,
            onChange: (e) => setBitrate(e.target.value),
            placeholder: "1000",
            disabled: isProcessing,
            min: "100",
            max: "10000",
            className: "transition-all duration-150 focus:scale-[1.01]"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Recommended: 500-2000 kbps" })
      ] })
    ] }),
    isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Compressing..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          Math.round(progress),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "progress-smooth" })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error }) }) }),
    outputSize && inputSize && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDescription, { children: [
      "Compression complete! Output size: ",
      formatSize(outputSize),
      "(",
      ((1 - outputSize / inputSize) * 100).toFixed(1),
      "% reduction)"
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleCompress,
          disabled: !file || isProcessing,
          className: "flex-1 transition-all duration-200 hover:scale-[1.02]",
          children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Compressing..."
          ] }) : "Compress Video"
        }
      ),
      outputBlob && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleDownload,
          variant: "secondary",
          className: "transition-all duration-200 hover:scale-105 animate-scale-in",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
            "Download"
          ]
        }
      )
    ] })
  ] });
}
function VideoConvertPanel() {
  const [file, setFile] = reactExports.useState(null);
  const [format, setFormat] = reactExports.useState("mp4");
  const [progress, setProgress] = reactExports.useState(0);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [outputBlob, setOutputBlob] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const handleFileChange = (e) => {
    var _a;
    const selectedFile = (_a = e.target.files) == null ? void 0 : _a[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setOutputBlob(null);
    }
  };
  const handleConvert = async () => {
    if (!file) {
      setError("Please select a video file first");
      return;
    }
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    setOutputBlob(null);
    try {
      console.log(
        "[VideoConvertPanel] Starting format conversion for",
        file.name,
        "to",
        format
      );
      const blob = await convertVideoFormat(
        file,
        format,
        (p) => setProgress(p)
      );
      console.log(
        "[VideoConvertPanel] Format conversion succeeded. Blob size:",
        blob.size
      );
      setOutputBlob(blob);
      setProgress(100);
    } catch (err) {
      console.error("[VideoConvertPanel] Format conversion failed:", err);
      const msg = err instanceof Error ? err.message : "Conversion failed";
      setError(msg);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "video-convert-file", children: "Video File" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              id: "video-convert-file",
              type: "file",
              accept: "video/*",
              onChange: handleFileChange,
              className: "hidden"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              className: "w-full transition-all duration-200 hover:scale-[1.02] hover:shadow-sm",
              disabled: isProcessing,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-4 h-4 mr-2" }),
                file ? file.name : "Choose Video File"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in animation-delay-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "video-format", children: "Target Format" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Select,
          {
            value: format,
            onValueChange: (v) => setFormat(v),
            disabled: isProcessing,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                SelectTrigger,
                {
                  id: "video-format",
                  className: "transition-all duration-150",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mp4", children: "MP4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mov", children: "MOV" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "avi", children: "AVI" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mkv", children: "MKV" })
              ] })
            ]
          }
        )
      ] })
    ] }),
    isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Converting..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          Math.round(progress),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress, className: "progress-smooth" })
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          onClick: handleConvert,
          disabled: !file || isProcessing,
          className: "flex-1 transition-all duration-200 hover:scale-[1.02]",
          children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Converting..."
          ] }) : "Convert Format"
        }
      ),
      outputBlob && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          onClick: handleDownload,
          variant: "secondary",
          className: "transition-all duration-200 hover:scale-105 animate-scale-in",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
            "Download"
          ]
        }
      )
    ] })
  ] });
}
const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 }
};
const tabContentVariants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 }
};
const springTransition = {
  type: "spring",
  stiffness: 400,
  damping: 35
};
function ConverterPage() {
  const [activeSubTab, setActiveSubTab] = reactExports.useState("audio");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "space-y-6",
      variants: pageVariants,
      initial: "initial",
      animate: "animate",
      transition: { type: "spring", stiffness: 300, damping: 30 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Media Converter" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Convert videos to audio, change formats, compress, or mute files" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: 0.08
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                whileHover: { y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" },
                transition: { type: "spring", stiffness: 400, damping: 25 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Choose Your Tool" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "All conversions happen in your browser - your files never leave your device" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { value: activeSubTab, onValueChange: setActiveSubTab, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "flex flex-wrap gap-1 h-auto w-full", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TabsTrigger,
                        {
                          "data-ocid": "converter.audio.tab",
                          value: "audio",
                          className: "flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150",
                          children: "Extract"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TabsTrigger,
                        {
                          "data-ocid": "converter.format.tab",
                          value: "format",
                          className: "flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150",
                          children: "Format"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TabsTrigger,
                        {
                          "data-ocid": "converter.compress.tab",
                          value: "compress",
                          className: "flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150",
                          children: "Compress"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        TabsTrigger,
                        {
                          "data-ocid": "converter.mute.tab",
                          value: "mute",
                          className: "flex-1 min-w-fit text-xs sm:text-sm transition-all duration-150",
                          children: "Mute"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      motion.div,
                      {
                        variants: tabContentVariants,
                        initial: "initial",
                        animate: "animate",
                        exit: "exit",
                        transition: springTransition,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            TabsContent,
                            {
                              value: "audio",
                              className: "mt-6",
                              forceMount: activeSubTab === "audio" || void 0,
                              children: activeSubTab === "audio" && /* @__PURE__ */ jsxRuntimeExports.jsx(AudioExtractPanel, {})
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            TabsContent,
                            {
                              value: "format",
                              className: "mt-6",
                              forceMount: activeSubTab === "format" || void 0,
                              children: activeSubTab === "format" && /* @__PURE__ */ jsxRuntimeExports.jsx(VideoConvertPanel, {})
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            TabsContent,
                            {
                              value: "compress",
                              className: "mt-6",
                              forceMount: activeSubTab === "compress" || void 0,
                              children: activeSubTab === "compress" && /* @__PURE__ */ jsxRuntimeExports.jsx(VideoCompressPanel, {})
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            TabsContent,
                            {
                              value: "mute",
                              className: "mt-6",
                              forceMount: activeSubTab === "mute" || void 0,
                              children: activeSubTab === "mute" && /* @__PURE__ */ jsxRuntimeExports.jsx(MuteVideoPanel, {})
                            }
                          )
                        ]
                      },
                      activeSubTab
                    ) })
                  ] }) })
                ] })
              }
            )
          }
        )
      ]
    }
  );
}
export {
  ConverterPage
};
