import { useCallback, useEffect, useState } from "react";

export interface ManagedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  dataUrl: string;
}

const STORAGE_KEY = "app_file_manager";

export function useFileManager() {
  const [files, setFiles] = useState<ManagedFile[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setFiles(JSON.parse(stored));
    } catch {}
  }, []);

  const saveToManager = useCallback(
    (file: Omit<ManagedFile, "id" | "createdAt">) => {
      const newFile: ManagedFile = {
        ...file,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
      };
      setFiles((prev) => {
        const updated = [newFile, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
      return newFile;
    },
    [],
  );

  const renameFile = useCallback((id: string, name: string) => {
    setFiles((prev) => {
      const updated = prev.map((f) => (f.id === id ? { ...f, name } : f));
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const getAllFiles = useCallback(() => files, [files]);

  return { files, saveToManager, renameFile, deleteFile, getAllFiles };
}

export type SortField = "name" | "size" | "date";
export type SortDir = "asc" | "desc";

export function sortFiles(
  files: ManagedFile[],
  field: SortField,
  dir: SortDir,
): ManagedFile[] {
  return [...files].sort((a, b) => {
    let cmp = 0;
    if (field === "name") cmp = a.name.localeCompare(b.name);
    else if (field === "size") cmp = a.size - b.size;
    else
      cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    return dir === "asc" ? cmp : -cmp;
  });
}
