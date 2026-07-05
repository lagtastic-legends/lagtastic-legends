import Common "common";

module {
  // A Smart File Manager entry. Stores FILE METADATA ONLY — converted file
  // bytes live client-side; this record lets the user organize, search,
  // rename, and re-download their converted files across sessions.
  public type FileEntry = {
    id : Common.EntryId;
    name : Text;
    size : Nat;
    mimeType : Text;
    category : Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };
};
