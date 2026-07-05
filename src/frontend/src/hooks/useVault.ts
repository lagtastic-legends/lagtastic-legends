import { useCallback, useEffect, useState } from "react";

export interface VaultFile {
  id: string;
  name: string;
  type: string;
  size: number;
  addedAt: string;
  dataUrl: string;
}

const VAULT_PIN_KEY = "vault_pin_hash";
const VAULT_FILES_KEY = "vault_files";

function simpleHash(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return `${hash.toString(36)}_${pin.length}`;
}

function loadFilesFromStorage(): VaultFile[] {
  try {
    const stored = localStorage.getItem(VAULT_FILES_KEY);
    if (stored) return JSON.parse(stored) as VaultFile[];
  } catch {}
  return [];
}

export function useVault() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [hasPin, setHasPin] = useState(false);
  const [files, setFiles] = useState<VaultFile[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setHasPin(!!localStorage.getItem(VAULT_PIN_KEY));
  }, []);

  const setupPin = useCallback((pin: string) => {
    localStorage.setItem(VAULT_PIN_KEY, simpleHash(pin));
    setHasPin(true);
    setIsUnlocked(true);
    setError("");
    setFiles(loadFilesFromStorage());
  }, []);

  const unlock = useCallback((pin: string) => {
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

  const lock = useCallback(() => {
    setIsUnlocked(false);
    setFiles([]);
  }, []);

  const addFile = useCallback((file: Omit<VaultFile, "id" | "addedAt">) => {
    const newFile: VaultFile = {
      ...file,
      id: crypto.randomUUID(),
      addedAt: new Date().toISOString(),
    };
    setFiles((prev) => {
      const updated = [newFile, ...prev];
      try {
        localStorage.setItem(VAULT_FILES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  const deleteFile = useCallback((id: string) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      try {
        localStorage.setItem(VAULT_FILES_KEY, JSON.stringify(updated));
      } catch {}
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
    deleteFile,
  };
}
