import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, A as AnimatePresence, D as Download } from "./index-C7SiQumv.js";
import { A as Alert, a as AlertDescription, b as AlertTitle } from "./alert-B08A_fUg.js";
import { B as Button, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BUE6aIsi.js";
import { I as Input } from "./input-DeaYCkik.js";
import { L as Label } from "./label-DjSXj35-.js";
import { u as useFileManager } from "./useFileManager-pUWi2FwS.js";
import { L as LoaderCircle } from "./loader-circle-B1soad14.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode);
function UrlDownloaderPanel() {
  const { saveToManager } = useFileManager();
  const [url, setUrl] = reactExports.useState("");
  const [isFocused, setIsFocused] = reactExports.useState(false);
  const [isDownloading, setIsDownloading] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [error, setError] = reactExports.useState(null);
  const [success, setSuccess] = reactExports.useState(null);
  const [saveOption, setSaveOption] = reactExports.useState(false);
  const handleDownload = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }
    setIsDownloading(true);
    setError(null);
    setSuccess(null);
    setProgress(10);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error ${response.status}`);
      setProgress(50);
      const blob = await response.blob();
      setProgress(80);
      const urlParts = url.split("/");
      const filename = urlParts[urlParts.length - 1].split("?")[0] || `download_${Date.now()}`;
      if (saveOption) {
        const reader = new FileReader();
        reader.onload = () => {
          saveToManager({
            name: filename,
            type: blob.type || "application/octet-stream",
            size: blob.size,
            dataUrl: reader.result
          });
        };
        reader.readAsDataURL(blob);
      }
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
      setProgress(100);
      setSuccess(
        `Downloaded: ${filename}${saveOption ? " (saved to File Manager)" : ""}`
      );
      setUrl("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Download failed — CORS restrictions may be blocking this URL."
      );
    } finally {
      setIsDownloading(false);
      setTimeout(() => setProgress(0), 1200);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "download-url", children: "Media URL" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: isFocused ? { scale: 1.01, y: -1 } : { scale: 1, y: 0 },
            transition: { type: "spring", stiffness: 400, damping: 25 },
            className: "mt-2",
            style: isFocused ? { filter: "drop-shadow(0 0 8px rgba(6,182,212,0.3))" } : {},
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                "data-ocid": "downloader.url.input",
                id: "download-url",
                type: "url",
                value: url,
                onChange: (e) => setUrl(e.target.value),
                onFocus: () => setIsFocused(true),
                onBlur: () => setIsFocused(false),
                placeholder: "https://example.com/video.mp4",
                disabled: isDownloading,
                onKeyDown: (e) => {
                  if (e.key === "Enter") handleDownload();
                },
                className: "transition-all duration-150"
              }
            )
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: "Works best with direct media links (.mp4, .mp3, .jpg, etc.)" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            "data-ocid": "downloader.save_to_manager.checkbox",
            id: "save-to-manager",
            type: "checkbox",
            checked: saveOption,
            onChange: (e) => setSaveOption(e.target.checked),
            className: "w-4 h-4 rounded accent-cyan-500 cursor-pointer"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "save-to-manager", className: "cursor-pointer text-sm", children: "Also save to File Manager after download" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isDownloading && progress > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        "data-ocid": "downloader.loading_state",
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: "auto" },
        exit: { opacity: 0, height: 0 },
        className: "space-y-1",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Downloading…" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              progress,
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 bg-muted rounded-full overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              className: "h-full rounded-full",
              style: { background: "#06B6D4" },
              initial: { width: 0 },
              animate: { width: `${progress}%` },
              transition: { duration: 0.4 }
            }
          ) })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: error && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        "data-ocid": "downloader.error_state",
        initial: { opacity: 0, y: -4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { variant: "destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: error }) })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: success && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        "data-ocid": "downloader.success_state",
        initial: { opacity: 0, y: -4 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Alert, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: success }) })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.97 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        "data-ocid": "downloader.primary_button",
        onClick: handleDownload,
        disabled: !url.trim() || isDownloading,
        className: "w-full",
        size: "lg",
        children: isDownloading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
          "Downloading…"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4 mr-2" }),
          "Download Media"
        ] })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { className: "border-amber-500/30 bg-amber-500/5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4 text-amber-500" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { className: "text-amber-500 text-sm", children: "CORS & DRM Limitations" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { className: "text-xs", children: "Many platforms (YouTube, Instagram, X/Twitter) block browser downloads via CORS, DRM, or authentication. This tool works best with direct, publicly-accessible media file URLs." })
    ] })
  ] });
}
function DownloaderPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "space-y-6",
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { type: "spring", stiffness: 300, damping: 30 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Media Downloader" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Download media files from URLs" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: 0.06
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Alert, { variant: "default", className: "border-primary/50 bg-primary/5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-4 w-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertTitle, { children: "Important Limitations" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDescription, { children: "This tool uses generic HTTP fetching. Many platforms (YouTube, Instagram, etc.) block browser downloads due to CORS, DRM, or authentication requirements. It works best with direct media links." })
            ] })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 30,
              delay: 0.12
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                whileHover: { y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" },
                transition: { type: "spring", stiffness: 400, damping: 25 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Download Media" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Paste a direct media URL to download the file" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(UrlDownloaderPanel, {}) })
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
  DownloaderPage
};
