import { r as reactExports, j as jsxRuntimeExports, m as motion, I as ImagePlay, A as AnimatePresence, D as Download } from "./index-C7SiQumv.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, B as Button } from "./card-BUE6aIsi.js";
import { L as Label } from "./label-DjSXj35-.js";
import { P as Progress } from "./loadFfmpeg-DdmWCwwW.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Ud0mtTtf.js";
import { b as makeGif } from "./videoTools-DkMcdMVq.js";
import { U as Upload } from "./upload-B3IIcvra.js";
import { L as LoaderCircle } from "./loader-circle-B1soad14.js";
function GifMakerPage() {
  const [file, setFile] = reactExports.useState(null);
  const [fps, setFps] = reactExports.useState("10");
  const [width, setWidth] = reactExports.useState("480");
  const [loop, setLoop] = reactExports.useState("0");
  const [progress, setProgress] = reactExports.useState(0);
  const [isConverting, setIsConverting] = reactExports.useState(false);
  const [gifUrl, setGifUrl] = reactExports.useState(null);
  const [error, setError] = reactExports.useState("");
  const fileInputRef = reactExports.useRef(null);
  const handleFile = (e) => {
    var _a;
    const f = (_a = e.target.files) == null ? void 0 : _a[0];
    if (f) {
      setFile(f);
      setGifUrl(null);
      setError("");
    }
  };
  const convert = async () => {
    if (!file) return;
    setIsConverting(true);
    setProgress(0);
    setError("");
    try {
      const blob = await makeGif(
        file,
        {
          fps: Number(fps),
          width: Number(width),
          loop: Number(loop)
        },
        (p) => setProgress(p)
      );
      setGifUrl(URL.createObjectURL(blob));
    } catch (e) {
      setError("GIF creation failed. Ensure FFmpeg WASM core is accessible.");
      console.error(e);
    } finally {
      setIsConverting(false);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "text-center space-y-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "GIF Maker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Convert video clips into shareable animated GIFs" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1 },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ImagePlay, { className: "w-5 h-5" }),
              " GIF Creator"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Upload a short video clip and convert it to an animated GIF" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "gif.dropzone",
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                className: "w-full border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all duration-200",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      ref: fileInputRef,
                      type: "file",
                      accept: "video/*",
                      className: "hidden",
                      onChange: handleFile
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 mx-auto mb-3 text-muted-foreground" }),
                  file ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: file.name }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Click or drop a video file" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "MP4, MOV, AVI, MKV supported" })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Frame Rate (FPS)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: fps, onValueChange: setFps, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "gif.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "5", children: "5 FPS (Small)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "10", children: "10 FPS (Balanced)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "15", children: "15 FPS (Smooth)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "24", children: "24 FPS (Cinematic)" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Width" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: width, onValueChange: setWidth, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "gif.width.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "320", children: "320px (Small)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "480", children: "480px (Medium)" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "640", children: "640px (Large)" })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Loop" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: loop, onValueChange: setLoop, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "gif.loop.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "0", children: "Infinite Loop" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "1", children: "Loop Once" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "3", children: "Loop 3 Times" })
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                "data-ocid": "gif.primary_button",
                onClick: convert,
                disabled: !file || isConverting,
                className: "w-full",
                size: "lg",
                children: isConverting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                  "Converting..."
                ] }) : "Create GIF"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isConverting && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0 },
                animate: { opacity: 1 },
                exit: { opacity: 0 },
                className: "space-y-2",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Converting..." }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                      progress,
                      "%"
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { "data-ocid": "gif.loading_state", value: progress })
                ]
              }
            ) }),
            error && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                "data-ocid": "gif.error_state",
                className: "text-destructive text-sm text-center",
                children: error
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: gifUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              motion.div,
              {
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1 },
                className: "space-y-4",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      "data-ocid": "gif.success_state",
                      className: "rounded-xl overflow-hidden border border-border",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: gifUrl,
                          alt: "Generated GIF",
                          className: "w-full h-auto"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: gifUrl, download: "output.gif", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      "data-ocid": "gif.secondary_button",
                      variant: "outline",
                      className: "w-full",
                      size: "lg",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
                        " Download GIF"
                      ]
                    }
                  ) })
                ]
              }
            ) })
          ] })
        ] })
      }
    )
  ] });
}
export {
  GifMakerPage
};
