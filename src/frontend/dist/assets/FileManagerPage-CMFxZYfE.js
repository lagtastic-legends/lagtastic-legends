import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, r as reactExports, m as motion, F as FolderOpen, A as AnimatePresence, D as Download } from "./index-C7SiQumv.js";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, B as Button } from "./card-BUE6aIsi.js";
import { I as Input } from "./input-DeaYCkik.js";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem, C as Check } from "./select-Ud0mtTtf.js";
import { u as useFileManager, s as sortFiles } from "./useFileManager-pUWi2FwS.js";
import { X } from "./x-3KvPO6r7.js";
import { T as Trash2 } from "./trash-2-CYPZWH1M.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
  ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }]
];
const Search = createLucideIcon("search", __iconNode);
function Table({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-slot": "table-container",
      className: "relative w-full overflow-x-auto",
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        "table",
        {
          "data-slot": "table",
          className: cn("w-full caption-bottom text-sm", className),
          ...props
        }
      )
    }
  );
}
function TableHeader({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "thead",
    {
      "data-slot": "table-header",
      className: cn("[&_tr]:border-b", className),
      ...props
    }
  );
}
function TableBody({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tbody",
    {
      "data-slot": "table-body",
      className: cn("[&_tr:last-child]:border-0", className),
      ...props
    }
  );
}
function TableRow({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      "data-slot": "table-row",
      className: cn(
        "hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors",
        className
      ),
      ...props
    }
  );
}
function TableHead({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "th",
    {
      "data-slot": "table-head",
      className: cn(
        "text-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function TableCell({ className, ...props }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "td",
    {
      "data-slot": "table-cell",
      className: cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
        className
      ),
      ...props
    }
  );
}
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}
const listItemVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 }
};
function FileManagerPage() {
  const { files, renameFile, deleteFile } = useFileManager();
  const [search, setSearch] = reactExports.useState("");
  const [sortField, setSortField] = reactExports.useState("date");
  const [sortDir, setSortDir] = reactExports.useState("desc");
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editingName, setEditingName] = reactExports.useState("");
  const filtered = sortFiles(
    files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())),
    sortField,
    sortDir
  );
  const startEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };
  const commitEdit = () => {
    if (editingId && editingName.trim()) {
      renameFile(editingId, editingName.trim());
    }
    setEditingId(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      className: "space-y-6",
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      transition: { type: "spring", stiffness: 300, damping: 30 },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: -10 },
            animate: { opacity: 1, y: 0 },
            transition: { type: "spring", stiffness: 300, damping: 30 },
            className: "text-center space-y-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold tracking-tight", children: "File Manager" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground", children: "View, rename, download, or delete your converted files" })
            ]
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
              delay: 0.08
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              motion.div,
              {
                whileHover: { y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" },
                transition: { type: "spring", stiffness: 400, damping: 25 },
                children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "border-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(CardTitle, { className: "flex items-center gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-5 h-5" }),
                      " Your Files"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1 justify-end flex-wrap", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-xs", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          Input,
                          {
                            "data-ocid": "filemanager.search_input",
                            className: "pl-9",
                            placeholder: "Search files...",
                            value: search,
                            onChange: (e) => setSearch(e.target.value)
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        Select,
                        {
                          value: `${sortField}-${sortDir}`,
                          onValueChange: (v) => {
                            const [f, d] = v.split("-");
                            setSortField(f);
                            setSortDir(d);
                          },
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              SelectTrigger,
                              {
                                "data-ocid": "filemanager.sort.select",
                                className: "w-44 h-9 text-sm",
                                children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Sort by..." })
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "date-desc", children: "Newest first" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "date-asc", children: "Oldest first" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "name-asc", children: "Name A → Z" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "name-desc", children: "Name Z → A" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "size-desc", children: "Largest first" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "size-asc", children: "Smallest first" })
                            ] })
                          ]
                        }
                      )
                    ] })
                  ] }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    motion.div,
                    {
                      "data-ocid": "filemanager.empty_state",
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      exit: { opacity: 0 },
                      className: "text-center py-12 text-muted-foreground",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { className: "w-12 h-12 mx-auto mb-3 opacity-30" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: files.length === 0 ? "No files yet. Convert something to see it here." : "No files match your search." })
                      ]
                    },
                    "empty"
                  ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                    motion.div,
                    {
                      initial: { opacity: 0 },
                      animate: { opacity: 1 },
                      exit: { opacity: 0 },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { "data-ocid": "filemanager.table", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Name" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Type" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Size" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { children: "Date" }),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "text-right", children: "Actions" })
                        ] }) }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: filtered.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          motion.tr,
                          {
                            "data-ocid": `filemanager.row.${i + 1}`,
                            variants: listItemVariants,
                            initial: "initial",
                            animate: "animate",
                            exit: { opacity: 0, y: -4 },
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                              delay: i * 0.05
                            },
                            className: "border-b transition-colors hover:bg-muted/50",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { children: editingId === f.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Input,
                                  {
                                    "data-ocid": "filemanager.rename.input",
                                    value: editingName,
                                    onChange: (e) => setEditingName(e.target.value),
                                    onKeyDown: (e) => {
                                      if (e.key === "Enter") commitEdit();
                                      if (e.key === "Escape")
                                        setEditingId(null);
                                    },
                                    autoFocus: true,
                                    className: "h-7 text-sm"
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Button,
                                  {
                                    variant: "ghost",
                                    size: "sm",
                                    onClick: commitEdit,
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "w-3 h-3" })
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Button,
                                  {
                                    variant: "ghost",
                                    size: "sm",
                                    onClick: () => setEditingId(null),
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "w-3 h-3" })
                                  }
                                )
                              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "button",
                                {
                                  type: "button",
                                  "data-ocid": `filemanager.edit_button.${i + 1}`,
                                  onClick: () => startEdit(f.id, f.name),
                                  className: "text-left font-medium hover:text-primary transition-colors duration-150 cursor-pointer",
                                  children: f.name
                                }
                              ) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: f.type || "Unknown" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: formatSize(f.size) }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-muted-foreground text-sm", children: new Date(f.createdAt).toLocaleDateString() }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: f.dataUrl, download: f.name, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileTap: { scale: 0.95 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Button,
                                  {
                                    "data-ocid": `filemanager.secondary_button.${i + 1}`,
                                    variant: "outline",
                                    size: "sm",
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "w-4 h-4" })
                                  }
                                ) }) }),
                                /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { whileTap: { scale: 0.95 }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  Button,
                                  {
                                    "data-ocid": `filemanager.delete_button.${i + 1}`,
                                    variant: "outline",
                                    size: "sm",
                                    className: "text-destructive hover:text-destructive",
                                    onClick: () => deleteFile(f.id),
                                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "w-4 h-4" })
                                  }
                                ) })
                              ] }) })
                            ]
                          },
                          f.id
                        )) }) })
                      ] })
                    },
                    "table"
                  ) }) })
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
  FileManagerPage
};
