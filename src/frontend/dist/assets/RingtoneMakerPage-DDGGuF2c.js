import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, a as cn, D as Download, m as motion } from "./index-C7SiQumv.js";
import { A as Alert, a as AlertDescription } from "./alert-B08A_fUg.js";
import { u as useComposedRefs, B as Button, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent } from "./card-BUE6aIsi.js";
import { I as Input } from "./input-DeaYCkik.js";
import { L as Label } from "./label-DjSXj35-.js";
import { g as getFfmpeg, f as fetchFile, F as FFmpegLoadError, P as Progress } from "./loadFfmpeg-DdmWCwwW.js";
import { u as useControllableState, P as Primitive, e as composeEventHandlers, f as usePrevious, g as useSize, h as createContextScope, S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-Ud0mtTtf.js";
import { U as Upload } from "./upload-B3IIcvra.js";
import { L as LoaderCircle } from "./loader-circle-B1soad14.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
];
const Pause = createLucideIcon("pause", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]];
const Play = createLucideIcon("play", __iconNode);
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
const MIME_MAP = {
  mp3: "audio/mpeg",
  m4r: "audio/mp4",
  ogg: "audio/ogg"
};
async function createRingtone(file, startTime, endTime, fadeInDuration, fadeOutDuration, format, onProgress) {
  const ffmpeg = await getFfmpeg();
  ffmpeg.on("progress", ({ progress: p }) => onProgress(Math.round(p * 100)));
  try {
    const ext = file.name.split(".").pop() ?? "mp3";
    const inputName = `input.${ext}`;
    const segDuration = endTime - startTime;
    const filters = [];
    if (fadeInDuration > 0) {
      filters.push(`afade=t=in:st=0:d=${fadeInDuration}`);
    }
    if (fadeOutDuration > 0) {
      const fadeStart = segDuration - fadeOutDuration;
      filters.push(`afade=t=out:st=${fadeStart}:d=${fadeOutDuration}`);
    }
    const codecArgs = format === "mp3" ? ["-c:a", "libmp3lame", "-b:a", "192k"] : format === "ogg" ? ["-c:a", "libvorbis", "-b:a", "192k"] : ["-c:a", "aac", "-b:a", "192k"];
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
      ...filters.length > 0 ? ["-af", filters.join(",")] : [],
      ...codecArgs,
      outputName
    ];
    await ffmpeg.exec(ffArgs);
    const data = await ffmpeg.readFile(outputName);
    return new Blob([data.buffer], {
      type: MIME_MAP[format]
    });
  } catch (err) {
    if (err instanceof FFmpegLoadError) throw err;
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Ringtone creation failed: ${message}`);
  }
}
function validateTrim(startTime, endTime, duration, fadeIn, fadeOut, fadeInDuration, fadeOutDuration) {
  if (startTime < 0) {
    return "Start time cannot be negative";
  }
  if (endTime > duration) {
    return "End time cannot exceed audio duration";
  }
  if (startTime >= endTime) {
    return "End time must be greater than start time";
  }
  const segmentDuration = endTime - startTime;
  if (fadeIn && fadeInDuration > segmentDuration) {
    return "Fade in duration cannot exceed segment length";
  }
  if (fadeOut && fadeOutDuration > segmentDuration) {
    return "Fade out duration cannot exceed segment length";
  }
  if (fadeIn && fadeOut && fadeInDuration + fadeOutDuration > segmentDuration) {
    return "Combined fade durations cannot exceed segment length";
  }
  return null;
}
function WaveformEditor() {
  const [file, setFile] = reactExports.useState(null);
  const [duration, setDuration] = reactExports.useState(0);
  const [startTime, setStartTime] = reactExports.useState(0);
  const [endTime, setEndTime] = reactExports.useState(30);
  const [fadeIn, setFadeIn] = reactExports.useState(false);
  const [fadeOut, setFadeOut] = reactExports.useState(false);
  const [fadeInDuration, setFadeInDuration] = reactExports.useState(1);
  const [fadeOutDuration, setFadeOutDuration] = reactExports.useState(1);
  const [format, setFormat] = reactExports.useState("mp3");
  const [progress, setProgress] = reactExports.useState(0);
  const [isProcessing, setIsProcessing] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const [outputBlob, setOutputBlob] = reactExports.useState(null);
  const [audioUrl, setAudioUrl] = reactExports.useState(null);
  const [isPlaying, setIsPlaying] = reactExports.useState(false);
  const fileInputRef = reactExports.useRef(null);
  const audioRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      const audio = new Audio(url);
      audio.addEventListener("loadedmetadata", () => {
        setDuration(audio.duration);
        setEndTime(Math.min(30, audio.duration));
      });
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [file]);
  const handleFileChange = (e) => {
    var _a;
    const selectedFile = (_a = e.target.files) == null ? void 0 : _a[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
      setOutputBlob(null);
      setIsPlaying(false);
    }
  };
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  const handleExport = async () => {
    if (!file) {
      setError("Please select an audio or video file first");
      return;
    }
    const validationError = validateTrim(
      startTime,
      endTime,
      duration,
      fadeIn,
      fadeOut,
      fadeInDuration,
      fadeOutDuration
    );
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsProcessing(true);
    setError(null);
    setProgress(0);
    try {
      const blob = await createRingtone(
        file,
        startTime,
        endTime,
        fadeIn ? fadeInDuration : 0,
        fadeOut ? fadeOutDuration : 0,
        format,
        (p) => setProgress(p)
      );
      setOutputBlob(blob);
      setProgress(100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Export failed");
    } finally {
      setIsProcessing(false);
    }
  };
  const handleDownload = () => {
    if (!outputBlob || !file) return;
    const url = URL.createObjectURL(outputBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${file.name.replace(/\.[^/.]+$/, "")}_ringtone.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "audio-file", children: "Audio/Video File" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              ref: fileInputRef,
              id: "audio-file",
              type: "file",
              accept: "audio/*,video/*",
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
                file ? file.name : "Choose Audio/Video File"
              ]
            }
          )
        ] })
      ] }),
      audioUrl && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 border rounded-lg bg-muted/30 animate-fade-in", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "audio",
          {
            ref: audioRef,
            src: audioUrl,
            onEnded: () => setIsPlaying(false),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("track", { kind: "captions" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              size: "icon",
              variant: "outline",
              onClick: togglePlayPause,
              className: "transition-all duration-200 hover:scale-110",
              children: isPlaying ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { className: "w-4 h-4" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { className: "w-4 h-4" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium", children: "Preview Audio" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              "Duration: ",
              duration.toFixed(1),
              "s"
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-4 animate-fade-in animation-delay-50", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "start-time", children: "Start Time (s)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "start-time",
              type: "number",
              value: startTime,
              onChange: (e) => setStartTime(Number.parseFloat(e.target.value) || 0),
              disabled: !file || isProcessing,
              min: "0",
              max: duration,
              step: "0.1",
              className: "transition-all duration-150 focus:scale-[1.01]"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "end-time", children: "End Time (s)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              id: "end-time",
              type: "number",
              value: endTime,
              onChange: (e) => setEndTime(Number.parseFloat(e.target.value) || 0),
              disabled: !file || isProcessing,
              min: "0",
              max: duration,
              step: "0.1",
              className: "transition-all duration-150 focus:scale-[1.01]"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-fade-in animation-delay-100", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fade-in", children: "Fade In" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "fade-in",
              checked: fadeIn,
              onCheckedChange: setFadeIn,
              disabled: isProcessing,
              className: "transition-all duration-150"
            }
          )
        ] }),
        fadeIn && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            value: fadeInDuration,
            onChange: (e) => setFadeInDuration(Number.parseFloat(e.target.value) || 0),
            disabled: isProcessing,
            min: "0.1",
            max: "5",
            step: "0.1",
            placeholder: "Fade in duration (s)",
            className: "transition-all duration-150 focus:scale-[1.01]"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 animate-fade-in animation-delay-150", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "fade-out", children: "Fade Out" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Switch,
            {
              id: "fade-out",
              checked: fadeOut,
              onCheckedChange: setFadeOut,
              disabled: isProcessing,
              className: "transition-all duration-150"
            }
          )
        ] }),
        fadeOut && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-fade-in", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            type: "number",
            value: fadeOutDuration,
            onChange: (e) => setFadeOutDuration(Number.parseFloat(e.target.value) || 0),
            disabled: isProcessing,
            min: "0.1",
            max: "5",
            step: "0.1",
            placeholder: "Fade out duration (s)",
            className: "transition-all duration-150 focus:scale-[1.01]"
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "animate-fade-in animation-delay-200", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "output-format", children: "Output Format" }),
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
                  id: "output-format",
                  className: "transition-all duration-150",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {})
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "mp3", children: "MP3" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "m4r", children: "M4R (iPhone)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "ogg", children: "OGG" })
              ] })
            ]
          }
        )
      ] })
    ] }),
    isProcessing && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 animate-fade-in", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Creating ringtone..." }),
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
          onClick: handleExport,
          disabled: !file || isProcessing,
          className: "flex-1 transition-all duration-200 hover:scale-[1.02]",
          children: isProcessing ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "w-4 h-4 mr-2 animate-spin" }),
            "Exporting..."
          ] }) : "Export Ringtone"
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
function RingtoneMakerPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "space-y-6",
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { type: "spring", stiffness: 300, damping: 30 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Ringtone Maker" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Trim audio, add fades, and create custom ringtones" })
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
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { children: "Create Your Ringtone" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Upload audio or video, trim to your favorite part, and export" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(WaveformEditor, {}) })
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
  RingtoneMakerPage
};
