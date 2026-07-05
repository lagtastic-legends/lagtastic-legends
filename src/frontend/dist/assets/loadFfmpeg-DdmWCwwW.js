var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _worker, _resolves, _rejects, _logEventCallbacks, _progressEventCallbacks, _registerHandlers, _send;
import { r as reactExports, j as jsxRuntimeExports, a as cn } from "./index-C7SiQumv.js";
import { P as Primitive } from "./label-DjSXj35-.js";
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    BaseContext.displayName = rootComponentName + "Context";
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      var _a;
      const { scope, children, ...context } = props;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      var _a;
      const Context = ((_a = scope == null ? void 0 : scope[scopeName]) == null ? void 0 : _a[index]) || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = (scope == null ? void 0 : scope[scopeName]) || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
function Progress({
  className,
  value,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "progress",
      className: cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Indicator,
        {
          "data-slot": "progress-indicator",
          className: "bg-primary h-full w-full flex-1 transition-all",
          style: { transform: `translateX(-${100 - (value || 0)}%)` }
        }
      )
    }
  );
}
const ERROR_RESPONSE_BODY_READER = new Error("failed to get response body reader");
const ERROR_INCOMPLETED_DOWNLOAD = new Error("failed to complete download");
const HeaderContentLength = "Content-Length";
const readFromBlobOrFile = (blob) => new Promise((resolve, reject) => {
  const fileReader = new FileReader();
  fileReader.onload = () => {
    const { result } = fileReader;
    if (result instanceof ArrayBuffer) {
      resolve(new Uint8Array(result));
    } else {
      resolve(new Uint8Array());
    }
  };
  fileReader.onerror = (event) => {
    var _a, _b;
    reject(Error(`File could not be read! Code=${((_b = (_a = event == null ? void 0 : event.target) == null ? void 0 : _a.error) == null ? void 0 : _b.code) || -1}`));
  };
  fileReader.readAsArrayBuffer(blob);
});
const fetchFile = async (file) => {
  let data;
  if (typeof file === "string") {
    if (/data:_data\/([a-zA-Z]*);base64,([^"]*)/.test(file)) {
      data = atob(file.split(",")[1]).split("").map((c) => c.charCodeAt(0));
    } else {
      data = await (await fetch(file)).arrayBuffer();
    }
  } else if (file instanceof URL) {
    data = await (await fetch(file)).arrayBuffer();
  } else if (file instanceof File || file instanceof Blob) {
    data = await readFromBlobOrFile(file);
  } else {
    return new Uint8Array();
  }
  return new Uint8Array(data);
};
const downloadWithProgress = async (url, cb) => {
  var _a;
  const resp = await fetch(url);
  let buf;
  try {
    const total = parseInt(resp.headers.get(HeaderContentLength) || "-1");
    const reader = (_a = resp.body) == null ? void 0 : _a.getReader();
    if (!reader)
      throw ERROR_RESPONSE_BODY_READER;
    const chunks = [];
    let received = 0;
    for (; ; ) {
      const { done, value } = await reader.read();
      const delta = value ? value.length : 0;
      if (done) {
        if (total != -1 && total !== received)
          throw ERROR_INCOMPLETED_DOWNLOAD;
        cb && cb({ url, total, received, delta, done });
        break;
      }
      chunks.push(value);
      received += delta;
      cb && cb({ url, total, received, delta, done });
    }
    const data = new Uint8Array(received);
    let position = 0;
    for (const chunk of chunks) {
      data.set(chunk, position);
      position += chunk.length;
    }
    buf = data.buffer;
  } catch (e) {
    console.log(`failed to send download progress event: `, e);
    buf = await resp.arrayBuffer();
  }
  return buf;
};
const toBlobURL = async (url, mimeType, progress = false, cb) => {
  const buf = progress ? await downloadWithProgress(url, cb) : await (await fetch(url)).arrayBuffer();
  const blob = new Blob([buf], { type: mimeType });
  return URL.createObjectURL(blob);
};
var FFMessageType;
(function(FFMessageType2) {
  FFMessageType2["LOAD"] = "LOAD";
  FFMessageType2["EXEC"] = "EXEC";
  FFMessageType2["FFPROBE"] = "FFPROBE";
  FFMessageType2["WRITE_FILE"] = "WRITE_FILE";
  FFMessageType2["READ_FILE"] = "READ_FILE";
  FFMessageType2["DELETE_FILE"] = "DELETE_FILE";
  FFMessageType2["RENAME"] = "RENAME";
  FFMessageType2["CREATE_DIR"] = "CREATE_DIR";
  FFMessageType2["LIST_DIR"] = "LIST_DIR";
  FFMessageType2["DELETE_DIR"] = "DELETE_DIR";
  FFMessageType2["ERROR"] = "ERROR";
  FFMessageType2["DOWNLOAD"] = "DOWNLOAD";
  FFMessageType2["PROGRESS"] = "PROGRESS";
  FFMessageType2["LOG"] = "LOG";
  FFMessageType2["MOUNT"] = "MOUNT";
  FFMessageType2["UNMOUNT"] = "UNMOUNT";
})(FFMessageType || (FFMessageType = {}));
const getMessageID = /* @__PURE__ */ (() => {
  let messageID = 0;
  return () => messageID++;
})();
const ERROR_NOT_LOADED = new Error("ffmpeg is not loaded, call `await ffmpeg.load()` first");
const ERROR_TERMINATED = new Error("called FFmpeg.terminate()");
class FFmpeg {
  constructor() {
    __privateAdd(this, _worker, null);
    /**
     * #resolves and #rejects tracks Promise resolves and rejects to
     * be called when we receive message from web worker.
     */
    __privateAdd(this, _resolves, {});
    __privateAdd(this, _rejects, {});
    __privateAdd(this, _logEventCallbacks, []);
    __privateAdd(this, _progressEventCallbacks, []);
    __publicField(this, "loaded", false);
    /**
     * register worker message event handlers.
     */
    __privateAdd(this, _registerHandlers, () => {
      if (__privateGet(this, _worker)) {
        __privateGet(this, _worker).onmessage = ({ data: { id, type, data } }) => {
          switch (type) {
            case FFMessageType.LOAD:
              this.loaded = true;
              __privateGet(this, _resolves)[id](data);
              break;
            case FFMessageType.MOUNT:
            case FFMessageType.UNMOUNT:
            case FFMessageType.EXEC:
            case FFMessageType.FFPROBE:
            case FFMessageType.WRITE_FILE:
            case FFMessageType.READ_FILE:
            case FFMessageType.DELETE_FILE:
            case FFMessageType.RENAME:
            case FFMessageType.CREATE_DIR:
            case FFMessageType.LIST_DIR:
            case FFMessageType.DELETE_DIR:
              __privateGet(this, _resolves)[id](data);
              break;
            case FFMessageType.LOG:
              __privateGet(this, _logEventCallbacks).forEach((f) => f(data));
              break;
            case FFMessageType.PROGRESS:
              __privateGet(this, _progressEventCallbacks).forEach((f) => f(data));
              break;
            case FFMessageType.ERROR:
              __privateGet(this, _rejects)[id](data);
              break;
          }
          delete __privateGet(this, _resolves)[id];
          delete __privateGet(this, _rejects)[id];
        };
      }
    });
    /**
     * Generic function to send messages to web worker.
     */
    __privateAdd(this, _send, ({ type, data }, trans = [], signal) => {
      if (!__privateGet(this, _worker)) {
        return Promise.reject(ERROR_NOT_LOADED);
      }
      return new Promise((resolve, reject) => {
        const id = getMessageID();
        __privateGet(this, _worker) && __privateGet(this, _worker).postMessage({ id, type, data }, trans);
        __privateGet(this, _resolves)[id] = resolve;
        __privateGet(this, _rejects)[id] = reject;
        signal == null ? void 0 : signal.addEventListener("abort", () => {
          reject(new DOMException(`Message # ${id} was aborted`, "AbortError"));
        }, { once: true });
      });
    });
    /**
     * Loads ffmpeg-core inside web worker. It is required to call this method first
     * as it initializes WebAssembly and other essential variables.
     *
     * @category FFmpeg
     * @returns `true` if ffmpeg core is loaded for the first time.
     */
    __publicField(this, "load", ({ classWorkerURL, ...config } = {}, { signal } = {}) => {
      if (!__privateGet(this, _worker)) {
        __privateSet(this, _worker, classWorkerURL ? new Worker(new URL(classWorkerURL, import.meta.url), {
          type: "module"
        }) : (
          // We need to duplicated the code here to enable webpack
          // to bundle worekr.js here.
          new Worker(new URL(
            /* @vite-ignore */
            "/assets/worker-D3WqxKMJ.js",
            import.meta.url
          ), {
            type: "module"
          })
        ));
        __privateGet(this, _registerHandlers).call(this);
      }
      return __privateGet(this, _send).call(this, {
        type: FFMessageType.LOAD,
        data: config
      }, void 0, signal);
    });
    /**
     * Execute ffmpeg command.
     *
     * @remarks
     * To avoid common I/O issues, ["-nostdin", "-y"] are prepended to the args
     * by default.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * await ffmpeg.writeFile("video.avi", ...);
     * // ffmpeg -i video.avi video.mp4
     * await ffmpeg.exec(["-i", "video.avi", "video.mp4"]);
     * const data = ffmpeg.readFile("video.mp4");
     * ```
     *
     * @returns `0` if no error, `!= 0` if timeout (1) or error.
     * @category FFmpeg
     */
    __publicField(this, "exec", (args, timeout = -1, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.EXEC,
      data: { args, timeout }
    }, void 0, signal));
    /**
     * Execute ffprobe command.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * await ffmpeg.writeFile("video.avi", ...);
     * // Getting duration of a video in seconds: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.avi -o output.txt
     * await ffmpeg.ffprobe(["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", "video.avi", "-o", "output.txt"]);
     * const data = ffmpeg.readFile("output.txt");
     * ```
     *
     * @returns `0` if no error, `!= 0` if timeout (1) or error.
     * @category FFmpeg
     */
    __publicField(this, "ffprobe", (args, timeout = -1, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.FFPROBE,
      data: { args, timeout }
    }, void 0, signal));
    /**
     * Terminate all ongoing API calls and terminate web worker.
     * `FFmpeg.load()` must be called again before calling any other APIs.
     *
     * @category FFmpeg
     */
    __publicField(this, "terminate", () => {
      const ids = Object.keys(__privateGet(this, _rejects));
      for (const id of ids) {
        __privateGet(this, _rejects)[id](ERROR_TERMINATED);
        delete __privateGet(this, _rejects)[id];
        delete __privateGet(this, _resolves)[id];
      }
      if (__privateGet(this, _worker)) {
        __privateGet(this, _worker).terminate();
        __privateSet(this, _worker, null);
        this.loaded = false;
      }
    });
    /**
     * Write data to ffmpeg.wasm.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * await ffmpeg.writeFile("video.avi", await fetchFile("../video.avi"));
     * await ffmpeg.writeFile("text.txt", "hello world");
     * ```
     *
     * @category File System
     */
    __publicField(this, "writeFile", (path, data, { signal } = {}) => {
      const trans = [];
      if (data instanceof Uint8Array) {
        trans.push(data.buffer);
      }
      return __privateGet(this, _send).call(this, {
        type: FFMessageType.WRITE_FILE,
        data: { path, data }
      }, trans, signal);
    });
    __publicField(this, "mount", (fsType, options, mountPoint) => {
      const trans = [];
      return __privateGet(this, _send).call(this, {
        type: FFMessageType.MOUNT,
        data: { fsType, options, mountPoint }
      }, trans);
    });
    __publicField(this, "unmount", (mountPoint) => {
      const trans = [];
      return __privateGet(this, _send).call(this, {
        type: FFMessageType.UNMOUNT,
        data: { mountPoint }
      }, trans);
    });
    /**
     * Read data from ffmpeg.wasm.
     *
     * @example
     * ```ts
     * const ffmpeg = new FFmpeg();
     * await ffmpeg.load();
     * const data = await ffmpeg.readFile("video.mp4");
     * ```
     *
     * @category File System
     */
    __publicField(this, "readFile", (path, encoding = "binary", { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.READ_FILE,
      data: { path, encoding }
    }, void 0, signal));
    /**
     * Delete a file.
     *
     * @category File System
     */
    __publicField(this, "deleteFile", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.DELETE_FILE,
      data: { path }
    }, void 0, signal));
    /**
     * Rename a file or directory.
     *
     * @category File System
     */
    __publicField(this, "rename", (oldPath, newPath, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.RENAME,
      data: { oldPath, newPath }
    }, void 0, signal));
    /**
     * Create a directory.
     *
     * @category File System
     */
    __publicField(this, "createDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.CREATE_DIR,
      data: { path }
    }, void 0, signal));
    /**
     * List directory contents.
     *
     * @category File System
     */
    __publicField(this, "listDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.LIST_DIR,
      data: { path }
    }, void 0, signal));
    /**
     * Delete an empty directory.
     *
     * @category File System
     */
    __publicField(this, "deleteDir", (path, { signal } = {}) => __privateGet(this, _send).call(this, {
      type: FFMessageType.DELETE_DIR,
      data: { path }
    }, void 0, signal));
  }
  on(event, callback) {
    if (event === "log") {
      __privateGet(this, _logEventCallbacks).push(callback);
    } else if (event === "progress") {
      __privateGet(this, _progressEventCallbacks).push(callback);
    }
  }
  off(event, callback) {
    if (event === "log") {
      __privateSet(this, _logEventCallbacks, __privateGet(this, _logEventCallbacks).filter((f) => f !== callback));
    } else if (event === "progress") {
      __privateSet(this, _progressEventCallbacks, __privateGet(this, _progressEventCallbacks).filter((f) => f !== callback));
    }
  }
}
_worker = new WeakMap();
_resolves = new WeakMap();
_rejects = new WeakMap();
_logEventCallbacks = new WeakMap();
_progressEventCallbacks = new WeakMap();
_registerHandlers = new WeakMap();
_send = new WeakMap();
var FFFSType;
(function(FFFSType2) {
  FFFSType2["MEMFS"] = "MEMFS";
  FFFSType2["NODEFS"] = "NODEFS";
  FFFSType2["NODERAWFS"] = "NODERAWFS";
  FFFSType2["IDBFS"] = "IDBFS";
  FFFSType2["WORKERFS"] = "WORKERFS";
  FFFSType2["PROXYFS"] = "PROXYFS";
})(FFFSType || (FFFSType = {}));
let sharedInstance = null;
let loadPromise = null;
class FFmpegLoadError extends Error {
  constructor(message) {
    super(message);
    this.name = "FFmpegLoadError";
  }
}
function getCorePaths() {
  const coreURL = "/ffmpeg/ffmpeg-core.js";
  const wasmURL = "/ffmpeg/ffmpeg-core.wasm";
  return { coreURL, wasmURL };
}
async function doLoad() {
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
async function getFfmpeg() {
  console.log(
    "[FFmpeg] getFfmpeg() called. sharedInstance?.loaded =",
    sharedInstance == null ? void 0 : sharedInstance.loaded
  );
  if (sharedInstance == null ? void 0 : sharedInstance.loaded) {
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
async function ensureFfmpegReady() {
  const ffmpeg = await getFfmpeg();
  if (!ffmpeg.loaded) {
    throw new FFmpegLoadError("FFmpeg is not fully loaded.");
  }
  console.log("[FFmpeg] Readiness check passed.");
  return ffmpeg;
}
export {
  FFmpegLoadError as F,
  Progress as P,
  ensureFfmpegReady as e,
  fetchFile as f,
  getFfmpeg as g
};
