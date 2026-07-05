import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type EntryId = string;
export interface VaultEntry {
    id: EntryId;
    blobRef?: string;
    name: string;
    createdAt: Timestamp;
    size: bigint;
    tags: Array<string>;
    mimeType: string;
    updatedAt: Timestamp;
}
export interface FileEntry {
    id: EntryId;
    name: string;
    createdAt: Timestamp;
    size: bigint;
    mimeType: string;
    updatedAt: Timestamp;
    category: string;
}
export interface backendInterface {
    createFileEntry(id: EntryId, name: string, size: bigint, mimeType: string, category: string): Promise<FileEntry>;
    createVaultEntry(id: EntryId, name: string, mimeType: string, size: bigint, tags: Array<string>, blobRef: string | null): Promise<VaultEntry>;
    deleteFileEntry(id: EntryId): Promise<boolean>;
    deleteVaultEntry(id: EntryId): Promise<boolean>;
    getFileEntry(id: EntryId): Promise<FileEntry | null>;
    getVaultEntry(id: EntryId): Promise<VaultEntry | null>;
    listFileEntries(): Promise<Array<FileEntry>>;
    listVaultEntries(): Promise<Array<VaultEntry>>;
    renameFileEntry(id: EntryId, name: string): Promise<FileEntry | null>;
    updateVaultEntry(id: EntryId, name: string, tags: Array<string>, blobRef: string | null): Promise<VaultEntry | null>;
}
