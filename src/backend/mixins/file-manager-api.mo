import FileLib "../lib/file_manager";
import Types "../types/file_manager";
import Common "../types/common";

// Public API surface for the Smart File Manager domain. All entries are
// scoped to msg.caller — each user only sees and mutates their own files.
mixin (store : FileLib.FileStore) {
  // Register a converted file's metadata. The client supplies the id (UUID)
  // so it can keep its local blob and the on-chain metadata in sync.
  public shared ({ caller }) func createFileEntry(
    id : Common.EntryId,
    name : Text,
    size : Nat,
    mimeType : Text,
    category : Text,
  ) : async Types.FileEntry {
    FileLib.create(store, caller, id, name, size, mimeType, category);
  };

  // List all file entries belonging to the caller.
  public shared query ({ caller }) func listFileEntries() : async [Types.FileEntry] {
    FileLib.list(store, caller);
  };

  // Fetch a single file entry by id, scoped to the caller.
  public shared query ({ caller }) func getFileEntry(id : Common.EntryId) : async ?Types.FileEntry {
    FileLib.get(store, caller, id);
  };

  // Rename a file entry. Returns null if the caller has no entry with that id.
  public shared ({ caller }) func renameFileEntry(
    id : Common.EntryId,
    name : Text,
  ) : async ?Types.FileEntry {
    FileLib.rename(store, caller, id, name);
  };

  // Delete a file entry. Returns true if an entry was removed.
  public shared ({ caller }) func deleteFileEntry(id : Common.EntryId) : async Bool {
    FileLib.delete(store, caller, id);
  };
};
