import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, m as motion, S as ShieldCheck, A as AnimatePresence, D as Download } from "./index-C7SiQumv.js";
import { C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, B as Button } from "./card-BUE6aIsi.js";
import { I as Input } from "./input-DeaYCkik.js";
import { L as Label } from "./label-DjSXj35-.js";
import { L as Lock } from "./lock-NvqOD5wg.js";
import { U as Upload } from "./upload-B3IIcvra.js";
import { T as Trash2 } from "./trash-2-CYPZWH1M.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1", key: "19aais" }],
  [
    "path",
    {
      d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5",
      key: "1w6v7t"
    }
  ],
  ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2", key: "pwaxnr" }]
];
const FolderLock = createLucideIcon("folder-lock", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2", key: "1w4ew1" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1", key: "1mm8w8" }]
];
const LockOpen = createLucideIcon("lock-open", __iconNode);
const VAULT_PIN_KEY = "vault_pin_hash";
const VAULT_FILES_KEY = "vault_files";
function simpleHash(pin) {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `${hash.toString(36)}_${pin.length}`;
}
function loadFilesFromStorage() {
  try {
    const stored = localStorage.getItem(VAULT_FILES_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
  }
  return [];
}
function useVault() {
  const [isUnlocked, setIsUnlocked] = reactExports.useState(false);
  const [hasPin, setHasPin] = reactExports.useState(false);
  const [files, setFiles] = reactExports.useState([]);
  const [error, setError] = reactExports.useState("");
  reactExports.useEffect(() => {
    setHasPin(!!localStorage.getItem(VAULT_PIN_KEY));
  }, []);
  const setupPin = reactExports.useCallback((pin) => {
    localStorage.setItem(VAULT_PIN_KEY, simpleHash(pin));
    setHasPin(true);
    setIsUnlocked(true);
    setError("");
    setFiles(loadFilesFromStorage());
  }, []);
  const unlock = reactExports.useCallback((pin) => {
    const stored = localStorage.getItem(VAULT_PIN_KEY);
    if (stored === simpleHash(pin)) {
      setIsUnlocked(true);
      setError("");
      setFiles(loadFilesFromStorage());
      return true;
    }
    setError("Incorrect PIN");
    return false;
  }, []);
  const lock = reactExports.useCallback(() => {
    setIsUnlocked(false);
    setFiles([]);
  }, []);
  const addFile = reactExports.useCallback((file) => {
    const newFile = {
      ...file,
      id: crypto.randomUUID(),
      addedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    setFiles((prev) => {
      const updated = [newFile, ...prev];
      try {
        localStorage.setItem(VAULT_FILES_KEY, JSON.stringify(updated));
      } catch {
      }
      return updated;
    });
  }, []);
  const deleteFile = reactExports.useCallback((id) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem(VAULT_FILES_KEY, JSON.stringify(updated));
      } catch {
      }
      return updated;
    });
  }, []);
  return {
    isUnlocked,
    hasPin,
    files,
    error,
    setupPin,
    unlock,
    lock,
    addFile,
    deleteFile
  };
}
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
function VaultPage() {
  const {
    isUnlocked,
    hasPin,
    files,
    error,
    setupPin,
    unlock,
    lock,
    addFile,
    deleteFile
  } = useVault();
  const [pin, setPin] = reactExports.useState("");
  const [confirmPin, setConfirmPin] = reactExports.useState("");
  const [setupError, setSetupError] = reactExports.useState("");
  const fileInputRef = reactExports.useRef(null);
  const handleSetup = () => {
    if (pin.length < 4 || pin.length > 8) {
      setSetupError("PIN must be 4-8 digits");
      return;
    }
    if (!/^\d+$/.test(pin)) {
      setSetupError("PIN must contain only digits");
      return;
    }
    if (pin !== confirmPin) {
      setSetupError("PINs do not match");
      return;
    }
    setSetupError("");
    setupPin(pin);
    setPin("");
    setConfirmPin("");
  };
  const handleUnlock = () => {
    unlock(pin);
    setPin("");
  };
  const handleAddFile = async (e) => {
    var _a;
    const f = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      addFile({
        name: f.name,
        type: f.type,
        size: f.size,
        dataUrl: reader.result
      });
    };
    reader.readAsDataURL(f);
  };
  if (!hasPin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: "text-center space-y-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Secure Vault" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Create a PIN to protect your private files" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.1 },
          className: "max-w-sm mx-auto",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardHeader, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderLock, { className: "w-5 h-5" }),
                " Set Up Vault PIN"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(CardDescription, { children: "Choose a 4–8 digit PIN to secure your vault" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Create PIN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "vault.pin.input",
                    type: "password",
                    inputMode: "numeric",
                    maxLength: 8,
                    placeholder: "4-8 digits",
                    value: pin,
                    onChange: (e) => setPin(e.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Confirm PIN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "vault.confirm_pin.input",
                    type: "password",
                    inputMode: "numeric",
                    maxLength: 8,
                    placeholder: "Confirm PIN",
                    value: confirmPin,
                    onChange: (e) => setConfirmPin(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && handleSetup()
                  }
                )
              ] }),
              setupError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": "vault.error_state",
                  className: "text-destructive text-sm",
                  children: setupError
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "vault.primary_button",
                  onClick: handleSetup,
                  className: "w-full",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "mr-2 h-4 w-4" }),
                    " Create Vault"
                  ]
                }
              )
            ] })
          ] })
        }
      )
    ] });
  }
  if (!isUnlocked) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        motion.div,
        {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          className: "text-center space-y-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Secure Vault" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Enter your PIN to access your vault" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          transition: { delay: 0.1 },
          className: "max-w-sm mx-auto",
          children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "w-5 h-5" }),
              " Vault Locked"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Enter PIN" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Input,
                  {
                    "data-ocid": "vault.unlock.input",
                    type: "password",
                    inputMode: "numeric",
                    maxLength: 8,
                    placeholder: "Your PIN",
                    value: pin,
                    onChange: (e) => setPin(e.target.value),
                    onKeyDown: (e) => e.key === "Enter" && handleUnlock()
                  }
                )
              ] }),
              error && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  "data-ocid": "vault.error_state",
                  className: "text-destructive text-sm",
                  children: error
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  "data-ocid": "vault.unlock.primary_button",
                  onClick: handleUnlock,
                  className: "w-full",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "mr-2 h-4 w-4" }),
                    " Unlock Vault"
                  ]
                }
              )
            ] })
          ] })
        }
      )
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "flex items-center justify-between",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "Secure Vault" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "Your private files — stored securely in this browser" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { "data-ocid": "vault.lock.button", variant: "outline", onClick: lock, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "mr-2 h-4 w-4" }),
            " Lock Vault"
          ] })
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
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-5 h-5" }),
              " Vault Contents"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                "data-ocid": "vault.upload_button",
                size: "sm",
                onClick: () => {
                  var _a;
                  return (_a = fileInputRef.current) == null ? void 0 : _a.click();
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
                  " Add to Vault"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                className: "hidden",
                onChange: handleAddFile
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "popLayout", children: files.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              "data-ocid": "vault.empty_state",
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              className: "text-center py-12 text-muted-foreground",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(FolderLock, { className: "w-12 h-12 mx-auto mb-3 opacity-30" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Your vault is empty. Add files to keep them private." })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: files.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.div,
            {
              "data-ocid": `vault.item.${i + 1}`,
              initial: { opacity: 0, x: -10 },
              animate: { opacity: 1, x: 0 },
              exit: { opacity: 0, x: 10 },
              className: "flex items-center justify-between p-3 bg-muted/40 rounded-lg border border-border",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-sm truncate", children: f.name }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                    formatSize(f.size),
                    " ·",
                    " ",
                    new Date(f.addedAt).toLocaleDateString()
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 ml-3", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: f.dataUrl, download: f.name, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": `vault.secondary_button.${i + 1}`,
                      variant: "outline",
                      size: "sm",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      "data-ocid": `vault.delete_button.${i + 1}`,
                      variant: "outline",
                      size: "sm",
                      className: "text-destructive hover:text-destructive",
                      onClick: () => deleteFile(f.id),
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                    }
                  )
                ] })
              ]
            },
            f.id
          )) }) }) })
        ] })
      }
    )
  ] });
}
export {
  VaultPage
};
