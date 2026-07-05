import Common "common";

module {
  // A Secure Vault entry. Stores FILE METADATA ONLY — the encrypted blob
  // itself lives client-side (browser localStorage / IndexedDB); `blobRef`
  // is an optional opaque reference or metadata pointer the client can use
  // to relocate its local copy. All fields are shared (serializable).
  public type VaultEntry = {
    id : Common.EntryId;
    name : Text;
    mimeType : Text;
    size : Nat;
    tags : [Text];
    blobRef : ?Text;
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };
};
