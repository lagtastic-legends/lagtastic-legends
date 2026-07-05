import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  type SortDir,
  type SortField,
  sortFiles,
  useFileManager,
} from "@/hooks/useFileManager";
import { Check, Download, FolderOpen, Search, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

const listItemVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
};

export function FileManagerPage() {
  const { files, renameFile, deleteFile } = useFileManager();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const filtered = sortFiles(
    files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase())),
    sortField,
    sortDir,
  );

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const commitEdit = () => {
    if (editingId && editingName.trim()) {
      renameFile(editingId, editingName.trim());
    }
    setEditingId(null);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="text-center space-y-2"
      >
        <h2 className="text-3xl font-bold tracking-tight">File Manager</h2>
        <p className="text-muted-foreground">
          View, rename, download, or delete your converted files
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: 0.08,
        }}
      >
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-4">
                <CardTitle className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" /> Your Files
                </CardTitle>
                <div className="flex items-center gap-2 flex-1 justify-end flex-wrap">
                  <div className="relative max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      data-ocid="filemanager.search_input"
                      className="pl-9"
                      placeholder="Search files..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <Select
                    value={`${sortField}-${sortDir}`}
                    onValueChange={(v) => {
                      const [f, d] = v.split("-") as [SortField, SortDir];
                      setSortField(f);
                      setSortDir(d);
                    }}
                  >
                    <SelectTrigger
                      data-ocid="filemanager.sort.select"
                      className="w-44 h-9 text-sm"
                    >
                      <SelectValue placeholder="Sort by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Newest first</SelectItem>
                      <SelectItem value="date-asc">Oldest first</SelectItem>
                      <SelectItem value="name-asc">Name A → Z</SelectItem>
                      <SelectItem value="name-desc">Name Z → A</SelectItem>
                      <SelectItem value="size-desc">Largest first</SelectItem>
                      <SelectItem value="size-asc">Smallest first</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    data-ocid="filemanager.empty_state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12 text-muted-foreground"
                  >
                    <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p>
                      {files.length === 0
                        ? "No files yet. Convert something to see it here."
                        : "No files match your search."}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Table data-ocid="filemanager.table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {filtered.map((f, i) => (
                            <motion.tr
                              key={f.id}
                              data-ocid={`filemanager.row.${i + 1}`}
                              variants={listItemVariants}
                              initial="initial"
                              animate="animate"
                              exit={{ opacity: 0, y: -4 }}
                              transition={{
                                type: "spring",
                                stiffness: 400,
                                damping: 30,
                                delay: i * 0.05,
                              }}
                              className="border-b transition-colors hover:bg-muted/50"
                            >
                              <TableCell>
                                {editingId === f.id ? (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      data-ocid="filemanager.rename.input"
                                      value={editingName}
                                      onChange={(e) =>
                                        setEditingName(e.target.value)
                                      }
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter") commitEdit();
                                        if (e.key === "Escape")
                                          setEditingId(null);
                                      }}
                                      autoFocus
                                      className="h-7 text-sm"
                                    />
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={commitEdit}
                                    >
                                      <Check className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEditingId(null)}
                                    >
                                      <X className="w-3 h-3" />
                                    </Button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    data-ocid={`filemanager.edit_button.${i + 1}`}
                                    onClick={() => startEdit(f.id, f.name)}
                                    className="text-left font-medium hover:text-primary transition-colors duration-150 cursor-pointer"
                                  >
                                    {f.name}
                                  </button>
                                )}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {f.type || "Unknown"}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {formatSize(f.size)}
                              </TableCell>
                              <TableCell className="text-muted-foreground text-sm">
                                {new Date(f.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  <a href={f.dataUrl} download={f.name}>
                                    <motion.div whileTap={{ scale: 0.95 }}>
                                      <Button
                                        data-ocid={`filemanager.secondary_button.${i + 1}`}
                                        variant="outline"
                                        size="sm"
                                      >
                                        <Download className="w-4 h-4" />
                                      </Button>
                                    </motion.div>
                                  </a>
                                  <motion.div whileTap={{ scale: 0.95 }}>
                                    <Button
                                      data-ocid={`filemanager.delete_button.${i + 1}`}
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive hover:text-destructive"
                                      onClick={() => deleteFile(f.id)}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </motion.div>
                                </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
