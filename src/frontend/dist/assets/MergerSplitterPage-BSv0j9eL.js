import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, C as Combine, A as AnimatePresence, D as Download } from "./index-C7SiQumv.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, B as Button } from "./card-BUE6aIsi.js";
import { I as Input } from "./input-DeaYCkik.js";
import { L as Label } from "./label-DjSXj35-.js";
import { P as Progress } from "./loadFfmpeg-DdmWCwwW.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Ud0mtTtf.js";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-gBfJxeso.js";
import { d as mergeMedia, s as splitMedia } from "./videoTools-DkMcdMVq.js";
import { U as Upload } from "./upload-B3IIcvra.js";
import { X } from "./x-3KvPO6r7.js";
import { L as LoaderCircle } from "./loader-circle-B1soad14.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "6", cy: "6", r: "3", key: "1lh9wr" }],
  ["path", { d: "M8.12 8.12 12 12", key: "1alkpv" }],
  ["path", { d: "M20 4 8.12 15.88", key: "xgtan2" }],
  ["circle", { cx: "6", cy: "18", r: "3", key: "fqmcym" }],
  ["path", { d: "M14.8 14.8 20 20", key: "ptml3r" }]
];
const Scissors = createLucideIcon("scissors", __iconNode);
function MergerSplitterPage() {
  var _a;
  const [mergeFiles, setMergeFiles] = reactExports.useState([]);
  const [mergeProgress, setMergeProgress] = reactExports.useState(0);
  const [isMerging, setIsMerging] = reactExports.useState(false);
  const [mergedUrl, setMergedUrl] = reactExports.useState(null);
  const [mergeError, setMergeError] = reactExports.useState("");
  const [splitFile, setSplitFile] = reactExports.useState(null);
  const [splitMode, setSplitMode] = reactExports.useState("timepoints");
  const [timepoints, setTimepoints] = reactExports.useState("0:30,1:00");
  const [equalParts, setEqualParts] = reactExports.useState("3");
  const [splitProgress, setSplitProgress] = reactExports.useState(0);
  const [isSplitting, setIsSplitting] = reactExports.useState(false);
  const [segments, setSegments] = reactExports.useState([]);
  const [splitError, setSplitError] = reactExports.useState("");
  const mergeInputRef = reactExports.useRef(null);
  const splitInputRef = reactExports.useRef(null);
  const addMergeFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setMergeFiles((prev) => [...prev, ...files]);
    setMergedUrl(null);
  };
  const removeMergeFile = (idx) => setMergeFiles((prev) => prev.filter((_, i) => i !== idx));
  const merge = async () => {
    if (mergeFiles.length < 2) return;
    setIsMerging(true);
    setMergeProgress(0);
    setMergeError("");
    try {
      const blob = await mergeMedia(mergeFiles, (p) => setMergeProgress(p));
      setMergedUrl(URL.createObjectURL(blob));
    } catch (e) {
      setMergeError("Merge failed. Ensure all files are the same format.");
      console.error(e);
    } finally {
      setIsMerging(false);
    }
  };
  const split = async () => {
    if (!splitFile) return;
    setIsSplitting(true);
    setSplitProgress(0);
    setSplitError("");
    setSegments([]);
    try {
      const points = timepoints.split(",").map((t) => t.trim()).filter(Boolean);
      const results = await splitMedia(
        splitFile,
        points,
        (done, total) => setSplitProgress(Math.round(done / total * 100))
      );
      setSegments(
        results.map((r) => ({
          name: r.name,
          url: URL.createObjectURL(r.blob)
        }))
      );
    } catch (e) {
      setSplitError("Split failed. Please try again.");
      console.error(e);
    } finally {
      setIsSplitting(false);
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Merger & Splitter" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Combine multiple files or split one into segments" })
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
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Audio & Video Tools" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Merge multiple files together or split a single file into parts" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "merge", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { className: "grid w-full grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  "data-ocid": "merger.merge.tab",
                  value: "merge",
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Combine, { className: "w-4 h-4" }),
                    " Merge"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                TabsTrigger,
                {
                  "data-ocid": "merger.split.tab",
                  value: "split",
                  className: "flex items-center gap-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Scissors, { className: "w-4 h-4" }),
                    " Split"
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "merge", className: "mt-6 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "merger.merge.dropzone",
                  onClick: () => {
                    var _a2;
                    return (_a2 = mergeInputRef.current) == null ? void 0 : _a2.click();
                  },
                  className: "w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all duration-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: mergeInputRef,
                        type: "file",
                        accept: "audio/*,video/*",
                        multiple: true,
                        className: "hidden",
                        onChange: addMergeFiles
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 mx-auto mb-2 text-muted-foreground" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Click to add files" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: "Add 2 or more audio/video files" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: mergeFiles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "space-y-2",
                  children: mergeFiles.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      "data-ocid": `merger.merge.item.${i + 1}`,
                      initial: { opacity: 0, x: -10 },
                      animate: { opacity: 1, x: 0 },
                      exit: { opacity: 0, x: 10 },
                      className: "flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium truncate", children: f.name }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Button,
                          {
                            "data-ocid": `merger.merge.delete_button.${i + 1}`,
                            variant: "ghost",
                            size: "sm",
                            onClick: () => removeMergeFile(i),
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-4 h-4" })
                          }
                        )
                      ]
                    },
                    `${f.name}-${i}`
                  ))
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "merger.merge.primary_button",
                  onClick: merge,
                  disabled: mergeFiles.length < 2 || isMerging,
                  className: "w-full",
                  size: "lg",
                  children: isMerging ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                    "Merging..."
                  ] }) : "Merge Files"
                }
              ),
              isMerging && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Progress,
                {
                  "data-ocid": "merger.merge.loading_state",
                  value: mergeProgress
                }
              ),
              mergeError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": "merger.merge.error_state",
                  className: "text-destructive text-sm",
                  children: mergeError
                }
              ),
              mergedUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "a",
                {
                  href: mergedUrl,
                  download: `merged.${((_a = mergeFiles[0]) == null ? void 0 : _a.name.split(".").pop()) || "mp4"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    Button,
                    {
                      "data-ocid": "merger.merge.secondary_button",
                      variant: "outline",
                      className: "w-full",
                      size: "lg",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-2 h-4 w-4" }),
                        " Download Merged File"
                      ]
                    }
                  )
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsContent, { value: "split", className: "mt-6 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  "data-ocid": "merger.split.dropzone",
                  onClick: () => {
                    var _a2;
                    return (_a2 = splitInputRef.current) == null ? void 0 : _a2.click();
                  },
                  className: "w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary hover:bg-accent/30 transition-all duration-200",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        ref: splitInputRef,
                        type: "file",
                        accept: "audio/*,video/*",
                        className: "hidden",
                        onChange: (e) => {
                          var _a2;
                          const f = (_a2 = e.target.files) == null ? void 0 : _a2[0];
                          if (f) {
                            setSplitFile(f);
                            setSegments([]);
                          }
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "w-8 h-8 mx-auto mb-2 text-muted-foreground" }),
                    splitFile ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: splitFile.name }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: "Click to upload a file to split" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Split Mode" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: splitMode, onValueChange: setSplitMode, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { "data-ocid": "merger.split.select", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "timepoints", children: "By Time Points" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "equal", children: "Equal Parts" })
                  ] })
                ] })
              ] }),
              splitMode === "timepoints" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Time Points (e.g. 0:30,1:45)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "merger.split.input",
                    value: timepoints,
                    onChange: (e) => setTimepoints(e.target.value),
                    placeholder: "0:30,1:45,3:00"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Comma-separated timestamps to split at" })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Number of Parts" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "merger.split.parts.input",
                    type: "number",
                    value: equalParts,
                    onChange: (e) => setEqualParts(e.target.value),
                    min: "2",
                    max: "20"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  "data-ocid": "merger.split.primary_button",
                  onClick: split,
                  disabled: !splitFile || isSplitting,
                  className: "w-full",
                  size: "lg",
                  children: isSplitting ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
                    "Splitting..."
                  ] }) : "Split File"
                }
              ),
              isSplitting && /* @__PURE__ */ jsxRuntimeExports.jsx(
                Progress,
                {
                  "data-ocid": "merger.split.loading_state",
                  value: splitProgress
                }
              ),
              splitError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": "merger.split.error_state",
                  className: "text-destructive text-sm",
                  children: splitError
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: segments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                motion.div,
                {
                  initial: { opacity: 0 },
                  animate: { opacity: 1 },
                  className: "space-y-2",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm", children: "Output Segments:" }),
                    segments.map((seg, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": `merger.split.item.${i + 1}`,
                        className: "flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border",
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: seg.name }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: seg.url, download: seg.name, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            Button,
                            {
                              "data-ocid": `merger.split.secondary_button.${i + 1}`,
                              variant: "outline",
                              size: "sm",
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" })
                            }
                          ) })
                        ]
                      },
                      `${seg.name}-${i}`
                    ))
                  ]
                }
              ) })
            ] })
          ] }) })
        ] })
      }
    )
  ] });
}
export {
  MergerSplitterPage
};
