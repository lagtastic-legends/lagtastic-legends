import { r as reactExports } from "./index-C7SiQumv.js";
const STORAGE_KEY = "app_file_manager";
function useFileManager() {
  const [files, setFiles] = reactExports.useState([]);
  reactExports.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFiles(JSON.parse(stored));
    } catch {
    }
  }, []);
  const saveToManager = reactExports.useCallback(
    (file) => {
      const newFile = {
        ...file,
        id: crypto.randomUUID(),
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      setFiles((prev) => {
        const updated = [newFile, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {
        }
        return updated;
      });
      return newFile;
    },
    []
  );
  const renameFile = reactExports.useCallback((id, name) => {
    setFiles((prev) => {
      const updated = prev.map((f) => f.id === id ? { ...f, name } : f);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
      }
      return updated;
    });
  }, []);
  const deleteFile = reactExports.useCallback((id) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
      }
      return updated;
    });
  }, []);
  const getAllFiles = reactExports.useCallback(() => files, [files]);
  return { files, saveToManager, renameFile, deleteFile, getAllFiles };
}
function sortFiles(files, field, dir) {
  return [...files].sort((a, b) => {
    let cmp = 0;
    if (field === "name") cmp = a.name.localeCompare(b.name);
    else if (field === "size") cmp = a.size - b.size;
    else
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return dir === "asc" ? cmp : -cmp;
  });
}
export {
  sortFiles as s,
  useFileManager as u
};
